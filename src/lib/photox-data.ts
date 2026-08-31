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
import roomLiving from "@/assets/room-living.jpg";
import roomBedroom from "@/assets/room-bedroom.jpg";
import roomWorkspace from "@/assets/room-workspace.jpg";
import roomDining from "@/assets/room-dining.jpg";
import idxMetal from "@/assets/idx-metal.jpg";

export type Material = "Metal Print";

export const sizes = [
  { label: '12 × 18"', inches: 12, price: 79 },
  { label: '16 × 24"', inches: 16, price: 119 },
  { label: '20 × 30"', inches: 20, price: 159 },
  { label: '24 × 36"', inches: 24, price: 189 },
  { label: '30 × 40"', inches: 30, price: 249 },
];

export const sizeRange = '12 × 18" — 30 × 40"';
export const sizeList = sizes.map((s) => s.label);

export const materialFrom: Record<Material, number> = {
  "Metal Print": 79,
};

/** Angled, three-quarter physical view used on product hover. */
export const angleFor: Record<Material, string> = {
  "Metal Print": idxMetal,
};

export type Product = {
  id: string;
  name: string;
  material: Material;
  from: number;
  image: string;
  hover: string;
  tags: string[];
};

export const products: Product[] = [
  {
    id: "after-the-rain",
    name: "After the Rain",
    material: "Metal Print",
    from: 119,
    image: artRain,
    hover: roomDining,
    tags: ["new", "photography"],
  },
  {
    id: "salt-mirror",
    name: "Salt Mirror",
    material: "Metal Print",
    from: 109,
    image: artSaltflat,
    hover: roomLiving,
    tags: ["landscape", "best"],
  },
  {
    id: "concrete-light",
    name: "Concrete Light",
    material: "Metal Print",
    from: 129,
    image: artBrutal,
    hover: roomWorkspace,
    tags: ["photography", "new"],
  },
  {
    id: "red-field-no-2",
    name: "Red Field No. 02",
    material: "Metal Print",
    from: 99,
    image: artRedfield,
    hover: roomWorkspace,
    tags: ["abstract", "best"],
  },
  {
    id: "concrete-planes",
    name: "Concrete Planes",
    material: "Metal Print",
    from: 139,
    image: artConcrete,
    hover: roomLiving,
    tags: ["photography", "best"],
  },
  {
    id: "study-in-olive",
    name: "Study in Olive",
    material: "Metal Print",
    from: 119,
    image: artFigure,
    hover: roomBedroom,
    tags: ["photography"],
  },
  {
    id: "signal-blue",
    name: "Signal Blue",
    material: "Metal Print",
    from: 129,
    image: artSignal,
    hover: roomDining,
    tags: ["abstract", "new"],
  },
  {
    id: "canopy",
    name: "Canopy",
    material: "Metal Print",
    from: 149,
    image: artCanopy,
    hover: roomBedroom,
    tags: ["landscape", "new"],
  },
];

export const filters = [
  "All",
  "New",
  "Best Sellers",
  "Photography",
  "Abstract",
  "Landscape",
] as const;

export const filterMap: Record<string, string | null> = {
  All: null,
  New: "new",
  "Best Sellers": "best",
  Photography: "photography",
  Abstract: "abstract",
  Landscape: "landscape",
};

export type LargeWork = {
  id: string;
  name: string;
  material: Material;
  size: string;
  price: number;
  image: string;
  room: string;
};

export const largeWorks: LargeWork[] = [
  {
    id: "blue-hour",
    name: "Blue Hour",
    material: "Metal Print",
    size: '30 × 40"',
    price: 249,
    image: artBluehour,
    room: roomLiving,
  },
  {
    id: "night-city",
    name: "Night City",
    material: "Metal Print",
    size: '24 × 36"',
    price: 189,
    image: artNightcity,
    room: roomDining,
  },
  {
    id: "tide-line",
    name: "Tide Line",
    material: "Metal Print",
    size: '30 × 40"',
    price: 249,
    image: artTideline,
    room: roomWorkspace,
  },
  {
    id: "chroma-study",
    name: "Chroma Study",
    material: "Metal Print",
    size: '24 × 36"',
    price: 189,
    image: artChroma,
    room: roomBedroom,
  },
];

export { artBluehour, artNightcity, artTideline, artChroma };

import customOriginalImage from "@/assets/custom-original.jpg";
import customPrintImage from "@/assets/custom-print.jpg";

/** Single source of truth for the "your image → metal print" before/after pair. */
export const customPrintExample = {
  sourceImage: customOriginalImage,
  sourceAlt: "An original digital photograph of two walkers on a desert dune ridge",
  metalPrintImage: customPrintImage,
  metalPrintAlt: "The same desert photograph printed as a gloss metal print mounted on a wall",
} as const;
