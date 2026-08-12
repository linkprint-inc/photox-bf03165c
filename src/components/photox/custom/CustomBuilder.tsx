import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import sizeRoom from "@/assets/size-room.jpg";
import { Shell } from "../Section";
import { sizes } from "@/lib/photox-data";
import { useStore, type BagMaterial } from "@/lib/store";
import {
  acceptedLabel,
  acceptedTypes,
  minPixelsFor,
  readImageFile,
  usePreparedImage,
} from "@/lib/prepared-image";

const WALL_INCHES = 108;

const materials: { id: BagMaterial; name: string; note: string; from: number }[] = [
  { id: "metal", name: "Metal Print", note: "Glossy · crisp · luminous", from: 79 },
  { id: "canvas", name: "Frameless Canvas", note: "Matte · textured · soft", from: 69 },
];

function price(material: BagMaterial, sizeIndex: number) {
  const base = sizes[sizeIndex]!.price;
  return material === "canvas" ? base - 10 : base;
}

export function CustomBuilder() {
  const { image, setImage } = usePreparedImage();
  const { addToBag } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [material, setMaterial] = useState<BagMaterial>("metal");
  const [sizeIndex, setSizeIndex] = useState(3);
  const [view, setView] = useState<"print" | "room">("print");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const size = sizes[sizeIndex]!;
  const total = price(material, sizeIndex);

  const tooSmall = useMemo(() => {
    if (!image) return false;
    return Math.max(image.width, image.height) < minPixelsFor(size.inches);
  }, [image, size.inches]);

  const load = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      setImage(await readImageFile(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  };

  const widthPct = (size.inches * 1.5 * 100) / WALL_INCHES;

  return (
    <Shell id="builder" label="Custom print builder" className="pb-20 md:pb-28">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        {/* Preview */}
        <div className="md:col-span-7">
          <div className="px-rule flex items-baseline justify-between gap-6 pt-6">
            <p className="px-label">Preview</p>
            {image ? (
              <div className="flex items-center gap-5">
                {(["print", "room"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    aria-pressed={view === v}
                    className={[
                      "px-label px-underline transition-opacity duration-300",
                      view === v ? "opacity-100" : "opacity-45 hover:opacity-100",
                    ].join(" ")}
                  >
                    {v === "print" ? "Print view" : "Room view"}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {!image ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                void load(e.dataTransfer.files?.[0]);
              }}
              className={[
                "mt-6 flex aspect-[4/3] w-full flex-col items-center justify-center border border-dashed px-8 text-center transition-colors duration-300",
                dragOver ? "border-foreground bg-secondary" : "border-hairline bg-secondary/40",
              ].join(" ")}
            >
              <p className="px-label text-muted-foreground">Step 01</p>
              <h3 className="px-serif mt-3 text-[1.7rem]">Upload your image</h3>
              <p className="px-meta mt-3 max-w-[34ch] text-muted-foreground">
                Drag and drop your file here, or choose it from your device. {acceptedLabel}.
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-label px-underline mt-7"
              >
                Choose image →
              </button>
              {error ? <p className="px-meta mt-4 text-destructive">{error}</p> : null}
            </div>
          ) : view === "print" ? (
            <div className="mt-6 flex aspect-[4/3] w-full items-center justify-center bg-secondary p-10 md:p-16">
              <div
                className={[
                  "relative max-h-full",
                  material === "metal" ? "px-gloss" : "px-weave",
                  "shadow-[0_18px_40px_-28px_rgba(0,0,0,0.75)]",
                ].join(" ")}
              >
                <img
                  src={image.dataUrl}
                  alt={`Your image shown as a ${material === "metal" ? "metal print" : "frameless canvas"} at ${size.label}`}
                  className="block max-h-[46vh] w-auto max-w-full object-contain"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      material === "metal"
                        ? "linear-gradient(104deg, transparent 30%, rgba(255,255,255,0.22) 46%, transparent 64%)"
                        : "none",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute inset-y-0 right-0 w-[3px]"
                  style={{
                    background:
                      material === "metal"
                        ? "linear-gradient(90deg, rgba(0,0,0,0.35), rgba(255,255,255,0.85))"
                        : "linear-gradient(90deg, rgba(0,0,0,0.30), rgba(0,0,0,0.10))",
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="relative mt-6 overflow-hidden bg-secondary">
              <img
                src={sizeRoom}
                alt="A fixed interior wall used as a reference for print scale"
                loading="lazy"
                className="block h-auto w-full"
              />
              <div
                className="absolute left-[42%] top-[18%] -translate-x-1/2 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.7)] transition-[width] duration-[560ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                style={{ width: `${widthPct}%` }}
              >
                <img
                  src={image.dataUrl}
                  alt={`Your image at ${size.label} on the reference wall`}
                  className="block w-full"
                  style={{ aspectRatio: "3 / 2", objectFit: "cover" }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      material === "metal"
                        ? "linear-gradient(104deg, transparent 32%, rgba(255,255,255,0.20) 46%, transparent 62%)"
                        : "none",
                  }}
                />
              </div>
            </div>
          )}

          {image ? (
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
              <p className="px-meta text-muted-foreground">
                {image.name} · {image.width} × {image.height} px
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-label px-underline text-muted-foreground"
              >
                Replace image →
              </button>
            </div>
          ) : null}

          <input
            ref={inputRef}
            type="file"
            accept={acceptedTypes}
            className="sr-only"
            onChange={(e) => void load(e.target.files?.[0] ?? undefined)}
          />
        </div>

        {/* Controls */}
        <div className="md:col-span-5">
          <div className={image ? "" : "opacity-45"}>
            <div className="px-rule pt-6">
              <p className="px-label text-muted-foreground">Step 02</p>
              <h3 className="px-label mt-2">Choose your surface</h3>
              <ul className="mt-4 border-t border-hairline">
                {materials.map((m) => (
                  <li key={m.id} className="border-b border-hairline">
                    <button
                      type="button"
                      disabled={!image}
                      onClick={() => setMaterial(m.id)}
                      aria-pressed={material === m.id}
                      className={[
                        "flex w-full items-baseline justify-between gap-6 py-4 text-left transition-opacity duration-300",
                        material === m.id ? "opacity-100" : "opacity-50 hover:opacity-100",
                      ].join(" ")}
                    >
                      <span>
                        <span className="px-label block">{m.name}</span>
                        <span className="px-meta mt-1 block text-muted-foreground">{m.note}</span>
                      </span>
                      <span className="px-price whitespace-nowrap">
                        <span className="px-label mr-1 opacity-70">From</span>${m.from}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <p className="px-label text-muted-foreground">Step 03</p>
              <h3 className="px-label mt-2">Choose your size</h3>
              <ul className="mt-4 border-t border-hairline">
                {sizes.map((s, i) => (
                  <li key={s.label} className="border-b border-hairline">
                    <button
                      type="button"
                      disabled={!image}
                      onClick={() => setSizeIndex(i)}
                      aria-pressed={sizeIndex === i}
                      className={[
                        "flex w-full items-baseline justify-between gap-6 py-3.5 text-left transition-opacity duration-300",
                        sizeIndex === i ? "opacity-100" : "opacity-50 hover:opacity-100",
                      ].join(" ")}
                    >
                      <span className="px-label">{s.label}</span>
                      <span className="px-price">${price(material, i)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <p className="px-label text-muted-foreground">Step 04</p>
              <h3 className="px-label mt-2">Prepare your image · optional</h3>
              <ul className="mt-4 border-t border-hairline">
                {[
                  { label: "Restore old photo", to: "/photo-tools", search: { tool: "restore" as const } },
                  { label: "Enhance resolution", to: "/photo-tools", search: { tool: "enhance" as const } },
                  { label: "Add text", to: "/photo-tools", search: { tool: "text" as const } },
                ].map((t) => (
                  <li key={t.label} className="border-b border-hairline">
                    <Link
                      to="/photo-tools"
                      search={t.search}
                      className="px-label px-underline block py-3.5"
                    >
                      {t.label} →
                    </Link>
                  </li>
                ))}
              </ul>

              {tooSmall ? (
                <div className="mt-6 border-l-2 border-foreground/40 pl-4">
                  <p className="px-meta">
                    This image may be too small for {size.label}. Its long edge is {Math.max(image!.width, image!.height)} px;
                    we suggest at least {minPixelsFor(size.inches)} px.
                  </p>
                  <Link
                    to="/photo-tools"
                    search={{ tool: "enhance" as const }}
                    className="px-label px-underline mt-3 inline-block"
                  >
                    Enhance resolution →
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          {/* Summary */}
          <div className="px-rule mt-12 pt-6">
            <p className="px-label text-muted-foreground">Your print</p>
            <p className="px-label mt-3">
              {material === "metal" ? "Metal Print" : "Frameless Canvas"}
            </p>
            <p className="px-meta mt-1 text-muted-foreground">{size.label}</p>
            <p className="px-meta text-muted-foreground">
              {image ? image.name : "No image uploaded yet"}
            </p>
            <p className="px-price mt-3 text-[1.05rem]">${total}</p>

            <button
              type="button"
              disabled={!image}
              onClick={() => {
                addToBag({ productId: "custom-print", material, sizeIndex, qty: 1 });
                setAdded(true);
              }}
              className="px-label mt-6 w-full border border-foreground py-4 text-center transition-colors duration-300 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to bag
            </button>
            {added ? (
              <p className="px-meta mt-3 text-muted-foreground">Added to your bag.</p>
            ) : null}
          </div>
        </div>
      </div>
    </Shell>
  );
}
