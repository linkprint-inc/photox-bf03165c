import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import roomLiving from "@/assets/room-living.jpg";
import roomWorkspace from "@/assets/room-workspace.jpg";
import roomDining from "@/assets/room-dining.jpg";
import roomBedroom from "@/assets/room-bedroom.jpg";

const strip = [
  { image: roomLiving, alt: "A metal print above a sofa in a daylit living room" },
  { image: roomWorkspace, alt: "A red abstract metal print above a workspace desk" },
  { image: roomDining, alt: "A city night metal print in a dining area" },
  { image: roomBedroom, alt: "A matte canvas above a bed in a dark bedroom" },
];

export function FinalMoment() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sequenceRef = useRef<HTMLDivElement | null>(null);
  const animationFrame = useRef<number | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFrame = useRef<number | null>(null);
  const sequenceWidth = useRef(0);
  const offset = useRef(0);
  const speed = useRef(1);
  const hovering = useRef(false);
  const manualPause = useRef(false);
  const dragging = useRef<{ pointerId: number; x: number } | null>(null);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const renderTrack = useCallback(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translate3d(${-offset.current}px, 0, 0)`;
  }, []);

  const measureSequence = useCallback(() => {
    const width = sequenceRef.current?.getBoundingClientRect().width ?? 0;
    if (!width) return;
    sequenceWidth.current = width;
    offset.current = ((offset.current % width) + width) % width;
    renderTrack();
  }, [renderTrack]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      {
        rootMargin: "160px 0px",
      },
    );
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sequence = sequenceRef.current;
    if (!sequence) return;
    measureSequence();
    const observer = new ResizeObserver(measureSequence);
    observer.observe(sequence);
    return () => observer.disconnect();
  }, [measureSequence]);

  useEffect(() => {
    if (reducedMotion) {
      offset.current = 0;
      speed.current = 0;
      renderTrack();
      return;
    }
    if (!inView) return;

    const tick = (time: number) => {
      const previous = lastFrame.current ?? time;
      const delta = Math.min((time - previous) / 1000, 0.05);
      const targetSpeed = hovering.current || dragging.current || manualPause.current ? 0 : 1;
      const rate = 1 - Math.exp(-delta / 0.5);
      speed.current += (targetSpeed - speed.current) * rate;

      if (sequenceWidth.current) {
        offset.current =
          (offset.current + (sequenceWidth.current / 30) * speed.current * delta) %
          sequenceWidth.current;
        renderTrack();
      }

      lastFrame.current = time;
      animationFrame.current = requestAnimationFrame(tick);
    };

    lastFrame.current = null;
    animationFrame.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    };
  }, [inView, reducedMotion, renderTrack]);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    [],
  );

  const resumeAfter = useCallback((delay: number) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      resumeTimer.current = null;
      manualPause.current = false;
    }, delay);
  }, []);

  const endDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (dragging.current?.pointerId !== event.pointerId) return;
      dragging.current = null;
      setIsDragging(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      resumeAfter(event.pointerType === "touch" ? 1200 : 0);
    },
    [resumeAfter],
  );

  return (
    <section aria-label="Made for real walls" className="pb-24 md:pb-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="px-rule flex flex-wrap items-baseline justify-between gap-4 pt-8">
          <h2 className="px-label">Made for real walls</h2>
          <p className="px-meta text-muted-foreground">4.8 / 5 · 2,140 reviews</p>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={`mt-10 overflow-hidden px-6 pb-4 select-none touch-pan-y motion-reduce:overflow-x-auto ${
          isDragging ? "md:cursor-grabbing" : "md:cursor-grab"
        }`}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") hovering.current = true;
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") hovering.current = false;
        }}
        onPointerDown={(event) => {
          if (reducedMotion || (event.pointerType === "mouse" && event.button !== 0)) return;
          if (resumeTimer.current) clearTimeout(resumeTimer.current);
          manualPause.current = true;
          dragging.current = { pointerId: event.pointerId, x: event.clientX };
          setIsDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const activeDrag = dragging.current;
          if (!activeDrag || activeDrag.pointerId !== event.pointerId || !sequenceWidth.current)
            return;
          const delta = event.clientX - activeDrag.x;
          activeDrag.x = event.clientX;
          offset.current =
            (((offset.current - delta) % sequenceWidth.current) + sequenceWidth.current) %
            sequenceWidth.current;
          renderTrack();
          event.preventDefault();
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {[false, true].map((isDuplicate) => (
            <div
              key={isDuplicate ? "duplicate" : "primary"}
              ref={isDuplicate ? undefined : sequenceRef}
              className="flex shrink-0"
            >
              {strip.map((s) => (
                <div key={`${isDuplicate ? "duplicate-" : ""}${s.alt}`} className="shrink-0 pr-4">
                  <img
                    src={s.image}
                    alt={isDuplicate ? "" : s.alt}
                    aria-hidden={isDuplicate || undefined}
                    draggable={false}
                    loading="lazy"
                    className="h-[42vw] max-h-[380px] w-auto shrink-0 object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[1440px] px-6 md:px-10">
        <a href="/shop" className="px-label px-underline">
          Start with an idea →
        </a>
      </div>
    </section>
  );
}
