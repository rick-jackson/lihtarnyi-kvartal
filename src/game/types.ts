export type Slot =
  | "top"
  | "bottom"
  | "dress"
  | "shoes"
  | "outer"
  | "head"
  | "jewelry"
  | "makeup"
  | "legs";

export type Tag = "plain" | "soft" | "elegant" | "bold";

export type HairStyle = "short" | "bob" | "long" | "bun";

export type Block = "morning" | "day" | "evening" | "night";

export type GameId = "latte" | "memory" | "steps" | "mail";

export type SceneId = "coffee" | "mirror" | "stroll" | "gallery" | "doorbell" | "tea";

export type TalkMode = "spot" | "host" | "visit";

export interface Item {
  id: string;
  name: string;
  slot: Slot;
  feminine: number;
  style: number;
  tags: Tag[];
  color: string;
  accent?: string;
  blurb: string;
  image?: string;
  price?: number;
}

export interface Look {
  name: string;
  hair: HairStyle;
  hairColor: string;
  eye: string;
  skin: string;
}

export interface Equipped {
  top: string | null;
  bottom: string | null;
  dress: string | null;
  shoes: string | null;
  outer: string | null;
  head: string | null;
  jewelry: string | null;
  makeup: string | null;
  legs: string | null;
}

export interface PlaceRef {
  locationId: string;
  spotId: string;
}

export interface Npc {
  id: string;
  name: string;
  role: string;
  portrait: string;
  visitBg: string;
  likes: Tag[];
  schedule: Record<Block, PlaceRef | null>;
}

export interface Spot {
  id: string;
  name: string;
  blurb: string;
  image: string;
  game?: GameId;
}

export interface Location {
  id: string;
  name: string;
  blurb: string;
  image: string;
  x: number;
  y: number;
  spots: Spot[];
}

export type Effect =
  | { k: "coins"; n: number }
  | { k: "energy"; n: number }
  | { k: "confidence"; n: number }
  | { k: "charm"; n: number }
  | { k: "sense"; n: number }
  | { k: "rel"; npc: string; n: number }
  | { k: "item"; id: string }
  | { k: "flag"; key: string; n?: number };

export interface Line {
  who: "player" | "npc";
  text: string;
}

export interface Topic {
  id: string;
  label: string;
  modes?: TalkMode[];
  minRel?: number;
  minFem?: number;
  minStyle?: number;
  hourMin?: number;
  hourMax?: number;
  onceFlag?: string;
  scene?: SceneId;
  effects: Effect[];
  lines: Line[];
}

export interface TaskDef {
  id: string;
  title: string;
  detail: string;
  daily: boolean;
  rewards: Effect[];
}

export interface GameState {
  version: 1;
  created: boolean;
  look: Look;
  equipped: Equipped;
  owned: string[];
  coins: number;
  energy: number;
  confidence: number;
  charm: number;
  sense: number;
  day: number;
  hour: number;
  rel: Record<string, number>;
  flags: Record<string, number>;
  claimed: Record<string, number>;
  played: Record<string, number>;
  invited: Record<string, number>;
  visited: Record<string, number>;
  log: string[];
  seenIntro: boolean;
  guest: string | null;
  here: string | null;
  tracks: Record<string, string>;
}

export interface Outfit {
  items: Item[];
  style: number;
  feminine: number;
  clash: boolean;
  label: string;
}

export interface Swatch {
  id: string;
  name: string;
  color: string;
}
