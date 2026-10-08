import { create } from "zustand";
import { persist } from "zustand/middleware";
import { itemById, npcById } from "./content";
import {
  advanceClock,
  applyEffects,
  canInvite,
  gameRewards,
  movementNotes,
  outfit,
  resolveTasks,
  snapshotTracks,
  topicSideEffects,
} from "./logic";
import type { Equipped, GameId, GameState, Look, Topic } from "./types";

const STARTER: Equipped = {
  top: "shirt",
  bottom: "trousers",
  dress: null,
  shoes: "sneakers",
  outer: null,
  head: null,
  jewelry: null,
  makeup: null,
  legs: null,
};

export function blankState(): GameState {
  return {
    version: 1,
    created: false,
    look: { name: "", hair: "short", hairColor: "h2", eye: "e3", skin: "s2" },
    equipped: { ...STARTER },
    owned: ["shirt", "trousers", "sneakers"],
    coins: 40,
    energy: 88,
    confidence: 12,
    charm: 10,
    sense: 0,
    day: 1,
    hour: 8,
    rel: { sofia: 8, lina: 6, marko: 16, andriy: 8, olena: 10, ira: 5 },
    flags: {},
    claimed: {},
    played: {},
    invited: {},
    visited: {},
    log: [],
    seenIntro: false,
    guest: null,
    here: null,
    tracks: {},
  };
}

interface Store extends GameState {
  notice: string[];
  startNew: (look: Look) => void;
  reset: () => void;
  dismissNotice: () => void;
  markIntro: () => void;
  travel: (locationId: string) => boolean;
  waitHour: () => void;
  sleep: () => void;
  rest: () => void;
  equip: (id: string) => void;
  unequip: (slot: keyof Equipped) => void;
  buy: (id: string) => void;
  applyTopic: (topic: Topic, npcId: string) => void;
  invite: (npcId: string) => boolean;
  clearGuest: () => void;
  beginVisit: (npcId: string) => boolean;
  completeGame: (game: GameId, score: number) => void;
}

function noteOf(state: GameState, notes: string[], extra?: Partial<GameState>): StorePatch {
  const clean = notes.filter(Boolean);
  return {
    ...extra,
    notice: clean.slice(0, 4),
    log: [...clean, ...state.log].slice(0, 18),
  };
}

type StorePatch = Partial<Store>;

function commit(current: GameState, draft: GameState, notes: string[]) {
  const before = current.tracks;
  const moved = movementNotes(before, snapshotTracks(draft));
  const withTracks = { ...draft, tracks: snapshotTracks(draft) };
  const tasks = resolveTasks(withTracks);
  return {
    ...tasks.state,
    tracks: snapshotTracks(tasks.state),
    ...noteOf(current, [...notes, ...moved, ...tasks.notes]),
  };
}

