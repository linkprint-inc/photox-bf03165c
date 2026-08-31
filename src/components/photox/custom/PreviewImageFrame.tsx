import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { PreparedImage } from "@/lib/prepared-image";

type FrameSize = { width: number; height: number };

function previewSize(
  image: PreparedImage,
  availableWidth: number,
  availableHeight: number,
): FrameSize {
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
  className = "",
  imageClassName = "",
}: {
  image: PreparedImage;
  alt: string;
  children?: ReactNode;
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
      const next = previewSize(image, width, height);
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
  }, [image]);

  return (
    <div ref={stageRef} className={`flex h-full w-full items-center justify-center ${className}`}>
      <div
        className="relative shrink-0"
        style={size ? { width: `${size.width}px`, height: `${size.height}px` } : undefined}
      >
        <img
          src={image.dataUrl}
          alt={alt}
          draggable={false}
          className={`block h-full w-full select-none object-contain ${imageClassName}`}
        />
        {children}
      </div>
    </div>
  );
}
