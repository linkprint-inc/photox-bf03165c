import { useState } from "react";
import {
  generatedTextStyle,
  recommendedInches,
  textStyleIds,
  toolMeta,
  type TextConfig,
  type TextStyleId,
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
  onGenerateText,
  onApply,
  onCancel,
  onBack,
  selectedSizeLabel,
  selectedInches,
  requiresTextResult = false,
}: {
  tool: ToolId;
  original: PreparedImage;
  result: PreparedImage | null;
  cfg: TextConfig;
  setCfg: (c: TextConfig) => void;
  busy: boolean;
  error: string | null;
  onRun: () => void;
  /** Optional legacy raster export for the standalone builder. */
  onGenerateText?: (config: TextConfig) => void;
  onApply: () => void;
  onCancel: () => void;
  /** Prepare-step tools use Back as their single discard-and-return action. */
  onBack?: () => void;
  selectedSizeLabel: string;
  selectedInches: number;
  requiresTextResult?: boolean;
}) {
  const meta = toolMeta[tool];
  const recommended = recommendedInches(original);
  const needsMore = selectedInches > recommended;
  const [generatedVersion, setGeneratedVersion] = useState(() => cfg.styleVersion || 0);
  const textGenerated = cfg.styleVersion > 0;

  const selectTextStyle = (styleId: TextStyleId, version: number) => {
    const next = {
      ...cfg,
      ...generatedTextStyle(styleId, version),
      text: cfg.text,
      styleVersion: version,
    };
    setCfg(next);
    onGenerateText?.(next);
  };

  const generateTextStyles = () => {
    if (!cfg.text.trim()) return;
    const nextVersion = Math.max(generatedVersion, cfg.styleVersion, 0) + 1;
    setGeneratedVersion(nextVersion);
    // The first generated set selects a safe treatment immediately. Later
    // regenerations only present alternatives, preserving the active design.
    if (!textGenerated) selectTextStyle("editorial", nextVersion);
  };

  return (
    <div>
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="px-label px-underline mb-6 inline-block text-muted-foreground"
        >
          ← Back
        </button>
      ) : null}
      <div className="px-rule pt-6">
        <p className="px-label text-muted-foreground">Image preparation</p>
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
              maxLength={240}
              onChange={(event) => setCfg({ ...cfg, text: event.target.value })}
              placeholder="Enter your text"
              className="px-meta mt-2 w-full border-b border-hairline bg-transparent pb-2 outline-none focus:border-foreground"
            />
          </div>

          {textGenerated ? (
            <>
              <div>
                <p className="px-label text-muted-foreground">Style</p>
                <div className="mt-3 flex gap-5">
                  {textStyleIds.map((styleId, index) => {
                    const selected =
                      cfg.styleId === styleId && cfg.styleVersion === generatedVersion;
                    return (
                      <button
                        key={styleId}
                        type="button"
                        onClick={() => selectTextStyle(styleId, generatedVersion)}
                        aria-label={`Select text style ${index + 1}`}
                        aria-pressed={selected}
                        className={`px-label px-underline ${selected ? "opacity-100 after:scale-x-100" : "opacity-45 hover:opacity-100"}`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="tool-size" className="px-label text-muted-foreground">
                  Size
                </label>
                <input
                  id="tool-size"
                  type="range"
                  min={8}
                  max={68}
                  value={cfg.size}
                  onChange={(event) => setCfg({ ...cfg, size: Number(event.target.value) })}
                  className="mt-3 w-full accent-foreground"
                />
                <p className="px-meta mt-2 text-muted-foreground">
                  Drag the text directly on the image to position it.
                </p>
              </div>

              <div>
                <p className="px-label text-muted-foreground">Light / dark</p>
                <div className="mt-3 flex gap-6">
                  {(["light", "dark"] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setCfg({ ...cfg, color })}
                      aria-pressed={cfg.color === color}
                      className={`px-label px-underline ${cfg.color === color ? "opacity-100 after:scale-x-100" : "opacity-45 hover:opacity-100"}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={generateTextStyles}
                className="px-label px-underline inline-block text-muted-foreground"
              >
                Regenerate →
              </button>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="sticky bottom-0 z-10 -mx-1 mt-10 border-t border-hairline bg-paper/95 px-1 pb-3 pt-5 backdrop-blur-sm lg:mx-0 lg:bg-paper lg:px-0 lg:pb-0">
        {tool === "text" ? (
          textGenerated ? (
            <button
              type="button"
              onClick={onApply}
              disabled={!cfg.text.trim() || (requiresTextResult && (!result || busy))}
              className="px-label w-full border border-foreground py-4 text-center transition-colors duration-300 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? "Preparing text…" : "Apply text →"}
            </button>
          ) : (
            <button
              type="button"
              disabled={!cfg.text.trim()}
              onClick={generateTextStyles}
              className="px-label w-full border border-foreground py-4 text-center transition-colors duration-300 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              Generate text styles →
            </button>
          )
        ) : !result ? (
          <button
            type="button"
            disabled={busy}
            onClick={onRun}
            className="px-label w-full border border-foreground py-4 text-center transition-colors duration-300 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy
              ? tool === "restore"
                ? "Restoring image…"
                : "Enhancing image…"
              : tool === "restore"
                ? "Preview restoration →"
                : "Preview enhancement →"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onApply}
            className="px-label w-full border border-foreground py-4 text-center transition-colors duration-300 hover:bg-foreground hover:text-background"
          >
            {tool === "enhance" ? "Keep enhanced image →" : "Keep restored image →"}
          </button>
        )}

        {error ? <p className="px-meta mt-3 text-destructive">{error}</p> : null}

        {!onBack ? (
          <button
            type="button"
            onClick={onCancel}
            className="px-label px-underline mt-5 inline-block text-muted-foreground"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}
