import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GameApp } from "@/components/game/GameApp";
import { useGame } from "@/game/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void useGame.persist.rehydrate();
    setReady(true);
  }, []);
  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink text-cream">
        <p className="font-display text-3xl">Ліхтарний квартал</p>
      </main>
    );
  }
  return <GameApp />;
}
