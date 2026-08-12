import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { Shell, SectionHead } from "@/components/photox/Section";
import { ToolWorkspace, tools, type ToolId } from "@/components/photox/tools/ToolWorkspace";

const title = "Photo Tools — Prepare Your Image for Print | photoX";
const description =
  "Three simple tools for getting your image ready before it goes on the wall: restore an old photo, enhance resolution for larger prints, and add text.";

const ids: ToolId[] = ["restore", "enhance", "text"];

export const Route = createFileRoute("/photo-tools")({
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
  validateSearch: (search: Record<string, unknown>): { tool?: ToolId } =>
    ids.includes(search["tool"] as ToolId) ? { tool: search["tool"] as ToolId } : {},
  component: PhotoToolsPage,
});

const help = [
  {
    q: "When should I restore a photo?",
    a: "Use restore when a scan or older print looks flat, faded or slightly discoloured. It recovers contrast, colour and depth so the image holds up at print size.",
  },
  {
    q: "How large can I print my image?",
    a: "As a guide, allow about 150 pixels per printed inch. A 2400 px long edge is comfortable up to 16 × 24\". The custom print builder compares your file with the size you select and flags anything that looks small.",
  },
  {
    q: "Will adding text change my original file?",
    a: "No. Every tool works on a copy inside your browser. Your original file on your device is never modified, and you can download the prepared version or carry it straight into a custom print.",
  },
];

function PhotoToolsPage() {
  const { tool } = Route.useSearch();
  const navigate = useNavigate();
  const active: ToolId = tool ?? "restore";
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-background text-foreground">
      <SiteNav variant="light" />
      <main>
        <Shell label="Photo tools" className="pt-[132px] pb-10 md:pt-[148px] md:pb-12">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="px-label text-muted-foreground">Photo Tools</p>
              <h1 className="px-serif mt-4 text-[2.2rem] leading-[1.08] md:text-[3rem]">
                Prepare your image
                <br />
                for print.
              </h1>
            </div>
            <p className="px-meta max-w-[40ch] text-muted-foreground md:col-span-5">
              Three simple tools for getting your image ready before it goes on the wall.
            </p>
          </div>

          <nav aria-label="Photo tools" className="px-rule mt-10 pt-5">
            <ul className="flex flex-wrap gap-x-9 gap-y-3">
              {tools.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => void navigate({ to: "/photo-tools", search: { tool: t.id } })}
                    aria-current={active === t.id ? "page" : undefined}
                    className={[
                      "px-label px-underline transition-opacity duration-300",
                      active === t.id ? "opacity-100" : "opacity-45 hover:opacity-100",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </Shell>

        <ToolWorkspace key={active} tool={active} />

        <Shell label="Photo tools help" className="pb-24 md:pb-32">
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
      </main>
      <SiteFooter />
    </div>
  );
}
