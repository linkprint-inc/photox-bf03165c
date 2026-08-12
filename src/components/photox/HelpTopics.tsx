import { useState } from "react";
import { Shell } from "./Section";
import helpChoosing from "@/assets/help-choosing.jpg";
import helpImage from "@/assets/help-image.jpg";
import helpOrders from "@/assets/help-orders.jpg";
import helpPrivacy from "@/assets/help-privacy.jpg";

type Visual =
  | { kind: "materials" }
  | { kind: "sizes" }
  | { kind: "resolution" }
  | { kind: "packaging" }
  | { kind: "image"; src: string; alt: string };

type Answer = {
  q: string;
  lines: { term?: string; body: string }[];
  visual: Visual;
};

type Topic = {
  num: string;
  title: string;
  titleTop: string;
  titleBottom: string;
  descriptor: string;
  image: string;
  alt: string;
  destination: { label: string; href: string };
  answers: Answer[];
};

const topics: Topic[] = [
  {
    num: "01",
    title: "Choosing your print",
    titleTop: "Choosing",
    titleBottom: "your print",
    descriptor: "Material, size and finish.",
    image: helpChoosing,
    alt: "Glossy metal print beside a textured frameless canvas print",
    destination: { label: "View size guide", href: "/shop#sizes" },
    answers: [
      {
        q: "Metal or canvas?",
        lines: [
          { term: "Metal", body: "Glossy, luminous and crisp. Ideal when you want colour, detail and reflected light." },
          { term: "Canvas", body: "Matte, tactile and softer. Ideal for a more traditional, textured finish." },
        ],
        visual: { kind: "materials" },
      },
      {
        q: "What size should I choose?",
        lines: [
          { body: "Match the print to the wall, not the room. On the same wall, each size reads very differently." },
          { body: "Every artwork lists its available sizes and price before you add it to the bag." },
        ],
        visual: { kind: "sizes" },
      },
      {
        q: "Which finish works best for photography?",
        lines: [
          { term: "Metal", body: "Holds fine detail and deep contrast — best for architecture, night and high-colour work." },
          { term: "Canvas", body: "Softens grain and glare — best for portraits, film scans and quieter tones." },
        ],
        visual: { kind: "materials" },
      },
      {
        q: "Can I see how it looks in a room?",
        lines: [
          { body: "Yes. Shop by Size on this page places one artwork in a fixed interior so only the print scale changes." },
          { body: "In the shop, Room view shows each artwork hung in a real space." },
        ],
        visual: { kind: "sizes" },
      },
    ],
  },
  {
    num: "02",
    title: "Your image",
    titleTop: "Your",
    titleBottom: "image",
    descriptor: "Custom prints and image quality.",
    image: helpImage,
    alt: "A photograph on a screen beside the same photograph as a physical print",
    destination: { label: "View photo tools", href: "/photo-tools" },
    answers: [
      {
        q: "Can I print my own photo or artwork?",
        lines: [
          { body: "Yes. Custom prints use your own file on the same metal and frameless canvas as the collection." },
          { body: "Upload the image, choose material and size, and the price updates with the size you pick." },
        ],
        visual: { kind: "image", src: helpImage, alt: "A photograph moving from screen to printed panel" },
      },
      {
        q: "Is my image large enough to print?",
        lines: [
          { body: "Larger prints need more pixels. As a guide, the longest edge of your file sets the comfortable print size." },
          { body: "If the file is small, Enhance Resolution can prepare it before printing." },
        ],
        visual: { kind: "resolution" },
      },
      {
        q: "Can an old photo be restored first?",
        lines: [
          { body: "Yes. Restore Old Photo repairs fading, marks and damage before the file goes to print." },
        ],
        visual: { kind: "image", src: helpImage, alt: "Prepared image ready for printing" },
      },
      {
        q: "Can I add text before printing?",
        lines: [
          { body: "Yes. Add Text places a name, date or short message on the image before it is printed." },
        ],
        visual: { kind: "image", src: helpImage, alt: "Image prepared with text before printing" },
      },
    ],
  },
  {
    num: "03",
    title: "Orders & delivery",
    titleTop: "Orders",
    titleBottom: "& delivery",
    descriptor: "Production, shipping and returns.",
    image: helpOrders,
    alt: "A print packed flat with corner protection and surface film",
    destination: { label: "Shipping & returns", href: "/shipping-returns" },
    answers: [
      {
        q: "How long does production take?",
        lines: [
          { body: "Every print is made to order. The production time for your material and size is confirmed at checkout and in your order confirmation." },
        ],
        visual: { kind: "packaging" },
      },
      {
        q: "How will my print be packaged?",
        lines: [
          { body: "Prints ship flat, with the surface filmed, the corners protected and the whole panel held inside a rigid outer carton." },
        ],
        visual: { kind: "packaging" },
      },
      {
        q: "How much is shipping?",
        lines: [
          { body: "Shipping is calculated from your destination and the size of the print, and is shown before you pay." },
        ],
        visual: { kind: "image", src: helpOrders, alt: "Packed print ready for shipping" },
      },
      {
        q: "What if my print arrives damaged?",
        lines: [
          { body: "Contact us with a photo of the packaging and the print, and we will resolve it under our returns terms." },
        ],
        visual: { kind: "image", src: helpOrders, alt: "Protective packaging detail" },
      },
    ],
  },
  {
    num: "04",
    title: "Artwork & privacy",
    titleTop: "Artwork",
    titleBottom: "& privacy",
    descriptor: "Uploads, ownership and privacy.",
    image: helpPrivacy,
    alt: "Close detail of a fine art print edge",
    destination: { label: "Image & privacy policy", href: "/privacy" },
    answers: [
      {
        q: "Who owns the image I upload?",
        lines: [
          { body: "You do. Uploading an image to photoX does not transfer any ownership of it." },
        ],
        visual: { kind: "image", src: helpPrivacy, alt: "Print surface detail" },
      },
      {
        q: "What happens to my uploaded image?",
        lines: [
          { body: "It is used to prepare and produce the print you ordered. Full retention details are set out in the image and privacy policy." },
        ],
        visual: { kind: "image", src: helpPrivacy, alt: "Print surface detail" },
      },
      {
        q: "Will my artwork ever be displayed publicly?",
        lines: [
          { body: "Not without your permission. Uploaded images are not published or added to the photoX collection." },
        ],
        visual: { kind: "image", src: helpPrivacy, alt: "Print surface detail" },
      },
      {
        q: "How is my image used to fulfill my order?",
        lines: [
          { body: "The file is prepared for the material and size you chose, printed, checked and packed — then handed to the carrier." },
        ],
        visual: { kind: "packaging" },
      },
    ],
  },
];

