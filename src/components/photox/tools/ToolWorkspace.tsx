import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Shell } from "../Section";
import {
  acceptedLabel,
  acceptedTypes,
  readImageFile,
  usePreparedImage,
  type PreparedImage,
} from "@/lib/prepared-image";

export type ToolId = "restore" | "enhance" | "text";

const tools: { id: ToolId; label: string; heading: string; body: string }[] = [
  {
    id: "restore",
    label: "Restore Old Photo",
    heading: "Restore old photo",
    body: "Repair fading, flatness and age-related colour shift before printing.",
  },
  {
    id: "enhance",
    label: "Enhance Resolution",
    heading: "Enhance resolution",
    body: "Prepare smaller images for larger prints.",
  },
  {
    id: "text",
    label: "Add Text",
    heading: "Add text",
    body: "Add a name, date, caption or personal message before printing.",
  },
];

const fonts = [
  { label: "Serif", css: "'Instrument Serif', Georgia, serif" },
  { label: "Sans", css: "Archivo, system-ui, sans-serif" },
];

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load the image."));
    img.src = src;
  });
}

/** Contrast / saturation / brightness recovery pass for faded originals. */
async function runRestore(image: PreparedImage): Promise<PreparedImage> {
  const img = await loadImage(image.dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.filter = "contrast(122%) saturate(126%) brightness(103%)";
  ctx.drawImage(img, 0, 0);
  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.92),
    width: canvas.width,
    height: canvas.height,
    name: image.name,
    source: "restore",
  };
}

/** 2× resample with smoothing plus a light sharpening pass. */
async function runEnhance(image: PreparedImage): Promise<PreparedImage> {
  const img = await loadImage(image.dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth * 2;
  canvas.height = img.naturalHeight * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.filter = "contrast(106%) saturate(104%)";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.92),
    width: canvas.width,
    height: canvas.height,
    name: image.name,
    source: "enhance",
  };
}

type TextConfig = {
  text: string;
  font: string;
  size: number;
  align: "left" | "center" | "right";
  y: number;
  color: "light" | "dark";
};

