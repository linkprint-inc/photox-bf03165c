import metalSurface from "@/assets/metal-surface.jpg";
import metalEdge from "@/assets/metal-edge.jpg";
import metalDetailCrop from "@/assets/metal-detail-crop.jpg";
import { Shell } from "../Section";

const frames = [
  {
    title: "Surface",
    note: "A glossy finish that reflects the light in the room.",
    image: metalSurface,
    alt: "Extreme close-up of the glossy printed surface of a metal print",
  },
  {
    title: "Edge",
    note: "A thin rigid panel with no frame around the image.",
    image: metalEdge,
    alt: "Three-quarter view of a metal print corner showing the thin rigid panel",
  },
  {
    title: "Detail",
    note: "Fine detail stays sharp, even in the darkest areas.",
    image: metalDetailCrop,
    alt: "Close crop of a metal print showing sharp architectural detail",
  },
];

export function MetalSurface() {
  return (
    <Shell label="Detail, edge and surface" className="pb-20 md:pb-28">
      <div className="px-rule grid gap-8 pt-6 sm:grid-cols-3 md:gap-8">
        {frames.map((f) => (
          <figure key={f.title} className="group">
            <div className="px-gloss relative aspect-square w-full overflow-hidden bg-secondary group-hover:after:opacity-100">
              <img
                src={f.image}
                width={1024}
                height={1024}
                loading="lazy"
                alt={f.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-4">
              <p className="px-label">{f.title}</p>
              <p className="px-meta px-reveal mt-2 max-w-[34ch] text-muted-foreground group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 max-md:translate-y-0 max-md:opacity-100">
                {f.note}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Shell>
  );
}
