import roomLiving from "@/assets/room-living.jpg";
import roomBedroom from "@/assets/room-bedroom.jpg";
import roomWorkspace from "@/assets/room-workspace.jpg";
import roomDining from "@/assets/room-dining.jpg";

const rooms = [
  {
    label: "Living",
    image: roomLiving,
    alt: "Living room with a large metal print of a coastal cliff above a linen sofa",
    work: "Pacific Coast No. 08",
    material: "Metal Print",
    size: '30 × 40"',
    price: 249,
    ratio: "7 / 6",
    className: "md:col-span-7",
    inset: "left-6 bottom-6",
  },
  {
    label: "Bedroom",
    image: roomBedroom,
    alt: "Dark bedroom with a matte canvas of a black and white abstract above the bed",
    work: "Ink Study No. 04",
    material: "Frameless Canvas",
    size: '24 × 36"',
    price: 189,
    ratio: "4 / 5",
    className: "md:col-span-4 md:col-start-9 md:mt-24",
    inset: "left-6 bottom-6",
  },
  {
    label: "Workspace",
    image: roomWorkspace,
    alt: "Home workspace with a glossy metal print of a red abstract artwork",
    work: "Red Field No. 02",
    material: "Metal Print",
    size: '20 × 30"',
    price: 159,
    ratio: "5 / 4",
    className: "md:col-span-5 md:col-start-2",
    inset: "left-6 bottom-6",
  },
  {
    label: "Dining",
    image: roomDining,
    alt: "Dining area with a metal print of a rainy city street at night",
    work: "After the Rain",
    material: "Metal Print",
    size: '24 × 36"',
    price: 199,
    ratio: "4 / 5",
    className: "md:col-span-4 md:col-start-8",
    inset: "left-6 bottom-6",
  },
];

export function RoomSection() {
  return (
    <section aria-label="In real spaces" className="mx-auto max-w-[1440px] px-6 py-28 md:px-10 md:py-40">
      <h2 className="px-serif text-[2.2rem] md:text-[3rem]">In real spaces</h2>

      <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-12">
        {rooms.map((r) => (
          <article key={r.label} className={r.className}>
            <a href="#shop" className="group relative block overflow-hidden">
              <div className="w-full" style={{ aspectRatio: r.ratio }}>
                <img
                  src={r.image}
                  alt={r.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

              <span className="px-label absolute left-6 top-6 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                {r.label}
              </span>

              <span
                className={`absolute ${r.inset} text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] px-reveal group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0`}
              >
                <span className="px-meta block">{r.work}</span>
                <span className="px-meta block opacity-80">
                  {r.material} · {r.size}
                </span>
                <span className="px-meta block">${r.price}</span>
                <span className="px-label mt-2 block">View artwork →</span>
              </span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
