import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { PreparedImage } from "@/lib/prepared-image";

type FrameSize = { width: number; height: number };

function previewSize(
  image: PreparedImage,
  availableWidth: number,
  availableHeight: number,
  aspectRatio?: number,
): FrameSize {
  if (aspectRatio) {
    const width = Math.min(availableWidth, availableHeight * aspectRatio);
    return { width, height: width / aspectRatio };
  }
  const isPortrait = image.height > image.width;
  const isLandscape = image.width > image.height;
  const primaryScale = isPortrait
    ? availableHeight / image.height
    : isLandscape
      ? availableWidth / image.width
      : Math.min(availableWidth / image.width, availableHeight / image.height);
  const secondaryScale = isPortrait ? availableWidth / image.width : availableHeight / image.height;
  const scale = Math.min(1, primaryScale, secondaryScale);

  return { width: image.width * scale, height: image.height * scale };
}

/** Shows a complete source image inside a fixed editor stage without enlarging it past its natural size. */
export function PreviewImageFrame({
  image,
  alt,
  children,
  content,
  aspectRatio,
  className = "",
  imageClassName = "",
}: {
  image: PreparedImage;
  alt: string;
  children?: ReactNode;
  /** Replaces the default source-image element while retaining the exact measured frame. */
  content?: ReactNode;
  /** Lets crop/print previews use their committed printable ratio. */
  aspectRatio?: number;
  className?: string;
  imageClassName?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<FrameSize | null>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => {
      const { width, height } = stage.getBoundingClientRect();
      if (!width || !height) return;
      const next = previewSize(image, width, height, aspectRatio);
      setSize((current) =>
        current &&
        Math.abs(current.width - next.width) < 0.5 &&
        Math.abs(current.height - next.height) < 0.5
          ? current
          : next,
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [aspectRatio, image]);

  return (
    <div ref={stageRef} className={`flex h-full w-full items-center justify-center ${className}`}>
      <div
        className="relative shrink-0 [container-type:inline-size]"
        style={size ? { width: `${size.width}px`, height: `${size.height}px` } : undefined}
      >
        {content ?? (
          <img
            src={image.dataUrl}
            alt={alt}
            draggable={false}
            className={`block h-full w-full select-none object-contain ${imageClassName}`}
          />
        )}
        {children}
      </div>
    </div>
  );
}
