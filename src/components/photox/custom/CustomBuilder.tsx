import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import sizeRoom from "@/assets/size-room.jpg";
import { Shell } from "../Section";
import { BeforeAfter } from "./BeforeAfter";
import { CustomToolPanel } from "./CustomToolPanel";
import { sizes } from "@/lib/photox-data";
import { useStore, type BagMaterial } from "@/lib/store";
import {
  defaultTextConfig,
  recommendedInches,
  runTool,
  toolMeta,
  type TextConfig,
  type ToolId,
} from "@/lib/image-tools";
import {
  acceptedLabel,
  acceptedTypes,
  readImageFile,
  usePreparedImage,
  type PreparedImage,
} from "@/lib/prepared-image";

const WALL_INCHES = 108;

const materials: { id: BagMaterial; name: string; note: string; from: number }[] = [
  { id: "metal", name: "Metal Print", note: "Glossy · crisp · luminous", from: 79 },
  { id: "canvas", name: "Frameless Canvas", note: "Matte · textured · soft", from: 69 },
];

const appliedLabel: Record<ToolId, string> = {
  restore: "Restored",
  enhance: "Enhanced",
  text: "Text added",
};

const icons: Record<ToolId, ReactNode> = {
  restore: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-4 w-4">
      <path d="M3 7c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 16l4-4 4 4 5-6 5 6" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  ),
  enhance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-4 w-4">
      <path d="M12 3v18M3 12h18" />
      <path d="m21 21-3-3M3 21l3-3M21 3l-3 3M3 3l3 3" />
    </svg>
  ),
  text: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-4 w-4">
      <path d="M4 7V5h16v2M9 20h6M12 5v15" />
    </svg>
  ),
};

function price(material: BagMaterial, sizeIndex: number) {
  const base = sizes[sizeIndex]!.price;
  return material === "canvas" ? base - 10 : base;
}

