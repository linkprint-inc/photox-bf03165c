import artRain from "@/assets/art-rain.jpg";
import artSaltflat from "@/assets/art-saltflat.jpg";
import artBrutal from "@/assets/art-brutal.jpg";
import artRedfield from "@/assets/art-redfield.jpg";
import artConcrete from "@/assets/art-concrete-planes.jpg";
import artFigure from "@/assets/art-figure.jpg";
import artSignal from "@/assets/art-signal.jpg";
import artCanopy from "@/assets/art-canopy.jpg";
import artBluehour from "@/assets/art-bluehour.jpg";
import artNightcity from "@/assets/art-nightcity.jpg";
import artTideline from "@/assets/art-tideline.jpg";
import artChroma from "@/assets/art-chroma.jpg";
import artNorthsea from "@/assets/art-northsea.jpg";
import artMonolith from "@/assets/art-monolith.jpg";
import roomLiving from "@/assets/room-living.jpg";
import roomLivingArch from "@/assets/room-living-architectural.jpg";
import roomBedroom from "@/assets/room-bedroom.jpg";
import roomWorkspace from "@/assets/room-workspace.jpg";
import roomDining from "@/assets/room-dining.jpg";
import idxMetal from "@/assets/idx-metal.jpg";
import idxCanvas from "@/assets/idx-canvas.jpg";
import { sizes } from "./photox-data";

export type ShopMaterial = "metal" | "canvas" | "both";
export type Orientation = "Portrait" | "Landscape" | "Square";

export type ShopStyle =
  | "Photography"
  | "Abstract"
  | "Landscape"
  | "Architecture"
  | "Black & White"
  | "Nature"
  | "Urban"
  | "Figurative";

export type ShopProduct = {
  id: string;
  name: string;
  material: ShopMaterial;
  orientation: Orientation;
  styles: ShopStyle[];
  from: number;
  image: string;
  room: string;
  badges: ("new" | "best")[];
};

export const totalWorks = 128;

export const materialLabel: Record<ShopMaterial, string> = {
  metal: "Metal Print",
  canvas: "Frameless Canvas",
  both: "Metal / Canvas",
};

export const angleView: Record<ShopMaterial, string> = {
  metal: idxMetal,
  canvas: idxCanvas,
  both: idxMetal,
};

export const sizeRangeShort = '12×18" — 30×40"';
export const sizeRangeLong = '12 × 18" — 30 × 40"';
export const sizeSteps = sizes;

const rooms = [roomLiving, roomLivingArch, roomBedroom, roomWorkspace, roomDining];

