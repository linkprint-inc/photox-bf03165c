import type { PreparedImage } from "@/lib/prepared-image";

export type ToolId = "restore" | "enhance" | "text";

export const toolMeta: Record<ToolId, { label: string; heading: string; body: string }> = {
  restore: {
    label: "Restore",
    heading: "Restore old photo",
    body: "Repair fading, scratches and age-related damage before printing.",
  },
  enhance: {
    label: "Enhance",
    heading: "Enhance resolution",
    body: "Prepare your image for larger print sizes.",
  },
  text: {
    label: "Add text",
    heading: "Add text",
    body: "Add a name, date, caption or personal message before printing.",
  },
};

const editorialFont = "'Instrument Serif', Georgia, serif";
const sansFont = "Archivo, system-ui, sans-serif";
const displayFont = "'Space Grotesk', Archivo, system-ui, sans-serif";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load the image."));
    img.src = src;
  });
}

function debugProcessing(
  tool: "restore" | "enhance",
  phase: "started" | "completed",
  image: Pick<PreparedImage, "dataUrl" | "width" | "height">,
) {
  if (import.meta.env.DEV) {
    console.info(`[photoX ${tool}] ${phase}`, {
      source: image.dataUrl.slice(0, 48),
      width: image.width,
      height: image.height,
    });
  }
}

/**
 * Local processing boundary used until a server-side restoration provider is
 * connected. It creates a distinct bitmap with restrained tonal recovery; it
 * is intentionally not presented as an AI restoration service.
 */
