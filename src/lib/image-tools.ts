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
  y: number;
  color: "light" | "dark";
};

export const defaultTextConfig: TextConfig = {
  text: "",
  font: fonts[0]!.css,
  size: 40,
  align: "center",
  y: 82,
  color: "light",
};

export async function runText(image: PreparedImage, cfg: TextConfig): Promise<PreparedImage> {
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
  const x =
    cfg.align === "left" ? margin : cfg.align === "right" ? canvas.width - margin : canvas.width / 2;
  ctx.fillText(cfg.text, x, (cfg.y / 100) * canvas.height);

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
