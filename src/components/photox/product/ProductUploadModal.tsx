import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import sizeRoom from "@/assets/size-room.jpg";
import { BeforeAfter } from "@/components/photox/custom/BeforeAfter";
import { CustomToolPanel } from "@/components/photox/custom/CustomToolPanel";
import { defaultTextConfig, runTool, type TextConfig, type ToolId } from "@/lib/image-tools";
import {
  acceptedTypes,
  readImageFile,
  usePreparedImage,
  type PreparedImage,
} from "@/lib/prepared-image";
import { sizeSteps, type ShopProduct } from "@/lib/shop-data";
import { materialName, useStore, type BagMaterial } from "@/lib/store";

type Step = "photo" | "prepare" | "preview" | "success";
type PreviewView = "artwork" | "detail" | "room";

type ProductUploadModalProps = {
  product: ShopProduct;
  material: BagMaterial;
  sizeIndex: number;
  sizeLabel: string;
  price: number;
  onClose: () => void;
};

const stepNumber: Record<Exclude<Step, "success">, number> = { photo: 1, prepare: 2, preview: 3 };
const steps: Array<{ key: Exclude<Step, "success">; label: string }> = [
  { key: "photo", label: "Your photo" },
  { key: "prepare", label: "Prepare" },
  { key: "preview", label: "Preview" },
];

