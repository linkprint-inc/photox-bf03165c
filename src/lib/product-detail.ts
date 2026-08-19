import metalSurface from "@/assets/metal-surface.jpg";
import metalEdge from "@/assets/metal-edge.jpg";
import metalDetailCrop from "@/assets/metal-detail-crop.jpg";
import canvasTexture from "@/assets/canvas-texture.jpg";
import canvasEdge from "@/assets/canvas-edge.jpg";
import canvasFinish from "@/assets/canvas-finish.jpg";
import artRain from "@/assets/art-rain.jpg";
import artSaltflat from "@/assets/art-saltflat.jpg";
import artBrutal from "@/assets/art-brutal.jpg";
import artRedfield from "@/assets/art-redfield.jpg";
import artConcretePlanes from "@/assets/art-concrete-planes.jpg";
import artFigure from "@/assets/art-figure.jpg";
import artSignal from "@/assets/art-signal.jpg";
import artCanopy from "@/assets/art-canopy.jpg";
import artBluehour from "@/assets/art-bluehour.jpg";
import artNightcity from "@/assets/art-nightcity.jpg";
import artTideline from "@/assets/art-tideline.jpg";
import artChroma from "@/assets/art-chroma.jpg";
import artNorthsea from "@/assets/art-northsea.jpg";
import artMonolith from "@/assets/art-monolith.jpg";
import dRainMetal from "@/assets/detail/rain-metal.jpg";
import dSaltflatCanvas from "@/assets/detail/saltflat-canvas.jpg";
import dBrutalMetal from "@/assets/detail/brutal-metal.jpg";
import dRedfieldCanvas from "@/assets/detail/redfield-canvas.jpg";
import dConcretePlanesMetal from "@/assets/detail/concrete-planes-metal.jpg";
import dFigureCanvas from "@/assets/detail/figure-canvas.jpg";
import dSignalMetal from "@/assets/detail/signal-metal.jpg";
import dSignalCanvas from "@/assets/detail/signal-canvas.jpg";
import dCanopyMetal from "@/assets/detail/canopy-metal.jpg";
import dBluehourMetal from "@/assets/detail/bluehour-metal.jpg";
import dBluehourCanvas from "@/assets/detail/bluehour-canvas.jpg";
import dNightcityMetal from "@/assets/detail/nightcity-metal.jpg";
import dNightcityCanvas from "@/assets/detail/nightcity-canvas.jpg";
import dTidelineMetal from "@/assets/detail/tideline-metal.jpg";
import dTidelineCanvas from "@/assets/detail/tideline-canvas.jpg";
import dChromaMetal from "@/assets/detail/chroma-metal.jpg";
import dChromaCanvas from "@/assets/detail/chroma-canvas.jpg";
import dNorthseaMetal from "@/assets/detail/northsea-metal.jpg";
import dNorthseaCanvas from "@/assets/detail/northsea-canvas.jpg";
import dMonolithMetal from "@/assets/detail/monolith-metal.jpg";
import idxMetal from "@/assets/idx-metal.jpg";
import idxCanvas from "@/assets/idx-canvas.jpg";
import { shopProducts, sizeSteps, type ShopProduct } from "./shop-data";
import type { BagMaterial } from "./store";

export function productBySlug(slug: string): ShopProduct | undefined {
  return shopProducts.find((p) => p.id === slug);
}

/** Materials actually available for an artwork. */
export function materialsFor(p: ShopProduct): BagMaterial[] {
  if (p.material === "both") return ["metal", "canvas"];
  return [p.material];
}

/** Lowest price for a material, matching the pricing rules used in the bag. */
export function fromPrice(material: BagMaterial) {
  const base = sizeSteps[0]!.price;
  return material === "canvas" ? base - 10 : base;
}

export const materialBlurb: Record<BagMaterial, string> = {
  metal: "Glossy · crisp · luminous",
  canvas: "Matte · textured · soft",
};

