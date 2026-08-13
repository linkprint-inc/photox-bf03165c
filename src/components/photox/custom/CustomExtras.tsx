import { useState } from "react";
import { Shell, SectionHead } from "../Section";
import { acceptedLabel } from "@/lib/prepared-image";

const steps = [
  { num: "01", label: "Upload" },
  { num: "02", label: "Choose" },
  { num: "03", label: "Edit" },
  { num: "04", label: "Preview" },
  { num: "05", label: "We print" },
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
      <Shell label="How it works" className="pb-14 md:pb-16">
        <div className="px-rule flex flex-wrap items-baseline gap-x-10 gap-y-3 pt-5">
          <p className="px-label">How it works</p>
          <ol className="flex flex-wrap gap-x-8 gap-y-2">
            {steps.map((s) => (
              <li key={s.num} className="flex items-baseline gap-2">
                <span className="px-meta text-muted-foreground">{s.num}</span>
                <span className="px-label">{s.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </Shell>

      <Shell label="Custom help" className="pb-24 md:pb-32">
        <SectionHead title="Good to know" />
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
