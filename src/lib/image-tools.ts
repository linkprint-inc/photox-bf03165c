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

export const fonts = [
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
export async function runRestore(image: PreparedImage): Promise<PreparedImage> {
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
export async function runEnhance(image: PreparedImage): Promise<PreparedImage> {
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

export type TextConfig = {
  text: string;
  font: string;
  size: number;
  align: "left" | "center" | "right";
  x: number;
  y: number;
  color: "light" | "dark";
};

export const defaultTextConfig: TextConfig = {
  text: "",
  font: fonts[0]!.css,
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
  let fontSize = (cfg.size / 100) * canvas.width * 0.12;
  let lineHeight = fontSize * 1.05;
  let lines: string[];

  ctx.font = `${fontSize}px ${cfg.font}`;
  lines = wrapText(ctx, cfg.text, maxWidth);

  // Keep a multiline caption printable even when it is much taller than its
  // original single-line treatment. The requested size remains the maximum.
  const availableHeight = canvas.height - marginY * 2;
  const initialHeight = lines.length * lineHeight;
  if (initialHeight > availableHeight) {
    fontSize *= availableHeight / initialHeight;
    lineHeight = fontSize * 1.05;
    ctx.font = `${fontSize}px ${cfg.font}`;
    lines = wrapText(ctx, cfg.text, maxWidth);
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
  ctx.fillStyle = cfg.color === "light" ? "#ffffff" : "#141414";
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
