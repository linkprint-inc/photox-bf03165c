import roomLiving from "@/assets/room-living.jpg";
import roomBedroom from "@/assets/room-bedroom.jpg";
import roomWorkspace from "@/assets/room-workspace.jpg";
import roomDining from "@/assets/room-dining.jpg";
import { artBluehour, artMonolith, artTideline, artChroma } from "@/lib/photox-data";

const works = [
  {
    name: "Blue Hour",
    material: "Metal Print",
    size: '30 × 40"',
    from: 249,
    image: artBluehour,
    room: roomLiving,
    ratio: "3 / 2",
    className: "md:col-span-7",
  },
  {
    name: "Monolith",
    material: "Metal Print",
    size: '24 × 36"',
    from: 219,
    image: artMonolith,
    room: roomDining,
    ratio: "4 / 5",
    className: "md:col-span-4 md:col-start-9",
  },
  {
    name: "Tide Line",
    material: "Frameless Canvas",
    size: '30 × 40"',
    from: 229,
    image: artTideline,
    room: roomWorkspace,
    ratio: "3 / 2",
    className: "md:col-span-6 md:col-start-4",
  },
  {
    name: "Chroma Study",
    material: "Frameless Canvas",
    size: '24 × 36"',
    from: 199,
    image: artChroma,
    room: roomBedroom,
    ratio: "4 / 5",
    className: "md:col-span-4",
  },
];

export function LargeFormat() {
  return (
    <section aria-label="New works, large format" className="mx-auto max-w-[1600px] px-6 pb-28 md:px-10 md:pb-40">
      <div className="px-rule flex flex-wrap items-baseline justify-between gap-4 pt-8">
        <h2 className="px-label">New works · Large format</h2>
        <p className="px-meta text-muted-foreground">Statement scale, 24" and above</p>
      </div>

      <div className="mt-14 grid gap-x-8 gap-y-24 md:grid-cols-12">
        {works.map((w) => (
          <article key={w.name} className={w.className}>
            <a href="#shop" className="group block">
              <div
                className="relative w-full overflow-hidden bg-secondary"
                style={{ aspectRatio: w.ratio }}
              >
                <img
                  src={w.image}
                  alt={`${w.name} — ${w.material}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:opacity-0 group-focus-visible:opacity-0"
                />
                <img
                  src={w.room}
                  alt={`${w.name} installed in a real interior`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-6">
                <div>
                  <h3 className="px-serif text-[1.5rem]">{w.name}</h3>
                  <p className="px-meta text-muted-foreground">
                    {w.material} · {w.size}
                  </p>
                </div>
                <p className="px-meta whitespace-nowrap">From ${w.from}</p>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