function MaterialsVisual() {
  return (
    <div className="grid grid-cols-2 gap-px bg-foreground/15">
      <figure className="bg-background">
        <div className="px-gloss relative aspect-square overflow-hidden">
          <img
            src={helpChoosing}
            alt="Glossy metal print surface"
            loading="lazy"
            width={1200}
            height={1200}
            className="h-full w-full origin-left scale-[2] object-cover"
          />
        </div>
        <figcaption className="px-meta px-rule pt-2 text-muted-foreground">Metal — gloss</figcaption>
      </figure>
      <figure className="bg-background">
        <div className="px-weave relative aspect-square overflow-hidden">
          <img
            src={helpChoosing}
            alt="Textured canvas print surface"
            loading="lazy"
            width={1200}
            height={1200}
            className="h-full w-full origin-right scale-[2] object-cover"
          />
        </div>
        <figcaption className="px-meta px-rule pt-2 text-muted-foreground">Canvas — matte</figcaption>
      </figure>
    </div>
  );
}

const sizeSteps = [
  { label: '12 × 18"', w: 26, h: 39 },
  { label: '24 × 36"', w: 46, h: 69 },
  { label: '30 × 40"', w: 62, h: 82 },
];

function SizesVisual() {
  return (
    <div>
      <div className="flex items-end justify-between gap-6 border-b border-foreground/20 pb-0">
        {sizeSteps.map((s) => (
          <div key={s.label} className="flex flex-1 flex-col items-center justify-end">
            <div
              className="w-full bg-foreground/85"
              style={{ height: `${s.h * 2.2}px`, maxWidth: `${s.w * 2.2}px` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between gap-6">
        {sizeSteps.map((s) => (
          <span key={s.label} className="px-meta flex-1 text-center text-muted-foreground">
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const resolutionRows = [
  { px: "1500 px", size: '12 × 18"' },
  { px: "3000 px", size: '24 × 36"' },
  { px: "4000 px", size: '30 × 40"' },
];

function ResolutionVisual() {
  return (
    <div className="border-t border-foreground/20">
      {resolutionRows.map((r) => (
        <div
          key={r.px}
          className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-4 border-b border-foreground/15 py-4"
        >
          <span className="px-label">{r.px}</span>
          <span aria-hidden className="px-meta text-muted-foreground">→</span>
          <span className="px-meta text-right text-muted-foreground">{r.size}</span>
        </div>
      ))}
      <p className="px-meta mt-3 text-muted-foreground">Longest edge of your file → comfortable print size.</p>
    </div>
  );
}

const packingSteps = ["Surface film", "Protected corners", "Rigid outer carton"];

function PackagingVisual() {
  return (
    <div>
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={helpOrders}
          alt="Print packed flat with corner protection"
          loading="lazy"
          width={1200}
          height={1200}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-4 border-t border-foreground/20 pt-3">
        {packingSteps.map((s, i) => (
          <div key={s}>
            <span className="px-meta text-muted-foreground">0{i + 1}</span>
            <p className="px-meta mt-1">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisualFor({ visual }: { visual: Visual }) {
  if (visual.kind === "materials") return <MaterialsVisual />;
  if (visual.kind === "sizes") return <SizesVisual />;
  if (visual.kind === "resolution") return <ResolutionVisual />;
  if (visual.kind === "packaging") return <PackagingVisual />;
  return (
    <div className="aspect-[4/3] overflow-hidden">
      <img
        src={visual.src}
        alt={visual.alt}
        loading="lazy"
        width={1200}
        height={1200}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function PlusMark({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/30 transition-colors duration-300 group-hover:border-foreground/70"
    >
      <span
        className={`absolute h-px w-3.5 bg-current transition-transform duration-500 ${open ? "rotate-45" : ""}`}
      />
      <span
        className={`absolute h-px w-3.5 bg-current transition-transform duration-500 ${open ? "-rotate-45" : "rotate-90"}`}
      />
    </span>
  );
}

function QuestionList({
  topic,
  onPick,
}: {
  topic: Topic;
  onPick: (i: number) => void;
}) {
  return (
    <div className="mt-8">
      <div className="border-t border-foreground/20">
        {topic.answers.map((a, i) => (
          <button
            key={a.q}
            type="button"
            onClick={() => onPick(i)}
            className="group flex w-full items-baseline justify-between gap-6 border-b border-foreground/15 py-4 text-left"
          >
            <span className="px-serif text-[1.15rem] leading-tight transition-opacity duration-300 group-hover:opacity-70 md:text-[1.35rem]">
              {a.q}
            </span>
            <span
              aria-hidden
              className="px-meta shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-[3px]"
            >
              →
            </span>
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <a href={topic.destination.href} className="px-meta px-underline text-foreground/80 hover:text-foreground">
          {topic.destination.label} <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}

function AnswerView({
  answer,
  onBack,
}: {
  answer: Answer;
  onBack: () => void;
}) {
  return (
    <div className="mt-8">
      <div className="grid gap-8 border-t border-foreground/20 pt-8 md:grid-cols-2 md:gap-12">
        <div>
          <h4 className="px-serif text-[1.6rem] leading-[1.1] md:text-[2rem]">{answer.q}</h4>
          <div className="mt-6 space-y-5">
            {answer.lines.map((l, i) => (
              <div key={i}>
                {l.term ? <p className="px-label">{l.term}</p> : null}
                <p className="px-meta mt-1 max-w-[46ch] text-muted-foreground">{l.body}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onBack}
            className="px-meta px-underline group mt-8 inline-flex items-center gap-2 text-foreground/80 hover:text-foreground"
          >
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-[3px]">←</span>
            Back to questions
          </button>
        </div>
        <div>
          <VisualFor visual={answer.visual} />
        </div>
      </div>
    </div>
  );
}

export function HelpTopics() {
  const [active, setActive] = useState<number | null>(null);
  const [question, setQuestion] = useState<number | null>(null);

  const open = (i: number) => {
    setQuestion(null);
    setActive((cur) => (cur === i ? null : i));
  };

  return (
    <Shell id="help" className="py-16 md:py-24" label="Help topics">
      <div className="px-rule grid gap-y-3 pt-4 md:grid-cols-12 md:items-baseline md:gap-x-8">
        <h2 className="px-serif text-[2rem] leading-[1.05] md:col-span-6 md:text-[3rem]">
          What do you want to know?
        </h2>
        <p className="px-meta text-muted-foreground md:col-span-4 md:col-start-9 md:text-right">
          Start with what you&rsquo;re deciding.
        </p>
      </div>

      {/* Desktop: horizontal expansion */}
      <div className="mt-12 hidden md:flex md:items-stretch md:gap-8">
        {topics.map((t, i) => {
          const isActive = active === i;
          const quiet = active !== null && !isActive;
          return (
            <div
              key={t.num}
              className="min-w-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ flex: isActive ? "1 1 0%" : quiet ? "0 0 13%" : "1 1 0%" }}
            >
              <button
                type="button"
                onClick={() => open(i)}
                aria-expanded={isActive}
                className={`group block w-full text-left transition-opacity duration-500 ${
                  quiet ? "opacity-45 hover:opacity-80" : "opacity-100"
                }`}
              >
                <div
                  className={`relative overflow-hidden bg-muted transition-all duration-700 ${
                    isActive ? "h-[380px]" : "aspect-square"
                  }`}
                >
                  <img
                    src={t.image}
                    alt={t.alt}
                    loading="lazy"
                    width={1200}
                    height={1200}
                    className={`h-full w-full object-cover transition-transform duration-[900ms] ease-out ${
                      isActive ? "scale-[1.03]" : "group-hover:scale-[1.04]"
                    }`}
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="px-meta text-muted-foreground">{t.num}</span>
                    <h3
                      className={`px-serif mt-2 text-[1.35rem] leading-[1.1] transition-colors duration-300 ${
                        quiet ? "text-foreground/60" : "text-foreground/85 group-hover:text-foreground"
                      }`}
                    >
                      {t.titleTop}
                      <br />
                      {t.titleBottom}
                    </h3>
                    <p
                      className={`px-meta mt-3 text-muted-foreground transition-opacity duration-500 ${
                        quiet ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      {t.descriptor}
                    </p>
                  </div>
                  <PlusMark open={isActive} />
                </div>
              </button>

              {isActive ? (
                question === null ? (
                  <QuestionList topic={t} onPick={setQuestion} />
                ) : (
                  <AnswerView answer={t.answers[question]!} onBack={() => setQuestion(null)} />
                )
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Mobile: stacked entries */}
      <div className="mt-10 border-t border-foreground/20 md:hidden">
        {topics.map((t, i) => {
          const isActive = active === i;
          return (
            <div key={t.num} className="border-b border-foreground/15">
              <button
                type="button"
                onClick={() => open(i)}
                aria-expanded={isActive}
                className="flex w-full items-center gap-4 py-5 text-left"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden bg-muted">
                  <img
                    src={t.image}
                    alt={t.alt}
                    loading="lazy"
                    width={1200}
                    height={1200}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="px-serif min-w-0 flex-1 text-[1.2rem] leading-tight">{t.title}</span>
                <PlusMark open={isActive} />
              </button>
              {isActive ? (
                <div className="pb-8">
                  <p className="px-meta text-muted-foreground">{t.descriptor}</p>
                  {question === null ? (
                    <QuestionList topic={t} onPick={setQuestion} />
                  ) : (
                    <AnswerView answer={t.answers[question]!} onBack={() => setQuestion(null)} />
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="px-rule mt-14 flex flex-wrap items-baseline justify-between gap-4 pt-6">
        <p className="px-label text-foreground/70">Still looking for something?</p>
        <a href="/help" className="px-meta px-underline group text-foreground/80 hover:text-foreground">
          View all help{" "}
          <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-[3px]">
            →
          </span>
        </a>
      </div>
    </Shell>
  );
}
