import type {
  GameId,
  Item,
  Location,
  Npc,
  Swatch,
  TaskDef,
  Topic,
} from "./types";

export const SKINS: Swatch[] = [
  { id: "s1", name: "Порцеляна", color: "#f3d2b5" },
  { id: "s2", name: "Пісок", color: "#e0b08a" },
  { id: "s3", name: "Мідь", color: "#c68642" },
  { id: "s4", name: "Умбра", color: "#8d5524" },
];

export const HAIR_COLORS: Swatch[] = [
  { id: "h1", name: "Чорне", color: "#1a1614" },
  { id: "h2", name: "Каштан", color: "#6b3a2a" },
  { id: "h3", name: "Пшениця", color: "#d7b15a" },
  { id: "h4", name: "Мідь", color: "#a33b3b" },
  { id: "h5", name: "Попіл", color: "#8a8f99" },
];

export const EYES: Swatch[] = [
  { id: "e1", name: "Зелені", color: "#3e5346" },
  { id: "e2", name: "Сині", color: "#3d5a80" },
  { id: "e3", name: "Карі", color: "#6b4a2a" },
  { id: "e4", name: "Сірі", color: "#4a4e55" },
];

export const HAIR_STYLES: { id: "short" | "bob" | "long" | "bun"; name: string }[] = [
  { id: "short", name: "Коротке" },
  { id: "bob", name: "Каре" },
  { id: "long", name: "Довге" },
  { id: "bun", name: "Пучок" },
];

export const SLOT_LABEL: Record<Item["slot"], string> = {
  top: "Верх",
  bottom: "Низ",
  dress: "Сукня",
  legs: "Ноги",
  shoes: "Взуття",
  outer: "Верхній одяг",
  head: "Голова",
  jewelry: "Прикраси",
  makeup: "Макіяж",
};

export const ITEMS: Item[] = [
  {
    id: "shirt",
    name: "Бавовняна сорочка",
    slot: "top",
    feminine: 0,
    style: 2,
    tags: ["plain"],
    color: "#e7e1d6",
    blurb: "Звична сорочка на гудзиках.",
  },
  {
    id: "trousers",
    name: "Темні брюки",
    slot: "bottom",
    feminine: 0,
    style: 2,
    tags: ["plain"],
    color: "#2c3338",
    blurb: "Прямий крій, без зайвого.",
  },
  {
    id: "sneakers",
    name: "Кросівки",
    slot: "shoes",
    feminine: 0,
    style: 1,
    tags: ["plain"],
    color: "#f4f1ea",
    accent: "#2a2420",
    blurb: "Для довгих переходів між дворами.",
  },
  {
    id: "blouse",
    name: "Шовкова блуза",
    slot: "top",
    feminine: 2,
    style: 6,
    tags: ["soft", "elegant"],
    color: "#f4d6cf",
    blurb: "Легка, з м'яким коміром.",
    image: "/art/items/blouse.jpg",
    price: 80,
  },
  {
    id: "skirt",
    name: "Плісирована спідниця",
    slot: "bottom",
    feminine: 3,
    style: 6,
    tags: ["soft"],
    color: "#6e3b4a",
    blurb: "Складки ловлять крок.",
    image: "/art/items/skirt.jpg",
    price: 80,
  },
  {
    id: "dress",
    name: "Чорна сукня",
    slot: "dress",
    feminine: 4,
    style: 9,
    tags: ["elegant", "bold"],
    color: "#16161a",
    blurb: "Проста лінія, сильний силует.",
    image: "/art/items/dress.jpg",
  },
  {
    id: "polka",
    name: "Сукня в горошок",
    slot: "dress",
    feminine: 3,
    style: 7,
    tags: ["soft"],
    color: "#f7f3ea",
    accent: "#1a1614",
    blurb: "Світла, трохи грайлива.",
    image: "/art/items/polka.jpg",
  },
  {
    id: "heels",
    name: "Туфлі на підборах",
    slot: "shoes",
    feminine: 3,
    style: 5,
    tags: ["elegant"],
    color: "#1a1614",
    blurb: "Змінюють поставу раніше, ніж настрій.",
    image: "/art/items/heels.jpg",
    price: 70,
  },
  {
    id: "cardigan",
    name: "В'язаний кардиган",
    slot: "outer",
    feminine: 1,
    style: 4,
    tags: ["soft"],
    color: "#c46a4a",
    blurb: "Теплий, накинутий на плечі.",
    image: "/art/items/cardigan.jpg",
    price: 60,
  },
  {
    id: "coat",
    name: "Пальто до колін",
    slot: "outer",
    feminine: 2,
    style: 7,
    tags: ["elegant"],
    color: "#3e342c",
    blurb: "Тримає образ, навіть коли вітряно.",
    image: "/art/items/coat.jpg",
  },
  {
    id: "earrings",
    name: "Сережки-кільця",
    slot: "jewelry",
    feminine: 2,
    style: 3,
    tags: ["bold"],
    color: "#c6a36a",
    blurb: "Маленький жест, який видно здалеку.",
    image: "/art/items/earrings.jpg",
  },
  {
    id: "beret",
    name: "Берет",
    slot: "head",
    feminine: 2,
    style: 4,
    tags: ["soft", "elegant"],
    color: "#8a3a1c",
    blurb: "Сидить трохи набік.",
    image: "/art/items/beret.jpg",
    price: 55,
  },
  {
    id: "ribbon",
    name: "Атласна стрічка",
    slot: "head",
    feminine: 2,
    style: 2,
    tags: ["soft"],
    color: "#b5522a",
    blurb: "Зав'язана в волоссі.",
    image: "/art/items/ribbon.jpg",
    price: 35,
  },
  {
    id: "lipstick",
    name: "Помада",
    slot: "makeup",
    feminine: 2,
    style: 3,
    tags: ["bold"],
    color: "#9a3048",
    blurb: "Один точний колір.",
    image: "/art/items/lipstick.jpg",
  },
  {
    id: "tights",
    name: "Тонкі колготки",
    slot: "legs",
    feminine: 2,
    style: 2,
    tags: ["elegant"],
    color: "#2a2428",
    blurb: "Рівний тон, спокійний жест.",
    image: "/art/items/tights.jpg",
    price: 40,
  },
];

