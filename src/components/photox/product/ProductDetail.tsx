import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Shell, SectionHead } from "../Section";
import { ShopProductCard } from "../shop/ShopProductCard";
import { ProductReviews, RatingJump } from "./ProductReviews";
import { ProductUploadModal } from "./ProductUploadModal";
import { MainVisual, PrintFace, type ViewMode } from "./ProductVisual";
import { categoryLabel, closeUps, productInfo, relatedProducts } from "@/lib/product-detail";
import { sizeSteps, type ShopProduct } from "@/lib/shop-data";
import {
  materialName,
  orientedSizeLabel,
  unitPrice,
  useStore,
  type BagMaterial,
  type PrintOrientation,
} from "@/lib/store";

const views: { key: ViewMode; label: string }[] = [
  { key: "artwork", label: "Artwork" },
  { key: "detail", label: "Detail" },
  { key: "room", label: "In a room" },
];

function parsePhysicalSize(size: (typeof sizeSteps)[number]) {
  const match = size.label.match(/(\d+)\s*×\s*(\d+)/);
  if (!match) {
    return { width: size.inches * 1.5, height: size.inches };
  }
  const a = parseInt(match[1]!, 10);
  const b = parseInt(match[2]!, 10);
  return { width: Math.max(a, b), height: Math.min(a, b) };
}

function SizePrint({
  product,
  material,
  size,
  orientation,
}: {
  product: ShopProduct;
  material: BagMaterial;
  size: (typeof sizeSteps)[number];
  orientation: PrintOrientation;
}) {
  const { width, height } = parsePhysicalSize(size);
  const aspectRatio = orientation === "landscape" ? width / height : height / width;
  return (
    <div
      className={["relative w-full overflow-hidden bg-secondary shadow-sm", "px-gloss"].join(" ")}
      style={{ aspectRatio }}
    >
      <img
        src={product.image}
        alt={`${product.name} shown at ${size.label}`}
        loading="lazy"
        className="block h-full w-full object-cover"
      />
      <span aria-hidden className="px-edge" />
    </div>
  );
}

