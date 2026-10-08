import { ChevronLeft, Map, ScrollText, Shirt, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  EYES,
  GAMES,
  HAIR_COLORS,
  HAIR_STYLES,
  LOCATIONS,
  NPCS,
  SKINS,
  SLOT_LABEL,
  TASKS,
  itemById,
  locationById,
  npcById,
  spotOf,
} from "@/game/content";
import {
  blockOf,
  canInvite,
  canVisit,
  outfit,
  peopleAt,
  placeLabel,
  npcWhere,
  shopItems,
  taskReady,
} from "@/game/logic";
import { useGame } from "@/game/store";
import type { Equipped, GameId, Look, TalkMode } from "@/game/types";
import { Doll } from "./Doll";
import { MiniGame } from "./MiniGames";
import { Talk } from "./Talk";
import { Btn, Hud, Notices, Photo, Portrait, cn } from "./ui";

type Screen =
  | { name: "title" }
  | { name: "create" }
  | { name: "city" }
  | { name: "location"; locationId: string }
  | { name: "spot"; locationId: string; spotId: string }
  | { name: "talk"; npcId: string; bg: string; mode: TalkMode; intro: boolean; back: Screen }
  | { name: "wardrobe" }
  | { name: "tasks" }
  | { name: "hero" }
  | { name: "shop" }
  | { name: "invite" }
  | { name: "mini"; game: GameId; back: Screen };

export function GameApp() {
  const created = useGame((s) => s.created);
  const [screen, setScreen] = useState<Screen>({ name: "title" });
  const showNav = ["city", "location", "spot", "tasks", "hero", "shop", "wardrobe", "invite"].includes(screen.name);
  const showHud = screen.name !== "title" && screen.name !== "create" && screen.name !== "talk" && screen.name !== "mini";

  return (
    <main className="relative min-h-screen bg-ink text-cream">
      {showHud && <Hud />}
      <Notices />
      {screen.name === "title" && <Title created={created} onNew={() => setScreen({ name: "create" })} onContinue={() => setScreen({ name: "city" })} />}
      {screen.name === "create" && <Create onDone={() => setScreen({ name: "location", locationId: "home" })} onBack={() => setScreen({ name: "title" })} />}
      {screen.name === "city" && <City onOpen={(locationId) => setScreen({ name: "location", locationId })} />}
      {screen.name === "location" && (
        <Location
          locationId={screen.locationId}
          onBack={() => setScreen({ name: "city" })}
          onSpot={(spotId) => setScreen({ name: "spot", locationId: screen.locationId, spotId })}
        />
      )}
      {screen.name === "spot" && (
        <Spot
          locationId={screen.locationId}
          spotId={screen.spotId}
          onBack={() => setScreen({ name: "location", locationId: screen.locationId })}
          onTalk={(npcId, bg, mode, intro) =>
            setScreen({ name: "talk", npcId, bg, mode, intro, back: screen })
          }
          onWardrobe={() => setScreen({ name: "wardrobe" })}
          onShop={() => setScreen({ name: "shop" })}
          onInvite={() => setScreen({ name: "invite" })}
          onGame={(game) => setScreen({ name: "mini", game, back: screen })}
        />
      )}
      {screen.name === "talk" && (
        <Talk
          npcId={screen.npcId}
          bg={screen.bg}
          mode={screen.mode}
          intro={screen.intro}
          onClose={() => setScreen(screen.back)}
        />
      )}
      {screen.name === "wardrobe" && <Wardrobe onBack={() => setScreen({ name: "spot", locationId: "home", spotId: "room" })} />}
      {screen.name === "tasks" && <Tasks onBack={() => setScreen({ name: "city" })} />}
      {screen.name === "hero" && <Hero onBack={() => setScreen({ name: "city" })} onTitle={() => setScreen({ name: "title" })} />}
      {screen.name === "shop" && <Shop onBack={() => setScreen({ name: "spot", locationId: "boutique", spotId: "floor" })} />}
      {screen.name === "invite" && (
        <Invite
          onBack={() => setScreen({ name: "spot", locationId: "home", spotId: "living" })}
          onArrived={(npcId) =>
            setScreen({
              name: "talk",
              npcId,
              bg: "/art/bg/home-living.jpg",
              mode: "host",
              intro: true,
              back: { name: "spot", locationId: "home", spotId: "living" },
            })
          }
        />
      )}
      {screen.name === "mini" && (
        <MiniGame
          game={screen.game}
          day={useGame.getState().day}
          onClose={() => setScreen(screen.back)}
          onFinish={(score) => {
            useGame.getState().completeGame(screen.game, score);
            setScreen(screen.back);
          }}
        />
      )}
      {showNav && <Nav current={screen.name} onCity={() => setScreen({ name: "city" })} onTasks={() => setScreen({ name: "tasks" })} onHero={() => setScreen({ name: "hero" })} />}
    </main>
  );
}

