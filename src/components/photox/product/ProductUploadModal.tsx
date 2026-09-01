import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import sizeRoom from "@/assets/size-room.jpg";
import { BeforeAfter } from "@/components/photox/custom/BeforeAfter";
import { CustomToolPanel } from "@/components/photox/custom/CustomToolPanel";
import { PreviewImageFrame } from "@/components/photox/custom/PreviewImageFrame";
import { defaultTextConfig, runTool, type TextConfig, type ToolId } from "@/lib/image-tools";
import {
  acceptedTypes,
  readImageFile,
  usePreparedImage,
  type PreparedImage,
} from "@/lib/prepared-image";
import { sizeSteps, type ShopProduct } from "@/lib/shop-data";
import {
  materialName,
  orientedSizeLabel,
  unitPrice,
  useStore,
  type BagMaterial,
  type CropPosition,
  type PrintOrientation,
} from "@/lib/store";

type Step = "photo" | "prepare" | "preview" | "success";
type PreviewView = "artwork" | "detail" | "room";

type ProductUploadModalProps = {
  product: ShopProduct;
  material: BagMaterial;
  sizeIndex: number;
  sizeLabel: string;
  price: number;
  orientation: PrintOrientation;
  onSizeChange: (sizeIndex: number) => void;
  onClose: () => void;
};

const stepNumber: Record<Exclude<Step, "success">, number> = { photo: 1, prepare: 2, preview: 3 };
const steps: Array<{ key: Exclude<Step, "success">; label: string }> = [
  { key: "photo", label: "Your photo" },
  { key: "prepare", label: "Prepare" },
  { key: "preview", label: "Preview" },
];

const defaultCrop: CropPosition = { zoom: 1, x: 0, y: 0, aspectRatio: 1.5 };
const customizationDraftKey = "photox-pdp-customization-draft-v1";
const sharedPreviewStageClass =
  "h-[min(42dvh,420px)] md:h-[min(54dvh,560px)] lg:h-[min(60dvh,620px)]";
const preparePreviewStageClass =
  "h-[clamp(200px,34dvh,340px)] [@media(max-height:700px)]:h-[clamp(180px,30dvh,260px)] lg:h-[min(60dvh,620px)]";
const sharedPreviewPaddingClass = "p-5 md:p-6";

type CustomizationDraft = {
  productId: string;
  originalImage: PreparedImage;
  image: PreparedImage;
  applied: ToolId[];
  textConfig: TextConfig;
  appliedTextConfig: TextConfig | null;
  crop: CropPosition;
  cropApplied: boolean;
  previewView: PreviewView;
};

function readCustomizationDraft(productId: string) {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(customizationDraftKey);
    if (!raw) return null;
    const draft = JSON.parse(raw) as CustomizationDraft;
    return draft.productId === productId ? draft : null;
  } catch {
    return null;
  }
}

function printAspectRatio(sizeLabel: string) {
  const match = sizeLabel.match(/(\d+)\s*×\s*(\d+)/);
  if (!match) return 1.5;
  return Number(match[1]) / Number(match[2]);
}

function printLongEdge(sizeLabel: string) {
  const match = sizeLabel.match(/(\d+)\s*×\s*(\d+)/);
  if (!match) return 36;
  return Math.max(Number(match[1]), Number(match[2]));
}

