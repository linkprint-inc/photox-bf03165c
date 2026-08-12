import { Shell } from "./Section";

const tools = [
  {
    id: "restore",
    num: "01",
    label: "Restore Old Photo",
    body: "Bring faded and damaged photos back to life.",
    href: "/photo-tools?tool=restore",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-4 w-4">
        <path d="M3 7c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
        <path d="M3 16l4-4 4 4 5-6 5 6" />
        <circle cx="8.5" cy="8.5" r="1.5" />
      </svg>
    ),
  },
  {
    id: "enhance",
    num: "02",
    label: "Enhance Resolution",
    body: "Prepare smaller images for larger prints.",
    href: "/photo-tools?tool=enhance",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-4 w-4">
        <path d="M12 3v18M3 12h18" />
        <path d="m21 21-3-3M3 21l3-3M21 3l-3 3M3 3l3 3" />
      </svg>
    ),
  },
  {
    id: "text",
    num: "03",
    label: "Add Text",
    body: "Add names, dates or a personal message.",
    href: "/photo-tools?tool=text",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-4 w-4">
        <path d="M4 7V5h16v2M9 20h6M12 5v15" />
      </svg>
    ),
  },
];

export function PhotoTools() {
  return (
    <Shell id="tools" className="py-14 md:py-16">
      <div className="px-rule grid gap-y-3 pt-4 md:grid-cols-12 md:items-baseline md:gap-x-8">
        <h2 className="px-label md:col-span-3">Before You Print</h2>
        <p className="px-meta max-w-[44ch] text-muted-foreground md:col-span-5 md:col-start-5">
          Need a little help with your image? Prepare it before turning it into wall art.
        </p>
        <a
          href="/photo-tools"
          className="px-meta px-underline text-foreground/80 transition-colors duration-300 hover:text-foreground md:col-span-3 md:col-start-10 md:text-right"
        >
          View photo tools <span aria-hidden>→</span>
        </a>
      </div>

      <div className="mt-10 grid gap-7 md:mt-12 md:grid-cols-3 md:gap-6">
        {tools.map((t) => (
          <a
            key={t.id}
            href={t.href}
            className="group block"
          >
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <span className="px-meta">{t.num}</span>
              <span className="transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]">
                {t.icon}
              </span>
              <span className="px-label text-foreground/80 transition-colors duration-300 group-hover:text-foreground">
                {t.label}
              </span>
              <span
                aria-hidden
                className="hidden text-[0.75rem] text-foreground/60 transition-all duration-300 group-hover:translate-x-[3px] md:inline-block md:opacity-0 md:group-hover:opacity-100"
              >
                →
              </span>
            </div>
            <p className="px-meta mt-2 max-w-[34ch] pl-0 text-muted-foreground md:pl-[2.2rem]">
              {t.body}
            </p>
          </a>
        ))}
      </div>
    </Shell>
  );
}