export const useGame = create<Store>()(
  persist(
    (set, get) => ({
      ...blankState(),
      notice: [],
      startNew: (look) => {
        const fresh = blankState();
        fresh.created = true;
        fresh.look = { ...look, name: look.name.trim() };
        fresh.here = "home";
        fresh.tracks = snapshotTracks(fresh);
        set({ ...fresh, notice: ["Ти прокидаєшся вдома. Шафа ще майже порожня."] });
      },
      reset: () => set({ ...blankState(), notice: [] }),
      dismissNotice: () => set({ notice: [] }),
      markIntro: () => set({ seenIntro: true }),
      travel: (locationId) => {
        const current = get();
        if (current.here === locationId) return true;
        const cost = locationId === "home" ? 0 : 8;
        if (current.energy < cost) {
          set({ notice: ["Замало енергії. Відпочинь удома."] });
          return false;
        }
        let draft = advanceClock(current, 1);
        draft = {
          ...draft,
          energy: Math.max(0, draft.energy - cost),
          guest: locationId === "home" ? draft.guest : null,
          here: locationId,
        };
        if (locationId === "park") {
          draft = { ...draft, flags: { ...draft.flags, "did:park": draft.day } };
        }
        set(commit(current, draft, []));
        return true;
      },
      waitHour: () => {
        const current = get();
        const draft = advanceClock({ ...current, guest: null }, 1);
        set(commit(current, draft, ["Минає година. Квартал переставляє людей."]));
      },
      sleep: () => {
        const current = get();
        const draft: GameState = {
          ...current,
          day: current.day + 1,
          hour: 8,
          energy: 100,
          guest: null,
        };
        set(commit(current, draft, ["Ранок. Енергія повна."]));
      },
      rest: () => {
        const current = get();
        if (current.hour >= 21 || current.hour < 7) {
          get().sleep();
          return;
        }
        const draft = advanceClock(current, 3);
        draft.energy = Math.min(100, draft.energy + 36);
        set(commit(current, draft, ["Ти перевів подих. +енергія."]));
      },
      equip: (id) => {
        const item = itemById(id);
        const current = get();
        if (!item || !current.owned.includes(id)) return;
        const equipped = { ...current.equipped, [item.slot]: id };
        let flags = current.flags;
        const notes: string[] = [`На тобі: ${item.name}.`];
        const nextLook = outfit({ equipped, sense: current.sense });
        if (nextLook.feminine >= 2 && !flags["first-femme"]) {
          flags = { ...flags, "first-femme": 1 };
          notes.push("Перший жіночніший вихід. Впевненість росте.");
        }
        const draft: GameState = {
          ...current,
          equipped,
          flags,
          confidence: flags !== current.flags ? Math.min(100, current.confidence + 4) : current.confidence,
        };
        set({ ...draft, ...noteOf(current, notes) });
      },
      unequip: (slot) => {
        const current = get();
        set({ equipped: { ...current.equipped, [slot]: null } });
      },
      buy: (id) => {
        const item = itemById(id);
        const current = get();
        if (!item?.price) return;
        if (current.owned.includes(id)) {
          set({ notice: ["Це вже висить у шафі."] });
          return;
        }
        if (current.coins < item.price) {
          set({ notice: ["Не вистачає монет."] });
          return;
        }
        const draft: GameState = {
          ...current,
          coins: current.coins - item.price,
          owned: [...current.owned, id],
        };
        set({ ...draft, ...noteOf(current, [`Куплено: ${item.name}.`]) });
      },
      applyTopic: (topic, npcId) => {
        const current = get();
        if (current.energy < 4) {
          set({ notice: ["Замало енергії для довгої розмови."] });
          return;
        }
        const effects = [...topic.effects, ...topicSideEffects(topic, npcId, current)];
        const applied = applyEffects({ ...current, energy: Math.max(0, current.energy - 4) }, effects);
        const draft = advanceClock(applied.state, 1);
        const who = npcById(npcId)?.name ?? "Розмова";
        set(commit(current, draft, [`Розмова: ${who}.`, ...applied.notes]));
      },
      invite: (npcId) => {
        const current = get();
        const gate = canInvite(npcId, current);
        if (!gate.ok) {
          set({ notice: [gate.reason] });
          return false;
        }
        let draft = advanceClock(current, 1);
        draft = {
          ...draft,
          energy: Math.max(0, draft.energy - 6),
          guest: npcId,
          invited: { ...draft.invited, [npcId]: draft.day },
        };
        const name = npcById(npcId)?.name ?? "Гість";
        set(commit(current, draft, [`${name} іде до тебе.`]));
        return true;
      },
      clearGuest: () => set({ guest: null }),
      beginVisit: (npcId) => {
        const current = get();
        if ((current.rel[npcId] ?? 0) < 18 || current.energy < 6) {
          set({ notice: ["Поки не пускають у гості."] });
          return false;
        }
        let draft = advanceClock(current, 1);
        draft = {
          ...draft,
          energy: Math.max(0, draft.energy - 6),
          visited: { ...draft.visited, [npcId]: draft.day },
          guest: null,
        };
        const name = npcById(npcId)?.name ?? "Гість";
        set(commit(current, draft, [`Ти завітав до ${name}.`]));
        return true;
      },
      completeGame: (game, score) => {
        const current = get();
        if (current.played[game] === current.day) {
          set({ notice: ["Сьогодні це вже зіграно."] });
          return;
        }
        if (current.energy < 10) {
          set({ notice: ["Замало енергії на гру."] });
          return;
        }
        let draft = advanceClock(
          { ...current, energy: Math.max(0, current.energy - 10), played: { ...current.played, [game]: current.day } },
          1,
        );
        draft = { ...draft, played: { ...draft.played, [game]: draft.day } };
        const applied = applyEffects(draft, gameRewards(game, score, draft));
        set(commit(current, applied.state, [`Результат: ${score}.`, ...applied.notes]));
      },
    }),
    {
      name: "lantern-quarter-v1",
      skipHydration: true,
      partialize: (state) => ({
        version: state.version,
        created: state.created,
        look: state.look,
        equipped: state.equipped,
        owned: state.owned,
        coins: state.coins,
        energy: state.energy,
        confidence: state.confidence,
        charm: state.charm,
        sense: state.sense,
        day: state.day,
        hour: state.hour,
        rel: state.rel,
        flags: state.flags,
        claimed: state.claimed,
        played: state.played,
        invited: state.invited,
        visited: state.visited,
        log: state.log,
        seenIntro: state.seenIntro,
        guest: state.guest,
        here: state.here,
        tracks: state.tracks,
      }),
    },
  ),
);