export function ProductDetail({ product }: { product: ShopProduct }) {
  const material: BagMaterial = "metal";
  const [sizeIndex, setSizeIndex] = useState(2);
  const [orientation, setOrientation] = useState<PrintOrientation>(
    product.orientation === "Portrait" ? "portrait" : "landscape",
  );
  const [view, setView] = useState<ViewMode>("artwork");
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mainCtaVisible, setMainCtaVisible] = useState<boolean | null>(null);
  const mainCtaRef = useRef<HTMLButtonElement>(null);
  const { toggleSaved, isSaved, hydrated } = useStore();

  useEffect(() => {
    setSizeIndex(2);
    setOrientation(product.orientation === "Portrait" ? "portrait" : "landscape");
    setView("artwork");
  }, [product.id, product.orientation]);

  useEffect(() => {
    const mainCta = mainCtaRef.current;
    const mobile = window.matchMedia("(max-width: 767px)");
    if (!mainCta) return;

    let observer: IntersectionObserver | undefined;
    const observe = () => {
      observer?.disconnect();

      if (!mobile.matches) {
        setMainCtaVisible(null);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          const ratio = entry?.intersectionRatio ?? 0;

          if (ratio >= 0.85) {
            setMainCtaVisible(true);
          } else if (ratio <= 0.7) {
            setMainCtaVisible(false);
          } else {
            setMainCtaVisible((visible) => visible ?? false);
          }
        },
        {
          threshold: [0, 0.7, 0.85],
        },
      );
      observer.observe(mainCta);
    };

    observe();
    mobile.addEventListener("change", observe);
    return () => {
      observer?.disconnect();
      mobile.removeEventListener("change", observe);
    };
  }, [product.id]);

  const size = sizeSteps[sizeIndex]!;
  const sizeLabel = orientedSizeLabel(sizeIndex, orientation);
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

        <div className="mt-5 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT — product visual */}
          <div className="lg:col-span-7">
            <MainVisual
              product={product}
              material={material}
              view={view}
              inches={size.inches}
              sizeLabel={sizeLabel}
              orientation={orientation}
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
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <p className="px-meta text-muted-foreground">{categoryLabel(product)}</p>
              <div className="mt-2 flex items-center justify-between gap-4">
                <h1 className="px-serif text-[2rem] leading-[1.05] md:text-[2.6rem]">
                  {product.name}
                </h1>
                <button
                  type="button"
                  onClick={() => toggleSaved(product.id)}
                  aria-label={
                    saved ? `Remove ${product.name} from saved artwork` : `Save ${product.name}`
                  }
                  aria-pressed={saved}
                  className="flex h-9 w-9 shrink-0 items-center justify-center text-foreground/75 transition-colors hover:text-foreground"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill={saved ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
                  </svg>
                </button>
              </div>
              <p className="px-meta mt-2 text-muted-foreground">
                {orientation === "landscape" ? "Landscape" : "Portrait"} · Metal Print
              </p>
              <RatingJump productId={product.id} />

              {/* Size */}
              <div className="px-rule mt-7 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="px-label text-muted-foreground">Choose your size</h2>
                  <div
                    className="-mr-2 flex items-center"
                    role="group"
                    aria-label="Print orientation"
                  >
                    {(
                      [
                        {
                          key: "landscape",
                          label: "Landscape orientation",
                          shape: "h-[15px] w-[22px]",
                        },
                        {
                          key: "portrait",
                          label: "Portrait orientation",
                          shape: "h-[22px] w-[15px]",
                        },
                      ] as const
                    ).map(({ key, label, shape }) => {
                      const active = orientation === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setOrientation(key)}
                          aria-label={label}
                          aria-pressed={active}
                          className="flex h-10 w-10 items-center justify-center outline-none transition-colors focus-visible:ring-1 focus-visible:ring-foreground/60"
                        >
                          <span
                            aria-hidden
                            className={`${shape} border transition-colors ${active ? "border-foreground" : "border-foreground/35 hover:border-foreground/65"}`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <ul className="mt-3 border-t border-hairline">
                  {sizeSteps.map((s, i) => {
                    const active = sizeIndex === i;
                    return (
                      <li key={s.label} className="border-b border-hairline">
                        <button
                          type="button"
                          onClick={() => {
                            setSizeIndex(i);
                            setView("room");
                          }}
                          aria-pressed={active}
                          className={[
                            "flex w-full items-baseline justify-between gap-6 py-[9px] transition-opacity duration-[420ms]",
                            active ? "opacity-100" : "opacity-50 hover:opacity-100",
                          ].join(" ")}
                        >
                          <span className="px-label">{orientedSizeLabel(i, orientation)}</span>
                          <span className="px-price">${unitPrice(material, i)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-6">
                <p className="px-label text-muted-foreground">
                  {materialName[material]} · {sizeLabel}
                </p>
                <p className="px-price">${price}</p>
              </div>

              <button
                ref={mainCtaRef}
                type="button"
                onClick={() => setUploadOpen(true)}
                className="px-label mt-5 flex h-[54px] w-full items-center justify-center border border-foreground text-center transition-colors duration-300 hover:bg-foreground hover:text-background"
              >
                Customize your print
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

      <ProductInformationSection
        product={product}
        openInfo={openInfo}
        onOpenInfoChange={setOpenInfo}
      />

      <ProductReviews product={product} />

      {/* ---------- See the difference in size ---------- */}
      <Shell className="pt-20 md:pt-28">
        <SectionHead
          title="See the difference in size"
          note="Compare every available format at a glance."
        />
        <div className="mt-10 rounded-sm bg-secondary/20 p-6 md:p-10">
          {/* Desktop */}
          <div
            className="hidden md:grid md:items-end gap-x-6 border-b border-hairline pb-6"
            style={{
              gridTemplateColumns: sizeSteps
                .map((s) => {
                  const { width } = parsePhysicalSize(s);
                  return `minmax(0, ${width}fr)`;
                })
                .join(" "),
            }}
          >
            {sizeSteps.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <SizePrint
                  product={product}
                  material={material}
                  size={s}
                  orientation={orientation}
                />
              </div>
            ))}
          </div>
          <div
            className="mt-5 hidden md:grid gap-x-6"
            style={{
              gridTemplateColumns: sizeSteps
                .map((s) => {
                  const { width } = parsePhysicalSize(s);
                  return `minmax(0, ${width}fr)`;
                })
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
                    {orientedSizeLabel(i, orientation)}
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
              const { width } = parsePhysicalSize(s);
              return (
                <div
                  key={s.label}
                  className="flex flex-shrink-0 flex-col items-center"
                  style={{ width: `${width * 7}px` }}
                >
                  <SizePrint
                    product={product}
                    material={material}
                    size={s}
                    orientation={orientation}
                  />
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
                      {orientedSizeLabel(i, orientation)}
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
      <div
        aria-hidden={mainCtaVisible !== false}
        className={`sticky bottom-0 z-30 border-t border-hairline bg-paper/95 backdrop-blur-sm transition-[opacity,transform] duration-[250ms] ease-in-out motion-reduce:transition-none md:hidden ${
          mainCtaVisible === false
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <span className="px-meta text-muted-foreground">
            {sizeLabel} · ${price}
          </span>
          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            tabIndex={mainCtaVisible === false ? 0 : -1}
            className="px-label border border-foreground px-5 py-3"
          >
            Customize
          </button>
        </div>
      </div>
      {uploadOpen ? (
        <ProductUploadModal
          product={product}
          material={material}
          sizeIndex={sizeIndex}
          sizeLabel={sizeLabel}
          price={price}
          onSizeChange={setSizeIndex}
          orientation={orientation}
          onClose={() => setUploadOpen(false)}
        />
      ) : null}
    </>
  );
}

function ProductInformationSection({
  product,
  openInfo,
  onOpenInfoChange,
}: {
  product: ShopProduct;
  openInfo: string | null;
  onOpenInfoChange: (title: string | null) => void;
}) {
  return (
    <Shell className="pt-16 md:pt-20">
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
              <dd className="px-label">Metal Print</dd>
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
                    onClick={() => onOpenInfoChange(open ? null : row.title)}
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
  );
}
