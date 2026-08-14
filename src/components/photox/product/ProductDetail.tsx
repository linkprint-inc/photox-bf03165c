import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Shell, SectionHead } from "../Section";
import { ShopProductCard } from "../shop/ShopProductCard";
import { MainVisual, PrintFace, type ViewMode } from "./ProductVisual";
import {
  categoryLabel,
  closeUps,
  fromPrice,
  materialBlurb,
  materialsFor,
  productInfo,
  relatedProducts,
} from "@/lib/product-detail";
import { sizeSteps, type ShopProduct } from "@/lib/shop-data";
import { materialName, unitPrice, useStore, type BagMaterial } from "@/lib/store";

const views: { key: ViewMode; label: string }[] = [
  { key: "artwork", label: "Artwork" },
  { key: "detail", label: "Detail" },
  { key: "room", label: "In a room" },
];

function parseSize(size: (typeof sizeSteps)[number]) {
  const match = size.label.match(/(\d+)\s*×\s*(\d+)/);
  const width = match ? parseInt(match[1]!, 10) : size.inches;
  const height = match ? parseInt(match[2]!, 10) : Math.round(size.inches * 1.5);
  return { width, height };
}

function SizePrint({
  product,
  material,
  size,
}: {
  product: ShopProduct;
  material: BagMaterial;
  size: (typeof sizeSteps)[number];
}) {
  const isMetal = material === "metal";
  const { width, height } = parseSize(size);
  return (
    <div
      className={[
        "relative w-full overflow-hidden bg-secondary shadow-sm",
        isMetal ? "px-gloss" : "px-weave",
      ].join(" ")}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      <img
        src={product.image}
        alt={`${product.name} shown at ${size.label}`}
        loading="lazy"
        className="block h-full w-full object-cover"
      />
      <span aria-hidden className={isMetal ? "px-edge" : "px-canvas-edge"} />
    </div>
  );
}

