import { Link } from "@tanstack/react-router";
import { useState } from "react";
import materialMetal from "@/assets/material-metal.jpg";
import materialCanvas from "@/assets/material-canvas.jpg";
import { Shell, SectionHead } from "../Section";
import { acceptedLabel } from "@/lib/prepared-image";

const steps = [
  { num: "01", label: "Upload", body: "Add your photograph, artwork or scan." },
  { num: "02", label: "Choose", body: "Pick a surface and a size for the wall." },
  { num: "03", label: "Preview", body: "See the print on its own and in a room." },
  { num: "04", label: "We print", body: "Your file goes into production and ships." },
];

const help = [
  {
    q: "What image quality do I need?",
    a: `We suggest a long edge of at least 150 pixels per printed inch. The builder compares your file's real pixel dimensions with the size you select and tells you when it looks small.`,
  },
  {
    q: "Can I print my own artwork?",
    a: `Yes. Photographs, scans, illustrations and digital artwork all work, as long as the file is ${acceptedLabel} and you have the right to print it.`,
  },
  {
    q: "What happens to my upload?",
    a: "Your image stays in this browser while you configure the print — it is held in this tab's session storage and is not published anywhere on the site.",
  },
];

export function CustomExtras() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <Shell label="How it works" className="pb-16 md:pb-20">
        <SectionHead title="How it works" />
        <ol className="mt-8 grid gap-8 md:grid-cols-4 md:gap-6">
          {steps.map((s) => (
            <li key={s.num} className="px-rule pt-4">
              <p className="px-meta text-muted-foreground">{s.num}</p>
              <p className="px-label mt-2">{s.label}</p>
              <p className="px-meta mt-2 max-w-[28ch] text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </Shell>

      <Shell label="Made for your image" className="pb-16 md:pb-24">
        <SectionHead title="Made for your image" />
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-6">
          {[
            {
              img: materialMetal,
              name: "Metal Print",
              note: "Glossy · crisp · luminous",
              body: "Best for high-contrast photography, architecture and deep colour.",
              from: 79,
              alt: "Close view of a glossy metal print surface catching side light",
            },
            {
              img: materialCanvas,
              name: "Frameless Canvas",
              note: "Matte · textured · soft",
              body: "Best for portraits, painterly images and quieter rooms.",
              from: 69,
              alt: "Close view of a matte frameless canvas with a wrapped edge",
            },
          ].map((m) => (
            <article key={m.name}>
              <img
                src={m.img}
                alt={m.alt}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="px-rule mt-5 flex items-baseline justify-between gap-6 pt-4">
                <p className="px-label">{m.name}</p>
                <p className="px-price">
                  <span className="px-label mr-1 opacity-70">From</span>${m.from}
                </p>
              </div>
              <p className="px-meta mt-2 text-muted-foreground">{m.note}</p>
              <p className="px-meta mt-1 max-w-[38ch] text-muted-foreground">{m.body}</p>
            </article>
          ))}
        </div>
      </Shell>

      <Shell label="Custom help" className="pb-24 md:pb-32">
        <SectionHead title="Good to know">
          <Link to="/photo-tools" className="px-label px-underline">
            Photo tools →
          </Link>
        </SectionHead>
        <ul className="mt-6 border-t border-hairline">
          {help.map((h, i) => (
            <li key={h.q} className="border-b border-hairline">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-baseline justify-between gap-6 py-5 text-left"
              >
                <span className="px-label">{h.q}</span>
                <span
                  aria-hidden
                  className={[
                    "text-muted-foreground transition-transform duration-300",
                    open === i ? "rotate-45" : "",
                  ].join(" ")}
                >
                  +
                </span>
              </button>
              {open === i ? (
                <p className="px-meta max-w-[62ch] pb-6 text-muted-foreground">{h.a}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Shell>
    </>
  );
}
