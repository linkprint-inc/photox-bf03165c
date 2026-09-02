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
  textColorValue,
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

const appliedLabel: Record<ToolId, string> = {
  restore: "Restored",
  enhance: "Enhanced",
  text: "Text added",
};

const icons: Record<ToolId, ReactNode> = {
  restore: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className="h-4 w-4"
    >
      <path d="M3 7c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 16l4-4 4 4 5-6 5 6" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  ),
  enhance: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className="h-4 w-4"
    >
      <path d="M12 3v18M3 12h18" />
      <path d="m21 21-3-3M3 21l3-3M21 3l-3 3M3 3l3 3" />
    </svg>
  ),
  text: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className="h-4 w-4"
    >
      <path d="M4 7V5h16v2M9 20h6M12 5v15" />
    </svg>
  ),
};

function StepLabel({
  n,
  name,
  state,
}: {
  n: string;
  name: string;
  state: "active" | "done" | "future";
}) {
  return (
    <p
      className={[
        "px-label",
        state === "active"
          ? "text-foreground"
          : state === "done"
            ? "text-muted-foreground"
            : "text-foreground/35",
      ].join(" ")}
    >
      <span className="mr-2 opacity-60">{n}</span>
      {name}
      {state === "done" ? <span className="ml-2 opacity-70">✓</span> : null}
    </p>
  );
}

function price(material: BagMaterial, sizeIndex: number) {
  return sizes[sizeIndex]!.price;
}

export type InitialPrintConfiguration = {
  material?: BagMaterial;
  sizeIndex?: number;
  startingPoint?: string;
};

