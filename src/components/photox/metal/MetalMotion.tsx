import { Shell } from "../Section";
import { VideoFrame, ClipCaption } from "../video/VideoFrame";
import lightVideo from "@/assets/creator-light.mp4.asset.json";
import edgeVideo from "@/assets/creator-edge.mp4.asset.json";
import homeVideo from "@/assets/creator-home.mp4.asset.json";
import lightPoster from "@/assets/creator-light-poster.jpg";
import edgePoster from "@/assets/creator-edge-poster.jpg";
import homePoster from "@/assets/creator-home-poster.jpg";

export function MetalMotion() {
  return (
    <Shell label="See metal in motion" className="pb-16 md:pb-20">
      <div className="px-rule grid gap-8 pt-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-12">
          <h2 className="px-serif max-w-[14ch] text-[2rem] md:text-[2.6rem]">
            See metal in motion.
          </h2>
          <p className="px-meta mt-4 max-w-[40ch] text-muted-foreground">
            Light, surface and scale — seen from real angles.
          </p>
        </div>

        <figure className="md:col-span-7">
          <VideoFrame
            clip={{
              src: lightVideo.url,
              poster: lightPoster,
              alt: "Daylight travelling across the glossy surface of a metal print",
              ratio: "16 / 9",
            }}
          />
          <ClipCaption
            title="Light & reflection"
            body="See how the glossy surface responds as the viewing angle changes."
          />
        </figure>

        <figure className="md:col-span-5">
          <VideoFrame
            clip={{
              src: edgeVideo.url,
              poster: edgePoster,
              alt: "Hands tilting a metal print to show its thin edge",
              ratio: "4 / 5",
            }}
          />
          <ClipCaption
            title="Edge & scale"
            body="A thin rigid profile, seen at real-world scale."
          />
        </figure>

        <figure className="md:col-span-7 md:col-start-1">
          <VideoFrame
            clip={{
              src: homeVideo.url,
              poster: homePoster,
              alt: "A finished metal print hanging on a wall in a real living room",
              ratio: "16 / 9",
            }}
          />
          <ClipCaption
            title="On the wall"
            body="The finished metal print in a real interior."
          />
        </figure>
      </div>
    </Shell>
  );
}
