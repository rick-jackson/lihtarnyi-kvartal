import { useEffect, useMemo, useRef, useState } from "react";
import { GAMES, itemById } from "@/game/content";
import { hash, memoryDeck } from "@/game/logic";
import type { GameId } from "@/game/types";
import { Btn } from "./ui";

export function MiniGame({
  game,
  day,
  onFinish,
  onClose,
}: {
  game: GameId;
  day: number;
  onFinish: (score: number) => void;
  onClose: () => void;
}) {
  return (
    <section className="flex min-h-screen flex-col bg-ink text-cream">
      <header className="flex items-center justify-between gap-3 px-4 py-4">
        <div>
          <p className="font-display text-2xl">{GAMES[game].name}</p>
          <p className="text-sm text-cream-dim">{GAMES[game].blurb}</p>
        </div>
        <Btn tone="ghost" onClick={onClose}>
          Вийти
        </Btn>
      </header>
      {game === "latte" && <Latte day={day} onFinish={onFinish} />}
      {game === "memory" && <Memory day={day} onFinish={onFinish} />}
      {game === "steps" && <Steps onFinish={onFinish} />}
      {game === "mail" && <Mail onFinish={onFinish} />}
    </section>
  );
}

function Latte({ day, onFinish }: { day: number; onFinish: (score: number) => void }) {
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState(0);
  const [marker, setMarker] = useState(0);
  const [done, setDone] = useState(false);
  const zone = 0.18 + ((hash("latte", day, round) % 50) / 100);
  const start = useRef(0);

  useEffect(() => {
    if (done) return;
    start.current = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const t = (now - start.current) / 420;
      setMarker((Math.sin(t) + 1) / 2);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [round, done]);

  function pour() {
    if (done) return;
    const hit = Math.abs(marker - zone) < 0.1;
    const nextHits = hits + (hit ? 1 : 0);
    if (round >= 7) {
      setHits(nextHits);
      setDone(true);
      onFinish(Math.round((nextHits / 8) * 100));
      return;
    }
    setHits(nextHits);
    setRound(round + 1);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 pb-10">
      <p className="text-sm text-cream-dim">
        Наливання {Math.min(round + 1, 8)} / 8 · влучань {hits}
      </p>
      <div className="relative h-72 w-16 rounded-full bg-ink-2">
        <div
          className="absolute inset-x-1 rounded-full bg-gold/70"
          style={{ top: `${zone * 100 - 8}%`, height: "16%" }}
        />
        <div
          className="absolute inset-x-0 h-2 rounded-full bg-cream"
          style={{ top: `${marker * 100}%` }}
        />
      </div>
      <Btn onClick={pour} disabled={done}>
        Налити
      </Btn>
    </div>
  );
}

function Memory({ day, onFinish }: { day: number; onFinish: (score: number) => void }) {
  const deck = useMemo(() => {
    const cards = memoryDeck();
    const arr = [...cards];
    let seed = hash("mem", day, 3) || 1;
    for (let i = arr.length - 1; i > 0; i--) {
      seed = (seed * 16807) % 2147483647;
      const j = seed % (i + 1);
      const swap = arr[i]!;
      arr[i] = arr[j]!;
      arr[j] = swap;
    }
    return arr;
  }, [day]);
  const [open, setOpen] = useState<number[]>([]);
  const [known, setKnown] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const finished = useRef(false);

  function tap(index: number) {
    if (lock || open.includes(index) || known.includes(deck[index]!.id)) return;
    const next = [...open, index];
    if (next.length < 2) {
      setOpen(next);
      return;
    }
    setMoves(moves + 1);
    const [a, b] = next;
    if (deck[a!]!.id === deck[b!]!.id) {
      const ids = [...known, deck[a!]!.id];
      setKnown(ids);
      setOpen([]);
      if (ids.length >= 4 && !finished.current) {
        finished.current = true;
        const score = Math.max(40, 100 - Math.max(0, moves + 1 - 4) * 8);
        onFinish(score);
      }
      return;
    }
    setOpen(next);
    setLock(true);
    window.setTimeout(() => {
      setOpen([]);
      setLock(false);
    }, 700);
  }

  return (
    <div className="grid flex-1 grid-cols-4 content-center gap-2 px-3 pb-8">
      {deck.map((card, index) => {
        const up = open.includes(index) || known.includes(card.id);
        const item = itemById(card.id);
        return (
          <button
            key={card.key}
            type="button"
            onClick={() => tap(index)}
            className="aspect-[3/4] overflow-hidden rounded-xl bg-ink-2"
          >
            {up ? (
              item?.image ? (
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full place-items-center p-1 text-center text-xs">{item?.name}</span>
              )
            ) : (
              <span className="grid h-full place-items-center font-display text-gold">?</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Steps({ onFinish }: { onFinish: (score: number) => void }) {
  const [scale, setScale] = useState(1.4);
  const [count, setCount] = useState(0);
  const [good, setGood] = useState(0);
  const [note, setNote] = useState("Торкнись, коли кільця збіжаться");
  const done = useRef(false);
  const scaleRef = useRef(1.4);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const phase = ((now - start) % 1100) / 1100;
      const next = 1.45 - phase * 0.75;
      scaleRef.current = next;
      setScale(next);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  function tap() {
    if (done.current) return;
    const delta = Math.abs(scaleRef.current - 1);
    const hit = delta < 0.12;
    const nextCount = count + 1;
    const nextGood = good + (hit ? 1 : 0);
    setCount(nextCount);
    setGood(nextGood);
    setNote(hit ? "Влучно" : "Мимо");
    if (nextCount >= 10) {
      done.current = true;
      onFinish(Math.round((nextGood / 10) * 100));
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 pb-10">
      <p className="text-sm text-cream-dim">
        {note} · {count}/10
      </p>
      <button type="button" onClick={tap} className="relative grid size-56 place-items-center" aria-label="Крок">
        <span className="absolute size-36 rounded-full border-2 border-gold" />
        <span
          className="absolute size-36 rounded-full border-2 border-cream"
          style={{ transform: `scale(${scale})` }}
        />
        <span className="font-display text-xl">Крок</span>
      </button>
    </div>
  );
}

const LETTERS: { text: string; cat: "clients" | "team" | "archive" }[] = [
  { text: "Рахунок за оренду зали від пані Коваль.", cat: "clients" },
  { text: "Хто принесе торт у п'ятницю?", cat: "team" },
  { text: "Старий прайс 2022, уже не діє.", cat: "archive" },
  { text: "Клієнт просить перенести зустріч на четвер.", cat: "clients" },
  { text: "Нагадування: зміна чергування на кухні.", cat: "team" },
  { text: "Чернетка листа, яку так і не надіслали.", cat: "archive" },
  { text: "Замовлення квітів для фойє галереї.", cat: "clients" },
  { text: "Андрій: я затримаюсь на десять хвилин.", cat: "team" },
];

function Mail({ onFinish }: { onFinish: (score: number) => void }) {
  const [index, setIndex] = useState(0);
  const [right, setRight] = useState(0);
  const letter = LETTERS[index];

  function choose(cat: "clients" | "team" | "archive") {
    if (!letter) return;
    const nextRight = right + (letter.cat === cat ? 1 : 0);
    if (index >= LETTERS.length - 1) {
      onFinish(Math.round((nextRight / LETTERS.length) * 100));
      return;
    }
    setRight(nextRight);
    setIndex(index + 1);
  }

  if (!letter) return null;
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-8">
      <p className="text-sm text-cream-dim">
        Лист {index + 1} / {LETTERS.length}
      </p>
      <article className="rise rounded-3xl bg-cream p-5 text-ink">
        <p className="font-display text-xl leading-snug">{letter.text}</p>
      </article>
      <div className="mt-auto grid gap-2">
        <Btn tone="ink" onClick={() => choose("clients")}>
          Клієнти
        </Btn>
        <Btn tone="olive" onClick={() => choose("team")}>
          Команда
        </Btn>
        <Btn tone="ghost" onClick={() => choose("archive")}>
          Архів
        </Btn>
      </div>
    </div>
  );
}
