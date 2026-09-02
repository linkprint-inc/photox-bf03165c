import { useEffect, useState } from "react";
import {
  createTextStyleBatch,
  generateTextStyles,
  recommendedInches,
  suggestTextColors,
  toolMeta,
  type GeneratedTextStyle,
  type TextColor,
  type TextConfig,
  type ToolId,
} from "@/lib/image-tools";
import type { PreparedImage } from "@/lib/prepared-image";

const fallbackTextColors = ["#6B493B", "#81584D", "#52616D", "#9A7960", "#C39C75"];

function isCustomTextColor(color: TextColor): color is `#${string}` {
  return color.startsWith("#");
}

function customHexValue(color: TextColor) {
  return isCustomTextColor(color) ? color.toUpperCase() : fallbackTextColors[0]!;
}

function isHexColor(value: string): value is `#${string}` {
  return /^#[0-9A-F]{6}$/i.test(value);
}

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
  normalFlowOnMobile = false,
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
  /** Lets the PDP mobile modal keep every tool control in document flow. */
  normalFlowOnMobile?: boolean;
  requiresTextResult?: boolean;
}) {
  const meta = toolMeta[tool];
  const recommended = recommendedInches(original);
  const needsMore = selectedInches > recommended;
  const [generatedVersion, setGeneratedVersion] = useState(() => cfg.styleVersion || 0);
  const [generatingStyles, setGeneratingStyles] = useState(false);
  const [styleBatch, setStyleBatch] = useState(() => createTextStyleBatch(cfg.styleVersion || 1));
  const [customColorOpen, setCustomColorOpen] = useState(() => isCustomTextColor(cfg.color));
  const [suggestedColors, setSuggestedColors] = useState<string[]>(fallbackTextColors);
  const [hexValue, setHexValue] = useState(() => customHexValue(cfg.color));
  const textGenerated = cfg.styleVersion > 0;
  const actionBarClass = normalFlowOnMobile
    ? "mt-10 border-t border-hairline pt-5 lg:sticky lg:bottom-0 lg:z-10 lg:mx-0 lg:bg-paper lg:px-0 lg:pb-0 lg:backdrop-blur-sm"
    : "sticky bottom-0 z-10 -mx-1 mt-10 border-t border-hairline bg-paper/95 px-1 pb-3 pt-5 backdrop-blur-sm lg:mx-0 lg:bg-paper lg:px-0 lg:pb-0";

  const selectTextStyle = (style: GeneratedTextStyle, version: number) => {
    const next = {
      ...cfg,
      ...style,
      text: cfg.text,
      styleVersion: version,
    };
    setCfg(next);
    onGenerateText?.(next);
  };

  const currentCustomHex = customHexValue(cfg.color);

  useEffect(() => {
    if (!customColorOpen || tool !== "text") return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void suggestTextColors({
        image: original,
        textPosition: { x: cfg.x ?? 50, y: cfg.y },
        count: 5,
      })
        .then((colors) => {
          if (!cancelled && colors.length) setSuggestedColors(colors);
        })
        .catch(() => {
          if (!cancelled) setSuggestedColors(fallbackTextColors);
        });
    }, 180);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [cfg.x, cfg.y, customColorOpen, original, tool]);

  useEffect(() => {
    if (customColorOpen) setHexValue(currentCustomHex);
  }, [currentCustomHex, customColorOpen]);

  const requestTextStyles = async () => {
    if (!cfg.text.trim()) return;
    const nextVersion = Math.max(generatedVersion, cfg.styleVersion, 0) + 1;
    setGeneratingStyles(true);
    try {
      const nextBatch = await generateTextStyles({
        text: cfg.text,
        count: 8,
        batch: nextVersion,
        imageContext: {
          width: original.width,
          height: original.height,
          orientation: original.width >= original.height ? "landscape" : "portrait",
        },
      });
      setStyleBatch(nextBatch);
      setGeneratedVersion(nextVersion);
      // The first batch chooses a safe initial treatment. Subsequent batches
      // only offer alternatives, leaving the selected design and its layout intact.
      if (!textGenerated) selectTextStyle(nextBatch[0]!, nextVersion);
    } finally {
      setGeneratingStyles(false);
    }
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
                <div className="mt-3 flex flex-wrap justify-between gap-x-3 gap-y-4 sm:flex-nowrap sm:items-center">
                  {styleBatch.map((style, index) => {
                    const styleNumber = index + 1;
                    const selected =
                      cfg.styleId === style.styleId && cfg.styleVersion === generatedVersion;
                    return (
                      <button
                        key={style.styleId}
                        type="button"
                        onClick={() => selectTextStyle(style, generatedVersion)}
                        disabled={generatingStyles}
                        aria-label={`Select text style ${styleNumber}`}
                        aria-pressed={selected}
                        className={`px-label px-underline w-fit disabled:cursor-not-allowed ${selected ? "opacity-100 after:scale-x-100" : "opacity-45 hover:opacity-100"}`}
                      >
                        {String(styleNumber).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => void requestTextStyles()}
                disabled={generatingStyles}
                className="px-label px-underline inline-block text-muted-foreground disabled:cursor-not-allowed disabled:opacity-45"
              >
                {generatingStyles ? "Generating…" : "Generate more →"}
              </button>

              <div>
                <label htmlFor="tool-size" className="px-label text-muted-foreground">
                  Size
                </label>
                <input
                  id="tool-size"
                  type="range"
                  min={18}
                  max={140}
                  value={cfg.size}
                  onChange={(event) => setCfg({ ...cfg, size: Number(event.target.value) })}
                  className="mt-3 w-full accent-foreground"
                />
                <p className="px-meta mt-2 text-muted-foreground">
                  Drag the text directly on the image to position it.
                </p>
              </div>
            </>
          ) : null}

          <div>
            <p className="px-label text-muted-foreground">Color</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
              {(["light", "dark"] as const).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setCfg({ ...cfg, color });
                    setCustomColorOpen(false);
                  }}
                  aria-pressed={cfg.color === color}
                  className={`px-label px-underline ${cfg.color === color ? "opacity-100 after:scale-x-100" : "opacity-45 hover:opacity-100"}`}
                >
                  {color}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCustomColorOpen((open) => !open)}
                aria-expanded={customColorOpen}
                aria-controls="custom-text-color-controls"
                className={`px-label px-underline ${customColorOpen ? "opacity-100 after:scale-x-100" : "opacity-45 hover:opacity-100"}`}
              >
                {customColorOpen ? "Custom" : "Custom +"}
              </button>
            </div>

            <div
              id="custom-text-color-controls"
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${customColorOpen ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              aria-hidden={!customColorOpen}
            >
              <div className="overflow-hidden">
                <p className="px-label text-muted-foreground">Suggested from image</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {suggestedColors.map((color) => {
                    const selected = cfg.color === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCfg({ ...cfg, color: color as TextColor })}
                        aria-label={`Use suggested color ${color}`}
                        aria-pressed={selected}
                        className={`grid h-5 w-5 place-items-center rounded-full transition-shadow focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground ${selected ? "ring-1 ring-foreground ring-offset-2 ring-offset-paper" : "hover:ring-1 hover:ring-foreground/45 hover:ring-offset-2 hover:ring-offset-paper"}`}
                        style={{ backgroundColor: color }}
                      >
                        <span className="sr-only">{color}</span>
                      </button>
                    );
                  })}
                  <label
                    className="grid h-5 w-5 cursor-pointer place-items-center rounded-full border border-hairline text-[1rem] leading-none text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    title="Choose a custom color"
                  >
                    <span aria-hidden>+</span>
                    <span className="sr-only">Choose a custom color</span>
                    <input
                      type="color"
                      value={currentCustomHex}
                      onChange={(event) =>
                        setCfg({ ...cfg, color: event.target.value.toUpperCase() as TextColor })
                      }
                      className="sr-only"
                    />
                  </label>
                </div>
                <label className="mt-4 block w-fit">
                  <span className="sr-only">Custom hex color</span>
                  <input
                    value={hexValue}
                    onChange={(event) => {
                      const next = event.target.value.toUpperCase();
                      setHexValue(next);
                      if (isHexColor(next)) setCfg({ ...cfg, color: next });
                    }}
                    onBlur={() => setHexValue(currentCustomHex)}
                    maxLength={7}
                    spellCheck={false}
                    className="px-meta min-w-[110px] w-[116px] border-b border-hairline bg-transparent pb-1 pr-2 uppercase outline-none transition-colors focus:border-foreground"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className={actionBarClass}>
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
              disabled={!cfg.text.trim() || generatingStyles}
              onClick={() => void requestTextStyles()}
              className="px-label w-full border border-foreground py-4 text-center transition-colors duration-300 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              {generatingStyles ? "Generating…" : "Generate text styles →"}
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