export async function runRestore(image: PreparedImage): Promise<PreparedImage> {
  debugProcessing("restore", "started", image);
  const img = await loadImage(image.dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.filter = "contrast(130%) saturate(114%) brightness(105%)";
  ctx.drawImage(img, 0, 0);
  const result = {
    dataUrl: canvas.toDataURL("image/jpeg", 0.92),
    width: canvas.width,
    height: canvas.height,
    name: image.name,
    source: "restore",
  } as const;
  debugProcessing("restore", "completed", result);
  return result;
}

/**
 * Local high-quality 2× bitmap resampling boundary. The output dimensions are
 * real (not metadata), while a future super-resolution provider can replace
 * this function without changing the customization workflow.
 */
export async function runEnhance(image: PreparedImage): Promise<PreparedImage> {
  debugProcessing("enhance", "started", image);
  const img = await loadImage(image.dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth * 2;
  canvas.height = img.naturalHeight * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.filter = "contrast(104%) saturate(102%)";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const result = {
    dataUrl: canvas.toDataURL("image/jpeg", 0.92),
    width: canvas.width,
    height: canvas.height,
    name: image.name,
    source: "enhance",
  } as const;
  debugProcessing("enhance", "completed", result);
  return result;
}

export type TextConfig = {
  text: string;
  /** The selected generated treatment. Typography remains intentionally internal. */
  styleId: TextStyleId;
  /** A regenerated style set can be selected without replacing the accepted design. */
  styleVersion: number;
  font: string;
  fontWeight: number;
  fontStyle: "normal" | "italic";
  letterSpacing: string;
  lineHeight: number;
  textTransform: "none" | "uppercase";
  size: number;
  align: "left" | "center" | "right";
  x: number;
  y: number;
  /** Curated light/dark defaults, or a customer-selected hex value. */
  color: TextColor;
};

export type TextColor = "light" | "dark" | `#${string}`;

export function textColorValue(color: TextColor) {
  if (color === "light") return "#ffffff";
  if (color === "dark") return "#141414";
  return color;
}

export function textColorShadow(color: TextColor) {
  const hex = textColorValue(color).replace("#", "");
  const value = Number.parseInt(hex.length === 3 ? hex.replace(/(.)/g, "$1$1") : hex, 16);
  const luminance = Number.isFinite(value)
    ? (0.2126 * ((value >> 16) & 255) + 0.7152 * ((value >> 8) & 255) + 0.0722 * (value & 255)) /
      255
    : 1;
  return luminance > 0.55 ? "0 1px 7px rgba(0,0,0,0.52)" : "0 1px 7px rgba(255,255,255,0.4)";
}

export type TextColorSuggestionInput = {
  image: Pick<PreparedImage, "dataUrl" | "width" | "height">;
  textPosition: { x: number; y: number };
  /** Reserved for a provider to use a more precise sampled crop later. */
  sampleRegion?: { width: number; height: number };
  count?: number;
};

function rgbToHsl(red: number, green: number, blue: number) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (!delta) return { hue: 32, saturation: 0, lightness };
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue = 0;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  return { hue: (hue * 60 + 360) % 360, saturation, lightness };
}

function hslToHex(hue: number, saturation: number, lightness: number) {
  const s = saturation / 100;
  const l = lightness / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const segment = (((hue % 360) + 360) % 360) / 60;
  const second = chroma * (1 - Math.abs((segment % 2) - 1));
  const match = l - chroma / 2;
  const [r, g, b] =
    segment < 1
      ? [chroma, second, 0]
      : segment < 2
        ? [second, chroma, 0]
        : segment < 3
          ? [0, chroma, second]
          : segment < 4
            ? [0, second, chroma]
            : segment < 5
              ? [second, 0, chroma]
              : [chroma, 0, second];
  return `#${[r, g, b]
    .map((channel) =>
      Math.round((channel + match) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`.toUpperCase();
}

function hexToRgb(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  return { red: (value >> 16) & 255, green: (value >> 8) & 255, blue: value & 255 };
}

function relativeLuminance({ red, green, blue }: { red: number; green: number; blue: number }) {
  const linear = [red, green, blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
}

function contrastRatio(first: string, second: { red: number; green: number; blue: number }) {
  const light = relativeLuminance(hexToRgb(first));
  const dark = relativeLuminance(second);
  return (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05);
}

function circularHueDistance(first: number, second: number) {
  const difference = Math.abs(first - second) % 360;
  return Math.min(difference, 360 - difference);
}

/**
 * Provider-neutral, image-aware fallback for Add Text color suggestions.
 * It samples the local area beneath the text, groups its palette into distinct
 * color families, then curates five readable text colors. A future
 * visual-analysis provider can replace this function without changing the
 * controls or persisted TextConfig shape.
 */
export async function suggestTextColors({
  image,
  textPosition,
  sampleRegion,
  count = 5,
}: TextColorSuggestionInput): Promise<string[]> {
  const imageElement = await loadImage(image.dataUrl);
  const canvas = document.createElement("canvas");
  const side = 96;
  canvas.width = side;
  canvas.height = side;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return ["#6B493B", "#81584D", "#52616D", "#9A7960", "#C39C75"].slice(0, count);

  const regionWidth = Math.max(12, Math.round(sampleRegion?.width ?? image.width * 0.22));
  const regionHeight = Math.max(12, Math.round(sampleRegion?.height ?? image.height * 0.16));
  const sourceX = Math.max(
    0,
    Math.min(
      imageElement.naturalWidth - regionWidth,
      (textPosition.x / 100) * imageElement.naturalWidth - regionWidth / 2,
    ),
  );
  const sourceY = Math.max(
    0,
    Math.min(
      imageElement.naturalHeight - regionHeight,
      (textPosition.y / 100) * imageElement.naturalHeight - regionHeight / 2,
    ),
  );
  context.drawImage(imageElement, sourceX, sourceY, regionWidth, regionHeight, 0, 0, side, side);
  const pixels = context.getImageData(0, 0, side, side).data;
  let red = 0;
  let green = 0;
  let blue = 0;
  let total = 0;
  const clusters = new Map<
    string,
    { count: number; hue: number; saturation: number; lightness: number }
  >();
  for (let index = 0; index < pixels.length; index += 16) {
    red += pixels[index] ?? 0;
    green += pixels[index + 1] ?? 0;
    blue += pixels[index + 2] ?? 0;
    total += 1;
    const color = rgbToHsl(pixels[index] ?? 0, pixels[index + 1] ?? 0, pixels[index + 2] ?? 0);
    const hueBucket = Math.round(color.hue / 30) % 12;
    const lightnessBucket = Math.min(3, Math.floor(color.lightness * 4));
    const key = `${hueBucket}-${lightnessBucket}`;
    const existing = clusters.get(key) ?? { count: 0, hue: 0, saturation: 0, lightness: 0 };
    existing.count += 1;
    existing.hue += color.hue;
    existing.saturation += color.saturation;
    existing.lightness += color.lightness;
    clusters.set(key, existing);
  }
  const average = { red: red / total, green: green / total, blue: blue / total };
  const local = rgbToHsl(average.red, average.green, average.blue);
  const backgroundIsDark = relativeLuminance(average) < 0.38;
  const groupedHues = [...clusters.values()]
    .map((cluster) => ({
      hue: cluster.hue / cluster.count,
      saturation: cluster.saturation / cluster.count,
      weight: cluster.count * (0.55 + cluster.saturation / cluster.count),
    }))
    .sort((first, second) => second.weight - first.weight);
  const hues: number[] = [];
  for (const candidate of groupedHues) {
    if (hues.every((hue) => circularHueDistance(hue, candidate.hue) >= 20)) {
      hues.push(candidate.hue);
    }
    if (hues.length === count) break;
  }
  const hueOffsets = [0, 25, -28, 52, -54, 180];
  for (let index = 0; hues.length < count; index += 1) {
    hues.push((local.hue + hueOffsets[index % hueOffsets.length]!) % 360);
  }

  const targetLightness = backgroundIsDark ? [73, 66, 58, 52, 77] : [20, 29, 38, 47, 58];
  const baseSaturation = Math.max(26, Math.min(62, local.saturation * 100 + 14));
  const saturationVariation = [8, -4, 5, -8, 0];
  const palette = hues.slice(0, count).map((hue, index) => {
    const saturation = Math.max(22, Math.min(68, baseSaturation + saturationVariation[index]!));
    let lightness = targetLightness[index % targetLightness.length]!;
    let color = hslToHex(hue, saturation, lightness);
    for (let attempt = 0; attempt < 14 && contrastRatio(color, average) < 3.5; attempt += 1) {
      lightness += backgroundIsDark ? 3 : -3;
      lightness = Math.max(18, Math.min(82, lightness));
      color = hslToHex(hue, saturation, lightness);
    }
    return color;
  });
  return [...new Set(palette)].slice(0, count);
}

export type TextStyleId =
  "editorial" | "modern" | "bold" | "soft" | "display" | "caption" | "refined" | "expressive";

export const textStyleIds: TextStyleId[] = [
  "editorial",
  "modern",
  "bold",
  "soft",
  "display",
  "caption",
  "refined",
  "expressive",
];

export type GeneratedTextStyle = Pick<
  TextConfig,
  | "styleId"
  | "font"
  | "fontWeight"
  | "fontStyle"
  | "letterSpacing"
  | "lineHeight"
  | "textTransform"
  | "align"
>;

export type TextStyleGenerationInput = {
  text: string;
  imageContext?: { width: number; height: number; orientation?: "landscape" | "portrait" };
  count?: number;
  batch?: number;
};

/** The approved internal typography pool. It is intentionally not exposed as a font picker. */
const textStylePool: Record<TextStyleId, GeneratedTextStyle> = {
  editorial: {
    styleId: "editorial",
    font: editorialFont,
    fontWeight: 500,
    fontStyle: "normal",
    letterSpacing: "-0.025em",
    lineHeight: 1.02,
    textTransform: "none",
    align: "center",
  },
  modern: {
    styleId: "modern",
    font: sansFont,
    fontWeight: 500,
    fontStyle: "normal",
    letterSpacing: "0.015em",
    lineHeight: 1.08,
    textTransform: "none",
    align: "center",
  },
  bold: {
    styleId: "bold",
    font: displayFont,
    fontWeight: 700,
    fontStyle: "normal",
    letterSpacing: "-0.045em",
    lineHeight: 0.94,
    textTransform: "uppercase",
    align: "center",
  },
  soft: {
    styleId: "soft",
    font: editorialFont,
    fontWeight: 400,
    fontStyle: "italic",
    letterSpacing: "0em",
    lineHeight: 1.1,
    textTransform: "none",
    align: "center",
  },
  display: {
    styleId: "display",
    font: displayFont,
    fontWeight: 600,
    fontStyle: "normal",
    letterSpacing: "-0.06em",
    lineHeight: 0.9,
    textTransform: "uppercase",
    align: "center",
  },
  caption: {
    styleId: "caption",
    font: sansFont,
    fontWeight: 500,
    fontStyle: "normal",
    letterSpacing: "0.09em",
    lineHeight: 1.18,
    textTransform: "uppercase",
    align: "left",
  },
  refined: {
    styleId: "refined",
    font: editorialFont,
    fontWeight: 500,
    fontStyle: "normal",
    letterSpacing: "0.045em",
    lineHeight: 1.06,
    textTransform: "none",
    align: "center",
  },
  expressive: {
    styleId: "expressive",
    font: editorialFont,
    fontWeight: 500,
    fontStyle: "italic",
    letterSpacing: "-0.04em",
    lineHeight: 0.98,
    textTransform: "none",
    align: "center",
  },
};

/**
 * Deterministic local stand-in for generated typography. The wording is never
 * altered; each option only changes typography. Position, size and colour are
 * independent customer-controlled layout state.
 */
export function generatedTextStyle(styleId: TextStyleId): GeneratedTextStyle {
  return textStylePool[styleId];
}

function withBatchVariation(
  style: GeneratedTextStyle,
  styleIndex: number,
  batch: number,
): GeneratedTextStyle {
  // Each local-development batch deliberately has a different typographic
  // composition. A future provider can replace this adapter without changing
  // the selection UI or the persisted customer layout state.
  const variation = (Math.max(1, batch) - 1) % 3;
  if (variation === 0) return style;

  if (variation === 1) {
    return {
      ...style,
      fontWeight: Math.min(700, style.fontWeight + (styleIndex % 2 ? 100 : 0)),
      letterSpacing: styleIndex % 2 ? "0.035em" : "-0.015em",
      lineHeight: Math.max(0.92, style.lineHeight - 0.04),
      fontStyle: style.styleId === "soft" ? "normal" : style.fontStyle,
    };
  }

  return {
    ...style,
    fontWeight: Math.max(400, style.fontWeight - (styleIndex % 2 ? 0 : 100)),
    letterSpacing: styleIndex % 2 ? "0.075em" : "0.01em",
    lineHeight: Math.min(1.2, style.lineHeight + 0.06),
    fontStyle: style.styleId === "refined" ? "italic" : style.fontStyle,
  };
}

/** Deterministic local batch used until a text-style provider is connected. */
export function createTextStyleBatch(batch = 1, count = 8): GeneratedTextStyle[] {
  const offset = (Math.max(1, batch) - 1) % textStyleIds.length;
  return Array.from({ length: Math.min(count, textStyleIds.length) }, (_, index) => {
    const styleId = textStyleIds[(index + offset) % textStyleIds.length]!;
    return withBatchVariation(generatedTextStyle(styleId), index, batch);
  });
}

/**
 * Provider boundary for future AI-assisted typography. The deterministic local
 * fallback keeps all eight style choices functional without exposing fonts.
 */
export async function generateTextStyles({
  count = 8,
  batch = 1,
}: TextStyleGenerationInput): Promise<GeneratedTextStyle[]> {
  return createTextStyleBatch(batch, count);
}

export const defaultTextConfig: TextConfig = {
  text: "",
  styleId: "editorial",
  styleVersion: 0,
  font: editorialFont,
  fontWeight: 500,
  fontStyle: "normal",
  letterSpacing: "-0.025em",
  lineHeight: 1.02,
  textTransform: "none",
  size: 40,
  align: "center",
  x: 50,
  y: 75,
  color: "light",
};

const textSafeArea = 0.025;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];

  for (const paragraph of text.split("\n")) {
    if (!paragraph) {
      lines.push("");
      continue;
    }

    let current = "";
    for (const token of paragraph.split(/(\s+)/).filter(Boolean)) {
      const candidate = `${current}${token}`;
      if (current && ctx.measureText(candidate).width > maxWidth) {
        lines.push(current.trimEnd());
        current = token.trimStart();
      } else {
        current = candidate;
      }

      while (current && ctx.measureText(current).width > maxWidth) {
        let splitAt = current.length - 1;
        while (splitAt > 1 && ctx.measureText(current.slice(0, splitAt)).width > maxWidth) {
          splitAt -= 1;
        }
        lines.push(current.slice(0, splitAt));
        current = current.slice(splitAt);
      }
    }
    if (current) lines.push(current.trimEnd());
  }

  return lines.length ? lines : [""];
}

