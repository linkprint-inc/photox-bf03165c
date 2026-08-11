import type { ReactNode } from "react";

/** Shared page container — one outer margin + max width for the whole site. */
export function Shell({
  children,
  className = "",
  id,
  label,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  label?: string;
}) {
  return (
    <section id={id} aria-label={label} className={className}>
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">{children}</div>
    </section>
  );
}

/** Section heading aligned to the main content grid, above a hairline rule. */
export function SectionHead({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children?: ReactNode;
}) {
  return (
    <div className="px-rule grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-3 pt-6 md:flex md:flex-wrap md:justify-between">
      <h2 className="px-label min-w-0">{title}</h2>
      {note ? <p className="px-meta text-muted-foreground">{note}</p> : null}
      {children}
    </div>
  );
}

/** Consistent product metadata block: name / material / size / price. */
export function ProductMeta({
  name,
  material,
  size,
  price,
  from = false,
  align = "left",
}: {
  name: string;
  material: string;
  size: string;
  price: number;
  from?: boolean;
  align?: "left";
}) {
  return (
    <div className={align === "left" ? "mt-4" : "mt-4"}>
      <h3 className="px-label">{name}</h3>
      <p className="px-meta mt-1 text-muted-foreground">{material}</p>
      <p className="px-meta text-muted-foreground">{size}</p>
      <p className="px-price mt-2">
        {from ? <span className="px-label mr-1 opacity-70">From</span> : null}${price}
      </p>
    </div>
  );
}
