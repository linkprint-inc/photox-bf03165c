import { useEffect, useRef, useState } from "react";
import { Shell } from "../Section";
import { VideoFrame, ClipCaption, type Clip } from "./VideoFrame";
import homeVideo from "@/assets/creator-home.mp4.asset.json";
import unboxingVideo from "@/assets/creator-unboxing.mp4.asset.json";
import lightVideo from "@/assets/creator-light.mp4.asset.json";
import edgeVideo from "@/assets/creator-edge.mp4.asset.json";
import homePoster from "@/assets/creator-home-poster.jpg";
import unboxingPoster from "@/assets/creator-unboxing-poster.jpg";
import lightPoster from "@/assets/creator-light-poster.jpg";
import edgePoster from "@/assets/creator-edge-poster.jpg";

type Item = { clip: Clip; title: string; body: string; meta?: string };

const pairs: Array<{ primary: Item; secondary: Item }> = [
  {
    primary: {
      clip: {
        src: homeVideo.url,
        poster: homePoster,
        alt: "Daylight moving across a large metal print hanging in a living room",
        ratio: "16 / 9",
      },
      title: "Metal in a real home",
      body: "Filmed in an ordinary room, in ordinary light — no studio wall, no styling.",
      meta: "Metal Print",
    },
    secondary: {
      clip: {
        src: unboxingVideo.url,
        poster: unboxingPoster,
        alt: "A flat metal print being lifted from its box and held against a wall",
        ratio: "4 / 5",
      },
      title: "From unboxing to the wall",
      body: "Flat packed, lifted out and positioned in a single pass.",
      meta: "Metal Print",
    },
  },
  {
    primary: {
      clip: {
        src: lightVideo.url,
        poster: lightPoster,
        alt: "Close-up of light travelling across the glossy surface of a metal print",
        ratio: "16 / 9",
      },
      title: "Light across the surface",
      body: "The gloss keeps moving as the light does — something a still frame can't show.",
      meta: "Metal Print",
    },
    secondary: {
      clip: {
        src: edgeVideo.url,
        poster: edgePoster,
        alt: "Hands tilting a metal print to reveal its thin edge and physical scale",
        ratio: "4 / 5",
      },
      title: "Held at real scale",
      body: "A thin rigid panel, seen next to a person rather than a size chart.",
      meta: "Metal Print",
    },
  },
];

