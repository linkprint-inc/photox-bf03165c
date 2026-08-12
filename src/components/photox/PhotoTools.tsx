import { Shell } from "./Section";

const tools = [
  {
    id: "restore",
    label: "Restore Old Photo",
    body: "Bring faded and damaged photos back to life.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-5 w-5">
        <path d="M3 7c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
        <path d="M3 16l4-4 4 4 5-6 5 6" />
        <circle cx="8.5" cy="8.5" r="1.5" />
      </svg>
    ),
  },
  {
    id: "enhance",
    label: "Enhance Resolution",
    body: "Prepare smaller images for larger prints.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-5 w-5">
        <path d="M12 3v18M3 12h18" />
        <path d="m21 21-3-3M3 21l3-3M21 3l-3 3M3 3l3 3" />
      </svg>
    ),
  },
  {
    id: "text",
    label: "Add Text",
    body: "Add names, dates or a personal message.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-5 w-5">
        <path d="M4 7V5h16v2M9 20h6M12 5v15" />
      </svg>
    ),
  },
];

export function PhotoTools() {
  return (
    <Shell id="tools" className="py-16 md:py-20">
      <div className="px-rule grid gap-x-10 gap-y-4 pt-5 md:grid-cols-12 md:items-baseline">
        <h2 className="px-label md:col-span-3">Before You Print</h2>
        <p className="px-meta max-w-[44ch] text-muted-foreground md:col-span-6 md:col-start-5">
          Need a little help with your image? Prepare your image before you print.
        </p>
      </div>

      <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-3 md:gap-6">
        {tools.map((t) => (
          <button
            key={t.id}
            type="button"
            className="group text-left"
            onClick={() => {
              // Navigate to the dedicated photoX Photo Tools page
              window.location.href = "/photo-tools";
            }}
          >
            <div className="flex items-center gap-3 text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
              {t.icon}
              <span className="px-label transition-colors duration-300 group-hover:text-foreground">
                {t.label}
              </span>
              <span
                aria-hidden
                className="ml-auto inline-block text-[0.75rem] opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:opacity-100 md:ml-0"
              >
                →
              </span>
            </div>
            <p className="px-meta mt-2 max-w-[34ch] text-muted-foreground">{t.body}</p>
          </button>
        ))}
      </div>

      <div className="mt-10 md:mt-12">
        <a
          href="/photo-tools"
          className="px-meta px-underline inline-flex items-center gap-2 text-foreground/80 transition-colors duration-300 hover:text-foreground"
        >
          View all photo tools
          <span aria-hidden>→</span>
        </a>
      </div>
    </Shell>
  );
}
