import roomHallway from "@/assets/room/hallway-empty.jpg";
import roomWorkspace from "@/assets/room/workspace-empty.jpg";
import roomDining from "@/assets/room/dining-empty.jpg";
import { hoverImages } from "./hover-images";
import { dedicatedDetailFor } from "./product-detail";
import { shopProducts, type ShopProduct } from "./shop-data";
import type { GalleryMediaItem } from "@/components/photox/product/ProductVisual";

export type PdpMediaItem = GalleryMediaItem & { id: string; label: string };
export type PdpMediaGroup = {
  id: string;
  artwork: PdpMediaItem;
  detail: PdpMediaItem;
  room: PdpMediaItem;
};

/**
 * Curated PDP gallery: four groups per product, each group showing the same
 * print as artwork / material detail / in a room. No asset is reused twice.
 */
export function productMediaGroups(product: ShopProduct): PdpMediaGroup[] {
  const shopRoom = hoverImages[product.id];
  const dedicatedDetail = dedicatedDetailFor(product, "metal");

  return [
    {
      id: "group-1",
      artwork: { id: "g1-artwork", label: "Full artwork", presentation: "original" },
      detail: dedicatedDetail
        ? {
            id: "g1-detail",
            label: "Printed surface close-up",
            presentation: "detail-image",
            source: dedicatedDetail,
          }
        : {
            id: "g1-detail",
            label: "Printed surface close-up",
            presentation: "front",
            crop: "scale-[1.38] object-[48%_50%]",
          },
      room: shopRoom
        ? {
            id: "g1-room",
            label: "Living room installation",
            presentation: "room-image",
            source: shopRoom,
          }
        : { id: "g1-room", label: "Living room installation", presentation: "room" },
    },
    {
      id: "group-2",
      artwork: { id: "g2-artwork", label: "Metal print, straight on", presentation: "front" },
      detail: {
        id: "g2-detail",
        label: "Thin rigid edge",
        presentation: "front",
        crop: "scale-[1.62] object-[92%_50%]",
      },
      room: {
        id: "g2-room",
        label: "Hallway console installation",
        presentation: "room",
        roomBackground: roomHallway,
      },
    },
    {
      id: "group-3",
      artwork: {
        id: "g3-artwork",
        label: "Closer composition",
        presentation: "front",
        crop: "scale-[1.18] object-[50%_40%]",
      },
      detail: {
        id: "g3-detail",
        label: "Angled glossy reflection",
        presentation: "front",
        crop: "scale-[1.5] object-[35%_62%]",
      },
      room: {
        id: "g3-room",
        label: "Workspace installation",
        presentation: "room",
        roomBackground: roomWorkspace,
      },
    },
    {
      id: "group-4",
      artwork: {
        id: "g4-artwork",
        label: "Alternate framing",
        presentation: "front",
        crop: "scale-[1.34] object-[62%_54%]",
      },
      detail: {
        id: "g4-detail",
        label: "Macro surface and corner",
        presentation: "front",
        crop: "scale-[2.05] object-[70%_36%]",
      },
      room: {
        id: "g4-room",
        label: "Dining area installation",
        presentation: "room",
        roomBackground: roomDining,
      },
    },
  ];
}


export type PdpFeatureDetails = {
  /** 01 FRONT — the print itself, always this product's artwork. */
  front: { source: string };
  /** 02 SURFACE / EDGE — a material close-up of THIS artwork. */
  surfaceEdge: { source: string; crop?: string; alt: string };
  /** 03 IN A ROOM — this artwork installed, or composited into a room. */
  room: { source?: string; roomBackground?: string; alt: string };
};

/** Lower three-image sequence, resolved per product — never cross-product. */
export function productFeatureDetails(product: ShopProduct): PdpFeatureDetails {
  const dedicatedDetail = dedicatedDetailFor(product, "metal");
  const ownRoom = hoverImages[product.id];
  return {
    front: { source: product.image },
    surfaceEdge: dedicatedDetail
      ? { source: dedicatedDetail, alt: `${product.name} printed on metal, surface and edge` }
      : {
          source: product.image,
          crop: "scale-[1.55] object-[88%_50%]",
          alt: `${product.name} printed on metal, surface and edge`,
        },
    room: ownRoom
      ? { source: ownRoom, alt: `${product.name} installed in an interior` }
      : { roomBackground: roomHallway, alt: `${product.name} installed in an interior` },
  };
}

export type PdpMedia = { gallery: PdpMediaGroup[]; featureDetails: PdpFeatureDetails };

/**
 * Centralized media configuration keyed by product handle. Every handle in the
 * catalog gets its own curated set built from that product's own assets only.
 */
export const productMedia: Record<string, PdpMedia> = Object.fromEntries(
  shopProducts.map((p) => [
    p.id,
    { gallery: productMediaGroups(p), featureDetails: productFeatureDetails(p) },
  ]),
);

export function mediaForProduct(product: ShopProduct): PdpMedia {
  return (
    productMedia[product.id] ?? {
      gallery: productMediaGroups(product),
      featureDetails: productFeatureDetails(product),
    }
  );
}
