import { EYES, HAIR_COLORS, SKINS, itemById } from "@/game/content";
import type { Equipped, Look } from "@/game/types";

export function Doll({
  look,
  equipped,
  className,
}: {
  look: Look;
  equipped: Equipped;
  className?: string;
}) {
  const skin = SKINS.find((swatch) => swatch.id === look.skin)?.color ?? SKINS[1]!.color;
  const hair = HAIR_COLORS.find((swatch) => swatch.id === look.hairColor)?.color ?? HAIR_COLORS[0]!.color;
  const eye = EYES.find((swatch) => swatch.id === look.eye)?.color ?? EYES[2]!.color;
  const dress = itemById(equipped.dress);
  const top = dress ? undefined : itemById(equipped.top);
  const bottom = dress ? undefined : itemById(equipped.bottom);
  const shoes = itemById(equipped.shoes);
  const outer = itemById(equipped.outer);
  const head = itemById(equipped.head);
  const jewel = itemById(equipped.jewelry);
  const makeup = itemById(equipped.makeup);
  const legs = itemById(equipped.legs);
  const shirt = itemById("shirt")!;
  const trousers = itemById("trousers")!;
  const torso = dress?.color ?? top?.color ?? shirt.color;
  const skirt = dress?.color ?? bottom?.color ?? trousers.color;
  const leg = legs?.color ?? skin;
  const heel = shoes?.id === "heels";
  const sole = shoes?.color ?? skin;
  const hem = heel ? 332 : 348;

  return (
    <svg viewBox="0 0 200 440" className={className} role="img" aria-label="Персонаж у поточному одязі">
      <ellipse cx="100" cy="424" rx="48" ry="8" fill="black" opacity="0.18" />
      {look.hair === "long" && (
        <path d="M62 78 C48 140 46 200 58 230 L78 210 C70 160 74 120 86 90 Z M138 78 C152 140 154 200 142 230 L122 210 C130 160 126 120 114 90 Z" fill={hair} />
      )}
      {look.hair === "bob" && (
        <path d="M64 70 C58 120 64 150 78 156 L86 96 C96 150 104 150 114 96 L122 156 C136 150 142 120 136 70 Z" fill={hair} />
      )}
      <path
        d={heel ? "M78 250 L74 360 L92 360 L96 250 Z M122 250 L118 360 L136 360 L140 250 Z" : "M78 248 L74 384 L94 384 L98 248 Z M120 248 L116 384 L136 384 L140 248 Z"}
        fill={leg}
      />
      {shoes?.id === "heels" && (
        <g>
          <path d="M70 356 L96 356 L100 372 L78 378 Z" fill={sole} />
          <path d="M116 356 L142 356 L146 378 L124 372 Z" fill={sole} />
          <rect x="86" y="368" width="6" height="16" rx="1" fill={sole} />
          <rect x="132" y="368" width="6" height="16" rx="1" fill={sole} />
        </g>
      )}
      {shoes && shoes.id !== "heels" && (
        <g>
          <rect x="68" y="376" width="32" height="16" rx="6" fill={sole} />
          <rect x="114" y="376" width="32" height="16" rx="6" fill={sole} />
          <path d="M70 382 H98 M116 382 H144" stroke={shoes.accent ?? "black"} strokeWidth="2" opacity="0.35" />
        </g>
      )}
      {!shoes && (
        <g>
          <ellipse cx="84" cy="392" rx="14" ry="7" fill={skin} />
          <ellipse cx="128" cy="392" rx="14" ry="7" fill={skin} />
        </g>
      )}
      {dress ? (
        <path d={`M70 168 C70 210 58 ${hem} 48 ${hem} L152 ${hem} C142 210 130 168 130 168 Z`} fill={skirt} />
      ) : (
        <path d="M74 214 H126 L132 300 H68 Z" fill={skirt} />
      )}
      {dress?.accent && (
        <g fill={dress.accent}>
          <circle cx="86" cy="230" r="3" />
          <circle cx="104" cy="246" r="3" />
          <circle cx="120" cy="228" r="3" />
          <circle cx="92" cy="268" r="3" />
          <circle cx="116" cy="272" r="3" />
        </g>
      )}
      <path d="M78 132 H122 L128 214 H72 Z" fill={torso} />
      <path d="M78 132 Q100 146 122 132" fill="none" stroke="black" strokeOpacity="0.15" />
      {outer && (
        <path
          d="M58 140 L46 300 L70 300 L78 168 L78 140 Z M142 140 L122 168 L122 300 L154 300 L142 140 Z"
          fill={outer.color}
        />
      )}
      <path d="M52 150 C40 190 46 230 62 236 L74 168 Z" fill={skin} />
      <path d="M148 150 C160 190 154 230 138 236 L126 168 Z" fill={skin} />
      <rect x="90" y="108" width="20" height="28" rx="8" fill={skin} />
      <ellipse cx="100" cy="74" rx="32" ry="36" fill={skin} />
      <ellipse cx="66" cy="78" rx="6" ry="8" fill={skin} />
      <ellipse cx="134" cy="78" rx="6" ry="8" fill={skin} />
      {look.hair === "bun" && <circle cx="100" cy="36" r="14" fill={hair} />}
      <path
        d={
          look.hair === "short"
            ? "M68 62 C70 34 130 34 132 62 C120 48 80 48 68 62 Z"
            : "M66 70 C64 28 136 28 134 70 C120 46 80 46 66 70 Z"
        }
        fill={hair}
      />
      {head?.id === "beret" && <ellipse cx="108" cy="42" rx="28" ry="12" fill={head.color} transform="rotate(-12 108 42)" />}
      {head?.id === "ribbon" && (
        <path d="M92 58 H108 L118 48 L112 64 L124 74 L104 66 L96 80 L98 64 L84 56 Z" fill={head.color} />
      )}
      <ellipse cx="88" cy="74" rx="4.5" ry="5" fill="white" />
      <ellipse cx="112" cy="74" rx="4.5" ry="5" fill="white" />
      <circle cx="89" cy="75" r="2.4" fill={eye} />
      <circle cx="113" cy="75" r="2.4" fill={eye} />
      <path d="M96 88 Q100 92 104 88" fill="none" stroke="black" strokeOpacity="0.35" strokeWidth="1.4" />
      <ellipse cx="100" cy="98" rx={makeup ? 7 : 5} ry={makeup ? 3.4 : 2.2} fill={makeup?.color ?? "black"} opacity={makeup ? 0.95 : 0.35} />
      {jewel && (
        <g fill={jewel.color}>
          <circle cx="64" cy="86" r="3.2" />
          <circle cx="136" cy="86" r="3.2" />
        </g>
      )}
    </svg>
  );
}
