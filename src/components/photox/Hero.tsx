import { useState } from "react";
import heroImage from "@/assets/hero-metal-room.jpg";

export function Hero() {
  const [lit, setLit] = useState(false);

  return (
    <section
      id="hero"
      className="relative h-screen min-h-screen w-full overflow-hidden bg-ink"
      style={{ height: "100dvh" }}
    >
      <img
        src={heroImage}
        width={1920}
        height={1200}
        alt="A large gloss metal print of a coastal seascape installed in a daylit contemporary living room"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* the artwork itself — hover changes the reflected highlight */}
      <button
        type="button"
        onMouseEnter={() => setLit(true)}
        onMouseLeave={() => setLit(false)}
        onFocus={() => setLit(true)}
        onBlur={() => setLit(false)}
        aria-label="A glossy photoX print in a daylit room"
        className="absolute right-[3%] top-[16%] h-[46%] w-[47%] cursor-pointer md:right-[4%] md:top-[19%] md:h-[45%] md:w-[45%]"
      >
        <span
          aria-hidden
          className="absolute inset-0 transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
          style={{
            opacity: lit ? 1 : 0,
            background:
              "linear-gradient(112deg, transparent 30%, rgba(255,255,255,0.20) 44%, rgba(255,255,255,0.04) 56%, transparent 70%)",
          }}
        />
      </button>

      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 text-white">
        <div className="mx-auto max-w-[1440px] px-6 pb-12 md:px-10 md:pb-16">
          <p className="px-label opacity-80">Made from your photo</p>
          <h1 className="px-serif mt-4 max-w-[16ch] text-[2.6rem] md:text-[4.2rem]">
            Your moment, made for the wall.
          </h1>

          <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-5">
              <p className="px-label">Upload · prepare · choose size · preview</p>
              <p className="px-meta mt-1 max-w-[38ch] opacity-85">
                Turn a photo you love into a Metal Print.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-8 md:col-span-7 md:justify-end">
              <a
                href="/products/north-sea"
                className="px-label border border-white/70 px-7 py-4 transition-colors duration-[420ms] hover:bg-white hover:text-ink"
              >
                Create your print →
              </a>
              <a href="/shop" className="px-label px-underline">
                Start with an idea →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