export function CustomBuilder({ initialTool }: { initialTool?: ToolId | undefined }) {
  const { image, setImage } = usePreparedImage();
  const { addToBag } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [material, setMaterial] = useState<BagMaterial>("metal");
  const [sizeIndex, setSizeIndex] = useState(3);
  const [view, setView] = useState<"print" | "room">("print");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  // Editing state
  const [pendingTool, setPendingTool] = useState<ToolId | null>(initialTool ?? null);
  const [editing, setEditing] = useState<ToolId | null>(image && initialTool ? initialTool : null);
  const [original, setOriginal] = useState<PreparedImage | null>(null);
  const [result, setResult] = useState<PreparedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [toolError, setToolError] = useState<string | null>(null);
  const [applied, setApplied] = useState<ToolId[]>([]);
  const [cfg, setCfg] = useState<TextConfig>(defaultTextConfig);

  const size = sizes[sizeIndex]!;
  const total = price(material, sizeIndex);

  const tooSmall = useMemo(() => {
    if (!image) return false;
    return size.inches > recommendedInches(image);
  }, [image, size.inches]);

  // A pending tool intent (from a link) opens as soon as an image exists.
  useEffect(() => {
    if (image && pendingTool && !editing) {
      openTool(pendingTool);
      setPendingTool(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, pendingTool]);

  function openTool(tool: ToolId) {
    if (!image) {
      setPendingTool(tool);
      return;
    }
    setOriginal(image);
    setResult(null);
    setToolError(null);
    setCfg({ ...defaultTextConfig });
    setEditing(tool);
    setView("print");
  }

  const load = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      const next = await readImageFile(file);
      setImage(next);
      setApplied([]);
      setEditing(null);
      setResult(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  };

  const run = async () => {
    if (!original || !editing) return;
    setBusy(true);
    setToolError(null);
    try {
      setResult(await runTool(editing, original, cfg));
    } catch (e) {
      setToolError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const applyResult = () => {
    if (!result || !editing) return;
    setImage(result);
    setApplied((a) => (a.includes(editing) ? a : [...a, editing]));
    setEditing(null);
    setResult(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setResult(null);
    setToolError(null);
  };

  const widthPct = (size.inches * 1.5 * 100) / WALL_INCHES;

  // Dragging the live text overlay vertically.
  const dragText = (clientY: number) => {
    const el = previewRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCfg({ ...cfg, y: Math.max(8, Math.min(94, ((clientY - r.top) / r.height) * 100)) });
  };

  return (
    <Shell id="builder" label="Custom print builder" className="pb-20 md:pb-28">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        {/* Preview */}
        <div className="md:col-span-7">
          <div className="px-rule flex items-baseline justify-between gap-6 pt-6">
            <p className="px-label">{editing ? toolMeta[editing].heading : "Preview"}</p>
            {image && !editing ? (
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
              <p className="px-label text-muted-foreground">Step 01 — Image</p>
              <h3 className="px-serif mt-3 text-[1.7rem]">Upload your image</h3>
              <p className="px-meta mt-3 max-w-[34ch] text-muted-foreground">
                {pendingTool
                  ? `Upload an image to ${toolMeta[pendingTool].heading.toLowerCase()}. ${acceptedLabel}.`
                  : `Drag and drop your file here, or choose it from your device. ${acceptedLabel}.`}
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
          ) : editing && result ? (
            <div className="mt-6">
              <BeforeAfter before={original!.dataUrl} after={result.dataUrl} />
            </div>
          ) : editing ? (
            <div
              ref={previewRef}
              className="relative mt-6 flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-secondary"
            >
              <img
                src={original!.dataUrl}
                alt="Your uploaded image"
                className="max-h-full max-w-full object-contain"
              />
              {editing === "text" && cfg.text ? (
                <span
                  onPointerDown={(e) => {
                    (e.target as HTMLElement).setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if (e.buttons === 1) dragText(e.clientY);
                  }}
                  className="absolute w-full cursor-ns-resize px-[6%]"
                  style={{
                    top: `${cfg.y}%`,
                    transform: "translateY(-50%)",
                    textAlign: cfg.align,
                    fontFamily: cfg.font,
                    fontSize: `${cfg.size / 2.6}px`,
                    color: cfg.color === "light" ? "#fff" : "#141414",
                  }}
                >
                  {cfg.text}
                </span>
              ) : null}
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
        <div className="md:col-span-5 md:self-start">
          {editing && original ? (
            <CustomToolPanel
              tool={editing}
              original={original}
              result={result}
              cfg={cfg}
              setCfg={setCfg}
              busy={busy}
              error={toolError}
              onRun={() => void run()}
              onApply={applyResult}
              onCancel={cancelEdit}
              selectedSizeLabel={size.label}
              selectedInches={size.inches}
            />
          ) : (
            <>
              <div className={image ? "" : "opacity-45"}>
                <div className="px-rule pt-6">
                  <p className="px-label text-muted-foreground">Step 02 — Surface</p>
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
                            <span className="px-meta mt-1 block text-muted-foreground">
                              {m.note}
                            </span>
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
                  <p className="px-label text-muted-foreground">Step 03 — Size</p>
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

                  {image && tooSmall ? (
                    <div className="mt-5 border-l-2 border-foreground/40 pl-4">
                      <p className="px-meta">
                        This image may not have enough resolution for {size.label}.
                      </p>
                      <button
                        type="button"
                        onClick={() => openTool("enhance")}
                        className="px-label px-underline mt-2 inline-block"
                      >
                        Enhance image →
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="mt-10">
                  <p className="px-label text-muted-foreground">Step 04 — Edit</p>
                  <h3 className="px-label mt-2">Edit your image</h3>
                  <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-hairline pt-4">
                    {(["restore", "enhance", "text"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        disabled={!image}
                        onClick={() => openTool(t)}
                        className="px-label group inline-flex items-center gap-2 transition-opacity duration-300 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-100"
                      >
                        <span className="text-muted-foreground transition-transform duration-300 group-hover:-translate-y-[2px]">
                          {icons[t]}
                        </span>
                        <span className="px-underline">{toolMeta[t].label}</span>
                        {applied.includes(t) ? (
                          <span className="px-meta text-muted-foreground">✓</span>
                        ) : null}
                      </button>
                    ))}
                  </div>

                  {!image ? (
                    <p className="px-meta mt-3 text-muted-foreground">Upload an image to edit</p>
                  ) : applied.length ? (
                    <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                      <p className="px-meta text-muted-foreground">
                        {applied.map((t) => `${appliedLabel[t]} ✓`).join(" · ")}
                      </p>
                      <button
                        type="button"
                        onClick={() => openTool(applied[applied.length - 1]!)}
                        className="px-label px-underline"
                      >
                        Edit again →
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Summary */}
              <div className="px-rule mt-12 pt-6">
                <p className="px-label text-muted-foreground">Step 05 — Preview · Step 06 — Bag</p>
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
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
