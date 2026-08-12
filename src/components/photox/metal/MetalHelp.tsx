import { useState } from "react";
import { Shell } from "../Section";

const questions = [
  {
    q: "Do metal prints reflect light?",
    a: "Yes. The finish is glossy, so it picks up the light in the room. Facing a window directly will show more reflection than a side-lit wall.",
  },
  {
    q: "Which size should I choose?",
    a: 'Sizes run from 12 × 18" to 30 × 40". Use Find your size above to compare each size against a fixed room before you decide.',
  },
  {
    q: "How do I care for a metal print?",
    a: "Wipe the surface gently with a soft, dry cloth. Avoid abrasive cloths and solvent-based cleaners.",
  },
];

export function MetalHelp() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Shell label="Metal help" className="pb-20 md:pb-28">
      <div className="px-rule grid gap-6 pt-6 md:grid-cols-12">
        <p className="px-label md:col-span-3">Metal, answered</p>

        <ul className="md:col-span-7">
          {questions.map((item, i) => (
            <li key={item.q} className="border-b border-hairline">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-baseline justify-between gap-6 py-4 text-left"
              >
                <span className="px-label">{item.q}</span>
                <span
                  aria-hidden
                  className={[
                    "px-meta transition-transform duration-[420ms]",
                    open === i ? "rotate-90" : "",
                  ].join(" ")}
                >
                  →
                </span>
              </button>
              {open === i ? (
                <p className="px-meta max-w-[56ch] pb-5 text-muted-foreground">{item.a}</p>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="md:col-span-2 md:text-right">
          <a href="/#help" className="px-label px-underline">
            View all help →
          </a>
        </div>
      </div>
    </Shell>
  );
}