export const LOCATIONS: Location[] = [
  {
    id: "home",
    name: "Твій дім",
    blurb: "Кімната й вітальня. Одяг змінюється тільки тут.",
    image: "/art/bg/home-room.jpg",
    x: 18,
    y: 68,
    spots: [
      {
        id: "room",
        name: "Кімната",
        blurb: "Дзеркало, шафа, ліжко. Тут збирається образ.",
        image: "/art/bg/home-room.jpg",
      },
      {
        id: "living",
        name: "Вітальня",
        blurb: "Диван і чай. Сюди кличуть гостей.",
        image: "/art/bg/home-living.jpg",
      },
    ],
  },
  {
    id: "cafe",
    name: "Кав'ярня «Зерно»",
    blurb: "Вікно на вулицю і стійка, де всі рано чи пізно сідають.",
    image: "/art/bg/cafe.jpg",
    x: 40,
    y: 30,
    spots: [
      {
        id: "counter",
        name: "Стійка",
        blurb: "Пара, чашки, короткі розмови.",
        image: "/art/bg/cafe.jpg",
        game: "latte",
      },
      {
        id: "window",
        name: "Вікно",
        blurb: "Стіл біля скла. Звідси видно, хто йде кварталом.",
        image: "/art/bg/cafe-window.jpg",
      },
    ],
  },
  {
    id: "park",
    name: "Парк лип",
    blurb: "Доріжки, альтанка і люди, які нікуди не поспішають.",
    image: "/art/bg/park.jpg",
    x: 74,
    y: 24,
    spots: [
      {
        id: "alley",
        name: "Алея",
        blurb: "Рівний крок під кронами.",
        image: "/art/bg/park.jpg",
        game: "steps",
      },
      {
        id: "gazebo",
        name: "Альтанка",
        blurb: "Тінь і лава. Зручно говорити не поспішаючи.",
        image: "/art/bg/park-gazebo.jpg",
      },
    ],
  },
  {
    id: "boutique",
    name: "Бутик «Нитка»",
    blurb: "Тканини, дзеркало і Ліна, яка бачить шов раніше за тебе.",
    image: "/art/bg/boutique.jpg",
    x: 66,
    y: 50,
    spots: [
      {
        id: "floor",
        name: "Зал",
        blurb: "Вішаки і цінники. Дещо можна купити.",
        image: "/art/bg/boutique.jpg",
      },
      {
        id: "fitting",
        name: "Примірочна",
        blurb: "Штора, дзеркало, чесна лампа.",
        image: "/art/bg/fitting.jpg",
        game: "memory",
      },
    ],
  },
  {
    id: "office",
    name: "Офіс «Північ»",
    blurb: "Світло ламп і чужі листи, які хтось має розкласти.",
    image: "/art/bg/office.jpg",
    x: 24,
    y: 22,
    spots: [
      {
        id: "floor",
        name: "Зал",
        blurb: "Столи в ряд. Андрій зазвичай тут до вечора.",
        image: "/art/bg/office.jpg",
      },
      {
        id: "kitchen",
        name: "Кухня",
        blurb: "Чайник і купа конвертів.",
        image: "/art/bg/office-kitchen.jpg",
        game: "mail",
      },
    ],
  },
  {
    id: "embankment",
    name: "Набережна",
    blurb: "Вода, місток і лавка, де вечір стає довшим.",
    image: "/art/bg/embankment.jpg",
    x: 46,
    y: 82,
    spots: [
      {
        id: "bridge",
        name: "Місток",
        blurb: "Вітер і ліхтарі.",
        image: "/art/bg/bridge.jpg",
      },
      {
        id: "bench",
        name: "Лавка",
        blurb: "Двоє вміщаються, троє вже тісно.",
        image: "/art/bg/embankment.jpg",
      },
    ],
  },
  {
    id: "gallery",
    name: "Галерея «Рама»",
    blurb: "Білі стіни. Тут образ або тримається, або розсипається.",
    image: "/art/bg/gallery.jpg",
    x: 80,
    y: 74,
    spots: [
      {
        id: "hall",
        name: "Зал",
        blurb: "Кілька робіт і багато тиші.",
        image: "/art/bg/gallery.jpg",
      },
      {
        id: "studio",
        name: "Майстерня",
        blurb: "Іра тримає тут ескізи й пальто гостей.",
        image: "/art/bg/studio.jpg",
      },
    ],
  },
];

