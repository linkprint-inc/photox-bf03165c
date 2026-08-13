import roomLivingArch from "@/assets/room-living-architectural.jpg";
import roomWorkspace from "@/assets/room-workspace.jpg";
import roomDining from "@/assets/room-dining.jpg";
import { metalById, metalSizes } from "@/lib/metal-data";
import { Shell, SectionHead } from "../Section";

const scenes = [
  { room: "Living", image: roomLivingArch, product: metalById("blue-hour"), sizeIndex: 4 },
  { room: "Workspace", image: roomWorkspace, product: metalById("concrete-planes"), sizeIndex: 2 },
  { room: "Dining", image: roomDining, product: metalById("night-city"), sizeIndex: 3 },
];

export function MetalSpaces() {
  return (
    <Shell label="Metal in real spaces" className="pb-16 md:pb-20">
      <SectionHead title="Metal in real spaces" />

      <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
        {scenes.map((s) => {
          const size = metalSizes[s.sizeIndex]!;
          return (
            <article key={s.room} className="group">
              <a
                href={`/shop?q=${encodeURIComponent(s.product.name)}`}
                className="block"
                aria-label={`${s.product.name} — view artwork`}
              >
                <div className="px-gloss relative aspect-[4/5] w-full overflow-hidden bg-secondary group-hover:after:opacity-100">
                  <img
                    src={s.image}
                    loading="lazy"
                    alt={`A metal print in a ${s.room.toLowerCase()} interior`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  <p className="px-label">{s.room}</p>
                  <div className="px-reveal mt-2 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 max-md:translate-y-0 max-md:opacity-100">
                    <p className="px-meta text-muted-foreground">{s.product.name}</p>
                    <p className="px-meta text-muted-foreground">Metal Print · {size.label}</p>
                    <p className="px-price mt-1">${size.price}</p>
                    <span className="px-label px-underline mt-3 inline-block">View artwork →</span>
                  </div>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </Shell>
  );
}
