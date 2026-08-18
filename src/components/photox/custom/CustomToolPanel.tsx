import {
  fonts,
  recommendedInches,
  toolMeta,
  type TextConfig,
  type ToolId,
} from "@/lib/image-tools";
import type { PreparedImage } from "@/lib/prepared-image";

export function CustomToolPanel({
  tool,
  original,
  result,
  cfg,
  setCfg,
  busy,
  error,
  onRun,
  onApply,
  onCancel,
  selectedSizeLabel,
  selectedInches,
}: {
  tool: ToolId;
  original: PreparedImage;
  result: PreparedImage | null;
  cfg: TextConfig;
  setCfg: (c: TextConfig) => void;
  busy: boolean;
  error: string | null;
  onRun: () => void;
  onApply: () => void;
  onCancel: () => void;
  selectedSizeLabel: string;
  selectedInches: number;
}) {
  const meta = toolMeta[tool];
  const recommended = recommendedInches(original);
  const needsMore = selectedInches > recommended;

  return (
    <div>
      <div className="px-rule pt-6">
        <p className="px-label text-muted-foreground">Step 04 — Edit</p>
        <h3 className="px-label mt-2">{meta.heading}</h3>
        <p className="px-meta mt-2 max-w-[38ch] text-muted-foreground">{meta.body}</p>
      </div>

      {tool === "enhance" ? (
        <dl className="mt-8 border-t border-hairline">
          <div className="flex items-baseline justify-between gap-6 border-b border-hairline py-3.5">
            <dt className="px-label text-muted-foreground">Current image</dt>
            <dd className="px-meta">
              {original.width} × {original.height} px
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-hairline py-3.5">
            <dt className="px-label text-muted-foreground">Selected print</dt>
            <dd className="px-meta">{selectedSizeLabel}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-hairline py-3.5">
            <dt className="px-label text-muted-foreground">Recommended print size</dt>
            <dd className="px-meta">Up to {recommended}″ long edge</dd>
          </div>
          {result ? (
            <div className="flex items-baseline justify-between gap-6 border-b border-hairline py-3.5">
              <dt className="px-label text-muted-foreground">Enhanced image</dt>
              <dd className="px-meta">
                {result.width} × {result.height} px
              </dd>
            </div>
          ) : null}
          {needsMore && !result ? (
            <p className="px-meta mt-5 border-l-2 border-foreground/40 pl-4">
              Image enhancement recommended for {selectedSizeLabel}.
            </p>
          ) : null}
        </dl>
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
            <p className="px-meta mt-2 text-muted-foreground">
              Or drag the text directly on the preview.
            </p>
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
        {!result ? (
          <button
            type="button"
            disabled={busy || (tool === "text" && !cfg.text)}
            onClick={onRun}
            className="px-label w-full border border-foreground py-4 text-center transition-colors duration-300 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy
              ? "Working…"
              : tool === "restore"
                ? "Apply restoration"
                : tool === "enhance"
                  ? "Enhance image"
                  : "Apply text"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onApply}
            className="px-label w-full border border-foreground py-4 text-center transition-colors duration-300 hover:bg-foreground hover:text-background"
          >
            {tool === "enhance" ? "Keep enhanced image" : "Keep edited image"}
          </button>
        )}

        {error ? <p className="px-meta mt-3 text-destructive">{error}</p> : null}

        <button
          type="button"
          onClick={onCancel}
          className="px-label px-underline mt-5 inline-block text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
