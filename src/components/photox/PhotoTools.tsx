import { useState } from "react";
import { Shell, SectionHead } from "./Section";

const tools = [
  {
    label: "Restore old photo",
    body: "Repair fading, scratches and age-related damage before printing.",
  },
  {
    label: "Enhance resolution",
    body: "Prepare smaller images for larger print sizes.",
  },
  {
    label: "Add text",
    body: "Add a date, name, caption or personal message.",
  },
];

export function PhotoTools() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Shell id="tools" className="pb-28 md:pb-36">
      <SectionHead title="Before you print" note="Need a little help with your image?" />

      <ul className="mt-10 border-t border-hairline">
        {tools.map((t) => {
          const isOpen = open === t.label;
          return (
            <li key={t.label} className="border-b border-hairline">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : t.label)}
                aria-expanded={isOpen}
                className="flex h-[72px] w-full items-center justify-between gap-6 px-0 text-left transition-opacity duration-[420ms] hover:opacity-60"
              >
                <span className="px-label">{t.label}</span>
                <span className="px-meta">{isOpen ? "–" : "+"}</span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-[480ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-meta max-w-[52ch] pb-6 text-muted-foreground">{t.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}