async function runText(image: PreparedImage, cfg: TextConfig): Promise<PreparedImage> {
  const img = await loadImage(image.dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  const px = (cfg.size / 100) * canvas.width * 0.12;
  ctx.font = `${px}px ${cfg.font}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = cfg.align;
  ctx.fillStyle = cfg.color === "light" ? "#ffffff" : "#141414";
  const margin = canvas.width * 0.06;
  const x = cfg.align === "left" ? margin : cfg.align === "right" ? canvas.width - margin : canvas.width / 2;
  ctx.fillText(cfg.text, x, (cfg.y / 100) * canvas.height);

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.92),
    width: canvas.width,
    height: canvas.height,
    name: image.name,
    source: "text",
  };
}

function BeforeAfter({ before, after }: { before: string; after: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      onMouseMove={(e) => move(e.clientX)}
      onTouchMove={(e) => move(e.touches[0]!.clientX)}
      className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden bg-secondary"
    >
      <img src={before} alt="Before" className="absolute inset-0 h-full w-full object-contain" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <img src={after} alt="After" className="absolute inset-0 h-full w-full object-contain" />
      </div>
      <span aria-hidden className="absolute inset-y-0 w-px bg-white/85" style={{ left: `${pos}%` }} />
      <span className="px-label absolute left-4 top-4 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
        Before
      </span>
      <span className="px-label absolute right-4 top-4 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
        After
      </span>
      <label className="sr-only" htmlFor="ba-range">
        Compare before and after
      </label>
      <input
        id="ba-range"
        type="range"
        min={4}
        max={96}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-0 bottom-4 mx-auto w-[70%] cursor-ew-resize appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-white/60 [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white"
      />
    </div>
  );
}

export function ToolWorkspace({ tool }: { tool: ToolId }) {
  const navigate = useNavigate();
  const { image, setImage } = usePreparedImage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [original, setOriginal] = useState<PreparedImage | null>(null);
  const [result, setResult] = useState<PreparedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cfg, setCfg] = useState<TextConfig>({
    text: "",
    font: fonts[0]!.css,
    size: 40,
    align: "center",
    y: 82,
    color: "light",
  });

  // A tool always starts from whatever image the customer currently has.
  useEffect(() => {
    setOriginal(image);
    setResult(null);
  }, [tool]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (image && !original) setOriginal(image);
  }, [image, original]);

  const active = tools.find((t) => t.id === tool)!;
  const preview = useMemo(() => result ?? original, [result, original]);

  const load = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      const next = await readImageFile(file);
      setOriginal(next);
      setResult(null);
      setImage(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  };

  const run = async () => {
    if (!original) return;
    setBusy(true);
    setError(null);
    try {
      const out =
        tool === "restore"
          ? await runRestore(original)
          : tool === "enhance"
            ? await runEnhance(original)
            : await runText(original, cfg);
      setResult(out);
      setImage(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell id="workspace" label="Photo tools workspace" className="pb-20 md:pb-28">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        {/* Preview */}
        <div className="md:col-span-7">
          {!original ? (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center border border-dashed border-hairline bg-secondary/40 px-8 text-center">
              <h2 className="px-serif text-[1.7rem]">{active.heading}</h2>
              <p className="px-meta mt-3 max-w-[34ch] text-muted-foreground">{active.body}</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-label px-underline mt-7"
              >
                {tool === "restore" ? "Upload photo" : "Upload image"} →
              </button>
              <p className="px-meta mt-3 text-muted-foreground">{acceptedLabel}</p>
            </div>
          ) : result ? (
            <BeforeAfter before={original.dataUrl} after={result.dataUrl} />
          ) : (
            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-secondary">
              <img
                src={original.dataUrl}
                alt="Your uploaded image"
                className="max-h-full max-w-full object-contain"
              />
              {tool === "text" && cfg.text ? (
                <span
                  className="pointer-events-none absolute w-full px-[6%]"
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
          )}

          {original ? (
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
              <p className="px-meta text-muted-foreground">
                Original {original.width} × {original.height} px
                {result && result.width !== original.width
                  ? ` · Result ${result.width} × ${result.height} px`
                  : ""}
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
          <div className="px-rule pt-6">
            <h2 className="px-label">{active.heading}</h2>
            <p className="px-meta mt-2 max-w-[38ch] text-muted-foreground">{active.body}</p>
          </div>

          {tool === "enhance" && original ? (
            <div className="mt-8">
              <p className="px-label text-muted-foreground">Original</p>
              <p className="px-meta mt-1">
                {original.width} × {original.height} px
              </p>
              <p className="px-label mt-5 text-muted-foreground">After enhancing</p>
              <p className="px-meta mt-1">
                {original.width * 2} × {original.height * 2} px
              </p>
            </div>
          ) : null}

          {tool === "text" ? (
            <div className="mt-8 space-y-7">
              <div>
                <label htmlFor="tool-text" className="px-label text-muted-foreground">
                  Text
                </label>
                <input
                  id="tool-text"
                  value={cfg.text}
                  onChange={(e) => setCfg({ ...cfg, text: e.target.value })}
                  placeholder="Enter your text"
                  className="px-meta mt-2 w-full border-b border-hairline bg-transparent pb-2 outline-none focus:border-foreground"
                />
              </div>

              <div>
                <p className="px-label text-muted-foreground">Font</p>
                <div className="mt-2 flex gap-6">
                  {fonts.map((f) => (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => setCfg({ ...cfg, font: f.css })}
                      aria-pressed={cfg.font === f.css}
                      className={[
                        "px-label px-underline",
                        cfg.font === f.css ? "opacity-100" : "opacity-45 hover:opacity-100",
                      ].join(" ")}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="tool-size" className="px-label text-muted-foreground">
                  Size
                </label>
                <input
                  id="tool-size"
                  type="range"
                  min={15}
                  max={100}
                  value={cfg.size}
                  onChange={(e) => setCfg({ ...cfg, size: Number(e.target.value) })}
                  className="mt-3 w-full accent-foreground"
                />
              </div>

              <div>
                <p className="px-label text-muted-foreground">Alignment</p>
                <div className="mt-2 flex gap-6">
                  {(["left", "center", "right"] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setCfg({ ...cfg, align: a })}
                      aria-pressed={cfg.align === a}
                      className={[
                        "px-label px-underline capitalize",
                        cfg.align === a ? "opacity-100" : "opacity-45 hover:opacity-100",
                      ].join(" ")}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="tool-pos" className="px-label text-muted-foreground">
                  Position
                </label>
                <input
                  id="tool-pos"
                  type="range"
                  min={8}
                  max={94}
                  value={cfg.y}
                  onChange={(e) => setCfg({ ...cfg, y: Number(e.target.value) })}
                  className="mt-3 w-full accent-foreground"
                />
              </div>

              <div>
                <p className="px-label text-muted-foreground">Text colour</p>
                <div className="mt-2 flex gap-6">
                  {(["light", "dark"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCfg({ ...cfg, color: c })}
                      aria-pressed={cfg.color === c}
                      className={[
                        "px-label px-underline capitalize",
                        cfg.color === c ? "opacity-100" : "opacity-45 hover:opacity-100",
                      ].join(" ")}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-10">
            <button
              type="button"
              disabled={!original || busy || (tool === "text" && !cfg.text)}
              onClick={() => void run()}
              className="px-label w-full border border-foreground py-4 text-center transition-colors duration-300 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy
                ? "Working…"
                : tool === "restore"
                  ? "Restore"
                  : tool === "enhance"
                    ? "Enhance"
                    : "Apply text"}
            </button>

            {error ? <p className="px-meta mt-3 text-destructive">{error}</p> : null}

            {result ? (
              <div className="px-rule mt-8 pt-6">
                <p className="px-meta text-muted-foreground">
                  Your prepared image is ready and will carry into the custom print builder.
                </p>
                <button
                  type="button"
                  onClick={() => void navigate({ to: "/custom" })}
                  className="px-label px-underline mt-4 inline-block"
                >
                  Use for custom print →
                </button>
                <a
                  href={result.dataUrl}
                  download={`photox-${tool}-${result.name.replace(/\.[^.]+$/, "")}.jpg`}
                  className="px-label px-underline mt-3 block text-muted-foreground"
                >
                  Download image →
                </a>
              </div>
            ) : (
              <p className="px-meta mt-6 text-muted-foreground">
                Already prepared?{" "}
                <Link to="/custom" className="px-underline text-foreground">
                  Go to custom prints →
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

export { tools };