function Nav({
  current,
  onCity,
  onTasks,
  onHero,
}: {
  current: string;
  onCity: () => void;
  onTasks: () => void;
  onHero: () => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 gap-2 border-t border-line bg-ink/95 px-3 py-2">
      <NavBtn active={current === "city" || current === "location" || current === "spot"} onClick={onCity} icon={<Map className="size-4" />} label="Мапа" />
      <NavBtn active={current === "tasks"} onClick={onTasks} icon={<ScrollText className="size-4" />} label="Завдання" />
      <NavBtn active={current === "hero" || current === "wardrobe"} onClick={onHero} icon={<UserRound className="size-4" />} label="Герой" />
    </nav>
  );
}

function NavBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button type="button" onClick={onClick} className={cn("flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl text-xs", active ? "bg-cream text-ink" : "text-cream-dim")}>
      {icon}
      {label}
    </button>
  );
}

function Title({ created, onNew, onContinue }: { created: boolean; onNew: () => void; onContinue: () => void }) {
  const reset = useGame((s) => s.reset);
  const [ask, setAsk] = useState(false);
  return (
    <section className="relative min-h-screen">
      <Photo src="/art/bg/title.jpg" alt="" className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="relative flex min-h-screen flex-col justify-end px-5 pb-10">
        <p className="text-sm tracking-widest text-gold uppercase">місто після шостої</p>
        <h1 className="mt-2 max-w-sm font-display text-5xl leading-none text-cream">Ліхтарний квартал</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-cream">
          Завдання, шафа і люди, які ходять своїми справами. Вони дивляться не на анкету — на те, в чому ти вийшов з дому.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {created && (
            <Btn onClick={onContinue}>Продовжити</Btn>
          )}
          <Btn tone={created ? "ghost" : "primary"} onClick={() => (created ? setAsk(true) : onNew())}>
            Нова гра
          </Btn>
        </div>
        <p className="mt-6 max-w-md text-xs leading-relaxed text-cream-dim">
          Світлини тимчасові. Заміни файли в теці public/art — імена лиши ті самі.
        </p>
        {ask && (
          <div className="mt-4 rounded-3xl bg-cream p-4 text-ink">
            <p>Поточний день зітреться.</p>
            <div className="mt-3 flex gap-2">
              <Btn tone="ink" onClick={() => { reset(); onNew(); }}>Так, спочатку</Btn>
              <Btn tone="olive" onClick={() => setAsk(false)}>Ні</Btn>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Create({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const startNew = useGame((s) => s.startNew);
  const [look, setLook] = useState<Look>({ name: "", hair: "bob", hairColor: "h2", eye: "e1", skin: "s2" });
  const equipped: Equipped = {
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
  const ready = look.name.trim().length >= 2;
  return (
    <section className="grid gap-4 px-4 pb-8 lg:grid-cols-[auto_1fr] lg:items-center">
      <Doll look={look} equipped={equipped} className="mx-auto h-80 w-auto" />
      <div className="grid gap-4">
        <div>
          <h2 className="font-display text-3xl">Хто виходить у місто</h2>
          <p className="mt-1 text-sm text-cream-dim">Ім'я, волосся, очі. Одяг зміниться пізніше — вдома, біля шафи.</p>
        </div>
        <label className="grid gap-1 text-sm">
          Ім'я
          <input
            value={look.name}
            maxLength={16}
            onChange={(event) => setLook({ ...look, name: event.target.value })}
            className="min-h-11 rounded-2xl border border-line bg-ink-2 px-3 text-cream"
            placeholder="Саша"
          />
        </label>
        <ChoiceRow label="Волосся">
          {HAIR_STYLES.map((style) => (
            <Btn key={style.id} tone={look.hair === style.id ? "primary" : "ghost"} onClick={() => setLook({ ...look, hair: style.id })}>
              {style.name}
            </Btn>
          ))}
        </ChoiceRow>
        <Swatches label="Колір волосся" value={look.hairColor} options={HAIR_COLORS} onPick={(hairColor) => setLook({ ...look, hairColor })} />
        <Swatches label="Очі" value={look.eye} options={EYES} onPick={(eye) => setLook({ ...look, eye })} />
        <Swatches label="Шкіра" value={look.skin} options={SKINS} onPick={(skin) => setLook({ ...look, skin })} />
        <div className="flex flex-wrap gap-2">
          <Btn
            disabled={!ready}
            onClick={() => {
              startNew(look);
              onDone();
            }}
          >
            Вийти в місто
          </Btn>
          <Btn tone="ghost" onClick={onBack}>Назад</Btn>
        </div>
      </div>
    </section>
  );
}

function ChoiceRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm text-cream-dim">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Swatches({
  label,
  value,
  options,
  onPick,
}: {
  label: string;
  value: string;
  options: { id: string; name: string; color: string }[];
  onPick: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-cream-dim">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-label={option.name}
            onClick={() => onPick(option.id)}
            className={cn("size-11 rounded-full border-2", value === option.id ? "border-cream" : "border-transparent")}
            style={{ background: option.color }}
          />
        ))}
      </div>
    </div>
  );
}

function City({ onOpen }: { onOpen: (locationId: string) => void }) {
  const state = useGame();
  const wait = useGame((s) => s.waitHour);
  const seen = useGame((s) => s.seenIntro);
  const mark = useGame((s) => s.markIntro);
  return (
    <section className="px-3 pb-24">
      {!seen && (
        <div className="mb-3 rounded-3xl bg-cream p-4 text-ink">
          <p className="font-display text-2xl">Перший вихід</p>
          <p className="mt-2 text-sm leading-relaxed">
            Обирай місце. Люди переходять між локаціями щогодини. Одяг змінюється лише вдома в кімнаті. Завдання й міні-ігри приносять речі.
          </p>
          <Btn tone="ink" className="mt-3" onClick={mark}>Зрозуміло</Btn>
        </div>
      )}
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-display text-3xl">Квартал</h2>
        <Btn tone="ghost" onClick={wait}>Почекати годину</Btn>
      </div>
      <div className="relative hidden overflow-hidden rounded-3xl md:block md:h-[40rem]">
        <Photo src="/art/bg/city.jpg" alt="" className="absolute inset-0" />
        <div className={cn("absolute inset-0", wash())} />
        {LOCATIONS.map((location) => (
          <button
            key={location.id}
            type="button"
            onClick={() => go(location.id)}
            className="absolute w-44 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-ink/80 p-2 text-left"
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
          >
            <Pin locationId={location.id} />
          </button>
        ))}
      </div>
      <div className="grid gap-2 md:hidden">
        {LOCATIONS.map((location) => (
          <button key={location.id} type="button" onClick={() => go(location.id)} className="overflow-hidden rounded-3xl bg-ink-2 text-left">
            <Photo src={location.image} alt="" className="h-28" />
            <div className="p-3">
              <Pin locationId={location.id} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );

  function go(locationId: string) {
    if (state.here === locationId) {
      onOpen(locationId);
      return;
    }
    const cost = locationId === "home" ? 0 : 8;
    if (state.energy < cost) {
      useGame.setState({ notice: ["Замало енергії. Відпочинь у кімнаті."] });
      return;
    }
    const ok = useGame.getState().travel(locationId);
    if (ok) onOpen(locationId);
  }
  function wash() {
    const block = blockOf(state.hour);
    if (block === "morning") return "bg-gold/25";
    if (block === "evening") return "bg-terra/30";
    if (block === "night") return "bg-ink/60";
    return "bg-ink/20";
  }
}

function Pin({ locationId }: { locationId: string }) {
  const state = useGame();
  const location = locationById(locationId)!;
  const people = peopleAt(locationId, null, state);
  const cost = locationId === "home" ? "без сил" : "8 енергії";
  return (
    <div>
      <p className="font-display text-lg leading-tight">{location.name}</p>
      <p className="text-xs text-cream-dim">{cost}</p>
      <div className="mt-2 flex -space-x-2">
        {people.map((npc) => (
          <Portrait key={npc.id} src={npc.portrait} alt={npc.name} className="size-8 rounded-full border border-ink" />
        ))}
      </div>
    </div>
  );
}

function Location({
  locationId,
  onBack,
  onSpot,
}: {
  locationId: string;
  onBack: () => void;
  onSpot: (spotId: string) => void;
}) {
  const state = useGame();
  const location = locationById(locationId)!;
  const people = peopleAt(locationId, null, state);
  return (
    <section className="px-3 pb-24">
      <Back onBack={onBack} />
      <div className="overflow-hidden rounded-3xl">
        <Photo src={location.image} alt="" className="h-48" />
      </div>
      <h2 className="mt-3 font-display text-4xl">{location.name}</h2>
      <p className="mt-1 max-w-xl text-sm leading-relaxed text-cream-dim">{location.blurb}</p>
      <p className="mt-3 text-sm">
        Зараз тут: {people.length ? people.map((npc) => npc.name).join(", ") : "нікого знайомого"}
      </p>
      <div className="mt-4 grid gap-2">
        {location.spots.map((spot) => {
          const here = peopleAt(locationId, spot.id, state);
          return (
            <button key={spot.id} type="button" onClick={() => onSpot(spot.id)} className="flex min-h-16 items-center gap-3 rounded-3xl bg-ink-2 p-2 text-left">
              <Photo src={spot.image} alt="" className="size-16 shrink-0 rounded-2xl" />
              <span>
                <span className="block font-display text-xl">{spot.name}</span>
                <span className="block text-sm text-cream-dim">
                  {here.length ? here.map((npc) => npc.name).join(", ") : spot.blurb}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Spot({
  locationId,
  spotId,
  onBack,
  onTalk,
  onWardrobe,
  onShop,
  onInvite,
  onGame,
}: {
  locationId: string;
  spotId: string;
  onBack: () => void;
  onTalk: (npcId: string, bg: string, mode: TalkMode, intro: boolean) => void;
  onWardrobe: () => void;
  onShop: () => void;
  onInvite: () => void;
  onGame: (game: GameId) => void;
}) {
  const state = useGame();
  const spot = spotOf(locationId, spotId)!;
  const people = peopleAt(locationId, spotId, state);
  const rest = useGame((s) => s.rest);
  const sleep = useGame((s) => s.sleep);
  return (
    <section className="px-3 pb-24">
      <Back onBack={onBack} />
      <div className="overflow-hidden rounded-3xl">
        <Photo src={spot.image} alt="" className="h-56" />
      </div>
      <h2 className="mt-3 font-display text-4xl">{spot.name}</h2>
      <p className="mt-1 text-sm text-cream-dim">{spot.blurb}</p>
      <div className="mt-4 grid gap-2">
        {people.map((npc) => {
          const host = locationId === "home" && state.guest === npc.id;
          const visit = canVisit(npc.id, state);
          return (
            <article key={npc.id} className="rounded-3xl bg-ink-2 p-3">
              <div className="flex items-center gap-3">
                <Portrait src={npc.portrait} alt={npc.name} className="size-16 rounded-2xl" />
                <div>
                  <p className="font-display text-2xl">{npc.name}</p>
                  <p className="text-sm text-cream-dim">{npc.role}</p>
                  <p className="text-xs text-gold">Близькість {state.rel[npc.id] ?? 0}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Btn onClick={() => onTalk(npc.id, spot.image, host ? "host" : "spot", false)}>Говорити</Btn>
                <Btn
                  tone="ghost"
                  disabled={!visit.ok}
                  onClick={() => {
                    if (useGame.getState().beginVisit(npc.id)) {
                      onTalk(npc.id, npc.visitBg, "visit", true);
                    }
                  }}
                >
                  У гості
                </Btn>
              </div>
              {!visit.ok && <p className="mt-2 text-xs text-cream-dim">{visit.reason}</p>}
            </article>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {spot.game && (
          <Btn
            tone="olive"
            onClick={() => {
              if (state.played[spot.game!] === state.day) {
                useGame.setState({ notice: ["Сьогодні це вже зіграно."] });
                return;
              }
              if (state.energy < 10) {
                useGame.setState({ notice: ["Потрібно 10 енергії."] });
                return;
              }
              onGame(spot.game!);
            }}
          >
            {GAMES[spot.game].name}
          </Btn>
        )}
        {locationId === "home" && spotId === "room" && (
          <>
            <Btn onClick={onWardrobe}>
              <Shirt className="size-4" /> Шафа
            </Btn>
            <Btn tone="ghost" onClick={rest}>Перепочити</Btn>
            <Btn tone="ghost" onClick={sleep}>Спати до ранку</Btn>
          </>
        )}
        {locationId === "home" && spotId === "living" && <Btn onClick={onInvite}>Покликати гостя</Btn>}
        {locationId === "boutique" && spotId === "floor" && <Btn onClick={onShop}>Купити</Btn>}
      </div>
    </section>
  );
}

function Wardrobe({ onBack }: { onBack: () => void }) {
  const state = useGame();
  const equip = useGame((s) => s.equip);
  const unequip = useGame((s) => s.unequip);
  const look = outfit(state);
  const groups = Object.entries(SLOT_LABEL);
  return (
    <section className="grid gap-4 px-3 pb-24 lg:grid-cols-[16rem_1fr]">
      <div>
        <Back onBack={onBack} />
        <Doll look={state.look} equipped={state.equipped} className="mx-auto h-96 w-auto" />
        <p className="mt-2 text-center text-sm text-cream-dim">{look.label}</p>
        <p className="text-center text-sm">Стиль {look.style} · жіночність {look.feminine}{look.clash ? " · інтонації сперечаються" : ""}</p>
      </div>
      <div className="grid gap-4">
        <h2 className="font-display text-3xl">Шафа</h2>
        {groups.map(([slot, label]) => {
          const items = state.owned
            .map((id) => itemById(id))
            .filter((item) => item && item.slot === slot);
          if (!items.length) return null;
          const current = state.equipped[slot as keyof Equipped];
          return (
            <div key={slot}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-gold">{label}</p>
                {current && (
                  <button type="button" className="text-xs text-cream-dim" onClick={() => unequip(slot as keyof Equipped)}>
                    Зняти
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {items.map((item) => (
                  <button
                    key={item!.id}
                    type="button"
                    onClick={() => equip(item!.id)}
                    className={cn("overflow-hidden rounded-2xl bg-ink-2 text-left", current === item!.id && "outline outline-2 outline-gold")}
                  >
                    {item!.image ? (
                    <img src={item!.image} alt="" className="h-24 w-full object-cover" />
                  ) : (
                    <span className="block h-24 w-full" style={{ background: item!.color }} />
                  )}
                    <span className="block px-2 py-2 text-sm">{item!.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Tasks({ onBack }: { onBack: () => void }) {
  const state = useGame();
  return (
    <section className="px-3 pb-24">
      <Back onBack={onBack} />
      <h2 className="font-display text-4xl">Завдання</h2>
      <div className="mt-4 grid gap-2">
        {TASKS.map((task) => {
          const ready = taskReady(task.id, state);
          const claimed = task.daily ? state.claimed[task.id] === state.day : (state.claimed[task.id] ?? 0) > 0;
          return (
            <article key={task.id} className="rounded-3xl bg-ink-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-2xl">{task.title}</h3>
                <span className="text-xs text-gold">{claimed ? "здано" : ready ? "майже" : task.daily ? "сьогодні" : "історія"}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-cream-dim">{task.detail}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Hero({ onBack, onTitle }: { onBack: () => void; onTitle: () => void }) {
  const state = useGame();
  const look = outfit(state);
  return (
    <section className="px-3 pb-24">
      <Back onBack={onBack} />
      <div className="grid items-center gap-3 sm:grid-cols-[12rem_1fr]">
        <Doll look={state.look} equipped={state.equipped} className="h-72 w-auto" />
        <div>
          <h2 className="font-display text-4xl">{state.look.name}</h2>
          <p className="mt-1 text-sm text-cream-dim">{look.label}</p>
          <ul className="mt-3 grid gap-1 text-sm">
            <li>Стиль {look.style}</li>
            <li>Жіночність образу {look.feminine}</li>
            <li>Впевненість {state.confidence}</li>
            <li>Чарівність {state.charm}</li>
            <li>Чуття стилю {state.sense}</li>
          </ul>
        </div>
      </div>
      <h3 className="mt-6 font-display text-2xl">Люди</h3>
      <ul className="mt-2 grid gap-2">
        {NPCS.map((npc) => {
          const where = npcWhere(npc.id, state.day, state.hour);
          return (
            <li key={npc.id} className="flex items-center gap-3 rounded-2xl bg-ink-2 p-2">
              <Portrait src={npc.portrait} alt="" className="size-12 rounded-xl" />
              <span>
                <span className="block">{npc.name} · {state.rel[npc.id] ?? 0}</span>
                <span className="block text-xs text-cream-dim">{placeLabel(where)}</span>
              </span>
            </li>
          );
        })}
      </ul>
      {state.log.length > 0 && (
        <>
          <h3 className="mt-6 font-display text-2xl">Журнал</h3>
          <ul className="mt-2 grid gap-1 text-sm text-cream-dim">
            {state.log.slice(0, 8).map((line, index) => (
              <li key={`${line}-${index}`}>{line}</li>
            ))}
          </ul>
        </>
      )}
      <Btn tone="ghost" className="mt-6" onClick={onTitle}>До титулу</Btn>
    </section>
  );
}

function Shop({ onBack }: { onBack: () => void }) {
  const state = useGame();
  const buy = useGame((s) => s.buy);
  return (
    <section className="px-3 pb-24">
      <Back onBack={onBack} />
      <h2 className="font-display text-4xl">Вішак «Нитки»</h2>
      <p className="mt-1 text-sm text-cream-dim">Монет: {state.coins}. Сукня, пальто і помада сюди не потрапляють.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {shopItems().map((item) => {
          const owned = state.owned.includes(item.id);
          return (
            <article key={item.id} className="overflow-hidden rounded-3xl bg-ink-2">
              {item.image && <img src={item.image} alt="" className="h-36 w-full object-cover" />}
              <div className="p-3">
                <p className="font-display text-xl">{item.name}</p>
                <p className="text-sm text-cream-dim">{item.blurb}</p>
                <Btn className="mt-3" disabled={owned || state.coins < (item.price ?? 0)} onClick={() => buy(item.id)}>
                  {owned ? "У шафі" : `${item.price} монет`}
                </Btn>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Invite({ onBack, onArrived }: { onBack: () => void; onArrived: (npcId: string) => void }) {
  const state = useGame();
  return (
    <section className="px-3 pb-24">
      <Back onBack={onBack} />
      <h2 className="font-display text-4xl">Покликати</h2>
      <div className="mt-4 grid gap-2">
        {NPCS.map((npc) => {
          const gate = canInvite(npc.id, state);
          return (
            <button
              key={npc.id}
              type="button"
              disabled={!gate.ok}
              onClick={() => {
                if (useGame.getState().invite(npc.id)) onArrived(npc.id);
              }}
              className="flex min-h-16 items-center gap-3 rounded-3xl bg-ink-2 p-2 text-left disabled:opacity-50"
            >
              <Portrait src={npc.portrait} alt="" className="size-14 rounded-2xl" />
              <span>
                <span className="block font-display text-xl">{npc.name}</span>
                <span className="block text-sm text-cream-dim">{gate.reason}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Back({ onBack }: { onBack: () => void }) {
  return (
    <button type="button" onClick={onBack} className="mb-3 inline-flex min-h-11 items-center gap-1 text-sm text-cream-dim">
      <ChevronLeft className="size-4" /> Назад
    </button>
  );
}