export async function runText(image: PreparedImage, cfg: TextConfig): Promise<PreparedImage> {
  const img = await loadImage(image.dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  const marginX = canvas.width * textSafeArea;
  const marginY = canvas.height * textSafeArea;
  const maxWidth = canvas.width * (1 - textSafeArea * 2);
  const renderedText = cfg.textTransform === "uppercase" ? cfg.text.toUpperCase() : cfg.text;
  let fontSize = (cfg.size / 100) * canvas.width * 0.12;
  let lineHeight = fontSize * cfg.lineHeight;
  let lines: string[];

  ctx.font = `${cfg.fontStyle} ${cfg.fontWeight} ${fontSize}px ${cfg.font}`;
  lines = wrapText(ctx, renderedText, maxWidth);

  // Keep a multiline caption printable even when it is much taller than its
  // original single-line treatment. The requested size remains the maximum.
  const availableHeight = canvas.height - marginY * 2;
  const initialHeight = lines.length * lineHeight;
  if (initialHeight > availableHeight) {
    fontSize *= availableHeight / initialHeight;
    lineHeight = fontSize * cfg.lineHeight;
    ctx.font = `${cfg.fontStyle} ${cfg.fontWeight} ${fontSize}px ${cfg.font}`;
    lines = wrapText(ctx, renderedText, maxWidth);
  }

  const textWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
  const textHeight = lines.length * lineHeight;
  const preferredX = ((cfg.x ?? 50) / 100) * canvas.width;
  const preferredY = (cfg.y / 100) * canvas.height;
  const x = clamp(preferredX, marginX + textWidth / 2, canvas.width - marginX - textWidth / 2);
  const y = clamp(preferredY, marginY + textHeight / 2, canvas.height - marginY - textHeight / 2);
  const textLeft = x - textWidth / 2;

  ctx.textBaseline = "middle";
  ctx.textAlign = cfg.align;
  ctx.fillStyle = textColorValue(cfg.color);
  lines.forEach((line, index) => {
    const lineX =
      cfg.align === "left" ? textLeft : cfg.align === "right" ? textLeft + textWidth : x;
    ctx.fillText(line, lineX, y - textHeight / 2 + lineHeight * (index + 0.5));
  });

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.92),
    width: canvas.width,
    height: canvas.height,
    name: image.name,
    source: "text",
  };
}

export async function runTool(
  tool: ToolId,
  image: PreparedImage,
  cfg: TextConfig,
): Promise<PreparedImage> {
  if (tool === "restore") return runRestore(image);
  if (tool === "enhance") return runEnhance(image);
  return runText(image, cfg);
}

/** Largest print inch size this image comfortably supports at ~150 ppi. */
export function recommendedInches(image: { width: number; height: number }) {
  return Math.floor(Math.max(image.width, image.height) / 1.5 / 150);
}
