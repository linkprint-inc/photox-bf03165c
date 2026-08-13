import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { Shell } from "@/components/photox/Section";

import aboutHero from "@/assets/about-hero.jpg";
import aboutProduction from "@/assets/about-production.jpg";
import aboutCommercial from "@/assets/about-commercial.jpg";
import metalSurface from "@/assets/metal-surface.jpg";
import metalEdge from "@/assets/metal-edge.jpg";
import metalDetailCrop from "@/assets/metal-detail-crop.jpg";
import materialCanvas from "@/assets/material-canvas.jpg";
import roomLiving from "@/assets/room-living-architectural.jpg";
import roomWorkspace from "@/assets/room-workspace.jpg";
import customOriginal from "@/assets/custom-original.jpg";
import customPrint from "@/assets/custom-print.jpg";

const title = "About photoX — Art, Made Physical";
const description =
  "photoX is a brand of LinkPrint, Inc., turning photography, artwork and personal images into objects made for the wall: metal prints, frameless canvas and custom prints.";

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
        {/* 01 Hero */}
        <section id="hero" aria-label="About photoX" className="relative">
          <div className="relative h-[74vh] min-h-[500px] w-full overflow-hidden">
            <img
              src={aboutHero}
              alt="Hands holding a glossy metal print of a mountain landscape in natural window light, showing its surface and thin edge"
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

        {/* 02 Built on print experience */}
        <Shell label="Built on print experience" className="py-20 md:py-28">
          <div className="px-rule grid gap-10 pt-6 md:grid-cols-[0.9fr_1fr] md:gap-16">
            <div>
              <h2 className="px-serif max-w-[14ch] text-[2.2rem] leading-[1.05] md:text-[3.2rem]">
                Built on
                <br />
                print experience.
              </h2>
              <p className="px-label mt-10 text-muted-foreground">
                LinkPrint <span className="px-2 opacity-50">×</span> photoX
              </p>
            </div>

            <div>
              <p className="px-meta max-w-[52ch] text-foreground/90">
                photoX is a brand of LinkPrint, Inc., built on years of experience turning images
                into professionally produced physical prints.
              </p>
              <p className="px-meta mt-6 max-w-[52ch] text-muted-foreground">
                The purpose of photoX is to bring that print expertise into a simpler, more visual
                way to discover, customize and create wall art.
              </p>
              <div className="mt-10 flex flex-wrap gap-8">
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

        {/* 03 Material matters */}
        <Shell label="Material matters" className="pb-20 md:pb-28">
          <h2 className="px-serif max-w-[12ch] text-[2.2rem] leading-[1.05] md:text-[3.4rem]">
            Material
            <br />
            matters.
          </h2>

          {/* Metal — dominant */}
          <div className="mt-12 grid gap-8 md:grid-cols-12">
            <figure className="md:col-span-8">
              <div className="px-gloss relative w-full overflow-hidden bg-secondary" style={{ aspectRatio: "16 / 10" }}>
                <img
                  src={metalSurface}
                  alt="Light reflecting across the glossy printed surface of a metal print"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-5">
                <p className="px-label">Metal Print</p>
                <p className="px-meta mt-2 max-w-[48ch] text-muted-foreground">
                  A glossy printed surface on a thin aluminium panel. Light moves across it, colour
                  stays crisp, detail stays sharp, and the edge stays visually light on the wall.
                </p>
                <a href="/metal" className="px-label px-underline mt-6 inline-block">
                  Metal prints →
                </a>
              </figcaption>
            </figure>

            <div className="grid gap-8 md:col-span-4 md:mt-16">
              <figure>
                <div className="relative w-full overflow-hidden bg-secondary" style={{ aspectRatio: "1 / 1" }}>
                  <img
                    src={metalEdge}
                    alt="Corner of a metal print showing the thin rigid aluminium profile"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <figcaption className="px-meta mt-3 text-muted-foreground">
                  Thin rigid profile
                </figcaption>
              </figure>
              <figure>
                <div className="relative w-full overflow-hidden bg-secondary" style={{ aspectRatio: "1 / 1" }}>
                  <img
                    src={metalDetailCrop}
                    alt="Close crop of a metal print showing fine photographic detail"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <figcaption className="px-meta mt-3 text-muted-foreground">
                  Photographic detail
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Canvas — secondary */}
          <div className="px-rule mt-16 grid gap-8 pt-6 md:grid-cols-12 md:items-end">
            <figure className="md:col-span-5">
              <div className="px-weave relative w-full overflow-hidden bg-secondary" style={{ aspectRatio: "5 / 4" }}>
                <img
                  src={materialCanvas}
                  alt="Woven canvas texture and the wrapped edge of a frameless canvas print"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </figure>
            <div className="md:col-span-5 md:col-start-7">
              <p className="px-label">Frameless Canvas</p>
              <p className="px-meta mt-3 max-w-[44ch] text-muted-foreground">
                A woven surface with a matte finish, wrapped around the edge so the work reads as an
                object rather than a poster.
              </p>
              <a href="/shop" className="px-label px-underline mt-6 inline-block">
                Shop canvas →
              </a>
            </div>
          </div>
        </Shell>

        {/* 05 The work stays the work */}
        <Shell label="The work stays the work" className="pb-20 md:pb-28">
          <div className="px-rule grid gap-10 pt-6 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <h2 className="px-serif max-w-[14ch] text-[2rem] leading-[1.05] md:text-[3rem]">
                The work stays
                <br />
                the work.
              </h2>
              <p className="px-meta mt-8 max-w-[46ch] text-muted-foreground">
                Whether it begins as an artist’s work, a photograph or a personal image, our role is
                to help it become a physical object. The artwork remains the focus. The process
                stays in service of the work.
              </p>
              <a href="/custom" className="px-label px-underline mt-8 inline-block">
                Artwork &amp; image policy →
              </a>
            </div>

            <figure className="md:col-span-6 md:col-start-7">
              <div className="relative w-full overflow-hidden bg-secondary" style={{ aspectRatio: "4 / 3" }}>
                <img
                  src={aboutProduction}
                  alt="Gloved hands inspecting the edge of a finished aluminium print panel on a clean workbench"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <figcaption className="px-meta mt-4 text-muted-foreground">
                Finished panels are checked by hand before they ship.
              </figcaption>
            </figure>
          </div>
        </Shell>

        {/* 07 Made for real spaces */}
        <Shell label="Made for real spaces" className="pb-20 md:pb-28">
          <h2 className="px-serif max-w-[12ch] text-[2.2rem] leading-[1.05] md:text-[3.4rem]">
            Made for
            <br />
            real spaces.
          </h2>

          <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-12">
            <figure className="md:col-span-12">
              <div className="relative w-full overflow-hidden bg-secondary" style={{ aspectRatio: "16 / 9" }}>
                <img
                  src={aboutCommercial}
                  alt="Creative studio reception with a very large glossy metal print on a white concrete wall"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <figcaption className="px-label mt-4">Commercial / creative space</figcaption>
            </figure>

            <figure className="md:col-span-5">
              <div className="relative w-full overflow-hidden bg-secondary" style={{ aspectRatio: "5 / 4" }}>
                <img
                  src={roomLiving}
                  alt="Living room with a large metal print on a soft grey plaster wall"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <figcaption className="px-label mt-4">Home</figcaption>
            </figure>

            <figure className="md:col-span-5 md:col-start-8 md:mt-16">
              <div className="relative w-full overflow-hidden bg-secondary" style={{ aspectRatio: "4 / 5" }}>
                <img
                  src={roomWorkspace}
                  alt="Home workspace with a glossy metal print above the desk"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <figcaption className="px-label mt-4">Workspace</figcaption>
            </figure>
          </div>
        </Shell>

        {/* 08 Yours, on the wall */}
        <Shell label="Custom prints" className="pb-24 md:pb-32">
          <div className="px-rule grid items-center gap-10 pt-6 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="px-serif max-w-[12ch] text-[2.2rem] leading-[1.05] md:text-[3.2rem]">
                Yours,
                <br />
                on the wall.
              </h2>
              <p className="px-meta mt-6 max-w-[46ch] text-muted-foreground">
                Bring your own photograph, artwork or personal image. Choose the surface. Choose the
                size. Prepare it if needed. Make it physical.
              </p>
              <a href="/custom" className="px-label px-underline mt-8 inline-block">
                Custom prints →
              </a>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <figure>
                <div className="overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
                  <img
                    src={customOriginal}
                    alt="Original digital photograph before printing"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="px-meta mt-3 text-muted-foreground">
                  Original image
                </figcaption>
              </figure>
              <span className="px-label mb-6 text-muted-foreground">→</span>
              <figure>
                <div className="overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
                  <img
                    src={customPrint}
                    alt="The same photograph as a finished physical print on a wall"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="px-meta mt-3 text-muted-foreground">
                  Physical print
                </figcaption>
              </figure>
            </div>
          </div>
        </Shell>
      </main>

      <SiteFooter />
    </div>
  );
}
