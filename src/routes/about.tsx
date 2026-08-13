import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { Shell } from "@/components/photox/Section";

import aboutHero from "@/assets/about-hero.jpg";
import aboutQuiet from "@/assets/about-quiet.jpg";
import metalSurface from "@/assets/metal-surface.jpg";
import materialCanvas from "@/assets/material-canvas.jpg";
import roomLiving from "@/assets/room-living-architectural.jpg";
import roomWorkspace from "@/assets/room-workspace.jpg";
import customOriginal from "@/assets/custom-original.jpg";
import customPrint from "@/assets/custom-print.jpg";

const title = "About photoX — Art, Made Physical";
const description =
  "photoX turns photography, artwork and personal images into objects made for the wall: metal prints, frameless canvas and custom prints.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteNav variant="hero" />

      <main>
        {/* Hero */}
        <section id="hero" aria-label="About photoX" className="relative">
          <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
            <img
              src={aboutHero}
              alt="Hands holding a glossy metal print of a mountain landscape in natural window light"
              width={1600}
              height={1104}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-end">
              <div className="mx-auto w-full max-w-[1440px] px-6 pb-14 md:px-10 md:pb-20">
                <p className="px-label text-white/80">About photoX</p>
                <h1 className="px-serif mt-4 max-w-[14ch] text-[2.8rem] leading-[0.95] text-white md:text-[5rem]">
                  Art,
                  <br />
                  made physical.
                </h1>
                <p className="px-meta mt-6 max-w-[46ch] text-white/85">
                  photoX turns photography, artwork and personal images into objects made for the
                  wall.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What we make */}
        <Shell label="What we make" className="py-20 md:py-28">
          <div className="px-rule grid gap-10 pt-6 md:grid-cols-[0.3fr_1fr] md:gap-16">
            <h2 className="px-label">What we make</h2>
            <div>
              <ul className="px-serif space-y-2 text-[2rem] leading-[1.15] md:text-[2.6rem]">
                <li>Metal Prints</li>
                <li>Frameless Canvas</li>
                <li>Custom Prints</li>
              </ul>
              <p className="px-meta mt-8 max-w-[52ch] text-muted-foreground">
                We make wall art in two ways: curated artwork ready to buy, and custom prints made
                from your own image.
              </p>
              <div className="mt-8 flex flex-wrap gap-8">
                <a href="/shop" className="px-label px-underline">
                  Shop art →
                </a>
                <a href="/custom" className="px-label px-underline">
                  Create yours →
                </a>
              </div>
            </div>
          </div>
        </Shell>

        {/* The object matters */}
        <Shell label="The object matters" className="pb-20 md:pb-28">
          <h2 className="px-serif max-w-[18ch] text-[2.2rem] leading-[1.05] md:text-[3.4rem]">
            The image is only
            <br />
            the beginning.
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <figure>
              <div className="overflow-hidden" style={{ aspectRatio: "5 / 4" }}>
                <img
                  src={metalSurface}
                  alt="Light reflecting across the glossy surface of a metal print"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <p className="px-label">Metal</p>
                <p className="px-meta mt-1 max-w-[40ch] text-muted-foreground">
                  A glossy surface that moves with the light in the room. Colour stays crisp, edges
                  stay thin.
                </p>
              </figcaption>
            </figure>

            <figure className="md:mt-16">
              <div className="overflow-hidden" style={{ aspectRatio: "5 / 4" }}>
                <img
                  src={materialCanvas}
                  alt="Woven canvas texture and the wrapped edge of a frameless canvas print"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <p className="px-label">Canvas</p>
                <p className="px-meta mt-1 max-w-[40ch] text-muted-foreground">
                  A matte, woven texture wrapped around the edge, so the work reads as an object
                  rather than a poster.
                </p>
              </figcaption>
            </figure>
          </div>

          <p className="px-meta mt-12 max-w-[58ch] text-muted-foreground">
            Surface, scale, light and space change how an image is read. We treat those four things
            as part of the work, not as packaging around it.
          </p>
        </Shell>

        {/* Artwork & respect */}
        <Shell label="Artwork and respect" className="pb-20 md:pb-28">
          <div className="px-rule grid gap-10 pt-6 md:grid-cols-[0.3fr_1fr] md:gap-16">
            <h2 className="px-label">Artwork &amp; respect</h2>
            <div>
              <p className="px-serif max-w-[18ch] text-[2rem] leading-[1.05] md:text-[3rem]">
                The work stays
                <br />
                the work.
              </p>
              <p className="px-meta mt-8 max-w-[54ch] text-muted-foreground">
                photoX exists to help an existing image become a physical print. Photographers and
                artists keep their work; customers keep their personal images. Our part is the
                surface, the scale and the printing.
              </p>
              <a href="/shop" className="px-label px-underline mt-8 inline-block">
                Artwork &amp; image policy →
              </a>
            </div>
          </div>
        </Shell>

        {/* Made for real spaces */}
        <Shell label="Made for real spaces" className="pb-20 md:pb-28">
          <h2 className="px-serif text-[2.2rem] md:text-[3rem]">Made for real spaces</h2>

          <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-12">
            <figure className="md:col-span-7">
              <div className="overflow-hidden" style={{ aspectRatio: "7 / 5" }}>
                <img
                  src={roomLiving}
                  alt="Living room with a large metal print on a soft grey plaster wall"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="px-label mt-4">Home</figcaption>
            </figure>

            <figure className="md:col-span-5 md:mt-20">
              <div className="overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
                <img
                  src={aboutQuiet}
                  alt="Quiet reading corner with a frameless canvas print in morning light"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="px-label mt-4">Quiet space</figcaption>
            </figure>

            <figure className="md:col-span-6 md:col-start-4">
              <div className="overflow-hidden" style={{ aspectRatio: "5 / 4" }}>
                <img
                  src={roomWorkspace}
                  alt="Home workspace with a glossy metal print above the desk"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="px-label mt-4">Workspace</figcaption>
            </figure>
          </div>
        </Shell>

        {/* Custom */}
        <Shell label="Custom prints" className="pb-24 md:pb-32">
          <div className="px-rule grid items-center gap-10 pt-6 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="px-serif max-w-[12ch] text-[2.2rem] leading-[1.05] md:text-[3.2rem]">
                Yours,
                <br />
                on the wall.
              </h2>
              <p className="px-meta mt-6 max-w-[46ch] text-muted-foreground">
                Bring your own photograph, artwork or personal image. Choose the surface and size.
                Prepare it if needed. Then make it physical.
              </p>
              <a href="/custom" className="px-label px-underline mt-8 inline-block">
                Custom prints →
              </a>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
                <img
                  src={customOriginal}
                  alt="Original digital photograph before printing"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="px-label text-muted-foreground">→</span>
              <div className="overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
                <img
                  src={customPrint}
                  alt="The same photograph as a finished physical print on a wall"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </Shell>
      </main>

      <SiteFooter />
    </div>
  );
}