export const NPCS: Npc[] = [
  {
    id: "sofia",
    name: "Софія",
    role: "Бариста в «Зерні»",
    portrait: "/art/portraits/sofia.jpg",
    visitBg: "/art/bg/cafe-window.jpg",
    likes: ["soft", "elegant"],
    schedule: {
      morning: { locationId: "cafe", spotId: "counter" },
      day: { locationId: "cafe", spotId: "window" },
      evening: { locationId: "embankment", spotId: "bench" },
      night: null,
    },
  },
  {
    id: "lina",
    name: "Ліна",
    role: "Стилістка «Нитки»",
    portrait: "/art/portraits/lina.jpg",
    visitBg: "/art/bg/fitting.jpg",
    likes: ["elegant", "bold"],
    schedule: {
      morning: { locationId: "boutique", spotId: "floor" },
      day: { locationId: "boutique", spotId: "fitting" },
      evening: { locationId: "gallery", spotId: "hall" },
      night: null,
    },
  },
  {
    id: "marko",
    name: "Марко",
    role: "Сусід з третього",
    portrait: "/art/portraits/marko.jpg",
    visitBg: "/art/bg/balcony.jpg",
    likes: ["soft", "plain"],
    schedule: {
      morning: { locationId: "park", spotId: "alley" },
      day: { locationId: "cafe", spotId: "window" },
      evening: { locationId: "embankment", spotId: "bridge" },
      night: null,
    },
  },
  {
    id: "andriy",
    name: "Андрій",
    role: "Колега з «Півночі»",
    portrait: "/art/portraits/andriy.jpg",
    visitBg: "/art/bg/office-kitchen.jpg",
    likes: ["plain", "elegant"],
    schedule: {
      morning: { locationId: "office", spotId: "floor" },
      day: { locationId: "office", spotId: "kitchen" },
      evening: { locationId: "cafe", spotId: "counter" },
      night: null,
    },
  },
  {
    id: "olena",
    name: "Олена",
    role: "Знайома з парку",
    portrait: "/art/portraits/olena.jpg",
    visitBg: "/art/bg/embankment.jpg",
    likes: ["bold", "soft"],
    schedule: {
      morning: { locationId: "park", spotId: "gazebo" },
      day: { locationId: "park", spotId: "alley" },
      evening: { locationId: "embankment", spotId: "bench" },
      night: { locationId: "gallery", spotId: "hall" },
    },
  },
  {
    id: "ira",
    name: "Іра",
    role: "Господиня галереї",
    portrait: "/art/portraits/ira.jpg",
    visitBg: "/art/bg/studio.jpg",
    likes: ["elegant"],
    schedule: {
      morning: { locationId: "gallery", spotId: "studio" },
      day: { locationId: "gallery", spotId: "hall" },
      evening: { locationId: "boutique", spotId: "floor" },
      night: { locationId: "gallery", spotId: "studio" },
    },
  },
];

