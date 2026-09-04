import roomHallway from "@/assets/room/hallway-empty.jpg";
import nsSurface from "@/assets/pdp/north-sea-surface.jpg";
import nsEdge from "@/assets/pdp/north-sea-edge.jpg";
import nsRoomWide from "@/assets/pdp/north-sea-room-wide.jpg";
import rainSurface from "@/assets/pdp/after-the-rain-surface.jpg";
import rainEdge from "@/assets/pdp/after-the-rain-edge.jpg";
import rainRoomWide from "@/assets/pdp/after-the-rain-room-wide.jpg";
import cpSurface from "@/assets/pdp/concrete-planes-surface.jpg";
import cpEdge from "@/assets/pdp/concrete-planes-edge.jpg";
import cpRoomWide from "@/assets/pdp/concrete-planes-room-wide.jpg";
import ncSurface from "@/assets/pdp/night-city-surface.jpg";
import ncEdge from "@/assets/pdp/night-city-edge.jpg";
import ncRoomWide from "@/assets/pdp/night-city-room-wide.jpg";
// Additional, genuinely different artworks per product collection.
import artNorthsea from "@/assets/art-northsea.jpg";
import artTideline from "@/assets/art-tideline.jpg";
import nsMisty from "@/assets/art/northsea-02-misty-horizon.jpg";
import nsCliff from "@/assets/art/northsea-03-cliff-coast.jpg";
import nsLongExposure from "@/assets/art/northsea-04-long-exposure.jpg";
import nsSeaStacks from "@/assets/art/northsea-05-sea-stacks.jpg";
import artRain from "@/assets/art-rain.jpg";
import rainStreet from "@/assets/art/rain-02-wet-street.jpg";
import rainWindow from "@/assets/art/rain-03-window-drops.jpg";
import rainPuddle from "@/assets/art/rain-04-puddle-neon.jpg";
import rainCrosswalk from "@/assets/art/rain-05-crosswalk.jpg";
import artConcrete from "@/assets/art-concrete-planes.jpg";
import artBrutal from "@/assets/art-brutal.jpg";
import cpStair from "@/assets/art/concrete-02-stair.jpg";
import cpFacade from "@/assets/art/concrete-03-facade.jpg";
import cpVault from "@/assets/art/concrete-04-vault.jpg";
import artNightcity from "@/assets/art-nightcity.jpg";
import ncAerial from "@/assets/art/nightcity-02-aerial-grid.jpg";
import ncAlley from "@/assets/art/nightcity-03-neon-alley.jpg";
import ncTower from "@/assets/art/nightcity-04-tower-windows.jpg";
import ncTrails from "@/assets/art/nightcity-05-light-trails.jpg";
import { hoverImages } from "./hover-images";
import { dedicatedDetailFor } from "./product-detail";
import { shopProducts, type ShopProduct } from "./shop-data";
import type { GalleryMediaItem, ViewMode } from "@/components/photox/product/ProductVisual";

export type PdpMediaItem = GalleryMediaItem & { id: string; label: string; view: ViewMode };

/**
 * PHASE 1 media model.
 *
 * Every gallery entry is a GROUP built around one artwork. `detail` and `room`
 * are intentionally nullable: a group only carries them when a real photograph
 * of THAT artwork exists. Nothing is substituted, cropped or borrowed from
 * another artwork to fill an empty slot — those assets arrive in Phase 2.
 */
export type PdpGalleryGroup = {
  id: string;
  label: string;
  artwork: { source: string; label: string };
  detail: { source: string; label: string } | null;
  room: { source: string; label: string } | null;
};

type ArtworkEntry = {
  id: string;
  label: string;
  source: string;
  detail?: { source: string; label: string };
  room?: { source: string; label: string };
};

