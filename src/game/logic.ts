import {
  ITEMS,
  LOCATIONS,
  NEIGHBORS,
  NPCS,
  TASKS,
  TOPICS,
  itemById,
  locationById,
  npcById,
} from "./content";
import type {
  Block,
  Effect,
  Equipped,
  GameId,
  GameState,
  Item,
  Outfit,
  PlaceRef,
  TalkMode,
  Topic,
} from "./types";

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function hash(seed: string, a: number, b: number) {
  let h = 2166136261;
  const str = `${seed}:${a}:${b}`;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function blockOf(hour: number): Block {
  if (hour < 7 || hour >= 22) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "day";
  return "evening";
}

export function blockName(block: Block) {
  if (block === "morning") return "Ранок";
  if (block === "day") return "День";
  if (block === "evening") return "Вечір";
  return "Ніч";
}

export function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export function wornItems(equipped: Equipped): Item[] {
  const ids: string[] = [];
  if (equipped.dress) ids.push(equipped.dress);
  else {
    if (equipped.top) ids.push(equipped.top);
    if (equipped.bottom) ids.push(equipped.bottom);
  }
  for (const id of [equipped.legs, equipped.shoes, equipped.outer, equipped.head, equipped.jewelry, equipped.makeup]) {
    if (id) ids.push(id);
  }
  return ids.map((id) => itemById(id)).filter((item): item is Item => Boolean(item));
}

export function outfit(state: Pick<GameState, "equipped" | "sense">): Outfit {
  const items = wornItems(state.equipped);
  const tags = new Set(items.flatMap((item) => item.tags));
  const clash = tags.has("bold") && tags.has("soft");
  const style = Math.max(0, items.reduce((sum, item) => sum + item.style, 0) + state.sense - (clash ? 3 : 0));
  const feminine = items.reduce((sum, item) => sum + item.feminine, 0);
  const notable = items.filter((item) => item.feminine > 0 || item.style >= 4);
  const label = notable.length
    ? notable.map((item) => item.name.toLowerCase()).join(", ")
    : "звичний комплект: сорочка й брюки";
  return { items, style, feminine, clash, label };
}

export function npcWhere(npcId: string, day: number, hour: number): PlaceRef | null {
  const npc = npcById(npcId);
  if (!npc) return null;
  const block = blockOf(hour);
  const base = npc.schedule[block];
  if (!base) return null;
  const roll = hash(npcId, day, hour);
  if (block !== "night" && roll % 7 === 0) {
    const neighbors = NEIGHBORS[base.locationId] ?? [];
    if (neighbors.length) {
      const locationId = neighbors[roll % neighbors.length]!;
      const spots = locationById(locationId)?.spots ?? [];
      const spot = spots[roll % Math.max(spots.length, 1)];
      if (spot) return { locationId, spotId: spot.id };
    }
  }
  if (roll % 4 === 0) {
    const spots = locationById(base.locationId)?.spots ?? [];
    const spot = spots[roll % Math.max(spots.length, 1)];
    if (spot) return { locationId: base.locationId, spotId: spot.id };
  }
  return base;
}

export function peopleAt(locationId: string, spotId: string | null, state: GameState) {
  const list = NPCS.filter((npc) => {
    const where = npcWhere(npc.id, state.day, state.hour);
    if (!where || where.locationId !== locationId) return false;
    if (spotId && where.spotId !== spotId) return false;
    return true;
  });
  if (locationId === "home" && spotId === "living" && state.guest) {
    const guest = npcById(state.guest);
    if (guest && !list.some((npc) => npc.id === guest.id)) list.push(guest);
  }
  return list;
}

export function placeLabel(ref: PlaceRef | null) {
  if (!ref) return "не виходить";
  const location = locationById(ref.locationId);
  const spot = location?.spots.find((item) => item.id === ref.spotId);
  if (!location || !spot) return "десь у кварталі";
  return `${location.name} · ${spot.name}`;
}

export function movementNotes(before: Record<string, string>, after: Record<string, string>) {
  const notes: string[] = [];
  if (Object.keys(before).length === 0) return notes;
  for (const npc of NPCS) {
    if (before[npc.id] === after[npc.id]) continue;
    const [locationId, spotId] = (after[npc.id] ?? "away").split("/");
    if (!locationId || locationId === "away") {
      notes.push(`${npc.name} зникає з вулиць до ранку.`);
      continue;
    }
    notes.push(`${npc.name} тепер: ${placeLabel({ locationId, spotId: spotId ?? "" })}.`);
  }
  return notes.slice(0, 3);
}

export function snapshotTracks(state: GameState) {
  const tracks: Record<string, string> = {};
  for (const npc of NPCS) {
    const where = npcWhere(npc.id, state.day, state.hour);
    tracks[npc.id] = where ? `${where.locationId}/${where.spotId}` : "away";
  }
  return tracks;
}

export function reaction(npcId: string, look: Outfit, rel: number): string {
  const { feminine: fem, style, label, clash } = look;
  const close = rel >= 35;
  if (npcId === "sofia") {
    if (fem >= 4 && style >= 12) return `«${label} — тепло і точно. Я зроблю каву під цей настрій, без зайвого.»`;
    if (fem >= 2) return `«Цікавий поворот. ${label} тобі пасує: м'якший силует, спокійний крок.»`;
    if (style < 6) return "«Звичайний день і звичний одяг. Теж має право на стійку.»";
    return "«Акуратно. Кава буде така сама — без прикрас.»";
  }
  if (npcId === "lina") {
    if (clash) return `«${label} сперечається само із собою. Обери одну інтонацію: або м'яку, або зухвалу.»`;
    if (look.items.some((item) => item.slot === "dress")) return `«Сукня тримає лінію. Не ховай ${label} під верхнім шаром, якщо не холодно.»`;
    if (look.items.some((item) => item.id === "heels")) return "«Підбори вже змінили крок. Решта образу хай не відстає.»";
    if (fem >= 2) return `«${label} зібрано свідомо. Ще один акцент — і це буде повноцінний вихід.»`;
    return "«Базовий комплект. Чесний, але нічого не каже. Можу підказати, з чого почати.»";
  }
  if (npcId === "marko") {
    if (fem >= 3) return close
      ? `«Тобі личить. ${label}. Я не вмію про тканину, але стояти тобі в цьому легко. Це видно.»`
      : `«Ого. ${label}. Вибач, я трохи завис. Тобі це личить, серйозно.»`;
    if (fem >= 1) return "«Інший комір, ніж учора. Мені так навіть зрозуміліше, що ти сьогодні не на бігу.»";
    return "«Звичайний вигляд. Ходімо, якщо треба компанія без розмов про моду.»";
  }
  if (npcId === "andriy") {
    if (fem >= 3 && style >= 8) return "«Сміливо для офісу. Якщо тобі зручно — я не збираю нараду.»";
    if (style >= 10) return "«Зібрано. Клієнт, якщо зайде, побачить людину, яка знає, навіщо прийшла.»";
    return "«Робочий вигляд. Листи цього не помітять, люди — може, й помітять, та це не їхній чек.»";
  }
  if (npcId === "olena") {
    if (fem >= 4) return `«Ось. ${label}. Не ховайся. Вечір якраз для такого силуету.»`;
    if (fem >= 2) return "«Вже не чернетка. Додай ще крок — туфлі або колір губ — і лавка на набережній твоя.»";
    return "«Поки тихо. Приходь сміливіше, мені подобається, коли люди не зливаються з липами.»";
  }
  if (clash) return "«Дві інтонації одразу. Рамка тріщить. Залиш одну.»";
  if (style >= 14) return `«Тримається. ${label} — це вже експозиція, не прикладка.»`;
  if (style >= 8) return "«Майже. Бракує однієї лінії, яка збере все докупи.»";
  return "«Ще сиро. Повернись, коли речі перестануть бути окремими покупками.»";
}

export function fillText(text: string, state: GameState, npcName: string) {
  const look = outfit(state);
  return text
    .replaceAll("{outfit}", look.label)
    .replaceAll("{name}", state.look.name || "ти")
    .replaceAll("{npc}", npcName)
    .replaceAll("{style}", String(look.style))
    .replaceAll("{fem}", String(look.feminine));
}

export function greeting(npcId: string, mode: TalkMode, state: GameState) {
  const npc = npcById(npcId);
  const look = outfit(state);
  const rel = state.rel[npcId] ?? 0;
  const name = state.look.name || "Друже";
  const react = reaction(npcId, look, rel);
  if (mode === "host") {
    return [
      { who: "npc" as const, text: `${npc?.name ?? "Гість"} заходить у вітальню і на мить зупиняється.` },
      { who: "npc" as const, text: react },
      { who: "player" as const, text: `${name === state.look.name ? "Проходь" : "Проходь"}. Чай уже стоїть, ${npc?.name}.` },
    ];
  }
  if (mode === "visit") {
    return [
      { who: "npc" as const, text: `${npc?.name} відчиняє і пропускає тебе всередину.` },
      { who: "npc" as const, text: react },
      { who: "player" as const, text: "Дякую, що пустили. Я в тому, в чому вийшов з дому." },
    ];
  }
  return [
    { who: "npc" as const, text: react },
    { who: "player" as const, text: `Вітаю, ${npc?.name}. Я ${state.look.name}.` },
  ];
}

export function topicsFor(npcId: string, mode: TalkMode, state: GameState): Topic[] {
  const look = outfit(state);
  const rel = state.rel[npcId] ?? 0;
  return (TOPICS[npcId] ?? []).filter((topic) => {
    if (topic.modes && !topic.modes.includes(mode)) return false;
    if (!topic.modes && mode !== "spot") return false;
    if (topic.minRel && rel < topic.minRel) return false;
    if (topic.minFem && look.feminine < topic.minFem) return false;
    if (topic.minStyle && look.style < topic.minStyle) return false;
    if (topic.hourMin != null && state.hour < topic.hourMin) return false;
    if (topic.hourMax != null && state.hour > topic.hourMax) return false;
    if (topic.id === "early" && look.style >= 12) return false;
    if (topic.onceFlag && state.flags[topic.onceFlag]) return false;
    const cost = topic.effects.reduce((sum, effect) => (effect.k === "coins" && effect.n < 0 ? sum + effect.n : sum), 0);
    if (state.coins + cost < 0) return false;
    return true;
  });
}

export function hiddenTopicHint(npcId: string, mode: TalkMode, state: GameState): string | null {
  if (mode !== "spot") return null;
  const look = outfit(state);
  if (npcId === "lina" && look.feminine < 2) return "Ліна чекає жіночніший образ, перш ніж відкриє примірку.";
  if (npcId === "ira" && look.style < 12) return "Іра дивиться мовчки: стилю ще менше ніж 12.";
  if (npcId === "olena" && state.hour < 17) return "Прогулянка з Оленою починається після 17:00.";
  if (npcId === "olena" && look.feminine < 3) return "Олена чекає жіночніший образ (від 3): спідниця, туфлі чи сукня.";
  return null;
}

function bump(map: Record<string, number>, key: string, delta: number, max = 100) {
  return { ...map, [key]: clamp((map[key] ?? 0) + delta, 0, max) };
}

export function applyEffects(state: GameState, effects: Effect[]) {
  let next: GameState = {
    ...state,
    owned: [...state.owned],
    flags: { ...state.flags },
    rel: { ...state.rel },
  };
  const notes: string[] = [];
  for (const effect of effects) {
    if (effect.k === "coins") {
      next = { ...next, coins: Math.max(0, next.coins + effect.n) };
      if (effect.n > 0) notes.push(`+${effect.n} монет`);
    } else if (effect.k === "energy") {
      next = { ...next, energy: clamp(next.energy + effect.n, 0, 100) };
    } else if (effect.k === "confidence") {
      next = { ...next, confidence: clamp(next.confidence + effect.n, 0, 100) };
    } else if (effect.k === "charm") {
      next = { ...next, charm: clamp(next.charm + effect.n, 0, 100) };
    } else if (effect.k === "sense") {
      next = { ...next, sense: clamp(next.sense + effect.n, 0, 100) };
    } else if (effect.k === "rel") {
      next = { ...next, rel: bump(next.rel, effect.npc, effect.n) };
      const npc = npcById(effect.npc);
      if (npc && effect.n > 0) notes.push(`${npc.name} ближче`);
    } else if (effect.k === "flag") {
      next = { ...next, flags: { ...next.flags, [effect.key]: effect.n ?? next.day } };
    } else if (effect.k === "item") {
      const item = itemById(effect.id);
      if (!item) continue;
      if (next.owned.includes(item.id)) {
        next = { ...next, coins: next.coins + 25 };
        notes.push(`${item.name} уже в шафі — +25 монет`);
      } else {
        next = { ...next, owned: [...next.owned, item.id] };
        notes.push(`Нова річ: ${item.name}`);
      }
    }
  }
  return { state: next, notes };
}

export function topicSideEffects(topic: Topic, npcId: string, state: GameState): Effect[] {
  const look = outfit(state);
  const extra: Effect[] = [];
  if (npcId === "sofia" && topic.id === "order" && state.hour < 12) {
    extra.push({ k: "flag", key: "did:morning-coffee" });
  }
  if (npcId === "olena" && topic.id === "stroll" && state.hour >= 17 && look.feminine >= 3) {
    extra.push({ k: "flag", key: "did:evening" });
  }
  if (topic.onceFlag) extra.push({ k: "flag", key: topic.onceFlag, n: 1 });
  return extra;
}

export function taskReady(taskId: string, state: GameState) {
  if (taskId === "morning-coffee") return state.flags["did:morning-coffee"] === state.day;
  if (taskId === "park") return state.flags["did:park"] === state.day;
  if (taskId === "mail") return state.flags["did:mail"] === state.day;
  if (taskId === "fitting") return (state.flags["did:fitting"] ?? 0) > 0;
  if (taskId === "host") return (state.flags["did:host"] ?? 0) > 0;
  if (taskId === "evening") return (state.flags["did:evening"] ?? 0) > 0;
  if (taskId === "gallery") return (state.flags["did:gallery"] ?? 0) > 0;
  return false;
}

export function claimableTasks(state: GameState) {
  return TASKS.filter((task) => {
    if (!taskReady(task.id, state)) return false;
    const mark = state.claimed[task.id] ?? 0;
    if (task.daily) return mark !== state.day;
    return mark === 0;
  });
}

export function resolveTasks(state: GameState) {
  let next = state;
  const notes: string[] = [];
  for (let pass = 0; pass < 3; pass++) {
    const due = claimableTasks(next);
    if (!due.length) break;
    for (const task of due) {
      const applied = applyEffects(next, task.rewards);
      next = {
        ...applied.state,
        claimed: { ...applied.state.claimed, [task.id]: task.daily ? next.day : 1 },
      };
      notes.push(`${task.title}: ${applied.notes.join(", ") || "заліковано"}`);
    }
  }
  return { state: next, notes };
}

export function advanceClock(state: GameState, hours: number): GameState {
  let hour = state.hour + hours;
  let day = state.day;
  let guest = state.guest;
  while (hour >= 24) {
    hour -= 24;
    day += 1;
    guest = null;
  }
  return { ...state, hour, day, guest };
}

export function gameRewards(game: GameId, score: number, state: GameState): Effect[] {
  if (game === "latte") {
    const effects: Effect[] = [
      { k: "coins", n: 15 + Math.round(score / 5) },
      { k: "charm", n: 1 },
    ];
    if (score >= 75) effects.push({ k: "item", id: "blouse" });
    return effects;
  }
  if (game === "memory") {
    const effects: Effect[] = [
      { k: "sense", n: 2 },
      { k: "coins", n: Math.max(10, Math.round(score / 4)) },
    ];
    if (score >= 55) {
      const pool = ["earrings", "ribbon", "tights", "polka"].filter((id) => !state.owned.includes(id));
      if (pool[0]) effects.push({ k: "item", id: pool[hash("memory", state.day, score) % pool.length]! });
    }
    return effects;
  }
  if (game === "steps") {
    const effects: Effect[] = [{ k: "confidence", n: 4 + Math.round(score / 25) }];
    if (score >= 70) effects.push({ k: "item", id: "beret" });
    else effects.push({ k: "coins", n: 20 });
    return effects;
  }
  const effects: Effect[] = [
    { k: "coins", n: 18 + Math.round(score / 2) },
    { k: "rel", npc: "andriy", n: 4 },
  ];
  if (score >= 50) effects.push({ k: "flag", key: "did:mail" });
  if (score >= 80) effects.push({ k: "item", id: "cardigan" });
  return effects;
}

export function canInvite(npcId: string, state: GameState) {
  const npc = npcById(npcId);
  if (!npc) return { ok: false, reason: "Немає такої людини." };
  if (state.guest) return { ok: false, reason: "У вітальні вже хтось є." };
  if (state.invited[npcId] === state.day) return { ok: false, reason: "Сьогодні вже заходили." };
  if ((state.rel[npcId] ?? 0) < 12) return { ok: false, reason: "Потрібно ближче знайомство (12)." };
  if (blockOf(state.hour) === "night" && (state.rel[npcId] ?? 0) < 30) {
    return { ok: false, reason: "Вже пізно кликати." };
  }
  if (state.energy < 6) return { ok: false, reason: "Замало енергії." };
  return { ok: true, reason: "Прийде за годину." };
}

export function canVisit(npcId: string, state: GameState) {
  if (state.visited[npcId] === state.day) return { ok: false, reason: "Сьогодні ти вже був у гостях." };
  if ((state.rel[npcId] ?? 0) < 18) return { ok: false, reason: "Ще зарано в гості (потрібно 18)." };
  if (state.energy < 6) return { ok: false, reason: "Замало енергії." };
  if (blockOf(state.hour) === "night" && (state.rel[npcId] ?? 0) < 40) {
    return { ok: false, reason: "Пізно для візиту." };
  }
  return { ok: true, reason: "Можна завітати." };
}

export function shopItems() {
  return ITEMS.filter((item) => item.price);
}

export function memoryDeck() {
  const pics = ITEMS.filter((item) => item.image).slice(0, 6);
  const picks = pics.length >= 4 ? pics.slice(0, 4) : ITEMS.slice(0, 4);
  const cards = picks.flatMap((item) => [
    { key: `${item.id}-a`, id: item.id, image: item.image, name: item.name },
    { key: `${item.id}-b`, id: item.id, image: item.image, name: item.name },
  ]);
  return cards;
}

export function locationName(id: string) {
  return LOCATIONS.find((location) => location.id === id)?.name ?? id;
}
