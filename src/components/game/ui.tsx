import { clsx, type ClassValue } from "clsx";
import { Clock, Coins, Sparkles, Zap } from "lucide-react";
import { useState, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { outfit, blockName, blockOf, formatHour } from "@/game/logic";
import { useGame } from "@/game/store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Btn({
  children,
  onClick,
  disabled,
  tone = "primary",
  type = "button",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "primary" | "ghost" | "olive" | "ink";
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-40",
        tone === "primary" && "bg-terra text-cream",
        tone === "olive" && "bg-olive text-cream",
        tone === "ink" && "bg-ink text-cream",
        tone === "ghost" && "border border-line bg-ink-2/80 text-cream",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Portrait({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [bad, setBad] = useState(false);
  if (bad) {
    return (
      <div className={cn("grid place-items-center bg-ink-2 font-display text-3xl text-cream", className)}>
        {alt.slice(0, 1)}
      </div>
    );
  }
  return <img src={src} alt={alt} className={cn("object-cover", className)} onError={() => setBad(true)} />;
}

export function Hud() {
  const state = useGame();
  const look = outfit(state);
  return (
    <header className="flex flex-wrap items-center gap-2 px-3 py-3 text-sm">
      <div className="font-display text-lg leading-none text-cream">
        {state.look.name}
        <span className="mt-1 block font-sans text-xs font-medium text-cream-dim">
          День {state.day} · {blockName(blockOf(state.hour))}
        </span>
      </div>
      <div className="ml-auto flex flex-wrap justify-end gap-1.5">
        <Stat icon={<Clock className="size-3.5" />} label={formatHour(state.hour)} />
        <Stat icon={<Zap className="size-3.5" />} label={String(state.energy)} />
        <Stat icon={<Coins className="size-3.5" />} label={String(state.coins)} />
        <Stat icon={<Sparkles className="size-3.5" />} label={`${look.style}`} />
      </div>
    </header>
  );
}

function Stat({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex min-h-9 items-center gap-1 rounded-full bg-ink-2 px-2.5 text-cream">
      {icon}
      <span className="tabular-nums">{label}</span>
    </span>
  );
}

export function Notices() {
  const notice = useGame((s) => s.notice);
  const dismiss = useGame((s) => s.dismissNotice);
  if (!notice.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center px-3 pt-3">
      <button type="button" onClick={dismiss} className="pointer-events-auto max-w-md rounded-2xl bg-cream px-4 py-3 text-left text-sm text-ink shadow-lg">
        {notice.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </button>
    </div>
  );
}

export function Photo({
  src,
  alt,
  className,
  pan = false,
}: {
  src: string;
  alt: string;
  className?: string;
  pan?: boolean;
}) {
  const [bad, setBad] = useState(false);
  return (
    <div className={cn("bg-ink-2", className)}>
      {!bad && (
        <img
          src={src}
          alt={alt}
          onError={() => setBad(true)}
          className={cn("h-full w-full object-cover", pan && "pan-bg")}
        />
      )}
    </div>
  );
}
