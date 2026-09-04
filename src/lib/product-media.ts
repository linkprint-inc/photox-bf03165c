import roomHallway from "@/assets/room/hallway-empty.jpg";
import roomWorkspace from "@/assets/room/workspace-empty.jpg";
import roomDining from "@/assets/room/dining-empty.jpg";
import nsSurface from "@/assets/pdp/north-sea-surface.jpg";
import nsEdge from "@/assets/pdp/north-sea-edge.jpg";
import nsRoomWide from "@/assets/pdp/north-sea-room-wide.jpg";
import nsObject from "@/assets/pdp/north-sea-object.jpg";
import rainSurface from "@/assets/pdp/after-the-rain-surface.jpg";
import rainEdge from "@/assets/pdp/after-the-rain-edge.jpg";
import rainRoomWide from "@/assets/pdp/after-the-rain-room-wide.jpg";
import rainObject from "@/assets/pdp/after-the-rain-object.jpg";
import cpSurface from "@/assets/pdp/concrete-planes-surface.jpg";
import cpEdge from "@/assets/pdp/concrete-planes-edge.jpg";
import cpRoomWide from "@/assets/pdp/concrete-planes-room-wide.jpg";
import cpObject from "@/assets/pdp/concrete-planes-object.jpg";
import ncSurface from "@/assets/pdp/night-city-surface.jpg";
import ncEdge from "@/assets/pdp/night-city-edge.jpg";
import ncRoomWide from "@/assets/pdp/night-city-room-wide.jpg";
import ncObject from "@/assets/pdp/night-city-object.jpg";
import { hoverImages } from "./hover-images";
import { dedicatedDetailFor } from "./product-detail";
import { shopProducts, type ShopProduct } from "./shop-data";
import type { GalleryMediaItem, ViewMode } from "@/components/photox/product/ProductVisual";

export type PdpMediaItem = GalleryMediaItem & { id: string; label: string; view: ViewMode };

/**
 * Curated PDP gallery: ~6 genuinely different views per product.
 * Full artwork → surface macro → room → edge → different room → physical object.
 */
type CuratedSet = { surface: string; edge: string; roomWide: string; object: string };

const curated: Record<string, CuratedSet> = {
  "north-sea": { surface: nsSurface, edge: nsEdge, roomWide: nsRoomWide, object: nsObject },
  "after-the-rain": {
    surface: rainSurface,
    edge: rainEdge,
    roomWide: rainRoomWide,
    object: rainObject,
  },
  "concrete-planes": { surface: cpSurface, edge: cpEdge, roomWide: cpRoomWide, object: cpObject },
  "night-city": { surface: ncSurface, edge: ncEdge, roomWide: ncRoomWide, object: ncObject },
};

const fallbackRoom = [roomHallway, roomWorkspace, roomDining];

export function productGallery(product: ShopProduct): PdpMediaItem[] {
  const set = curated[product.id];
  const shopRoom = hoverImages[product.id];
  const dedicatedDetail = dedicatedDetailFor(product, "metal");

  if (set) {
    const items: PdpMediaItem[] = [
      { id: "full-artwork", label: "Full artwork", view: "artwork", presentation: "original" },
      {
        id: "surface",
        label: "Printed surface, close-up",
        view: "detail",
        presentation: "detail-image",
        source: set.surface,
      },
      {
        id: "room-wide",
        label: "In a room",
        view: "room",
        presentation: "room-image",
        source: set.roomWide,
      },
      {
        id: "edge",
        label: "Thin metal edge",
        view: "detail",
        presentation: "detail-image",
        source: set.edge,
      },
    ];
    items.push(
      shopRoom
        ? {
            id: "room-alt",
            label: "A different space",
            view: "room",
            presentation: "room-image",
            source: shopRoom,
          }
        : {
            id: "room-alt",
            label: "A different space",
            view: "room",
            presentation: "room",
            roomBackground: roomHallway,
          },
    );
    items.push({
      id: "object",
      label: "The print as an object",
      view: "detail",
      presentation: "detail-image",
      source: set.object,
    });
    return items;
  }

  // Products without dedicated photography: build the most varied set possible
  // from that product's own assets only.
  const items: PdpMediaItem[] = [
    { id: "full-artwork", label: "Full artwork", view: "artwork", presentation: "original" },
    dedicatedDetail
      ? {
          id: "surface",
          label: "Printed surface, close-up",
          view: "detail",
          presentation: "detail-image",
          source: dedicatedDetail,
        }
      : {
          id: "surface",
          label: "Printed surface, close-up",
          view: "detail",
          presentation: "front",
          crop: "scale-[1.9] object-[46%_48%]",
        },
  ];
  items.push(
    shopRoom
      ? {
          id: "room-wide",
          label: "In a room",
          view: "room",
          presentation: "room-image",
          source: shopRoom,
        }
      : {
          id: "room-wide",
          label: "In a room",
          view: "room",
          presentation: "room",
          roomBackground: fallbackRoom[0],
        },
  );
  items.push(
    {
      id: "edge",
      label: "Thin metal edge",
      view: "detail",
      presentation: "front",
      crop: "scale-[2.3] object-[96%_50%]",
    },
    {
      id: "room-alt",
      label: "A different space",
      view: "room",
      presentation: "room",
      roomBackground: fallbackRoom[1],
    },
    {
      id: "room-third",
      label: "Dining area",
      view: "room",
      presentation: "room",
      roomBackground: fallbackRoom[2],
    },
  );
  return items;
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
  const set = curated[product.id];
  const dedicatedDetail = dedicatedDetailFor(product, "metal");
  const ownRoom = hoverImages[product.id];
  return {
    front: { source: product.image },
    surfaceEdge: set
      ? { source: set.edge, alt: `${product.name} printed on metal, surface and edge` }
      : dedicatedDetail
        ? { source: dedicatedDetail, alt: `${product.name} printed on metal, surface and edge` }
        : {
            source: product.image,
            crop: "scale-[1.55] object-[88%_50%]",
            alt: `${product.name} printed on metal, surface and edge`,
          },
    room: set
      ? { source: set.roomWide, alt: `${product.name} installed in an interior` }
      : ownRoom
        ? { source: ownRoom, alt: `${product.name} installed in an interior` }
        : { roomBackground: roomHallway, alt: `${product.name} installed in an interior` },
  };
}

export type PdpMedia = { gallery: PdpMediaItem[]; featureDetails: PdpFeatureDetails };

/**
 * Centralized media configuration keyed by product handle. Every handle in the
 * catalog gets its own curated set built from that product's own assets only.
 */
export const productMedia: Record<string, PdpMedia> = Object.fromEntries(
  shopProducts.map((p) => [
    p.id,
    { gallery: productGallery(p), featureDetails: productFeatureDetails(p) },
  ]),
);

export function mediaForProduct(product: ShopProduct): PdpMedia {
  return (
    productMedia[product.id] ?? {
      gallery: productGallery(product),
      featureDetails: productFeatureDetails(product),
    }
  );
}
