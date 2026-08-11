import roomLiving from "@/assets/room-living.jpg";
import roomWorkspace from "@/assets/room-workspace.jpg";
import roomDining from "@/assets/room-dining.jpg";
import roomBedroom from "@/assets/room-bedroom.jpg";

const strip = [
  { image: roomLiving, alt: "A metal print above a sofa in a daylit living room" },
  { image: roomWorkspace, alt: "A red abstract metal print above a workspace desk" },
  { image: roomDining, alt: "A city night metal print in a dining area" },
  { image: roomBedroom, alt: "A matte canvas above a bed in a dark bedroom" },
];

export function FinalMoment() {
  return (
    <section aria-label="Made for real walls" className="pb-24 md:pb-32">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="px-rule flex flex-wrap items-baseline justify-between gap-4 pt-8">
          <h2 className="px-label">Made for real walls</h2>
          <p className="px-meta text-muted-foreground">4.8 / 5 · 2,140 reviews</p>
        </div>
      </div>

      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:px-10">
        {strip.map((s) => (
          <img
            key={s.alt}
            src={s.image}
            alt={s.alt}
            loading="lazy"
            className="h-[42vw] max-h-[380px] w-auto shrink-0 snap-start object-cover"
          />
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-[1600px] px-6 md:px-10">
        <a href="#shop" className="px-label px-underline">
          Shop all art →
        </a>
      </div>
    </section>
  );
}