export function ProductUploadModal({
  product,
  material,
  sizeIndex,
  sizeLabel,
  price,
  onClose,
}: ProductUploadModalProps) {
  const { image: savedImage, setImage } = usePreparedImage();
  const { addToBag, closeDrawer, openDrawer } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>(savedImage ? "prepare" : "photo");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [sourceImage, setSourceImage] = useState<PreparedImage | null>(savedImage);
  const [draft, setDraft] = useState<PreparedImage | null>(savedImage);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ToolId | null>(null);
  const [toolOriginal, setToolOriginal] = useState<PreparedImage | null>(null);
  const [result, setResult] = useState<PreparedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [toolError, setToolError] = useState<string | null>(null);
  const [applied, setApplied] = useState<ToolId[]>([]);
  const [textConfig, setTextConfig] = useState<TextConfig>(defaultTextConfig);
  const [appliedTextConfig, setAppliedTextConfig] = useState<TextConfig | null>(null);
  const [previewView, setPreviewView] = useState<PreviewView>("room");

  const image = draft ?? sourceImage;
  const selectedSize = sizeSteps[sizeIndex]!;
  const roomWidth = (selectedSize.inches * 1.5 * 100) / 108;

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const goTo = (next: Step) => {
    if (step !== "success" && next !== "success") {
      setDirection(stepNumber[next] < stepNumber[step] ? "backward" : "forward");
    } else {
      setDirection("forward");
    }
    setStep(next);
  };

  const load = async (file: File | undefined) => {
    if (!file || uploading) return;
    setError(null);
    if (!acceptedTypes.split(",").includes(file.type)) {
      setError("Choose a JPG, PNG or WebP image.");
      return;
    }
    setUploading(true);
    try {
      const next = await readImageFile(file);
      setImage(next);
      setSourceImage(next);
      setDraft(next);
      setApplied([]);
      setAppliedTextConfig(null);
      setEditing(null);
      setResult(null);
      goTo("prepare");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not read that image.");
    } finally {
      setUploading(false);
    }
  };

  const openTool = (tool: ToolId) => {
    if (!image) return;
    setToolOriginal(image);
    setEditing(tool);
    setResult(null);
    setToolError(null);
    setTextConfig({ ...defaultTextConfig });
  };

  const runSelectedTool = async () => {
    if (!editing || !toolOriginal) return;
    setBusy(true);
    setToolError(null);
    try {
      setResult(await runTool(editing, toolOriginal, textConfig));
    } catch (reason) {
      setToolError(reason instanceof Error ? reason.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const applyResult = () => {
    if (!result || !editing) return;
    if (editing === "text") setAppliedTextConfig(textConfig);
    setDraft(result);
    setImage(result);
    setApplied((current) => (current.includes(editing) ? current : [...current, editing]));
    setEditing(null);
    setResult(null);
  };

  const resetImage = () => {
    if (!sourceImage) return;
    setDraft(sourceImage);
    setImage(sourceImage);
    setApplied([]);
    setAppliedTextConfig(null);
    setEditing(null);
    setResult(null);
  };

  const dragText = (clientY: number) => {
    const node = previewRef.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    setTextConfig((current) => ({
      ...current,
      y: Math.max(8, Math.min(94, ((clientY - bounds.top) / bounds.height) * 100)),
    }));
  };

  const addCustomizedPrint = () => {
    if (!image || !sourceImage) return;
    addToBag({
      productId: "custom-print",
      material,
      sizeIndex,
      qty: 1,
      customization: {
        originalImage: sourceImage,
        image,
        appliedTools: applied,
        textConfig: appliedTextConfig ?? undefined,
        startingPointId: product.id,
        price,
        preview: previewView,
      },
    });
    goTo("success");
  };

  const animation = direction === "forward" ? "px-modal-step-forward" : "px-modal-step-backward";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end bg-ink/45 p-0 backdrop-blur-[2px] md:items-center md:justify-center md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-print-title"
    >
      <button
        type="button"
        aria-label="Close customization"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <section className="relative z-10 flex h-[96dvh] w-full flex-col overflow-hidden border border-foreground/15 bg-paper shadow-[0_16px_38px_rgba(30,25,20,0.08)] md:h-[84vh] md:w-[86vw] md:max-w-[1280px]">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-hairline bg-paper px-6 py-5 md:px-8">
          <p id="customize-print-title" className="px-label shrink-0">
            Customize your print
          </p>
          <ol
            className="hidden min-w-0 items-center justify-center gap-5 md:flex"
            aria-label="Customization progress"
          >
            {steps.map((item) => {
              const active = step === item.key;
              const complete = step !== "success" && stepNumber[item.key] < stepNumber[step];
              return (
                <li
                  key={item.key}
                  className={`px-label whitespace-nowrap ${active ? "text-foreground" : complete ? "text-muted-foreground" : "text-foreground/35"}`}
                >
                  <span className="mr-1.5 opacity-70">0{stepNumber[item.key]}</span>
                  {item.label}
                </li>
              );
            })}
          </ol>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close customization"
            className="flex h-8 w-8 shrink-0 items-center justify-center text-foreground/75 transition-colors hover:text-foreground"
          >
            <X aria-hidden size={20} strokeWidth={1.4} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-7 md:px-8 md:py-8">
          <div key={step} className={animation}>
            {step === "photo" ? (
              <PhotoStep
                image={image}
                dragOver={dragOver}
                uploading={uploading}
                error={error}
                material={material}
                sizeLabel={sizeLabel}
                price={price}
                onDragOver={() => setDragOver(true)}
                onDragLeave={() => setDragOver(false)}
                onDrop={load}
                onPick={() => inputRef.current?.click()}
                onContinue={() => goTo("prepare")}
              />
            ) : null}
            {step === "prepare" && image ? (
              <PrepareStep
                image={image}
                editing={editing}
                toolOriginal={toolOriginal}
                result={result}
                textConfig={textConfig}
                setTextConfig={setTextConfig}
                busy={busy}
                toolError={toolError}
                applied={applied}
                previewRef={previewRef}
                sizeLabel={sizeLabel}
                selectedInches={selectedSize.inches}
                onDragText={dragText}
                onOpenTool={openTool}
                onRun={runSelectedTool}
                onApply={applyResult}
                onCancelTool={() => {
                  setEditing(null);
                  setResult(null);
                  setToolError(null);
                }}
                onReset={resetImage}
                onBack={() => goTo("photo")}
                onContinue={() => goTo("preview")}
              />
            ) : null}
            {step === "preview" && image ? (
              <PreviewStep
                image={image}
                material={material}
                sizeLabel={sizeLabel}
                price={price}
                roomWidth={roomWidth}
                view={previewView}
                onViewChange={setPreviewView}
                onBack={() => goTo("prepare")}
                onEditConfiguration={onClose}
                onAddToBag={addCustomizedPrint}
              />
            ) : null}
            {step === "success" ? (
              <SuccessStep
                material={material}
                sizeLabel={sizeLabel}
                onViewBag={() => {
                  onClose();
                  openDrawer();
                }}
                onContinueBrowsing={() => {
                  closeDrawer();
                  onClose();
                }}
              />
            ) : null}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes}
          className="sr-only"
          onChange={(event) => void load(event.target.files?.[0] ?? undefined)}
        />
      </section>
    </div>
  );
}

function PhotoStep({
  image,
  dragOver,
  uploading,
  error,
  material,
  sizeLabel,
  price,
  onDragOver,
  onDragLeave,
  onDrop,
  onPick,
  onContinue,
}: {
  image: PreparedImage | null;
  dragOver: boolean;
  uploading: boolean;
  error: string | null;
  material: BagMaterial;
  sizeLabel: string;
  price: number;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (file: File | undefined) => void;
  onPick: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(96dvh-7.5rem)] max-w-4xl flex-col justify-center md:min-h-[calc(84vh-8rem)]">
      <div className="max-w-xl">
        <p className="px-label text-muted-foreground">01 Your photo</p>
        <h2 className="px-serif mt-4 text-[2.5rem] leading-[1.02] md:text-[3.8rem]">
          YOUR PHOTO. THIS PRINT.
        </h2>
        <p className="px-meta mt-5 max-w-[38ch] text-muted-foreground">
          Upload a photo to make this print your own.
        </p>
      </div>
      {image ? (
        <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_220px] md:items-end">
          <div className="flex aspect-[4/3] items-center justify-center bg-secondary p-5">
            <img
              src={image.dataUrl}
              alt="Your uploaded image"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <p className="px-meta text-muted-foreground">{image.name}</p>
            <button
              type="button"
              onClick={onContinue}
              className="px-label mt-5 w-full border border-foreground py-4"
            >
              Continue →
            </button>
            <button
              type="button"
              onClick={onPick}
              className="px-label px-underline mt-5 text-muted-foreground"
            >
              Replace image →
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            onDragOver();
          }}
          onDragLeave={onDragLeave}
          onDrop={(event) => {
            event.preventDefault();
            onDragLeave();
            onDrop(event.dataTransfer.files?.[0]);
          }}
          className={`mt-8 flex min-h-64 flex-col items-center justify-center border border-dashed px-6 py-10 text-center transition-colors duration-300 md:min-h-72 ${dragOver ? "border-foreground bg-secondary" : "border-hairline bg-secondary/35"}`}
        >
          <p className="px-label">Drop your image here</p>
          <button
            type="button"
            onClick={onPick}
            disabled={uploading}
            className="px-label px-underline mt-6 disabled:opacity-45"
          >
            {uploading ? "Preparing image…" : "Choose image →"}
          </button>
          <p className="px-meta mt-3 text-muted-foreground">JPG · PNG · WEBP</p>
          {error ? <p className="px-meta mt-4 text-destructive">{error}</p> : null}
        </div>
      )}
      {image && error ? <p className="px-meta mt-4 text-destructive">{error}</p> : null}
      <div className="px-rule mt-8 flex items-baseline justify-between gap-6 pt-5">
        <div>
          <p className="px-label text-muted-foreground">Your print</p>
          <p className="px-meta mt-2">
            {materialName[material]} · {sizeLabel}
          </p>
        </div>
        <p className="px-price">${price}</p>
      </div>
    </div>
  );
}

