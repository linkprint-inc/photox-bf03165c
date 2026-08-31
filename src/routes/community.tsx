import { createFileRoute } from "@tanstack/react-router";
import { CommunityFeed } from "@/components/photox/community/CommunityFeed";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { SiteNav } from "@/components/photox/SiteNav";
import { Shell } from "@/components/photox/Section";

const title = "Community — Made by You | photoX";
const description =
  "Real photos, printed and lived with. See how the photoX community turns personal moments into prints for the wall.";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <div className="min-w-0 overflow-x-clip bg-background text-foreground">
      <SiteNav variant="light" />
      <main>
        <Shell label="photoX community" className="pt-28 pb-12 md:pt-32 md:pb-16">
          <p className="px-label text-muted-foreground">Community</p>
          <h1 className="px-serif mt-4 text-[2.5rem] leading-[1.02] md:text-[3.8rem]">
            MADE BY YOU.
          </h1>
          <p className="px-meta mt-4 text-muted-foreground">Real photos, printed and lived with.</p>
        </Shell>
        <Shell
          id="customer-stories"
          label="Customer stories"
          className="scroll-mt-24 pb-24 md:pb-32"
        >
          <CommunityFeed />
        </Shell>
      </main>
      <SiteFooter />
    </div>
  );
}