export function CreatorReel() {
  const [index, setIndex] = useState(0);
  const [transition, setTransition] = useState<{
    nextIndex: number;
    reducedMotion: boolean;
  } | null>(null);
  const [arrowNudged, setArrowNudged] = useState(false);
  const transitionTimer = useRef<number | undefined>(undefined);
  const arrowTimer = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      if (transitionTimer.current !== undefined) window.clearTimeout(transitionTimer.current);
      if (arrowTimer.current !== undefined) window.clearTimeout(arrowTimer.current);
    },
    [],
  );

  const showNext = () => {
    if (transition || transitionTimer.current !== undefined) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nextIndex = (index + 1) % pairs.length;

    setArrowNudged(true);
    if (arrowTimer.current !== undefined) window.clearTimeout(arrowTimer.current);
    arrowTimer.current = window.setTimeout(() => setArrowNudged(false), 170);

    setTransition({ nextIndex, reducedMotion });
    transitionTimer.current = window.setTimeout(
      () => {
        transitionTimer.current = undefined;
        setIndex(nextIndex);
        setTransition(null);
      },
      reducedMotion ? 200 : 450,
    );
  };

  return (
    <Shell label="Seen in real life" className="pb-24 md:pb-32">
      <div className="px-rule pt-6">
        <p className="px-label text-muted-foreground">Seen in real life</p>
        <h2 className="px-serif mt-5 max-w-[16ch] text-[2.2rem] md:text-[3rem]">
          See <span className="normal-case">photoX</span> beyond the studio.
        </h2>
        <p className="px-meta mt-4 text-muted-foreground">
          Real spaces. Real light. Real perspectives.
        </p>
      </div>

      <div className="relative mt-12 grid">
        {pairs.map((pair, pairIndex) => {
          const outgoing = transition !== null && pairIndex === index;
          const incoming = transition !== null && pairIndex === transition.nextIndex;
          const visible = transition === null && pairIndex === index;
          const reducedMotion = transition?.reducedMotion ?? false;
          const duration = reducedMotion ? "duration-[200ms]" : "duration-[450ms]";
          const groupState = outgoing
            ? "-translate-x-[14px] opacity-0"
            : incoming || visible
              ? "translate-x-0 opacity-100"
              : "translate-x-[14px] opacity-0";
          const mediaState = outgoing
            ? "scale-[0.995]"
            : incoming || visible
              ? "scale-100"
              : "scale-[1.005]";
          const captionState = reducedMotion
            ? outgoing || incoming || visible
              ? "translate-x-0 opacity-100"
              : "translate-x-0 opacity-0"
            : outgoing || incoming || visible
              ? "translate-x-0 opacity-100"
              : "translate-x-[6px] opacity-0";

          return (
            <div
              key={pair.primary.title}
              aria-hidden={pairIndex !== (transition?.nextIndex ?? index)}
              className={`col-start-1 row-start-1 grid gap-10 transition-[opacity,transform] ${duration} ease-[cubic-bezier(0.22,1,0.36,1)] md:grid-cols-12 md:gap-8 ${
                visible ? "pointer-events-auto" : "pointer-events-none"
              } ${groupState} ${reducedMotion ? "motion-reduce:translate-x-0" : ""}`}
            >
              <figure className="md:col-span-8">
                <div
                  className={`transition-transform ${duration} ease-[cubic-bezier(0.22,1,0.36,1)] ${mediaState} ${
                    reducedMotion ? "motion-reduce:scale-100" : ""
                  }`}
                >
                  <VideoFrame clip={pair.primary.clip} active={visible} />
                </div>
                <div
                  className={`transition-[opacity,transform] ${duration} ease-[cubic-bezier(0.22,1,0.36,1)] ${captionState} ${
                    incoming ? "delay-[40ms]" : "delay-0"
                  }`}
                >
                  <ClipCaption {...pair.primary} />
                </div>
              </figure>
              <figure className="md:col-span-4">
                <div
                  className={`transition-transform ${duration} ease-[cubic-bezier(0.22,1,0.36,1)] ${mediaState} ${
                    reducedMotion ? "motion-reduce:scale-100" : ""
                  }`}
                >
                  <VideoFrame clip={pair.secondary.clip} active={visible} />
                </div>
                <div
                  className={`transition-[opacity,transform] ${duration} ease-[cubic-bezier(0.22,1,0.36,1)] ${captionState} ${
                    incoming ? "delay-[40ms]" : "delay-0"
                  }`}
                >
                  <ClipCaption {...pair.secondary} />
                </div>
              </figure>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex items-baseline justify-between">
        <p className="relative h-[1em] min-w-[3rem] px-label text-muted-foreground">
          {pairs.map((_, pairIndex) => (
            <span
              key={pairIndex}
              className={`absolute inset-0 transition-opacity duration-[200ms] ${
                pairIndex === (transition?.nextIndex ?? index) ? "opacity-100" : "opacity-0"
              }`}
            >
              {String(pairIndex + 1).padStart(2, "0")} / {String(pairs.length).padStart(2, "0")}
            </span>
          ))}
        </p>
        <button
          type="button"
          onClick={showNext}
          disabled={transition !== null}
          className="group px-label px-underline px-next-trigger text-muted-foreground transition-colors duration-200 hover:text-foreground disabled:cursor-default"
        >
          Next{" "}
          <span
            className={`inline-block transition-transform duration-[170ms] md:group-hover:translate-x-[3px] ${
              arrowNudged ? "translate-x-[3px]" : ""
            }`}
          >
            →
          </span>
        </button>
      </div>
    </Shell>
  );
}
