import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/photox/policy/PolicyPage";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({ meta: [{ title: "Terms of Service | photoX" }] }),
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return (
    <PolicyPage
      title="Terms of Service"
      updated="August 2026"
      intro="These terms govern your use of photoX and the purchase of photoX products. By using the site or placing an order, you agree to these terms."
      sections={[
        {
          number: "01",
          heading: "Overview",
          children: (
            <p>
              photoX provides tools for customizing and ordering printed products. You agree to use
              the service lawfully and in accordance with these terms and any information presented
              to you before checkout.
            </p>
          ),
        },
        {
          number: "02",
          heading: "Orders",
          children: (
            <p>
              When you place an order, you are responsible for providing accurate contact, delivery,
              and customization details. Order acceptance, production status, and any available
              changes are subject to the information shown for your order.
            </p>
          ),
        },
        {
          number: "03",
          heading: "Custom uploads",
          children: (
            <p>
              By submitting an image or other content, you confirm that you have the rights,
              permissions, and any necessary consent to use it for the requested service. You are
              responsible for checking your selected crop, size, surface, text, and other
              customization details before ordering.
            </p>
          ),
        },
        {
          number: "04",
          heading: "Customer content and ownership",
          children: (
            <p>
              You retain ownership of the content you upload. You give photoX the limited permission
              needed to store, process, preview, produce, and deliver your order, and to provide
              related customer support. Our retention and deletion practices are described in the
              Privacy Policy.
            </p>
          ),
        },
        {
          number: "05",
          heading: "Acceptable content",
          children: (
            <p>
              Do not submit content that is unlawful, infringing, fraudulent, abusive, or otherwise
              inappropriate for the service. We may decline to process content where we reasonably
              believe doing so would violate law, rights, or these terms.
            </p>
          ),
        },
        {
          number: "06",
          heading: "Product appearance",
          children: (
            <p>
              Screen displays, image files, materials, production methods, and viewing conditions
              can affect how a finished print appears. Previews are intended to help with
              customization, but minor variations in color, crop, finish, and scale can occur.
            </p>
          ),
        },
        {
          number: "07",
          heading: "Pricing and payment",
          children: (
            <p>
              Prices, availability, taxes, and delivery charges are shown before checkout where
              applicable. We may correct clear errors in pricing or product information and will
              contact you if a material correction affects an order already placed.
            </p>
          ),
        },
        {
          number: "08",
          heading: "Shipping",
          children: (
            <p>
              Production and delivery are subject to the Shipping Policy and the order details
              provided at checkout. Delivery estimates are not guarantees, and address changes may
              not be possible once fulfillment has progressed.
            </p>
          ),
        },
        {
          number: "09",
          heading: "Returns and refunds",
          children: (
            <p>
              Requests relating to damaged, defective, or incorrectly produced orders are handled
              under the Refund Policy. Because products are customized, change-of-mind requests may
              be treated differently from an issue with the item received.
            </p>
          ),
        },
        {
          number: "10",
          heading: "Intellectual property",
          children: (
            <p>
              The photoX name, site design, product information, software, and other materials we
              provide are protected by applicable intellectual-property laws. Except for the limited
              use needed to use the service, no rights in those materials are granted to you.
            </p>
          ),
        },
        {
          number: "11",
          heading: "Limitation of liability",
          children: (
            <p>
              To the extent permitted by applicable law, photoX is not liable for indirect,
              incidental, special, consequential, or punitive losses arising from use of the
              service. Nothing in these terms limits rights or obligations that cannot lawfully be
              limited.
            </p>
          ),
        },
        {
          number: "12",
          heading: "Changes to these terms",
          children: (
            <p>
              We may update these terms when our service, practices, or legal requirements change.
              The date above shows when they were last revised. Your continued use of photoX after
              an update is subject to the revised terms.
            </p>
          ),
        },
        {
          number: "13",
          heading: "Contact",
          children: (
            <p>
              For questions about these terms, please{" "}
              <a className="px-underline" href="mailto:hello@photox.com">
                contact us
              </a>{" "}
              at hello@photox.com.
            </p>
          ),
        },
      ]}
    />
  );
}
