import { useState } from "react";
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
  const pair = pairs[index]!;

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

      <div key={index} className="px-fade mt-12 grid gap-10 md:grid-cols-12 md:gap-8">
        <figure className="md:col-span-8">
          <VideoFrame clip={pair.primary.clip} />
          <ClipCaption {...pair.primary} />
        </figure>
        <figure className="md:col-span-4">
          <VideoFrame clip={pair.secondary.clip} />
          <ClipCaption {...pair.secondary} />
        </figure>
      </div>

      <div className="mt-12 flex items-baseline justify-between">
        <p className="px-label text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(pairs.length).padStart(2, "0")}
        </p>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % pairs.length)}
          className="px-label px-underline"
        >
          Next →
        </button>
      </div>
    </Shell>
  );
}
