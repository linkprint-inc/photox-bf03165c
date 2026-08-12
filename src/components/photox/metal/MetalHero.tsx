import metalHero from "@/assets/metal-hero.jpg";
import { metalFrom } from "@/lib/metal-data";

export function MetalHero() {
  return (
    <section id="hero" className="relative min-h-[86vh] w-full overflow-hidden bg-secondary md:min-h-[92vh]">
      <img
        src={metalHero}
        width={1920}
        height={1088}
        alt="A large glossy metal print of a coastal seascape on a pale wall in a contemporary interior, with daylight raking across its surface"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.12)_38%,rgba(0,0,0,0.55)_100%)]"
      />

      <div className="relative mx-auto flex min-h-[86vh] max-w-[1440px] flex-col justify-end px-6 pb-14 text-white md:min-h-[92vh] md:px-10 md:pb-20">
        <p className="px-label opacity-80">Metal Prints</p>

        <h1 className="px-serif mt-5 max-w-[16ch] text-[2.6rem] md:text-[4.4rem]">
          Light becomes part of the image.
        </h1>

        <p className="px-meta mt-5 max-w-[42ch] opacity-85">
          Glossy, luminous and exceptionally crisp.
        </p>

        <div className="px-rule mt-10 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 border-white/25 pt-6">
          <p className="px-price">
            <span className="px-label mr-1 opacity-70">From</span>${metalFrom}
          </p>
          <a href="#metal-shop" className="px-label px-underline">
            Shop metal →
          </a>
        </div>
      </div>
    </section>
  );
}