function PrepareStep({
  image,
  editing,
  toolOriginal,
  result,
  textConfig,
  setTextConfig,
  busy,
  toolError,
  applied,
  previewRef,
  sizeLabel,
  selectedInches,
  onDragText,
  onOpenTool,
  onRun,
  onApply,
  onCancelTool,
  onReset,
  onBack,
  onContinue,
}: {
  image: PreparedImage;
  editing: ToolId | null;
  toolOriginal: PreparedImage | null;
  result: PreparedImage | null;
  textConfig: TextConfig;
  setTextConfig: (config: TextConfig) => void;
  busy: boolean;
  toolError: string | null;
  applied: ToolId[];
  previewRef: React.RefObject<HTMLDivElement | null>;
  sizeLabel: string;
  selectedInches: number;
  onDragText: (clientY: number) => void;
  onOpenTool: (tool: ToolId) => void;
  onRun: () => void;
  onApply: () => void;
  onCancelTool: () => void;
  onReset: () => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="grid min-h-[calc(96dvh-8rem)] gap-8 lg:min-h-[calc(84vh-8rem)] lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.65fr)] lg:gap-10">
      <div className="flex min-w-0 flex-col">
        <div className="flex items-baseline justify-between gap-5">
          <div>
            <p className="px-label text-muted-foreground">02 Prepare</p>
            <h2 className="px-serif mt-3 text-[2.2rem] md:text-[2.8rem]">Make it yours.</h2>
          </div>
          {applied.length ? (
            <button
              type="button"
              onClick={onReset}
              className="px-label px-underline text-muted-foreground"
            >
              Reset
            </button>
          ) : null}
        </div>
        <div
          ref={previewRef}
          className="relative mt-7 flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-secondary p-5 md:p-8"
        >
          {editing && result && toolOriginal ? (
            <BeforeAfter before={toolOriginal.dataUrl} after={result.dataUrl} />
          ) : (
            <>
              <img
                src={(editing && toolOriginal ? toolOriginal : image).dataUrl}
                alt="Your image being prepared"
                className="max-h-full max-w-full object-contain"
              />
              {editing === "text" && textConfig.text ? (
                <span
                  onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
                  onPointerMove={(event) => {
                    if (event.buttons === 1) onDragText(event.clientY);
                  }}
                  className="absolute w-full cursor-ns-resize px-[7%]"
                  style={{
                    top: `${textConfig.y}%`,
                    transform: "translateY(-50%)",
                    textAlign: textConfig.align,
                    fontFamily: textConfig.font,
                    fontSize: `${textConfig.size / 2.6}px`,
                    color: textConfig.color === "light" ? "#fff" : "#141414",
                  }}
                >
                  {textConfig.text}
                </span>
              ) : null}
            </>
          )}
        </div>
      </div>
      <aside className="flex flex-col justify-end lg:py-2">
        {editing && toolOriginal ? (
          <CustomToolPanel
            tool={editing}
            original={toolOriginal}
            result={result}
            cfg={textConfig}
            setCfg={setTextConfig}
            busy={busy}
            error={toolError}
            onRun={onRun}
            onApply={onApply}
            onCancel={onCancelTool}
            selectedSizeLabel={sizeLabel}
            selectedInches={selectedInches}
          />
        ) : (
          <>
            <div className="px-rule pt-6">
              <p className="px-label text-muted-foreground">Your image</p>
              <p className="px-meta mt-3 text-muted-foreground">
                Restore, enhance or add text. Changes remain editable until you continue.
              </p>
            </div>
            <ul className="mt-5 border-t border-hairline">
              {(["restore", "enhance", "text"] as const).map((tool) => (
                <li key={tool} className="border-b border-hairline">
                  <button
                    type="button"
                    onClick={() => onOpenTool(tool)}
                    className="px-label flex w-full items-center justify-between py-4 text-left"
                  >
                    {tool === "restore"
                      ? "Restore old photo"
                      : tool === "enhance"
                        ? "Enhance resolution"
                        : "Add text"}
                    <span aria-hidden>→</span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onContinue}
              className="px-label mt-8 w-full border border-foreground py-4 transition-colors hover:bg-foreground hover:text-background"
            >
              {applied.length ? "Continue →" : "Use as is →"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-label px-underline mt-5 text-muted-foreground"
            >
              Back to your photo
            </button>
          </>
        )}
      </aside>
    </div>
  );
}

function PreviewStep({
  image,
  material,
  sizeLabel,
  price,
  roomWidth,
  view,
  onViewChange,
  onBack,
  onEditConfiguration,
  onAddToBag,
}: {
  image: PreparedImage;
  material: BagMaterial;
  sizeLabel: string;
  price: number;
  roomWidth: number;
  view: PreviewView;
  onViewChange: (view: PreviewView) => void;
  onBack: () => void;
  onEditConfiguration: () => void;
  onAddToBag: () => void;
}) {
  return (
    <div className="grid min-h-[calc(96dvh-8rem)] gap-8 lg:min-h-[calc(84vh-8rem)] lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.65fr)] lg:gap-10">
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="px-label text-muted-foreground">03 Preview</p>
            <h2 className="px-serif mt-3 text-[2.2rem] md:text-[2.8rem]">Ready for the wall.</h2>
          </div>
          <div className="flex gap-5">
            {(["artwork", "detail", "room"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onViewChange(item)}
                aria-pressed={view === item}
                className={`px-label px-underline ${view === item ? "opacity-100 after:scale-x-100" : "opacity-45 hover:opacity-100"}`}
              >
                {item === "room" ? "In a room" : item}
              </button>
            ))}
          </div>
        </div>
        <div className="relative mt-7 flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-secondary p-5 md:p-8">
          {view === "room" ? (
            <div className="relative w-full overflow-hidden bg-secondary">
              <img
                src={sizeRoom}
                alt="A room used to preview your custom print at scale"
                className="block w-full"
              />
              <div
                className={`absolute left-[42%] top-[18%] -translate-x-1/2 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.7)] ${material === "metal" ? "px-gloss" : "px-weave"}`}
                style={{ width: `${roomWidth}%` }}
              >
                <img
                  src={image.dataUrl}
                  alt={`Your image as a ${materialName[material]} in a room`}
                  className="block w-full"
                />
              </div>
            </div>
          ) : (
            <div
              className={`relative max-h-full max-w-full overflow-hidden ${material === "metal" ? "px-gloss" : "px-weave"}`}
            >
              <img
                src={image.dataUrl}
                alt={`Your image as a ${materialName[material]}`}
                className={
                  view === "detail"
                    ? "block max-h-[58vh] max-w-full scale-[1.55] object-cover"
                    : "block max-h-[58vh] max-w-full object-contain"
                }
              />
              <span aria-hidden className={material === "metal" ? "px-edge" : "px-canvas-edge"} />
            </div>
          )}
        </div>
      </div>
      <aside className="flex flex-col justify-end lg:py-2">
        <div className="px-rule pt-6">
          <p className="px-label text-muted-foreground">Your print</p>
          <p className="px-label mt-4">{materialName[material]}</p>
          <p className="px-meta mt-1 text-muted-foreground">{sizeLabel}</p>
          <p className="px-price mt-4">${price}</p>
          <button
            type="button"
            onClick={onEditConfiguration}
            className="px-label px-underline mt-5 text-muted-foreground"
          >
            Edit configuration →
          </button>
        </div>
        <button
          type="button"
          onClick={onAddToBag}
          className="px-label mt-8 w-full border border-foreground py-4 transition-colors hover:bg-foreground hover:text-background"
        >
          Add to bag
        </button>
        <button
          type="button"
          onClick={onBack}
          className="px-label px-underline mt-5 text-muted-foreground"
        >
          Back to prepare
        </button>
      </aside>
    </div>
  );
}

function SuccessStep({
  material,
  sizeLabel,
  onViewBag,
  onContinueBrowsing,
}: {
  material: BagMaterial;
  sizeLabel: string;
  onViewBag: () => void;
  onContinueBrowsing: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(96dvh-7.5rem)] max-w-xl flex-col justify-center text-center md:min-h-[calc(84vh-8rem)]">
      <p className="px-label text-muted-foreground">Added to bag</p>
      <h2 className="px-serif mt-4 text-[2.8rem] leading-[1.02] md:text-[4rem]">
        Your print is ready.
      </h2>
      <p className="px-meta mt-5 text-muted-foreground">
        {materialName[material]} · {sizeLabel}
      </p>
      <button
        type="button"
        onClick={onViewBag}
        className="px-label mt-9 w-full border border-foreground py-4 transition-colors hover:bg-foreground hover:text-background"
      >
        View bag →
      </button>
      <button
        type="button"
        onClick={onContinueBrowsing}
        className="px-label px-underline mt-5 text-muted-foreground"
      >
        Continue browsing
      </button>
    </div>
  );
}
