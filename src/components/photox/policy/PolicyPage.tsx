import type { ReactNode } from "react";
import { Shell } from "../Section";
import { SiteFooter } from "../SiteFooter";
import { SiteNav } from "../SiteNav";

export type PolicySection = {
  number: string;
  heading: string;
  children: ReactNode;
};

export function PolicyPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: PolicySection[];
}) {
  return (
    <div className="bg-background text-foreground">
      <SiteNav variant="light" />
      <main>
        <Shell
          label={title}
          className="pt-[calc(var(--site-header-height)+3.5rem)] pb-20 md:pt-[calc(var(--site-header-height)+5rem)] md:pb-28"
        >
          <article className="mx-auto max-w-[50rem]">
            <p className="px-label text-muted-foreground">Policies</p>
            <h1 className="px-serif mt-5 text-[3rem] leading-[1.02] md:text-[4.25rem]">{title}</h1>
            <p className="px-meta mt-5 text-muted-foreground">Last updated {updated}</p>
            <p className="mt-10 max-w-[46rem] text-[0.98rem] leading-[1.75] text-foreground/80">
              {intro}
            </p>

            <div className="mt-14">
              {sections.map((section) => (
                <section
                  key={section.heading}
                  className="border-t border-hairline py-8 first:border-t-0 first:pt-0"
                >
                  <p className="px-label text-muted-foreground">{section.number}</p>
                  <h2 className="px-label mt-2">{section.heading}</h2>
                  <div className="mt-4 max-w-[46rem] space-y-4 text-[0.98rem] leading-[1.75] text-foreground/80">
                    {section.children}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </Shell>
      </main>
      <SiteFooter />
    </div>
  );
}