const source: Omit<ShopProduct, "room">[] = [
  {
    id: "north-sea",
    name: "North Sea",
    material: "both",
    orientation: "Landscape",
    styles: ["Photography", "Landscape", "Black & White"],
    from: 79,
    image: artNorthsea,
    badges: ["best"],
  },
  {
    id: "concrete-planes",
    name: "Concrete Planes",
    material: "metal",
    orientation: "Portrait",
    styles: ["Architecture", "Photography"],
    from: 139,
    image: artConcrete,
    badges: ["new"],
  },
  {
    id: "blue-hour",
    name: "Blue Hour",
    material: "both",
    orientation: "Landscape",
    styles: ["Photography", "Urban"],
    from: 89,
    image: artBluehour,
    badges: ["best"],
  },
  {
    id: "red-field-02",
    name: "Red Field No. 02",
    material: "canvas",
    orientation: "Square",
    styles: ["Abstract"],
    from: 99,
    image: artRedfield,
    badges: ["best"],
  },
  {
    id: "night-city",
    name: "Night City",
    material: "metal",
    orientation: "Landscape",
    styles: ["Urban", "Photography"],
    from: 129,
    image: artNightcity,
    badges: ["new"],
  },
  {
    id: "salt-mirror",
    name: "Salt Mirror",
    material: "canvas",
    orientation: "Landscape",
    styles: ["Landscape", "Nature"],
    from: 109,
    image: artSaltflat,
    badges: ["best"],
  },
  {
    id: "after-the-rain",
    name: "After the Rain",
    material: "metal",
    orientation: "Portrait",
    styles: ["Urban", "Photography"],
    from: 119,
    image: artRain,
    badges: ["new"],
  },
  {
    id: "signal-blue",
    name: "Signal Blue",
    material: "both",
    orientation: "Square",
    styles: ["Abstract"],
    from: 79,
    image: artSignal,
    badges: ["new"],
  },
  {
    id: "brutal-form",
    name: "Brutal Form",
    material: "metal",
    orientation: "Portrait",
    styles: ["Architecture", "Black & White"],
    from: 129,
    image: artBrutal,
    badges: [],
  },
  {
    id: "study-in-olive",
    name: "Study in Olive",
    material: "canvas",
    orientation: "Portrait",
    styles: ["Figurative", "Photography"],
    from: 119,
    image: artFigure,
    badges: [],
  },
  {
    id: "canopy",
    name: "Canopy",
    material: "metal",
    orientation: "Square",
    styles: ["Nature", "Landscape"],
    from: 149,
    image: artCanopy,
    badges: ["new"],
  },
  {
    id: "tide-line",
    name: "Tide Line",
    material: "canvas",
    orientation: "Landscape",
    styles: ["Landscape", "Nature"],
    from: 109,
    image: artTideline,
    badges: [],
  },
  {
    id: "chroma-study",
    name: "Chroma Study",
    material: "both",
    orientation: "Square",
    styles: ["Abstract"],
    from: 89,
    image: artChroma,
    badges: ["best"],
  },
  {
    id: "monolith",
    name: "Monolith",
    material: "metal",
    orientation: "Landscape",
    styles: ["Architecture", "Black & White"],
    from: 159,
    image: artMonolith,
    badges: [],
  },
  {
    id: "harbour-lights",
    name: "Harbour Lights",
    material: "both",
    orientation: "Landscape",
    styles: ["Urban", "Photography"],
    from: 99,
    image: artNightcity,
    badges: [],
  },
  {
    id: "grey-terraces",
    name: "Grey Terraces",
    material: "metal",
    orientation: "Portrait",
    styles: ["Architecture", "Black & White"],
    from: 189,
    image: artConcrete,
    badges: [],
  },
  {
    id: "ember-field",
    name: "Ember Field",
    material: "canvas",
    orientation: "Square",
    styles: ["Abstract"],
    from: 209,
    image: artRedfield,
    badges: ["new"],
  },
  {
    id: "low-tide",
    name: "Low Tide",
    material: "canvas",
    orientation: "Landscape",
    styles: ["Landscape", "Nature", "Black & White"],
    from: 69,
    image: artNorthsea,
    badges: [],
  },
  {
    id: "cobalt-drift",
    name: "Cobalt Drift",
    material: "both",
    orientation: "Square",
    styles: ["Abstract"],
    from: 259,
    image: artSignal,
    badges: ["best"],
  },
  {
    id: "wet-street",
    name: "Wet Street",
    material: "metal",
    orientation: "Portrait",
    styles: ["Urban", "Photography", "Black & White"],
    from: 119,
    image: artRain,
    badges: [],
  },
  {
    id: "salt-horizon",
    name: "Salt Horizon",
    material: "canvas",
    orientation: "Landscape",
    styles: ["Landscape", "Nature"],
    from: 159,
    image: artSaltflat,
    badges: [],
  },
  {
    id: "figure-study-04",
    name: "Figure Study No. 04",
    material: "canvas",
    orientation: "Portrait",
    styles: ["Figurative"],
    from: 189,
    image: artFigure,
    badges: [],
  },
  {
    id: "green-shade",
    name: "Green Shade",
    material: "metal",
    orientation: "Square",
    styles: ["Nature"],
    from: 149,
    image: artCanopy,
    badges: [],
  },
  {
    id: "deep-blue-hour",
    name: "Deep Blue Hour",
    material: "both",
    orientation: "Landscape",
    styles: ["Photography", "Urban"],
    from: 249,
    image: artBluehour,
    badges: ["best"],
  },
  {
    id: "concrete-stair",
    name: "Concrete Stair",
    material: "metal",
    orientation: "Portrait",
    styles: ["Architecture"],
    from: 139,
    image: artBrutal,
    badges: ["new"],
  },
  {
    id: "chroma-ii",
    name: "Chroma II",
    material: "canvas",
    orientation: "Square",
    styles: ["Abstract"],
    from: 99,
    image: artChroma,
    badges: [],
  },
  {
    id: "shore-break",
    name: "Shore Break",
    material: "both",
    orientation: "Landscape",
    styles: ["Landscape", "Nature"],
    from: 129,
    image: artTideline,
    badges: [],
  },
  {
    id: "stone-monolith",
    name: "Stone Monolith",
    material: "metal",
    orientation: "Landscape",
    styles: ["Architecture", "Black & White"],
    from: 219,
    image: artMonolith,
    badges: [],
  },
];

export const shopProducts: ShopProduct[] = source.map((p, i) => ({
  ...p,
  room: rooms[i % rooms.length]!,
}));

export const categories = [
  "All",
  "New",
  "Best Sellers",
  "Photography",
  "Abstract",
  "Landscape",
  "Architecture",
  "Black & White",
] as const;

export const styleOptions: ShopStyle[] = [
  "Photography",
  "Abstract",
  "Landscape",
  "Architecture",
  "Black & White",
  "Nature",
  "Urban",
  "Figurative",
];

export const orientationOptions: Orientation[] = ["Portrait", "Landscape", "Square"];

export const priceBands = [
  { label: "Under $100", min: 0, max: 99 },
  { label: "$100–$149", min: 100, max: 149 },
  { label: "$150–$199", min: 150, max: 199 },
  { label: "$200–$249", min: 200, max: 249 },
  { label: "$250+", min: 250, max: Infinity },
];

export const sortOptions = [
  "Featured",
  "New Arrivals",
  "Best Selling",
  "Price: Low to High",
  "Price: High to Low",
] as const;

export type SortOption = (typeof sortOptions)[number];
