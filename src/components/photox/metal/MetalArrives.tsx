import arrivesPrint from "@/assets/metal-arrives-print.jpg";
import arrivesPack from "@/assets/metal-arrives-pack.jpg";
import { Shell } from "../Section";

export function MetalArrives() {
  return (
    <Shell label="How it arrives" className="pb-16 md:pb-20">
      <div className="px-rule grid gap-8 pt-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <h2 className="px-serif text-[2rem] md:text-[2.6rem]">Ready for the wall.</h2>
          <p className="px-meta mt-5 max-w-[38ch] text-muted-foreground">
            Every metal print is produced as a single finished panel and shipped flat in protective
            packaging.
          </p>
          <a href="/#help" className="px-label px-underline mt-8 inline-block">
            Shipping &amp; delivery →
          </a>
        </div>

        <figure className="md:col-span-4">
          <div className="relative aspect-square w-full overflow-hidden bg-secondary">
            <img
              src={arrivesPrint}
              width={1024}
              height={1024}
              loading="lazy"
              alt="A finished glossy metal print standing against a warm white wall"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <figcaption className="px-label mt-4">Finished print</figcaption>
        </figure>

        <figure className="md:col-span-4">
          <div className="relative aspect-square w-full overflow-hidden bg-secondary">
            <img
              src={arrivesPack}
              width={1024}
              height={1024}
              loading="lazy"
              alt="A flat print packed inside a plain protective cardboard box with foam corners"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <figcaption className="px-label mt-4">Protective packaging</figcaption>
        </figure>
      </div>
    </Shell>
  );
}
