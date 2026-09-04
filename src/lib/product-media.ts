import roomHallway from "@/assets/room/hallway-empty.jpg";
import roomWorkspace from "@/assets/room/workspace-empty.jpg";
import roomDining from "@/assets/room/dining-empty.jpg";
import { hoverImages } from "./hover-images";
import { dedicatedDetailFor } from "./product-detail";
import type { ShopProduct } from "./shop-data";
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
