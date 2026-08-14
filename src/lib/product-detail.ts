import metalSurface from "@/assets/metal-surface.jpg";
import metalEdge from "@/assets/metal-edge.jpg";
import metalDetailCrop from "@/assets/metal-detail-crop.jpg";
import canvasTexture from "@/assets/canvas-texture.jpg";
import canvasEdge from "@/assets/canvas-edge.jpg";
import canvasFinish from "@/assets/canvas-finish.jpg";
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

/** Angled, physical three-quarter view per material. */
export const detailView: Record<BagMaterial, string> = {
  metal: idxMetal,
  canvas: idxCanvas,
};

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
