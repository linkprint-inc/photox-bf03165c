import { useRef, useState } from "react";

export type Clip = {
  src: string;
  poster: string;
  alt: string;
  ratio: string;
};

/**
 * Quiet video frame: static poster by default, short muted preview on desktop
 * hover, full playback with native controls on click. No media loads until the
 * viewer hovers or clicks.
 */
export function VideoFrame({ clip, className = "" }: { clip: Clip; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const preview = () => {
    if (window.matchMedia("(hover: none)").matches || playing) return;
    setArmed(true);
    requestAnimationFrame(() => {
      const v = ref.current;
      if (!v) return;
      v.muted = true;
      void v.play().catch(() => {});
    });
  };

  const stopPreview = () => {
    if (playing) return;
    const v = ref.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  const start = () => {
    setArmed(true);
    setPlaying(true);
    requestAnimationFrame(() => {
      const v = ref.current;
      if (!v) return;
      v.muted = false;
      v.currentTime = 0;
      void v.play().catch(() => {});
    });
  };

  return (
    <div
      className={["relative w-full overflow-hidden bg-secondary", className].join(" ")}
      style={{ aspectRatio: clip.ratio }}
      onMouseEnter={preview}
      onMouseLeave={stopPreview}
    >
      <img
        src={clip.poster}
        alt={clip.alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {armed ? (
        <video
          ref={ref}
          src={clip.src}
          poster={clip.poster}
          playsInline
          loop={!playing}
          preload="none"
          controls={playing}
          onEnded={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {!playing ? (
        <button
          type="button"
          onClick={start}
          aria-label={`Play video: ${clip.alt}`}
          className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur-sm transition-transform duration-300 hover:scale-105"
        >
          <span className="translate-x-[1px] text-[0.7rem] leading-none">▶</span>
        </button>
      ) : null}
    </div>
  );
}

export function ClipCaption({
  title,
  body,
  meta,
}: {
  title: string;
  body?: string;
  meta?: string;
}) {
  return (
    <figcaption className="mt-5">
      <p className="px-label">{title}</p>
      {body ? <p className="px-meta mt-2 max-w-[42ch] text-muted-foreground">{body}</p> : null}
      {meta ? <p className="px-meta mt-2 text-muted-foreground">{meta}</p> : null}
    </figcaption>
  );
}