export const NEIGHBORS: Record<string, string[]> = {
  home: ["cafe", "park"],
  cafe: ["office", "boutique", "park"],
  park: ["embankment", "cafe"],
  boutique: ["gallery", "cafe"],
  office: ["cafe"],
  embankment: ["park", "gallery"],
  gallery: ["boutique", "embankment"],
};

export const GAMES: Record<GameId, { name: string; blurb: string }> = {
  latte: {
    name: "Лате-арт",
    blurb: "Зупини струмінь у світлій смузі. Вісім наливань.",
  },
  memory: {
    name: "Вітрина",
    blurb: "Знайди пари речей, поки пам'ять свіжа.",
  },
  steps: {
    name: "Крок у ритм",
    blurb: "Торкайся, коли кільце збігається з колом.",
  },
  mail: {
    name: "Пошта офісу",
    blurb: "Розклади листи: клієнти, команда або архів.",
  },
};

const P = "player" as const;
const N = "npc" as const;

export const TOPICS: Record<string, Topic[]> = {
  sofia: [
    {
      id: "order",
      label: "Взяти каву",
      scene: "coffee",
      effects: [
        { k: "rel", npc: "sofia", n: 4 },
        { k: "charm", n: 1 },
      ],
      lines: [
        { who: P, text: "Зроби як собі. Я довіряю стійці більше, ніж меню." },
        { who: N, text: "Тоді без сиропу. {outfit} і так має смак, не треба його перебивати." },
        { who: N, text: "Сідай до вікна, якщо хочеш бачити, хто сьогодні вийшов інакше." },
      ],
    },
    {
      id: "look",
      label: "Спитати про образ",
      effects: [{ k: "rel", npc: "sofia", n: 2 }],
      lines: [
        { who: P, text: "Чесно: як це читається з того боку стійки?" },
        { who: N, text: "Я бачу {outfit}. Не костюм і не маска — просто рішення, яке ти доніс до дверей." },
        { who: N, text: "Якщо тобі в цьому спокійно, квартал підлаштується. Люди люблять упевнений крок." },
      ],
    },
    {
      id: "quarter",
      label: "Хто де ходить",
      effects: [{ k: "sense", n: 1 }],
      lines: [
        { who: P, text: "Ти бачиш усіх. Хто сьогодні не на своєму місці?" },
        { who: N, text: "Вони рухаються щогодини. Ранок — кава й офіс, вечір тягне на воду, Іра інколи лишається в майстерні до ночі." },
        { who: P, text: "Тобто мапа бреше, якщо стояти на місці." },
        { who: N, text: "Мапа чесна. Бреше тільки звичка думати, що люди — меблі." },
      ],
    },
    {
      id: "tea",
      label: "Сісти на чай",
      modes: ["host"],
      scene: "tea",
      effects: [
        { k: "rel", npc: "sofia", n: 8 },
        { k: "charm", n: 2 },
        { k: "flag", key: "did:host", n: 1 },
      ],
      lines: [
        { who: N, text: "У тебе тихіше, ніж у залі. І дзеркало чесніше за вітринне скло." },
        { who: P, text: "Можеш дивитись. Я саме вчуся не відводити очей від власного відображення." },
        { who: N, text: "Тоді не ховай {outfit}. Дім — єдина сцена, де костюм не мусить виправдовуватись перед вулицею." },
      ],
    },
    {
      id: "visit",
      label: "Посидіти в неї",
      modes: ["visit"],
      scene: "coffee",
      effects: [
        { k: "rel", npc: "sofia", n: 6 },
        { k: "confidence", n: 2 },
      ],
      lines: [
        { who: N, text: "Після зміни я сідаю з того боку стійки. Дивно бути гостем у власній кав'ярні." },
        { who: P, text: "Дякую, що пустила. Я прийшов у тому, в чому вийшов з дому." },
        { who: N, text: "І правильно. {outfit} тут не заважає. Заважає тільки, коли людина вибачається за власний комір." },
      ],
    },
  ],
  lina: [
    {
      id: "critique",
      label: "Попросити розбір",
      effects: [
        { k: "rel", npc: "lina", n: 4 },
        { k: "sense", n: 2 },
      ],
      lines: [
        { who: P, text: "Розбери по швах. Мені потрібна не похвала, а конструкція." },
        { who: N, text: "Дивлюсь на {outfit}. Образ має {style} умовних одиниць характеру — це не оцінка людини, це посадка речей." },
        { who: N, text: "Одна інтонація краще за три. М'яке з зухвалим сперечається, якщо не вирішиш, хто сьогодні головний." },
      ],
    },
    {
      id: "show",
      label: "Показати образ",
      minFem: 2,
      scene: "mirror",
      onceFlag: "topic:lina-show",
      effects: [
        { k: "rel", npc: "lina", n: 6 },
        { k: "confidence", n: 3 },
        { k: "flag", key: "did:fitting", n: 1 },
      ],
      lines: [
        { who: P, text: "Я вийшов не в сорочці. Хочу почути, чи це тримається." },
        { who: N, text: "Тримається. {outfit} зібрано навмисно, не як жарт і не як хованки." },
        { who: N, text: "Залиш це на собі до вечора. Вулиця має побачити той самий силует, що й дзеркало." },
      ],
    },
    {
      id: "advice",
      label: "Що добрати",
      effects: [{ k: "sense", n: 1 }],
      lines: [
        { who: P, text: "Якщо грошей вистачить тільки на одну річ?" },
        { who: N, text: "Спочатку верх або низ, який міняє лінію тіла: блуза, спідниця, туфлі. Потім уже берет і стрічки." },
        { who: N, text: "Сукню й пальто тобі ніхто не продасть з вішака. Їх віддають за вчинки, не за чек." },
      ],
    },
    {
      id: "tea",
      label: "Попросити її оцінити шафу",
      modes: ["host"],
      scene: "mirror",
      effects: [
        { k: "rel", npc: "lina", n: 7 },
        { k: "sense", n: 2 },
        { k: "flag", key: "did:host", n: 1 },
      ],
      lines: [
        { who: N, text: "Шафа чесна: видно, що ти носиш, а що лише зберігаєш." },
        { who: P, text: "Можеш перекласти плечики. Я не ображусь." },
        { who: N, text: "Не треба. Образ уже на тобі. Решта — запасні речення." },
      ],
    },
    {
      id: "visit",
      label: "Зайти за куліси",
      modes: ["visit"],
      scene: "mirror",
      effects: [
        { k: "rel", npc: "lina", n: 5 },
        { k: "sense", n: 2 },
      ],
      lines: [
        { who: N, text: "Примірочна після закриття — інше світло. Менше покупців, більше правди." },
        { who: P, text: "Я прийшов подивитись, як ти бачиш людей, коли вони не платять." },
        { who: N, text: "Так само. Гроші не змінюють посадку плечей." },
      ],
    },
  ],
  marko: [
    {
      id: "neighbor",
      label: "Сусідські новини",
      effects: [{ k: "rel", npc: "marko", n: 4 }],
      lines: [
        { who: N, text: "Ліфт знову думає. Я піднявся пішки і зустрів тебе — уже в плюсі." },
        { who: P, text: "Якщо побачиш світло в моїй вітальні, це не завжди самотність. Інколи я кличу людей." },
        { who: N, text: "Кличеш — зайду. Я погано говорю про одяг, але добре про чай." },
      ],
    },
    {
      id: "honest",
      label: "Спитати чесно",
      effects: [
        { k: "rel", npc: "marko", n: 5 },
        { k: "confidence", n: 2 },
      ],
      lines: [
        { who: P, text: "Без чемності. Як тобі те, що на мені?" },
        { who: N, text: "Язик дерев'яніє, коли треба хвалити тканину. Але {outfit} тобі личить. Це видно по тому, як ти стоїш, не по тому, як я вмію казати." },
        { who: P, text: "Цього досить." },
        { who: N, text: "Якщо хтось у дворі дивитиметься довше, ніж треба, це їхня робота — відвести очі. Не твоя." },
      ],
    },
    {
      id: "walk",
      label: "Піти двором",
      scene: "stroll",
      effects: [
        { k: "rel", npc: "marko", n: 3 },
        { k: "energy", n: 4 },
      ],
      lines: [
        { who: P, text: "Коло двору і назад. Без розмов про роботу." },
        { who: N, text: "Домовились. Дивлюсь під ноги, не на комір. Хоча комір сьогодні цікавий." },
      ],
    },
    {
      id: "tea",
      label: "Налити йому чаю",
      modes: ["host"],
      scene: "tea",
      effects: [
        { k: "rel", npc: "marko", n: 8 },
        { k: "confidence", n: 2 },
        { k: "flag", key: "did:host", n: 1 },
      ],
      lines: [
        { who: N, text: "У тебе пахне праскою. Значить, одяг не з підлоги. Поважаю." },
        { who: P, text: "Сідай. Можеш не коментувати сукню, якщо вона є. Або коментувати, якщо хочеш." },
        { who: N, text: "Тоді так: тобі личить. Серйозно. Я повторю, якщо місто зробить вигляд, що не почуло." },
      ],
    },
    {
      id: "visit",
      label: "Зайти на його балкон",
      modes: ["visit"],
      scene: "stroll",
      effects: [
        { k: "rel", npc: "marko", n: 6 },
        { k: "charm", n: 1 },
      ],
      lines: [
        { who: N, text: "Балкон вузький, вибач. Зате видно твій під'їзд і хто з якого одягу виходить уранці." },
        { who: P, text: "Тепер ти бачитимеш і мене. Я перестав ховати силует під курткою." },
        { who: N, text: "Хай. Я махну рукою, навіть якщо на тобі буде щось, чого я не вмію назвати." },
      ],
    },
  ],
  andriy: [
    {
      id: "work",
      label: "Про зміну",
      effects: [{ k: "rel", npc: "andriy", n: 3 }],
      lines: [
        { who: N, text: "На кухні знову гора листів. Якщо розкладеш — я поставлю чай, не жарт." },
        { who: P, text: "Дрес-код у нас умовний, але погляди справжні." },
        { who: N, text: "Погляди — їхня справа. Листи — наша. Якщо тобі зручно в {outfit}, мені теж." },
      ],
    },
    {
      id: "code",
      label: "Спитати про дрес-код",
      effects: [
        { k: "rel", npc: "andriy", n: 4 },
        { k: "confidence", n: 2 },
      ],
      lines: [
        { who: P, text: "Якщо я прийду не в сорочці й брюках — це проблема зміни?" },
        { who: N, text: "Проблема зміни — пропущені листи. Не спідниця і не підбори. Сміливо для офісу, так. Але якщо тобі зручно стояти на ногах, я не роблю з цього наради." },
        { who: P, text: "Добре. Тоді я не переодягатимусь у туалеті перед дверима." },
      ],
    },
    {
      id: "kitchen",
      label: "Кава на кухні",
      scene: "coffee",
      effects: [
        { k: "rel", npc: "andriy", n: 3 },
        { k: "energy", n: 6 },
      ],
      lines: [
        { who: N, text: "Кава тут гірша за Софіїну. Зате ніхто не стоїть над душею." },
        { who: P, text: "Мені вистачить паузи. Образ не знімається на перерві." },
        { who: N, text: "І не треба. Люди звикають швидше, ніж здається, коли ти не пояснюєш себе двічі." },
      ],
    },
    {
      id: "tea",
      label: "Поговорити без бейджа",
      modes: ["host"],
      scene: "tea",
      effects: [
        { k: "rel", npc: "andriy", n: 6 },
        { k: "flag", key: "did:host", n: 1 },
      ],
      lines: [
        { who: N, text: "Дивно бачити колегу без ламп відкритого простору. Ти виглядаєш спокійніше." },
        { who: P, text: "Вдома не треба тримати плечі так, ніби зараз увійде клієнт." },
        { who: N, text: "Запам'ятай цю посадку. Її можна принести й у зал." },
      ],
    },
    {
      id: "visit",
      label: "Лишитись після зміни",
      modes: ["visit"],
      effects: [
        { k: "rel", npc: "andriy", n: 5 },
        { k: "coins", n: 15 },
      ],
      lines: [
        { who: N, text: "Кухня після сьомої — майже квартира. Ось дрібні за допомогу, якщо розкладав пошту." },
        { who: P, text: "Візьму. І лишусь у цьому одязі до дверей, не ховаючись у куртку в ліфті." },
        { who: N, text: "Так і треба. Ліфт бачив і не таке." },
      ],
    },
  ],
  olena: [
    {
      id: "dare",
      label: "Почути її версію",
      effects: [
        { k: "rel", npc: "olena", n: 4 },
        { k: "charm", n: 2 },
      ],
      lines: [
        { who: N, text: "Ти сьогодні не розчинився в натовпі. {outfit} тримає окремий рядок." },
        { who: P, text: "Я ще вчуся не прискорювати крок, коли на мене дивляться." },
        { who: N, text: "Не прискорюй. Хай дивляться на силует, не на сумнів." },
      ],
    },
    {
      id: "stroll",
      label: "Пройтись разом",
      scene: "stroll",
      hourMin: 17,
      effects: [
        { k: "rel", npc: "olena", n: 6 },
        { k: "confidence", n: 3 },
      ],
      lines: [
        { who: P, text: "До містка і назад. Вечір все одно вже почався." },
        { who: N, text: "Якщо на тобі щось, що дзвенить кроком — туфлі, спідниця, сукня — вода це підкреслить. Не бійся блиску." },
        { who: N, text: "Люди на лавках обертаються раз. Другий раз вони вже просто звикають, що ти є." },
      ],
    },
    {
      id: "day",
      label: "Поговорити вдень",
      hourMax: 16,
      effects: [{ k: "rel", npc: "olena", n: 3 }],
      lines: [
        { who: N, text: "Вдень я м'якша. Ввечері вимагаю кольору. Приходь на набережну, коли ліхтарі вже горять." },
        { who: P, text: "Прийду в образі, не в виправданні." },
      ],
    },
    {
      id: "tea",
      label: "Показати їй кімнату",
      modes: ["host"],
      scene: "tea",
      effects: [
        { k: "rel", npc: "olena", n: 7 },
        { k: "charm", n: 2 },
        { k: "flag", key: "did:host", n: 1 },
      ],
      lines: [
        { who: N, text: "О, дзеркало в повний зріст. Небезпечна річ. Подобається." },
        { who: P, text: "Воно бачило і сорочку, і все, що я добув пізніше." },
        { who: N, text: "Нехай бачить частіше друге. {outfit} у кімнаті звучить голосніше, ніж на вулиці. Це комплімент." },
      ],
    },
    {
      id: "visit",
      label: "Сісти на її лавці",
      modes: ["visit"],
      scene: "stroll",
      effects: [
        { k: "rel", npc: "olena", n: 5 },
        { k: "confidence", n: 2 },
      ],
      lines: [
        { who: N, text: "Це не квартира, це мій вечірній дім. Лавка пам'ятає лікті." },
        { who: P, text: "Тоді я посиджу так, щоб пам'ятала і мій силует." },
        { who: N, text: "Вже. Завтра хтось сяде і не зрозуміє, чому місце здається ошатнішим." },
      ],
    },
  ],
  ira: [
    {
      id: "walls",
      label: "Спитати про зал",
      effects: [
        { k: "rel", npc: "ira", n: 3 },
        { k: "sense", n: 2 },
      ],
      lines: [
        { who: N, text: "Стіни порожні навмисно. Щоб гість не ховався за чужою картиною." },
        { who: P, text: "Тоді я теж експонат, поки стою тут." },
        { who: N, text: "Кожен, хто зайшов у {outfit}. Питання лише, чи рамка цілісна." },
      ],
    },
    {
      id: "compose",
      label: "Чи тримається образ",
      minStyle: 12,
      scene: "gallery",
      onceFlag: "topic:ira-compose",
      effects: [
        { k: "rel", npc: "ira", n: 8 },
        { k: "sense", n: 3 },
        { k: "flag", key: "did:gallery", n: 1 },
      ],
      lines: [
        { who: P, text: "Подивись як на роботу. Можна без доброти." },
        { who: N, text: "Тримається. {outfit} зібрано в одну інтонацію, стиль близько {style}. Це вже не чернетка." },
        { who: N, text: "Візьми пальто, коли вийдеш. Воно не ховає образ — воно ставить крапку." },
      ],
    },
    {
      id: "early",
      label: "Показатись раніше часу",
      effects: [{ k: "rel", npc: "ira", n: 2 }],
      lines: [
        { who: N, text: "Ще сиро. Додай лінію: взуття, низ, верхній шар. Повернись, коли образ не розпадається на окремі покупки." },
        { who: P, text: "Повернусь. Мені важливо, щоб ти побачила зібране, не процес." },
      ],
    },
    {
      id: "tea",
      label: "Поставити чай біля ескізів",
      modes: ["host"],
      scene: "gallery",
      effects: [
        { k: "rel", npc: "ira", n: 6 },
        { k: "sense", n: 2 },
        { k: "flag", key: "did:host", n: 1 },
      ],
      lines: [
        { who: N, text: "У тебе вдома менше білого, ніж у залі. І більше життя. Добре." },
        { who: P, text: "Можеш лишитись, поки чай не охолоне. Я не прошу рецензію." },
        { who: N, text: "Рецензія коротка: людина на місці. Речі їй не заважають." },
      ],
    },
    {
      id: "visit",
      label: "Зайти в майстерню",
      modes: ["visit"],
      scene: "gallery",
      effects: [
        { k: "rel", npc: "ira", n: 5 },
        { k: "sense", n: 2 },
      ],
      lines: [
        { who: N, text: "Тут ескізи й пальто, яке я нікому не вішаю в зал, доки не побачу, кому воно потрібне." },
        { who: P, text: "Я не прошу його сьогодні. Прошу лише постояти серед незакінченого." },
        { who: N, text: "Стій. Незакінчене любить сміливих глядачів." },
      ],
    },
  ],
};