export function ProductDetail({ product }: { product: ShopProduct }) {
  const materials = useMemo(() => materialsFor(product), [product]);
  const [material, setMaterial] = useState<BagMaterial>(materials[0]!);
  const [sizeIndex, setSizeIndex] = useState(2);
  const [view, setView] = useState<ViewMode>("artwork");
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const { addToBag, toggleSaved, isSaved, hydrated } = useStore();

  useEffect(() => {
    setMaterial(materials[0]!);
    setSizeIndex(2);
    setView("artwork");
  }, [product.id, materials]);

  const size = sizeSteps[sizeIndex]!;
  const price = unitPrice(material, sizeIndex);
  const saved = hydrated && isSaved(product.id);
  const related = useMemo(() => relatedProducts(product), [product]);


  return (
    <>
      {/* ---------- First screen: product + purchase ---------- */}
      <Shell className="pt-[calc(var(--site-header-height)+1.5rem)]">
        <nav className="px-meta text-muted-foreground">
          <Link to="/shop" className="px-underline">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="mt-5 grid gap-10 md:grid-cols-12 md:gap-12">
          {/* LEFT — product visual */}
          <div className="md:col-span-7 lg:col-span-7">
            <MainVisual
              product={product}
              material={material}
              view={view}
              inches={size.inches}
              sizeLabel={size.label}
            />

            <ul className="mt-4 flex gap-6">
              {views.map((v) => (
                <li key={v.key}>
                  <button
                    type="button"
                    onClick={() => setView(v.key)}
                    aria-pressed={view === v.key}
                    className={[
                      "px-label px-underline transition-opacity duration-[420ms]",
                      view === v.key
                        ? "opacity-100 after:scale-x-100"
                        : "opacity-45 hover:opacity-100",
                    ].join(" ")}
                  >
                    {v.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — purchase configuration */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-24">
              <p className="px-meta text-muted-foreground">{categoryLabel(product)}</p>
              <h1 className="px-serif mt-2 text-[2rem] leading-[1.05] md:text-[2.6rem]">
                {product.name}
              </h1>
              <p className="px-meta mt-3 text-muted-foreground">
                {product.orientation} · {materials.map((m) => materialName[m]).join(" / ")}
              </p>

              {/* Surface */}
              <div className="px-rule mt-8 pt-6">
                <h2 className="px-label text-muted-foreground">Choose your surface</h2>
                <ul className="mt-4">
                  {materials.map((m) => {
                    const active = material === m;
                    return (
                      <li key={m} className="border-b border-hairline">
                        <button
                          type="button"
                          onClick={() => setMaterial(m)}
                          aria-pressed={active}
                          className="flex w-full items-baseline justify-between gap-6 py-3 text-left transition-opacity duration-[420ms]"
                        >
                          <span className={active ? "opacity-100" : "opacity-50 hover:opacity-100"}>
                            <span
                              className={[
                                "px-label px-underline block",
                                active ? "after:scale-x-100" : "",
                              ].join(" ")}
                            >
                              {materialName[m]}
                            </span>
                            <span className="px-meta mt-1 block text-muted-foreground">
                              {materialBlurb[m]}
                            </span>
                          </span>
                          <span
                            className={[
                              "px-price whitespace-nowrap",
                              active ? "opacity-100" : "opacity-50",
                            ].join(" ")}
                          >
                            <span className="px-label mr-1 opacity-70">From</span>${fromPrice(m)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Size */}
              <div className="mt-8">
                <h2 className="px-label text-muted-foreground">Choose your size</h2>
                <ul className="mt-4 border-t border-hairline">
                  {sizeSteps.map((s, i) => {
                    const active = sizeIndex === i;
                    return (
                      <li key={s.label} className="border-b border-hairline">
                        <button
                          type="button"
                          onClick={() => setSizeIndex(i)}
                          aria-pressed={active}
                          className={[
                            "flex w-full items-baseline justify-between gap-6 py-3 transition-opacity duration-[420ms]",
                            active ? "opacity-100" : "opacity-50 hover:opacity-100",
                          ].join(" ")}
                        >
                          <span className="px-label">{s.label}</span>
                          <span className="px-price">${unitPrice(material, i)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Selection */}
              <div className="mt-8">
                <h2 className="px-label text-muted-foreground">Your selection</h2>
                <p className="px-label mt-3">{product.name}</p>
                <p className="px-meta mt-1 text-muted-foreground">{materialName[material]}</p>
                <p className="px-meta text-muted-foreground">{size.label}</p>
                <p className="px-price mt-2">${price}</p>
              </div>

              <button
                type="button"
                onClick={() => addToBag({ productId: product.id, material, sizeIndex, qty: 1 })}
                className="px-label mt-6 w-full border border-foreground py-4 text-center transition-colors duration-300 hover:bg-foreground hover:text-background"
              >
                Add to bag
              </button>

              <button
                type="button"
                onClick={() => toggleSaved(product.id)}
                aria-pressed={saved}
                className="px-label mt-4 flex items-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg
                  className="mr-2"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill={saved ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
                </svg>
                {saved ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </Shell>

      {/* ---------- Product image sequence ---------- */}
      <Shell className="pt-20 md:pt-28">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              n: "01",
              label: "Front",
              node: <PrintFace product={product} material={material} className="aspect-square" />,
            },
            {
              n: "02",
              label: "Surface / Edge",
              node: (
                <div className="aspect-square overflow-hidden bg-secondary">
                  <img
                    src={closeUps[material][1]!.image}
                    alt={closeUps[material][1]!.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ),
            },
            {
              n: "03",
              label: "In a room",
              node: (
                <div className="aspect-square overflow-hidden bg-secondary">
                  <img
                    src={product.room}
                    alt={`${product.name} installed in an interior`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ),
            },
          ].map((item) => (
            <figure key={item.n}>
              {item.node}
              <figcaption className="mt-3 flex items-baseline gap-3">
                <span className="px-meta text-muted-foreground">{item.n}</span>
                <span className="px-label">{item.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Shell>

      {/* ---------- See the difference in size ---------- */}
      <Shell className="pt-20 md:pt-28">
        <SectionHead
          title="See the difference in size"
          note="Compare every available format at a glance."
        />
        <div className="mt-10">
          {/* Desktop */}
          <div
            className="hidden md:grid md:items-end gap-x-8 border-b border-hairline pb-8"
            style={{
              gridTemplateColumns: sizeSteps
                .map((s) => `minmax(0, ${s.inches}fr)`)
                .join(" "),
            }}
          >
            {sizeSteps.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <SizePrint product={product} material={material} size={s} />
              </div>
            ))}
          </div>
          <div
            className="mt-5 hidden md:grid gap-x-8"
            style={{
              gridTemplateColumns: sizeSteps
                .map((s) => `minmax(0, ${s.inches}fr)`)
                .join(" "),
            }}
          >
            {sizeSteps.map((s, i) => {
              const selected = sizeIndex === i;
              return (
                <div key={`${s.label}-label`} className="text-center">
                  <span
                    className={[
                      "px-label relative inline-block",
                      selected ? "text-foreground" : "text-muted-foreground",
                      selected
                        ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-foreground"
                        : "",
                    ].join(" ")}
                  >
                    {s.label}
                  </span>
                  <p
                    className={[
                      "px-price mt-1",
                      selected ? "text-foreground" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    ${unitPrice(material, i)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-end gap-6 overflow-x-auto border-b border-hairline pb-6">
            {sizeSteps.map((s, i) => {
              const selected = sizeIndex === i;
              return (
                <div
                  key={s.label}
                  className="flex flex-shrink-0 flex-col items-center"
                  style={{ width: `${s.inches * 9}px` }}}
                >
                  <SizePrint product={product} material={material} size={s} />
                  <div className="mt-4 text-center">
                    <span
                      className={[
                        "px-label relative inline-block",
                        selected ? "text-foreground" : "text-muted-foreground",
                        selected
                          ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-foreground"
                          : "",
                      ].join(" ")}
                    >
                      {s.label}
                    </span>
                    <p
                      className={[
                        "px-price mt-1",
                        selected ? "text-foreground" : "text-muted-foreground",
                      ].join(" ")}
                    >
                      ${unitPrice(material, i)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Shell>

      {/* ---------- Material up close ---------- */}
      <Shell className="pt-20 md:pt-28">
        <SectionHead title={`${materialName[material]}, up close`} />
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {closeUps[material].map((c) => (
            <figure key={c.title}>
              <div className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={c.image}
                  alt={c.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3">
                <span className="px-label block">{c.title}</span>
                <span className="px-meta text-muted-foreground">{c.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Shell>

      {/* ---------- About the work + information ---------- */}
      <Shell className="pt-20 md:pt-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="px-label text-muted-foreground">About the work</h2>
            <dl className="mt-6 border-t border-hairline">
              <div className="flex justify-between gap-6 border-b border-hairline py-3">
                <dt className="px-meta text-muted-foreground">Title</dt>
                <dd className="px-label">{product.name}</dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-hairline py-3">
                <dt className="px-meta text-muted-foreground">Category</dt>
                <dd className="px-label">{categoryLabel(product)}</dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-hairline py-3">
                <dt className="px-meta text-muted-foreground">Orientation</dt>
                <dd className="px-label">{product.orientation}</dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-hairline py-3">
                <dt className="px-meta text-muted-foreground">Materials</dt>
                <dd className="px-label">{materials.map((m) => materialName[m]).join(" / ")}</dd>
              </div>
            </dl>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <h2 className="px-label text-muted-foreground">Product information</h2>
            <ul className="mt-6 border-t border-hairline">
              {productInfo.map((row) => {
                const open = openInfo === row.title;
                return (
                  <li key={row.title} className="border-b border-hairline">
                    <button
                      type="button"
                      onClick={() => setOpenInfo(open ? null : row.title)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-6 py-4 text-left"
                    >
                      <span className="px-label">{row.title}</span>
                      <span
                        aria-hidden
                        className={[
                          "text-lg leading-none transition-transform duration-300",
                          open ? "rotate-45" : "",
                        ].join(" ")}
                      >
                        +
                      </span>
                    </button>
                    {open ? (
                      <p className="px-meta max-w-prose pb-5 text-muted-foreground">{row.body}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Shell>

      {/* ---------- You may also like ---------- */}
      <Shell className="pt-20 pb-28 md:pt-28 md:pb-36">
        <SectionHead title="You may also like" />
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-8">
          {related.map((r) => (
            <ShopProductCard key={r.id} product={r} view="grid" href={`/products/${r.id}`} />
          ))}
        </div>
      </Shell>

      {/* ---------- Mobile sticky commerce bar ---------- */}
      <div className="sticky bottom-0 z-30 border-t border-hairline bg-paper/95 backdrop-blur-sm md:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-3">
          <span className="px-meta text-muted-foreground">
            {size.label} · ${price}
          </span>
          <button
            type="button"
            onClick={() => addToBag({ productId: product.id, material, sizeIndex, qty: 1 })}
            className="px-label border border-foreground px-5 py-3"
          >
            Add to bag
          </button>
        </div>
      </div>
    </>
  );
}
