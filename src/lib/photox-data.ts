import artRain from "@/assets/art-rain.jpg";
import artSaltflat from "@/assets/art-saltflat.jpg";
import artBrutal from "@/assets/art-brutal.jpg";
import artRedfield from "@/assets/art-redfield.jpg";
import artNorthsea from "@/assets/art-northsea.jpg";
import artFigure from "@/assets/art-figure.jpg";
import artSignal from "@/assets/art-signal.jpg";
import artCanopy from "@/assets/art-canopy.jpg";
import artBluehour from "@/assets/art-bluehour.jpg";
import artMonolith from "@/assets/art-monolith.jpg";
import artTideline from "@/assets/art-tideline.jpg";
import artChroma from "@/assets/art-chroma.jpg";

export type Material = "Metal Print" | "Frameless Canvas";

export type Product = {
  id: string;
  name: string;
  material: Material;
  from: number;
  image: string;
  ratio: string;
  span: "tall" | "wide" | "square" | "feature";
  tags: string[];
};

export const products: Product[] = [
  {
    id: "after-the-rain",
    name: "After the Rain",
    material: "Metal Print",
    from: 119,
    image: artRain,
    ratio: "4 / 5",
    span: "tall",
    tags: ["new", "photography"],
  },
  {
    id: "salt-mirror",
    name: "Salt Mirror",
    material: "Frameless Canvas",
    from: 109,
    image: artSaltflat,
    ratio: "16 / 10",
    span: "wide",
    tags: ["landscape", "best"],
  },
  {
    id: "concrete-light",
    name: "Concrete Light",
    material: "Metal Print",
    from: 129,
    image: artBrutal,
    ratio: "4 / 5",
    span: "tall",
    tags: ["photography", "new"],
  },
  {
    id: "red-field-no-2",
    name: "Red Field No. 02",
    material: "Frameless Canvas",
    from: 99,
    image: artRedfield,
    ratio: "1 / 1",
    span: "square",
    tags: ["abstract", "best"],
  },
  {
    id: "north-sea",
    name: "North Sea",
    material: "Metal Print",
    from: 139,
    image: artNorthsea,
    ratio: "16 / 10",
    span: "feature",
    tags: ["landscape", "best"],
  },
  {
    id: "study-in-olive",
    name: "Study in Olive",
    material: "Frameless Canvas",
    from: 119,
    image: artFigure,
    ratio: "4 / 5",
    span: "tall",
    tags: ["photography"],
  },
  {
    id: "signal-blue",
    name: "Signal Blue",
    material: "Metal Print",
    from: 129,
    image: artSignal,
    ratio: "16 / 10",
    span: "wide",
    tags: ["abstract", "new"],
  },
  {
    id: "canopy",
    name: "Canopy",
    material: "Metal Print",
    from: 149,
    image: artCanopy,
    ratio: "4 / 5",
    span: "tall",
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
  from: number;
  image: string;
  room: string;
  ratio: string;
};

export const sizes = [
  { label: '12 × 18"', inches: 12, price: 89 },
  { label: '16 × 24"', inches: 16, price: 129 },
  { label: '20 × 30"', inches: 20, price: 159 },
  { label: '24 × 36"', inches: 24, price: 189 },
  { label: '30 × 40"', inches: 30, price: 249 },
];

export { artBluehour, artMonolith, artTideline, artChroma };