export function ProductUploadModal({
  product,
  material,
  sizeIndex,
  sizeLabel,
  price,
  orientation,
  onSizeChange,
  onClose,
}: ProductUploadModalProps) {
  const { image: savedImage, setImage } = usePreparedImage();
  const { addToBag, closeDrawer, openDrawer } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const cropDragRef = useRef<{ clientX: number; clientY: number; crop: CropPosition } | null>(null);
  const toolRunRef = useRef(0);
  const [savedDraft] = useState(() => readCustomizationDraft(product.id));
  const [step, setStep] = useState<Step>(savedDraft || savedImage ? "prepare" : "photo");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [originalSourceImage, setOriginalSourceImage] = useState<PreparedImage | null>(
    savedDraft?.originalImage ?? savedImage,
  );
  const [currentWorkingImage, setCurrentWorkingImage] = useState<PreparedImage | null>(
    savedDraft?.image ?? savedImage,
  );
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ToolId | null>(null);
  const [toolOriginal, setToolOriginal] = useState<PreparedImage | null>(null);
  const [result, setResult] = useState<PreparedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [toolError, setToolError] = useState<string | null>(null);
  const [applied, setApplied] = useState<ToolId[]>(savedDraft?.applied ?? []);
  const [textConfig, setTextConfig] = useState<TextConfig>(
    savedDraft?.textConfig ?? defaultTextConfig,
  );
  const [appliedTextConfig, setAppliedTextConfig] = useState<TextConfig | null>(
    savedDraft?.appliedTextConfig ?? null,
  );
  const [previewView, setPreviewView] = useState<PreviewView>(savedDraft?.previewView ?? "room");
  const [cropNeedsAdjustment, setCropNeedsAdjustment] = useState(false);
  const [cropEditing, setCropEditing] = useState(false);
  const [cropSource, setCropSource] = useState<PreparedImage | null>(null);
  const [cropApplied, setCropApplied] = useState(savedDraft?.cropApplied ?? false);
  const [resetConfirming, setResetConfirming] = useState(false);
  const [crop, setCrop] = useState<CropPosition>({
    ...(savedDraft?.crop ?? defaultCrop),
    aspectRatio: printAspectRatio(sizeLabel),
  });
  const [draftCrop, setDraftCrop] = useState<CropPosition | null>(null);

  const image = currentWorkingImage ?? originalSourceImage;
  const prepareCrop = cropEditing && draftCrop ? draftCrop : crop;
  const selectedSize = sizeSteps[sizeIndex]!;
  const roomWidth =
    ((orientation === "landscape" ? selectedSize.inches * 1.5 : selectedSize.inches) * 100) / 108;
  const requiredPixels = printLongEdge(sizeLabel) * 150;
  const imageQuality =
    image && Math.max(image.width, image.height) >= requiredPixels ? "good" : "low";

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!originalSourceImage || !image) return;
    const draftForSession: CustomizationDraft = {
      productId: product.id,
      originalImage: originalSourceImage,
      image,
      applied,
      textConfig,
      appliedTextConfig,
      crop,
      cropApplied,
      previewView,
    };
    try {
      sessionStorage.setItem(customizationDraftKey, JSON.stringify(draftForSession));
    } catch {
      /* A large image may exceed available session storage. */
    }
  }, [
    applied,
    appliedTextConfig,
    crop,
    cropApplied,
    image,
    previewView,
    product.id,
    originalSourceImage,
    textConfig,
  ]);

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
    toolRunRef.current += 1;
    setError(null);
    if (!acceptedTypes.split(",").includes(file.type)) {
      setError("Choose a JPG, PNG or WebP image.");
      return;
    }
    setUploading(true);
    try {
      const next = await readImageFile(file);
      setImage(next);
      setOriginalSourceImage(next);
      setCurrentWorkingImage(next);
      setApplied([]);
      setTextConfig({ ...defaultTextConfig });
      setAppliedTextConfig(null);
      setCrop({ ...defaultCrop, aspectRatio: printAspectRatio(sizeLabel) });
      setCropNeedsAdjustment(false);
      setCropEditing(false);
      setCropSource(null);
      setDraftCrop(null);
      setCropApplied(false);
      setEditing(null);
      setToolOriginal(null);
      setResult(null);
      setBusy(false);
      setToolError(null);
      setResetConfirming(false);
      goTo("prepare");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not read that image.");
    } finally {
      setUploading(false);
    }
  };

  const openTool = (tool: ToolId) => {
    if (!currentWorkingImage) return;
    toolRunRef.current += 1;
    setCropEditing(false);
    setCropSource(null);
    // All preparation tools work from the accepted customer image only.
    // Text is non-destructive, but its preview still needs the exact same source.
    setToolOriginal(currentWorkingImage);
    setEditing(tool);
    setResult(null);
    setToolError(null);
    if (tool === "text") {
      const existing = appliedTextConfig ?? defaultTextConfig;
      setTextConfig({
        ...defaultTextConfig,
        ...existing,
        styleVersion: existing.styleVersion || (existing.text ? 1 : 0),
      });
    }
  };

  const runSelectedTool = async () => {
    if (!editing || !toolOriginal) return;
    const runId = ++toolRunRef.current;
    setBusy(true);
    setToolError(null);
    try {
      const nextResult = await runTool(editing, toolOriginal, textConfig);
      if (nextResult.dataUrl === toolOriginal.dataUrl) {
        throw new Error(
          editing === "restore"
            ? "We couldn't restore this image. Try again."
            : "We couldn't enhance this image. Try again.",
        );
      }
      if (
        editing === "enhance" &&
        (nextResult.width <= toolOriginal.width || nextResult.height <= toolOriginal.height)
      ) {
        throw new Error("We couldn't enhance this image. Try again.");
      }
      if (toolRunRef.current === runId) setResult(nextResult);
    } catch (reason) {
      if (toolRunRef.current === runId) {
        const fallback =
          editing === "restore"
            ? "We couldn't restore this image. Try again."
            : editing === "enhance"
              ? "We couldn't enhance this image. Try again."
              : "Something went wrong.";
        setToolError(reason instanceof Error ? reason.message : fallback);
      }
    } finally {
      if (toolRunRef.current === runId) setBusy(false);
    }
  };

  const applyResult = () => {
    if (!editing) return;
    toolRunRef.current += 1;
    if (editing === "text") {
      // Text stays as an accepted overlay. Keeping the underlying working image
      // unchanged means reopening Add text replaces the caption instead of
      // rasterising a second caption on top of the first one.
      setAppliedTextConfig({ ...textConfig });
    } else {
      if (!result) return;
      setCurrentWorkingImage(result);
      setImage(result);
    }
    setApplied((current) => (current.includes(editing) ? current : [...current, editing]));
    setEditing(null);
    setToolOriginal(null);
    setResult(null);
    setToolError(null);
  };

  const cancelTool = () => {
    toolRunRef.current += 1;
    setBusy(false);
    if (editing === "text") {
      const existing = appliedTextConfig ?? defaultTextConfig;
      setTextConfig({
        ...defaultTextConfig,
        ...existing,
        styleVersion: existing.styleVersion || (existing.text ? 1 : 0),
      });
    }
    setEditing(null);
    setToolOriginal(null);
    setResult(null);
    setToolError(null);
  };

  const resetPreparation = () => {
    if (!originalSourceImage) return;
    toolRunRef.current += 1;
    setCurrentWorkingImage(originalSourceImage);
    setImage(originalSourceImage);
    setApplied([]);
    setAppliedTextConfig(null);
    setTextConfig({ ...defaultTextConfig });
    setCrop({ ...defaultCrop, aspectRatio: printAspectRatio(sizeLabel) });
    setCropApplied(false);
    setCropNeedsAdjustment(false);
    setCropEditing(false);
    setCropSource(null);
    setDraftCrop(null);
    setEditing(null);
    setToolOriginal(null);
    setResult(null);
    setBusy(false);
    setToolError(null);
    setResetConfirming(false);
  };

  const requestReset = () => {
    if (applied.length || cropApplied) {
      setResetConfirming(true);
      return;
    }
    resetPreparation();
  };

  const startCropDrag = (clientX: number, clientY: number, startCrop: CropPosition) => {
    cropDragRef.current = { clientX, clientY, crop: startCrop };
  };

  const moveCrop = (clientX: number, clientY: number, bounds: DOMRect) => {
    const start = cropDragRef.current;
    if (!start) return;
    setDraftCrop({
      ...start.crop,
      x: Math.max(
        -40,
        Math.min(40, start.crop.x + ((clientX - start.clientX) / bounds.width) * 100),
      ),
      y: Math.max(
        -40,
        Math.min(40, start.crop.y + ((clientY - start.clientY) / bounds.height) * 100),
      ),
    });
  };

  const endCropDrag = () => {
    cropDragRef.current = null;
  };

  const updateCrop = (nextCrop: CropPosition) => setDraftCrop(nextCrop);

  const beginCrop = () => {
    if (!currentWorkingImage) return;
    // Cropping is an edit mode over the exact accepted working image. Capture
    // that image once so neither the PDP artwork nor a later fallback can
    // influence the crop workspace while it is open.
    setCropSource(currentWorkingImage);
    setDraftCrop({ ...crop });
    setCropEditing(true);
  };

  const applyCrop = () => {
    const nextCrop = draftCrop ?? crop;
    setCrop(nextCrop);
    setCropApplied(nextCrop.zoom !== 1 || nextCrop.x !== 0 || nextCrop.y !== 0);
    setCropNeedsAdjustment(false);
    setDraftCrop(null);
    setCropEditing(false);
    setCropSource(null);
  };

  const cancelCrop = () => {
    setDraftCrop(null);
    setCropEditing(false);
    setCropSource(null);
  };

  const resetCrop = () => {
    setDraftCrop({ ...defaultCrop, aspectRatio: (draftCrop ?? crop).aspectRatio });
  };

  const changePreviewSize = (nextSizeIndex: number) => {
    if (nextSizeIndex === sizeIndex) return;
    const nextAspectRatio = printAspectRatio(orientedSizeLabel(nextSizeIndex, orientation));
    if (Math.abs(crop.aspectRatio - nextAspectRatio) > 0.01) {
      setCrop((current) => ({ ...current, aspectRatio: nextAspectRatio }));
      setCropNeedsAdjustment(true);
    }
    onSizeChange(nextSizeIndex);
  };

  const addCustomizedPrint = () => {
    if (!image || !originalSourceImage) return;
    addToBag({
      productId: "custom-print",
      material,
      sizeIndex,
      orientation,
      qty: 1,
      customization: {
        originalImage: originalSourceImage,
        image,
        appliedTools: applied,
        textConfig: appliedTextConfig ?? undefined,
        crop,
        startingPointId: product.id,
        price,
        preview: previewView,
        orientation,
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
      <section
        className={`relative z-10 flex h-[96dvh] w-full flex-col overflow-hidden border border-foreground/15 bg-paper shadow-[0_16px_38px_rgba(30,25,20,0.08)] md:h-[84vh] md:w-[86vw] md:max-w-[1280px] ${step === "prepare" ? "px-prepare-modal" : ""}`}
      >
        <header className="relative z-10 shrink-0 flex items-center justify-between gap-4 border-b border-hairline bg-paper px-6 py-5 md:px-8">
          <p id="customize-print-title" className="px-label shrink-0">
            Customize your print
          </p>
          <ol
            className="hidden min-w-0 items-center justify-center gap-11 lg:gap-16 md:flex"
            aria-label="Customization progress"
          >
            {steps.map((item) => {
              const active = step === item.key;
              const complete =
                step === "success" ||
                (step !== "success" && stepNumber[item.key] < stepNumber[step]);
              const canReturn = Boolean(image) && complete;
              return (
                <li
                  key={item.key}
                  className={`px-label whitespace-nowrap ${active ? "text-foreground" : complete ? "text-muted-foreground" : "text-foreground/35"}`}
                >
                  <button
                    type="button"
                    disabled={!canReturn}
                    onClick={() => canReturn && goTo(item.key)}
                    className="disabled:cursor-default"
                  >
                    <span className="mr-1.5 opacity-70">0{stepNumber[item.key]}</span>
                    {item.label}
                  </button>
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

        <div
          className={`min-h-0 flex-1 px-6 py-7 md:px-8 md:py-8 ${
            step === "prepare" && image ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          <div
            key={step}
            className={`${animation} ${step === "prepare" && image ? "h-full min-h-0" : ""}`}
          >
            {step === "photo" ? (
              <PhotoStep
                image={image}
                dragOver={dragOver}
                uploading={uploading}
                error={error}
                material={material}
                sizeLabel={sizeLabel}
                price={price}
                orientation={orientation}
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
                appliedTextConfig={appliedTextConfig}
                setTextConfig={setTextConfig}
                busy={busy}
                toolError={toolError}
                applied={applied}
                crop={prepareCrop}
                cropSource={cropSource}
                cropApplied={cropApplied}
                imageQuality={imageQuality}
                cropEditing={cropEditing}
                previewRef={previewRef}
                sizeLabel={sizeLabel}
                selectedInches={selectedSize.inches}
                onCropChange={updateCrop}
                onCropStart={startCropDrag}
                onCropMove={moveCrop}
                onCropEnd={endCropDrag}
                onEnterCrop={beginCrop}
                onApplyCrop={applyCrop}
                onCancelCrop={cancelCrop}
                onResetCrop={resetCrop}
                onOpenTool={openTool}
                onRun={runSelectedTool}
                onApply={applyResult}
                onCancelTool={cancelTool}
                resetConfirming={resetConfirming}
                onReset={requestReset}
                onConfirmReset={resetPreparation}
                onCancelReset={() => setResetConfirming(false)}
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
                crop={crop}
                sizeIndex={sizeIndex}
                orientation={orientation}
                cropNeedsAdjustment={cropNeedsAdjustment}
                textConfig={appliedTextConfig}
                view={previewView}
                onViewChange={setPreviewView}
                onBack={() => goTo("prepare")}
                onSizeChange={changePreviewSize}
                onAdjustCrop={() => {
                  beginCrop();
                  goTo("prepare");
                }}
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
  orientation,
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
  orientation: PrintOrientation;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (file: File | undefined) => void;
  onPick: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="grid min-h-[calc(96dvh-8rem)] gap-8 lg:min-h-[calc(84vh-8rem)] lg:grid-cols-[minmax(0,7fr)_minmax(260px,3fr)] lg:gap-8">
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
        className={`relative flex ${sharedPreviewStageClass} ${sharedPreviewPaddingClass} items-center justify-center overflow-hidden border transition-colors duration-300 ${
          image
            ? "border-transparent bg-secondary"
            : dragOver
              ? "border-foreground bg-secondary"
              : "border-dashed border-hairline bg-secondary/35"
        }`}
      >
        {image ? (
          <PreviewImageFrame image={image} alt="Your uploaded image" />
        ) : (
          <div className="text-center">
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
          </div>
        )}
        {error ? <p className="px-meta absolute bottom-6 text-destructive">{error}</p> : null}
      </div>
      <aside className="flex flex-col lg:pt-0">
        <div className="px-rule pt-5 lg:pt-0">
          <p className="px-label text-muted-foreground">Your print</p>
          <p className="px-label mt-4">{materialName[material]}</p>
          <p className="px-meta mt-2 text-muted-foreground">{sizeLabel}</p>
          <p className="px-meta mt-1 text-muted-foreground">
            {orientation === "landscape" ? "Landscape" : "Portrait"}
          </p>
          <p className="px-price mt-5">${price}</p>
        </div>
        <div className="mt-7">
          {image ? (
            <>
              <button
                type="button"
                onClick={onContinue}
                className="px-label w-full border border-foreground py-4 transition-colors hover:bg-foreground hover:text-background"
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
            </>
          ) : (
            <button
              type="button"
              onClick={onPick}
              disabled={uploading}
              className="px-label w-full border border-foreground py-4 transition-colors hover:bg-foreground hover:text-background disabled:opacity-45"
            >
              {uploading ? "Preparing image…" : "Choose image →"}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

function PrepareStep({
  image,
  editing,
  toolOriginal,
  result,
  textConfig,
  appliedTextConfig,
  setTextConfig,
  busy,
  toolError,
  applied,
  crop,
  cropSource,
  cropApplied,
  imageQuality,
  cropEditing,
  previewRef,
  sizeLabel,
  selectedInches,
  onCropChange,
  onCropStart,
  onCropMove,
  onCropEnd,
  onEnterCrop,
  onApplyCrop,
  onCancelCrop,
  onResetCrop,
  onOpenTool,
  onRun,
  onApply,
  onCancelTool,
  resetConfirming,
  onReset,
  onConfirmReset,
  onCancelReset,
  onBack,
  onContinue,
}: {
  image: PreparedImage;
  editing: ToolId | null;
  toolOriginal: PreparedImage | null;
  result: PreparedImage | null;
  textConfig: TextConfig;
  appliedTextConfig: TextConfig | null;
  setTextConfig: (config: TextConfig) => void;
  busy: boolean;
  toolError: string | null;
  applied: ToolId[];
  crop: CropPosition;
  cropSource: PreparedImage | null;
  cropApplied: boolean;
  imageQuality: "good" | "low";
  cropEditing: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  sizeLabel: string;
  selectedInches: number;
  onCropChange: (crop: CropPosition) => void;
  onCropStart: (clientX: number, clientY: number, crop: CropPosition) => void;
  onCropMove: (clientX: number, clientY: number, bounds: DOMRect) => void;
  onCropEnd: () => void;
  onEnterCrop: () => void;
  onApplyCrop: () => void;
  onCancelCrop: () => void;
  onResetCrop: () => void;
  onOpenTool: (tool: ToolId) => void;
  onRun: () => void;
  onApply: () => void;
  onCancelTool: () => void;
  resetConfirming: boolean;
  onReset: () => void;
  onConfirmReset: () => void;
  onCancelReset: () => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const shouldShowReset = applied.length > 0 || cropApplied;

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)] lg:grid-rows-1 lg:gap-8">
      <div className="relative flex min-w-0 flex-col lg:static lg:h-full">
        <div
          ref={previewRef}
          className={`relative flex w-full ${preparePreviewStageClass} ${sharedPreviewPaddingClass} shrink-0 items-center justify-center overflow-hidden bg-secondary/65`}
        >
          {!cropEditing && resetConfirming ? (
            <div className="absolute right-5 top-5 z-20 w-[12rem] border border-hairline bg-paper p-4 shadow-[0_8px_18px_rgba(20,20,20,0.08)]">
              <p className="px-label">Reset all edits?</p>
              <div className="mt-4 flex items-center gap-4">
                <button type="button" onClick={onConfirmReset} className="px-label px-underline">
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onCancelReset}
                  className="px-label px-underline text-muted-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : !cropEditing && shouldShowReset ? (
            <button
              type="button"
              onClick={onReset}
              className="px-label px-underline absolute right-5 top-5 z-10 text-foreground/70"
            >
              Reset
            </button>
          ) : null}
          {editing && result && toolOriginal ? (
            <BeforeAfter
              before={toolOriginal.dataUrl}
              after={result.dataUrl}
              image={toolOriginal}
              beforeLabel="Original"
              afterLabel={
                editing === "restore" ? "Restored" : editing === "enhance" ? "Enhanced" : "Edited"
              }
            />
          ) : cropEditing && cropSource ? (
            <div
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                onCropStart(event.clientX, event.clientY, crop);
              }}
              onPointerMove={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  onCropMove(
                    event.clientX,
                    event.clientY,
                    event.currentTarget.getBoundingClientRect(),
                  );
                }
              }}
              onPointerUp={onCropEnd}
              onPointerCancel={onCropEnd}
              className="relative h-full max-w-full touch-none overflow-hidden bg-background [container-type:inline-size] cursor-grab active:cursor-grabbing"
              style={{ aspectRatio: crop.aspectRatio }}
            >
              <img
                src={cropSource.dataUrl}
                alt="Your image being prepared"
                draggable={false}
                className="absolute inset-0 h-full w-full select-none object-cover"
                style={{ transform: `translate(${crop.x}%, ${crop.y}%) scale(${crop.zoom})` }}
              />
              {appliedTextConfig?.text ? <AppliedTextOverlay config={appliedTextConfig} /> : null}
              <span className="px-label absolute left-4 top-4 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
                Printable area
              </span>
            </div>
          ) : (
            <PreviewImageFrame
              image={editing && toolOriginal ? toolOriginal : image}
              alt="Your full uploaded image"
              aspectRatio={crop.aspectRatio}
              content={
                <PreparedPrintImage
                  image={editing && toolOriginal ? toolOriginal : image}
                  crop={crop}
                  alt="Your prepared print"
                  className="h-full w-full"
                />
              }
            >
              {editing === "text" && textConfig.text && textConfig.styleVersion > 0 ? (
                <TextPreviewOverlay config={textConfig} onChange={setTextConfig} />
              ) : appliedTextConfig?.text ? (
                <AppliedTextOverlay config={appliedTextConfig} />
              ) : null}
            </PreviewImageFrame>
          )}
        </div>
      </div>
      <aside className="flex min-h-0 min-w-0 flex-col overflow-y-auto overscroll-contain border-t border-hairline pt-6 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:h-full lg:overflow-visible lg:border-t-0 lg:pt-0 lg:pb-0">
        {editing && toolOriginal ? (
          <div
            key={editing}
            className="px-panel-transition min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-3 lg:[scrollbar-color:rgba(20,20,20,0.28)_transparent] lg:[scrollbar-width:thin]"
          >
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
              onBack={onCancelTool}
              normalFlowOnMobile
              selectedSizeLabel={sizeLabel}
              selectedInches={selectedInches}
            />
          </div>
        ) : cropEditing && cropSource ? (
          <CropToolPanel
            crop={crop}
            onChange={onCropChange}
            onApply={onApplyCrop}
            onBack={onCancelCrop}
            onReset={onResetCrop}
          />
        ) : (
          <div key="image-preparation" className="px-panel-transition flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-3 lg:[scrollbar-color:rgba(20,20,20,0.28)_transparent] lg:[scrollbar-width:thin]">
              <p className="px-label text-muted-foreground">Image preparation</p>
              <div className="flex items-baseline justify-between gap-6">
                <p className="px-label mt-5">Image quality</p>
                <p className="px-label">{imageQuality}</p>
              </div>
              <p className="px-meta mt-3 text-muted-foreground">
                {imageQuality === "good"
                  ? "Your image has enough detail for this selected print size."
                  : "This image may appear soft at the selected print size."}
              </p>
              {imageQuality === "low" ? (
                <button
                  type="button"
                  onClick={() => onOpenTool("enhance")}
                  className="px-label px-underline mt-4 text-muted-foreground"
                >
                  Enhance resolution →
                </button>
              ) : null}
              <ul className="mt-6 border-t border-hairline">
                <li className="border-b border-hairline">
                  <button
                    type="button"
                    onClick={onEnterCrop}
                    className="px-label flex w-full items-center justify-between py-4 text-left"
                  >
                    <span>Crop &amp; position</span>
                    <span aria-hidden>{cropApplied ? "✓" : "→"}</span>
                  </button>
                </li>
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
                      <span aria-hidden>{applied.includes(tool) ? "✓" : "→"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 shrink-0 border-t border-hairline pt-5 lg:mt-0">
              <button
                type="button"
                onClick={onContinue}
                className="px-label w-full border border-foreground py-4 transition-colors hover:bg-foreground hover:text-background"
              >
                Preview your print →
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-label px-underline mt-5 text-muted-foreground"
              >
                Back to your photo
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function CropToolPanel({
  crop,
  onChange,
  onApply,
  onBack,
  onReset,
}: {
  crop: CropPosition;
  onChange: (crop: CropPosition) => void;
  onApply: () => void;
  onBack: () => void;
  onReset: () => void;
}) {
  return (
    <div className="px-panel-transition flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-3 lg:[scrollbar-color:rgba(20,20,20,0.28)_transparent] lg:[scrollbar-width:thin]">
        <button
          type="button"
          onClick={onBack}
          className="px-label px-underline mb-6 inline-block text-muted-foreground"
        >
          ← Back
        </button>
        <div className="px-rule pt-6">
          <p className="px-label text-muted-foreground">Image preparation</p>
          <h3 className="px-label mt-2">Crop &amp; position</h3>
          <p className="px-meta mt-2 max-w-[38ch] text-muted-foreground">
            Drag your image in the printable area, then adjust the zoom.
          </p>
        </div>
        <label htmlFor="crop-zoom" className="px-label mt-8 block text-muted-foreground">
          Zoom
        </label>
        <input
          id="crop-zoom"
          type="range"
          min={1}
          max={2.25}
          step={0.01}
          value={crop.zoom}
          onChange={(event) => onChange({ ...crop, zoom: Number(event.target.value) })}
          className="mt-3 w-full accent-foreground"
        />
        <button
          type="button"
          onClick={onReset}
          className="px-label px-underline mt-5 inline-block text-muted-foreground"
        >
          Reset crop
        </button>
      </div>
      <div className="mt-8 shrink-0 border-t border-hairline pt-5 lg:sticky lg:bottom-0 lg:z-10 lg:mx-0 lg:bg-paper lg:px-0 lg:pb-0 lg:backdrop-blur-sm">
        <button
          type="button"
          onClick={onApply}
          className="px-label w-full border border-foreground py-4 text-center transition-colors duration-300 hover:bg-foreground hover:text-background"
        >
          Apply crop →
        </button>
      </div>
    </div>
  );
}

function TextPreviewOverlay({
  config,
  onChange,
}: {
  config: TextConfig;
  onChange: (config: TextConfig) => void;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const dragOffset = useRef<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const target = textRef.current;
    const frame = target?.parentElement;
    if (!target || !frame) return;

    const constrain = () => {
      const imageBounds = frame.getBoundingClientRect();
      const textBounds = target.getBoundingClientRect();
      if (!imageBounds.width || !imageBounds.height) return;
      const margin = Math.max(3, Math.min(20, imageBounds.width * 0.025));
      const availableWidth = imageBounds.width - margin * 2;
      const availableHeight = imageBounds.height - margin * 2;
      const fittedScale = Math.min(
        1,
        availableWidth / textBounds.width,
        availableHeight / textBounds.height,
      );
      if (fittedScale < 0.995) {
        // Size is normalized to the printable frame. Persist the fitted value
        // rather than adding a temporary CSS scale that would be lost on Apply.
        onChange({ ...config, size: Math.max(8, config.size * fittedScale) });
        return;
      }

      const halfWidth = textBounds.width / 2;
      const halfHeight = textBounds.height / 2;
      const desiredX = imageBounds.left + ((config.x ?? 50) / 100) * imageBounds.width;
      const desiredY = imageBounds.top + (config.y / 100) * imageBounds.height;
      const x = Math.min(
        Math.max(desiredX, imageBounds.left + margin + halfWidth),
        imageBounds.right - margin - halfWidth,
      );
      const y = Math.min(
        Math.max(desiredY, imageBounds.top + margin + halfHeight),
        imageBounds.bottom - margin - halfHeight,
      );
      const next = {
        x: ((x - imageBounds.left) / imageBounds.width) * 100,
        y: ((y - imageBounds.top) / imageBounds.height) * 100,
      };
      if (Math.abs(next.x - (config.x ?? 50)) > 0.1 || Math.abs(next.y - config.y) > 0.1) {
        onChange({ ...config, ...next });
      }
    };

    constrain();
    const observer = new ResizeObserver(constrain);
    observer.observe(frame);
    observer.observe(target);
    return () => observer.disconnect();
  }, [config, onChange]);

  const moveTo = (target: HTMLSpanElement, clientX: number, clientY: number) => {
    const imageBounds = target.parentElement?.getBoundingClientRect();
    const textBounds = target.getBoundingClientRect();
    if (!imageBounds) return;
    const margin = Math.max(3, Math.min(20, imageBounds.width * 0.025));
    const halfWidth = textBounds.width / 2;
    const halfHeight = textBounds.height / 2;
    const x = Math.min(
      Math.max(clientX, imageBounds.left + margin + halfWidth),
      imageBounds.right - margin - halfWidth,
    );
    const y = Math.min(
      Math.max(clientY, imageBounds.top + margin + halfHeight),
      imageBounds.bottom - margin - halfHeight,
    );
    onChange({
      ...config,
      x: ((x - imageBounds.left) / imageBounds.width) * 100,
      y: ((y - imageBounds.top) / imageBounds.height) * 100,
    });
  };

  return (
    <span
      ref={textRef}
      onPointerDown={(event) => {
        event.preventDefault();
        const bounds = event.currentTarget.getBoundingClientRect();
        dragOffset.current = {
          x: event.clientX - (bounds.left + bounds.width / 2),
          y: event.clientY - (bounds.top + bounds.height / 2),
        };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
        const offset = dragOffset.current ?? { x: 0, y: 0 };
        moveTo(event.currentTarget, event.clientX - offset.x, event.clientY - offset.y);
      }}
      onPointerUp={() => {
        dragOffset.current = null;
      }}
      onPointerCancel={() => {
        dragOffset.current = null;
      }}
      className="absolute z-10 block max-w-[95%] select-none whitespace-pre-wrap break-words leading-[1.05] touch-none cursor-grab active:cursor-grabbing"
      style={{
        left: `${config.x ?? 50}%`,
        top: `${config.y}%`,
        transform: "translate(-50%, -50%)",
        textAlign: config.align,
        fontFamily: config.font,
        fontWeight: config.fontWeight,
        fontStyle: config.fontStyle,
        letterSpacing: config.letterSpacing,
        lineHeight: config.lineHeight,
        textTransform: config.textTransform,
        fontSize: `clamp(8px, ${config.size * 0.09}cqw, 48px)`,
        color: config.color === "light" ? "#fff" : "#141414",
        textShadow:
          config.color === "light"
            ? "0 1px 7px rgba(0,0,0,0.52)"
            : "0 1px 7px rgba(255,255,255,0.4)",
      }}
    >
      {config.text}
    </span>
  );
}

function PreviewStep({
  image,
  material,
  sizeLabel,
  price,
  roomWidth,
  crop,
  sizeIndex,
  orientation,
  cropNeedsAdjustment,
  textConfig,
  view,
  onViewChange,
  onBack,
  onSizeChange,
  onAdjustCrop,
  onAddToBag,
}: {
  image: PreparedImage;
  material: BagMaterial;
  sizeLabel: string;
  price: number;
  roomWidth: number;
  crop: CropPosition;
  sizeIndex: number;
  orientation: PrintOrientation;
  cropNeedsAdjustment: boolean;
  textConfig: TextConfig | null;
  view: PreviewView;
  onViewChange: (view: PreviewView) => void;
  onBack: () => void;
  onSizeChange: (sizeIndex: number) => void;
  onAdjustCrop: () => void;
  onAddToBag: () => void;
}) {
  return (
    <div className="grid min-h-[calc(96dvh-8rem)] gap-8 lg:min-h-[calc(84vh-8rem)] lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.65fr)] lg:gap-10">
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
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
        <div
          className={`relative mt-1 flex ${sharedPreviewStageClass} ${sharedPreviewPaddingClass} shrink-0 items-center justify-center overflow-hidden bg-secondary`}
        >
          {view === "room" ? (
            <div className="relative w-full overflow-hidden bg-secondary">
              <img
                src={sizeRoom}
                alt="A room used to preview your custom print at scale"
                className="block w-full"
              />
              <div
                className="px-gloss absolute left-[42%] top-[18%] -translate-x-1/2 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.7)] transition-[width] duration-300 ease-out"
                style={{ width: `${roomWidth}%`, aspectRatio: crop.aspectRatio }}
              >
                <PreparedPrintImage
                  image={image}
                  crop={crop}
                  textConfig={textConfig}
                  alt={`Your image as a ${materialName[material]} in a room`}
                  className="h-full w-full"
                />
              </div>
            </div>
          ) : (
            <div
              className="px-gloss relative w-full max-w-[46rem] overflow-hidden"
              style={{ aspectRatio: crop.aspectRatio }}
            >
              <PreparedPrintImage
                image={image}
                crop={crop}
                textConfig={textConfig}
                alt={`Your image as a ${materialName[material]}`}
                className={view === "detail" ? "scale-[1.55]" : ""}
              />
              <span aria-hidden className="px-edge" />
            </div>
          )}
        </div>
      </div>
      <aside className="flex flex-col lg:py-0">
        <div className="px-rule pt-0">
          <p className="px-label text-muted-foreground">Your print</p>
          <p className="px-label mt-4">{materialName[material]}</p>
          <div className="mt-6">
            <p className="px-label text-muted-foreground">Size</p>
            <ul className="mt-3 border-t border-hairline">
              {sizeSteps.map((size, index) => {
                const selected = index === sizeIndex;
                return (
                  <li key={size.label} className="border-b border-hairline">
                    <button
                      type="button"
                      onClick={() => onSizeChange(index)}
                      aria-pressed={selected}
                      className={`flex w-full items-baseline justify-between gap-5 py-2.5 text-left transition-opacity ${selected ? "opacity-100" : "opacity-45 hover:opacity-100"}`}
                    >
                      <span className="px-label">{orientedSizeLabel(index, orientation)}</span>
                      <span className="px-price">${unitPrice(material, index)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          {cropNeedsAdjustment ? (
            <div className="mt-5 border-l-2 border-foreground/40 pl-4">
              <p className="px-label">Crop needs adjustment</p>
              <button
                type="button"
                onClick={onAdjustCrop}
                className="px-label px-underline mt-3 text-muted-foreground"
              >
                Adjust crop →
              </button>
            </div>
          ) : null}
          <p className="px-price mt-5">${price}</p>
        </div>
        <div className="sticky bottom-0 z-10 -mx-1 mt-6 bg-paper/95 px-1 pb-3 pt-3 backdrop-blur-sm lg:static lg:mx-0 lg:mt-8 lg:bg-transparent lg:p-0">
          <button
            type="button"
            onClick={onAddToBag}
            className="px-label w-full border border-foreground py-4 transition-colors hover:bg-foreground hover:text-background"
          >
            Add to bag
          </button>
        </div>
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

function PreparedPrintImage({
  image,
  crop,
  textConfig,
  alt,
  className = "",
}: {
  image: PreparedImage;
  crop: CropPosition;
  textConfig?: TextConfig | null;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden [container-type:inline-size] ${className}`}
      style={{ aspectRatio: crop.aspectRatio }}
    >
      <img
        src={image.dataUrl}
        alt={alt}
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover"
        style={{ transform: `translate(${crop.x}%, ${crop.y}%) scale(${crop.zoom})` }}
      />
      {textConfig?.text ? <AppliedTextOverlay config={textConfig} /> : null}
    </div>
  );
}

function AppliedTextOverlay({ config }: { config: TextConfig }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute z-10 block max-w-[86%] select-none whitespace-pre-wrap break-words leading-[1.05]"
      style={{
        left: `${config.x ?? 50}%`,
        top: `${config.y}%`,
        transform: "translate(-50%, -50%)",
        textAlign: config.align,
        fontFamily: config.font,
        fontWeight: config.fontWeight,
        fontStyle: config.fontStyle,
        letterSpacing: config.letterSpacing,
        lineHeight: config.lineHeight,
        textTransform: config.textTransform,
        fontSize: `clamp(8px, ${config.size * 0.09}cqw, 48px)`,
        color: config.color === "light" ? "#fff" : "#141414",
        textShadow:
          config.color === "light"
            ? "0 1px 7px rgba(0,0,0,0.52)"
            : "0 1px 7px rgba(255,255,255,0.4)",
      }}
    >
      {config.text}
    </span>
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