/** Physical three-quarter close-up of the exact artwork, per material. */
const artworkDetail = new Map<string, Partial<Record<BagMaterial, string>>>([
  [artRain, { metal: dRainMetal }],
  [artSaltflat, { canvas: dSaltflatCanvas }],
  [artBrutal, { metal: dBrutalMetal }],
  [artRedfield, { canvas: dRedfieldCanvas }],
  [artConcretePlanes, { metal: dConcretePlanesMetal }],
  [artFigure, { canvas: dFigureCanvas }],
  [artSignal, { metal: dSignalMetal, canvas: dSignalCanvas }],
  [artCanopy, { metal: dCanopyMetal }],
  [artBluehour, { metal: dBluehourMetal, canvas: dBluehourCanvas }],
  [artNightcity, { metal: dNightcityMetal, canvas: dNightcityCanvas }],
  [artTideline, { metal: dTidelineMetal, canvas: dTidelineCanvas }],
  [artChroma, { metal: dChromaMetal, canvas: dChromaCanvas }],
  [artNorthsea, { metal: dNorthseaMetal, canvas: dNorthseaCanvas }],
  [artMonolith, { metal: dMonolithMetal }],
]);

const fallbackDetail: Record<BagMaterial, string> = {
  metal: idxMetal,
  canvas: idxCanvas,
};

/** Material-specific detail image for a product, falling back to a generic view. */
export function detailFor(p: ShopProduct, material: BagMaterial) {
  return artworkDetail.get(p.image)?.[material] ?? fallbackDetail[material];
}

export const closeUps: Record<
  BagMaterial,
  { title: string; caption: string; image: string; alt: string }[]
> = {
  metal: [
    {
      title: "Gloss",
      caption: "Natural light across the surface.",
      image: metalSurface,
      alt: "Close-up of daylight moving across the glossy surface of a metal print",
    },
    {
      title: "Edge",
      caption: "Thin rigid profile.",
      image: metalEdge,
      alt: "Three-quarter view of the thin rigid edge of an aluminium print panel",
    },
    {
      title: "Detail",
      caption: "Crisp photographic reproduction.",
      image: metalDetailCrop,
      alt: "Close crop of a metal print showing sharp photographic detail",
    },
  ],
  canvas: [
    {
      title: "Texture",
      caption: "Visible woven surface.",
      image: canvasTexture,
      alt: "Macro view of the woven cotton surface of a canvas print",
    },
    {
      title: "Edge",
      caption: "Gallery-wrapped profile.",
      image: canvasEdge,
      alt: "Three-quarter view of a gallery-wrapped canvas edge",
    },
    {
      title: "Finish",
      caption: "Soft matte appearance.",
      image: canvasFinish,
      alt: "Angled view of a canvas print showing a soft matte, non-reflective finish",
    },
  ],
};

/** Category label built only from real style data on the product. */
export function categoryLabel(p: ShopProduct) {
  const styles = p.styles;
  if (styles.includes("Black & White")) {
    const other = styles.find((s) => s !== "Black & White");
    return other ? `Black & White ${other}` : "Black & White";
  }
  return styles.slice(0, 2).join(" · ");
}

/** Four related works, preferring shared styles. */
export function relatedProducts(p: ShopProduct): ShopProduct[] {
  const others = shopProducts.filter((x) => x.id !== p.id);
  const scored = others
    .map((x) => ({ x, score: x.styles.filter((s) => p.styles.includes(s)).length }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map((s) => s.x);
}

export const productInfo = [
  {
    title: "Material & finish",
    body: "Metal prints are made on ChromaLuxe® HD aluminium: a rigid panel with a glossy, luminous surface and a thin visible edge. Frameless canvas is printed on woven cotton canvas with a soft matte finish and a gallery-wrapped edge.",
  },
  {
    title: "Hanging & care",
    body: "Both materials arrive ready to hang, with no external frame or glass. Clean with a dry, soft cloth. Hang out of direct, sustained sunlight for the most stable appearance.",
  },
  {
    title: "Shipping & returns",
    body: "Every print is made to order in the USA and shipped protected in the packaging it was made for. Contact photoX if anything arrives other than as it should — we will make it right.",
  },
];