export const TASKS: TaskDef[] = [
  {
    id: "morning-coffee",
    title: "Ранкова кава",
    detail: "До полудня візьми каву в Софії.",
    daily: true,
    rewards: [
      { k: "coins", n: 35 },
      { k: "charm", n: 1 },
    ],
  },
  {
    id: "park",
    title: "Коло парком",
    detail: "Зайди в парк лип сьогодні.",
    daily: true,
    rewards: [
      { k: "coins", n: 20 },
      { k: "energy", n: 8 },
    ],
  },
  {
    id: "mail",
    title: "Зміна листів",
    detail: "Розклади пошту в офісній кухні хоча б наполовину влучно.",
    daily: true,
    rewards: [
      { k: "coins", n: 30 },
      { k: "rel", npc: "andriy", n: 2 },
    ],
  },
  {
    id: "fitting",
    title: "Примірка",
    detail: "Вдягни жіночніший образ (від 2) і покажи його Ліні.",
    daily: false,
    rewards: [{ k: "item", id: "polka" }],
  },
  {
    id: "host",
    title: "Гість у вітальні",
    detail: "Поклич когось додому і сядь з ним на чай.",
    daily: false,
    rewards: [{ k: "item", id: "dress" }],
  },
  {
    id: "evening",
    title: "Вечір на воді",
    detail: "Після 17:00 пройдись з Оленою. Потрібен жіночніший образ (від 3) — спідниця, туфлі чи сукня.",
    daily: false,
    rewards: [{ k: "item", id: "lipstick" }],
  },
  {
    id: "gallery",
    title: "Цілісна рамка",
    detail: "Збери образ зі стилем від 12 і покажи його Ірі.",
    daily: false,
    rewards: [{ k: "item", id: "coat" }],
  },
];

export function itemById(id: string | null | undefined): Item | undefined {
  if (!id) return undefined;
  return ITEMS.find((item) => item.id === id);
}

export function npcById(id: string): Npc | undefined {
  return NPCS.find((npc) => npc.id === id);
}

export function locationById(id: string): Location | undefined {
  return LOCATIONS.find((location) => location.id === id);
}

export function spotOf(locationId: string, spotId: string) {
  return locationById(locationId)?.spots.find((spot) => spot.id === spotId);
}
