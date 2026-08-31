import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/photox/SiteNav";
import { SiteFooter } from "@/components/photox/SiteFooter";
import { ProductDetail } from "@/components/photox/product/ProductDetail";
import { productBySlug } from "@/lib/product-detail";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = productBySlug(params.slug);
    if (!product) throw notFound();
    return { name: product.name, from: product.from };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Artwork unavailable | photoX" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — Metal Print Wall Art | photoX`;
    const description = `Order ${loaderData.name} as a Metal Print. Five sizes from $${loaderData.from}, made to order and ready to hang.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
  errorComponent: ({ error }) => (
    <div role="alert" className="px-meta mx-auto max-w-[1440px] px-6 py-24">
      {error.message}
    </div>
  ),
  notFoundComponent: ProductNotFound,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = productBySlug(slug);
  if (!product) return <ProductNotFound />;

  return (
    <div className="bg-background text-foreground">
      <SiteNav variant="light" />
      <main>
        <ProductDetail product={product} />
      </main>
      <SiteFooter />
    </div>
  );
}

function ProductNotFound() {
  return (
    <div className="bg-background text-foreground">
      <SiteNav variant="light" />
      <main className="mx-auto max-w-[1440px] px-6 py-32 md:px-10">
        <h1 className="px-serif text-[2.4rem] leading-[1.05]">Artwork not found.</h1>
        <a href="/shop" className="px-label px-underline mt-6 inline-block">
          Back to shop →
        </a>
      </main>
      <SiteFooter />
    </div>
  );
}
