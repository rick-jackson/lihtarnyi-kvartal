import { useEffect, useMemo, useRef, useState } from "react";
import { npcById } from "@/game/content";
import { fillText, greeting, hiddenTopicHint, topicsFor } from "@/game/logic";
import { useGame } from "@/game/store";
import type { Line, SceneId, TalkMode, Topic } from "@/game/types";
import { Doll } from "./Doll";
import { Btn, Photo, Portrait } from "./ui";

export function Talk({
  npcId,
  bg,
  mode,
  intro = false,
  onClose,
}: {
  npcId: string;
  bg: string;
  mode: TalkMode;
  intro?: boolean;
  onClose: () => void;
}) {
  const npc = npcById(npcId)!;
  const state = useGame();
  const greet = useMemo(() => greeting(npcId, mode, useGame.getState()), [npcId, mode]);
  const [lines, setLines] = useState<Line[]>(greet);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"scene" | "lines" | "choose">(intro ? "scene" : "lines");
  const [scene, setScene] = useState<SceneId | null>(
    intro ? (mode === "host" ? "doorbell" : "stroll") : null,
  );
  const pending = useRef<Topic | null>(null);
  const line = lines[index];
  const topics = topicsFor(npcId, mode, state);
  const hint = hiddenTopicHint(npcId, mode, state);

  function finishScene() {
    const topic = pending.current;
    setScene(null);
    if (topic) {
      pending.current = null;
      begin(topic);
      return;
    }
    setPhase("lines");
  }

  function begin(topic: Topic) {
    const now = useGame.getState();
    setLines(topic.lines.map((item) => ({ ...item, text: fillText(item.text, now, npc.name) })));
    setIndex(0);
    setPhase("lines");
    now.applyTopic(topic, npcId);
  }

  function advance() {
    if (phase !== "lines") return;
    if (index < lines.length - 1) setIndex(index + 1);
    else setPhase("choose");
  }

  function pick(topic: Topic) {
    if (useGame.getState().energy < 4) {
      useGame.setState({ notice: ["Замало енергії для цієї розмови."] });
      return;
    }
    pending.current = topic;
    if (topic.scene) {
      setScene(topic.scene);
      setPhase("scene");
      return;
    }
    begin(topic);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        advance();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!line) return null;

  return (
    <section className="relative min-h-screen overflow-hidden bg-ink text-cream">
      <Photo src={bg} alt="" className="absolute inset-0" pan={scene === "stroll"} />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/20" />
      {phase === "scene" && scene ? (
        <Scene scene={scene} npcId={npcId} onDone={finishScene} />
      ) : (
        <div className="relative flex min-h-screen flex-col">
          <div className="flex items-start justify-between px-4 pt-4">
            <Btn tone="ghost" onClick={onClose}>
              Вийти
            </Btn>
          </div>
          <div className="grid flex-1 place-items-center px-4">
            {line.who === "npc" ? (
              <Portrait src={npc.portrait} alt={npc.name} className="slide-r nod stage-figure w-full max-w-sm rounded-3xl object-top shadow-2xl" />
            ) : (
              <Doll look={state.look} equipped={state.equipped} className="slide-l pop stage-figure" />
            )}
          </div>
          <div className="px-3 pb-4">
            {phase === "lines" ? (
              <button type="button" onClick={advance} className="w-full rounded-3xl bg-cream p-4 text-left text-ink">
                <span className="font-display text-lg">{line.who === "npc" ? npc.name : state.look.name}</span>
                <p className="mt-1 text-base leading-relaxed">{line.text}</p>
                <span className="mt-2 block text-xs text-ink/60">Торкнись, щоб далі</span>
              </button>
            ) : (
              <div className="grid gap-2 rounded-3xl bg-ink/80 p-3 backdrop-blur">
                {topics.map((topic) => (
                  <Btn key={topic.id} tone="ghost" onClick={() => pick(topic)}>
                    {topic.label}
                  </Btn>
                ))}
                {hint && <p className="px-2 text-sm text-cream-dim">{hint}</p>}
                <Btn tone="primary" onClick={onClose}>
                  Завершити
                </Btn>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function Scene({ scene, npcId, onDone }: { scene: SceneId; npcId: string; onDone: () => void }) {
  const state = useGame();
  const npc = npcById(npcId)!;
  const caption =
    scene === "coffee"
      ? "Чашки зсуваються. Пара на мить закриває обличчя."
      : scene === "mirror"
        ? "Дзеркало ловить силует і не відпускає."
        : scene === "stroll"
          ? "Ви йдете. Місто зсувається позаду."
          : scene === "gallery"
            ? "Рами спалахують одна за одною."
            : scene === "doorbell"
              ? "Дзвоник. Крок у вітальні."
              : "Чай стигне між двома людьми.";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-end px-4 pb-6">
      <div className="mb-6 flex w-full max-w-lg items-end justify-center gap-4">
        <Doll look={state.look} equipped={state.equipped} className="slide-l h-80 w-auto" />
        {scene === "coffee" && (
          <div className="relative mb-10 h-24 w-24">
            <span className="steam absolute left-4 h-8 w-2 rounded-full bg-cream/70" />
            <span className="steam absolute left-10 h-8 w-2 rounded-full bg-cream/70" style={{ animationDelay: "0.4s" }} />
            <span className="absolute bottom-0 left-2 h-10 w-8 rounded-b-xl bg-cream" />
            <span className="absolute bottom-0 right-2 h-10 w-8 rounded-b-xl bg-gold" />
          </div>
        )}
        {scene === "gallery" && (
          <div className="mb-16 grid gap-2">
            <span className="rise h-16 w-12 border border-gold bg-cream/20" />
            <span className="rise h-10 w-16 border border-cream bg-cream/10" style={{ animationDelay: "0.2s" }} />
          </div>
        )}
        <Portrait src={npc.portrait} alt={npc.name} className="slide-r h-72 w-48 rounded-3xl object-cover" />
      </div>
      <div className="w-full max-w-lg rounded-3xl bg-cream p-4 text-ink">
        <p className="font-display text-xl leading-snug">{caption}</p>
        <Btn className="mt-4 w-full" tone="ink" onClick={onDone}>
          Далі
        </Btn>
      </div>
    </div>
  );
}