export function CustomBuilder({
  initialTool,
  initialConfiguration,
  startInEditor = false,
}: {
  initialTool?: ToolId | undefined;
  initialConfiguration?: InitialPrintConfiguration;
  startInEditor?: boolean;
}) {
  const { image, setImage } = usePreparedImage();
  const { addToBag } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const startEditorRef = useRef(startInEditor);
  const material: BagMaterial = "metal";
  const [sizeIndex, setSizeIndex] = useState(initialConfiguration?.sizeIndex ?? 3);
  const [view, setView] = useState<"print" | "room">("print");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  // The accepted image is kept in shared state. Editing works on a separate draft until confirmed.
  const [draft, setDraft] = useState<PreparedImage | null>(image);
  const [editorOpen, setEditorOpen] = useState(false);
  const [pendingTool, setPendingTool] = useState<ToolId | null>(initialTool ?? null);
  const [editing, setEditing] = useState<ToolId | null>(null);
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

  useEffect(() => {
    if (!startEditorRef.current || !image) return;
    setDraft(image);
    setEditorOpen(true);
    startEditorRef.current = false;
  }, [image]);

  // Tool links open the editor as soon as there is an image to prepare.
  useEffect(() => {
    if (image && pendingTool && !editorOpen) {
      setDraft(image);
      setEditorOpen(true);
      return;
    }
    if (draft && pendingTool && editorOpen && !editing) {
      openTool(pendingTool);
      setPendingTool(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, draft, pendingTool, editorOpen]);

  function openTool(tool: ToolId) {
    const source = draft ?? image;
    if (!source) {
      setPendingTool(tool);
      return;
    }
    setDraft(source);
    setEditorOpen(true);
    setOriginal(source);
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
      setDraft(next);
      setApplied([]);
      setEditorOpen(true);
      setEditing(null);
      setResult(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  };

  const run = async (config = cfg) => {
    if (!original || !editing) return;
    setBusy(true);
    setToolError(null);
    try {
      setResult(await runTool(editing, original, config));
    } catch (e) {
      setToolError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const applyResult = () => {
    if (!result || !editing) return;
    setDraft(result);
    setApplied((a) => (a.includes(editing) ? a : [...a, editing]));
    setEditing(null);
    setResult(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setResult(null);
    setToolError(null);
  };

  const finishEditor = () => {
    if (!draft) return;
    setImage(draft);
    setEditorOpen(false);
    setEditing(null);
    setResult(null);
    setView("print");
  };

  const cancelEditor = () => {
    setDraft(image);
    setEditorOpen(false);
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
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Preview */}
        <div className="lg:col-span-7">
          <div className="px-rule flex items-baseline justify-between gap-6 pt-6">
            <p className="px-label">{editing ? toolMeta[editing].heading : "Preview"}</p>
            {image && !editorOpen ? (
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

          {editorOpen && draft ? (
            editing && result && editing !== "text" ? (
              <div className="mt-6">
                <BeforeAfter before={original!.dataUrl} after={result.dataUrl} image={original!} />
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
                      fontWeight: cfg.fontWeight,
                      fontStyle: cfg.fontStyle,
                      letterSpacing: cfg.letterSpacing,
                      lineHeight: cfg.lineHeight,
                      textTransform: cfg.textTransform,
                      fontSize: `${cfg.size / 1.8}px`,
                      color: textColorValue(cfg.color),
                    }}
                  >
                    {cfg.text}
                  </span>
                ) : null}
              </div>
            ) : (
              <div className="mt-6 flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-secondary p-6 md:p-10">
                <img
                  src={draft.dataUrl}
                  alt="Your image ready for preparation"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )
          ) : !image ? (
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
              <StepLabel n="01" name="Image" state="active" />
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
          ) : view === "print" ? (
            <div className="mt-6 flex aspect-[4/3] w-full items-center justify-center bg-secondary p-10 md:p-16">
              <div
                className={[
                  "relative max-h-full",
                  "px-gloss",
                  "shadow-[0_18px_40px_-28px_rgba(0,0,0,0.75)]",
                ].join(" ")}
              >
                <img
                  src={image.dataUrl}
                  alt={`Your image shown as a metal print at ${size.label}`}
                  className="block max-h-[46vh] w-auto max-w-full object-contain"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(104deg, transparent 30%, rgba(255,255,255,0.22) 46%, transparent 64%)",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute inset-y-0 right-0 w-[3px]"
                  style={{
                    background: "linear-gradient(90deg, rgba(0,0,0,0.35), rgba(255,255,255,0.85))",
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
                      "linear-gradient(104deg, transparent 32%, rgba(255,255,255,0.20) 46%, transparent 62%)",
                  }}
                />
              </div>
            </div>
          )}

          {image && !editorOpen ? (
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
              <p className="px-meta text-muted-foreground">
                {image.name} · {image.width} × {image.height} px
              </p>
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => {
                    setDraft(image);
                    setEditorOpen(true);
                  }}
                  className="px-label px-underline text-muted-foreground"
                >
                  Edit image →
                </button>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-label px-underline text-muted-foreground"
                >
                  Replace image →
                </button>
              </div>
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
        <div className="lg:col-span-5 lg:self-start">
          <div className="lg:sticky lg:top-24">
            {editorOpen && draft ? (
              editing && original ? (
                <CustomToolPanel
                  tool={editing}
                  original={original}
                  result={result}
                  cfg={cfg}
                  setCfg={setCfg}
                  busy={busy}
                  error={toolError}
                  onRun={() => void run()}
                  onGenerateText={(config) => {
                    setCfg(config);
                    void run(config);
                  }}
                  onApply={applyResult}
                  onCancel={cancelEdit}
                  selectedSizeLabel={size.label}
                  selectedInches={size.inches}
                  requiresTextResult
                />
              ) : (
                <div className="px-rule pt-6">
                  <StepLabel n="02" name="Edit" state="active" />
                  <h3 className="px-label mt-2">Prepare your image</h3>
                  <p className="px-meta mt-2 max-w-[38ch] text-muted-foreground">
                    Restore, enhance or add text before choosing the print details. You can also
                    continue with the image as it is.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 border-t border-hairline pt-5">
                    {(["restore", "enhance", "text"] as const).map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => openTool(tool)}
                        className="px-label inline-flex min-h-11 items-center gap-2 border border-hairline px-4 transition-colors hover:border-foreground"
                      >
                        <span className="text-muted-foreground">{icons[tool]}</span>
                        {toolMeta[tool].heading}
                        {applied.includes(tool) ? <span aria-label="Applied">✓</span> : null}
                      </button>
                    ))}
                  </div>
                  {applied.length ? (
                    <p className="px-meta mt-4 text-muted-foreground">
                      {applied.map((tool) => `${appliedLabel[tool]} ✓`).join(" · ")}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={finishEditor}
                    className="px-label mt-8 w-full border border-foreground py-4 text-center transition-colors hover:bg-foreground hover:text-background"
                  >
                    Use this image →
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditor}
                    className="px-label px-underline mt-5 inline-block text-muted-foreground"
                  >
                    Cancel
                  </button>
                </div>
              )
            ) : (
              <>
                <div className={image ? "" : "opacity-70"}>
                  <div className="px-rule pt-6">
                    <StepLabel n="03" name="Size" state={image ? "active" : "future"} />
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
                </div>

                {/* Summary */}
                <div className="px-rule mt-12 pt-6">
                  <StepLabel
                    n="04"
                    name="Preview · Your print"
                    state={image ? "active" : "future"}
                  />
                  <p className="px-label mt-3">Metal Print</p>
                  <p className="px-meta mt-1 text-muted-foreground">{size.label}</p>
                  <p className="px-meta text-muted-foreground">
                    {image ? image.name : "No image uploaded yet"}
                  </p>
                  {initialConfiguration?.startingPoint ? (
                    <p className="px-meta text-muted-foreground">
                      Starting point: {initialConfiguration.startingPoint}
                    </p>
                  ) : null}
                  <p className="px-price mt-3 text-[1.05rem]">${total}</p>

                  {image ? (
                    <>
                      <StepLabel n="05" name="Add to bag" state="active" />
                      <button
                        type="button"
                        onClick={() => {
                          addToBag({ productId: "custom-print", material, sizeIndex, qty: 1 });
                          setAdded(true);
                        }}
                        className="px-label mt-6 w-full border border-foreground py-4 text-center transition-colors duration-300 hover:bg-foreground hover:text-background"
                      >
                        Add to bag
                      </button>
                      {added ? (
                        <p className="px-meta mt-3 text-muted-foreground">Added to your bag.</p>
                      ) : null}
                    </>
                  ) : (
                    <p className="px-meta mt-4 text-muted-foreground">
                      Finish image preparation to continue.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