/** Per-product artwork collections — each PDP has its own, never shared. */
const artworkCollections: Record<string, ArtworkEntry[]> = {
  "north-sea": [
    {
      id: "north-sea",
      label: "North Sea",
      source: artNorthsea,
      detail: { source: nsSurface, label: "Printed surface, close-up" },
      room: { source: nsRoomWide, label: "In a room" },
    },
    { id: "misty-horizon", label: "Misty horizon", source: nsMisty },
    { id: "cliff-coast", label: "Cliff coast", source: nsCliff },
    { id: "long-exposure", label: "Long-exposure shore", source: nsLongExposure },
    { id: "sea-stacks", label: "Sea stacks", source: nsSeaStacks },
    { id: "tide-line", label: "Tide line", source: artTideline },
  ],
  "after-the-rain": [
    {
      id: "after-the-rain",
      label: "After the Rain",
      source: artRain,
      detail: { source: rainSurface, label: "Printed surface, close-up" },
      room: { source: rainRoomWide, label: "In a room" },
    },
    { id: "wet-street", label: "Wet street", source: rainStreet },
    { id: "window-drops", label: "Rain on glass", source: rainWindow },
    { id: "puddle-neon", label: "Puddle, neon", source: rainPuddle },
    { id: "crosswalk", label: "Crosswalk", source: rainCrosswalk },
  ],
  "concrete-planes": [
    {
      id: "concrete-planes",
      label: "Concrete Planes",
      source: artConcrete,
      detail: { source: cpSurface, label: "Printed surface, close-up" },
      room: { source: cpRoomWide, label: "In a room" },
    },
    { id: "concrete-stair", label: "Concrete stair", source: cpStair },
    { id: "concrete-facade", label: "Facade grid", source: cpFacade },
    { id: "concrete-vault", label: "Vault", source: cpVault },
    { id: "brutal-form", label: "Brutal form", source: artBrutal },
  ],
  "night-city": [
    {
      id: "night-city",
      label: "Night City",
      source: artNightcity,
      detail: { source: ncSurface, label: "Printed surface, close-up" },
      room: { source: ncRoomWide, label: "In a room" },
    },
    { id: "aerial-grid", label: "Aerial grid", source: ncAerial },
    { id: "neon-alley", label: "Neon alley", source: ncAlley },
    { id: "tower-windows", label: "Tower windows", source: ncTower },
    { id: "light-trails", label: "Light trails", source: ncTrails },
  ],
};

/** Extra, verified material photography of the primary artwork. */
const primaryEdgeDetail: Record<string, string> = {
  "north-sea": nsEdge,
  "after-the-rain": rainEdge,
  "concrete-planes": cpEdge,
  "night-city": ncEdge,
};

export function productGroups(product: ShopProduct): PdpGalleryGroup[] {
  const collection = artworkCollections[product.id];
  if (collection) {
    return collection.map((entry) => ({
      id: entry.id,
      label: entry.label,
      artwork: { source: entry.source, label: entry.label },
      detail: entry.detail ?? null,
      room: entry.room ?? null,
    }));
  }

  // Products without a dedicated artwork collection yet: their own artwork,
  // plus only the material / room photography that genuinely belongs to it.
  const detail = dedicatedDetailFor(product, "metal");
  const room = hoverImages[product.id];
  return [
    {
      id: product.id,
      label: product.name,
      artwork: { source: product.image, label: product.name },
      detail: detail ? { source: detail, label: "Printed surface, close-up" } : null,
      room: room ? { source: room, label: "In a room" } : null,
    },
  ];
}

/** Flattened carousel: Artwork → (Detail) → (In a room) per group, skipping empty slots. */
export function productGallery(product: ShopProduct): PdpMediaItem[] {
  const items: PdpMediaItem[] = [];
  for (const group of productGroups(product)) {
    items.push({
      id: `${group.id}-artwork`,
      label: group.artwork.label,
      view: "artwork",
      presentation: "original",
      source: group.artwork.source,
    });
    if (group.detail) {
      items.push({
        id: `${group.id}-detail`,
        label: group.detail.label,
        view: "detail",
        presentation: "detail-image",
        source: group.detail.source,
      });
    }
    if (group.room) {
      items.push({
        id: `${group.id}-room`,
        label: group.room.label,
        view: "room",
        presentation: "room-image",
        source: group.room.source,
      });
    }
  }
  const edge = primaryEdgeDetail[product.id];
  if (edge) {
    items.push({
      id: `${product.id}-edge`,
      label: "Thin metal edge",
      view: "detail",
      presentation: "detail-image",
      source: edge,
    });
  }
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
  const edge = primaryEdgeDetail[product.id];
  const roomWide = artworkCollections[product.id]?.[0]?.room?.source;
  const dedicatedDetail = dedicatedDetailFor(product, "metal");
  const ownRoom = hoverImages[product.id];
  return {
    front: { source: product.image },
    surfaceEdge: edge
      ? { source: edge, alt: `${product.name} printed on metal, surface and edge` }
      : dedicatedDetail
        ? { source: dedicatedDetail, alt: `${product.name} printed on metal, surface and edge` }
        : {
            source: product.image,
            crop: "scale-[1.55] object-[88%_50%]",
            alt: `${product.name} printed on metal, surface and edge`,
          },
    room: roomWide
      ? { source: roomWide, alt: `${product.name} installed in an interior` }
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
