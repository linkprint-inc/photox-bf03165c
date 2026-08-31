import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/photox/policy/PolicyPage";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({ meta: [{ title: "Shipping Policy | photoX" }] }),
  component: ShippingPolicyPage,
});

function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      updated="August 2026"
      intro="photoX prints are made to order and packed for the format selected. This policy describes the information shown during fulfillment and delivery."
      sections={[
        {
          number: "01",
          heading: "Production time",
          children: (
            <p>
              Orders generally move into production after payment is confirmed. Production timing
              varies by product, selected options, customization, and current order volume. We do
              not state a fixed production period unless one is shown with your order.
            </p>
          ),
        },
        {
          number: "02",
          heading: "Shipping estimates",
          children: (
            <p>
              Available delivery estimates are shown when you place an order where applicable. They
              are estimates rather than guaranteed arrival dates and can be affected by production
              status, carrier operations, destination access, weather, or other events outside our
              control.
            </p>
          ),
        },
        {
          number: "03",
          heading: "Shipping costs",
          children: (
            <p>
              Shipping costs, if applicable, are displayed before you complete checkout. Costs may
              vary with the delivery destination, selected shipping option, package size, and other
              order details.
            </p>
          ),
        },
        {
          number: "04",
          heading: "Tracking",
          children: (
            <p>
              When tracking is available for an order, we will provide the relevant tracking
              information after the shipment is handed to the carrier. Carrier updates may take time
              to appear after a label is created.
            </p>
          ),
        },
        {
          number: "05",
          heading: "Address changes",
          children: (
            <p>
              Please contact us promptly if a delivery address needs to change. We will assess
              whether a change is still possible, but we cannot guarantee updates after an order has
              entered production or been passed to a carrier.
            </p>
          ),
        },
        {
          number: "06",
          heading: "Delays",
          children: (
            <p>
              Delivery can be delayed by events such as production constraints, carrier disruption,
              customs processing, severe weather, or an address issue. If you need help with an
              order that appears delayed, contact our support team with the order number.
            </p>
          ),
        },
        {
          number: "07",
          heading: "Damaged packages",
          children: (
            <p>
              If a package or its contents arrive damaged, keep the packaging where possible and
              send us photographs of the item and package. We will review the issue under our Refund
              Policy.
            </p>
          ),
        },
        {
          number: "08",
          heading: "International shipping",
          children: (
            <p>
              International availability, delivery methods, and import charges depend on the
              destination and the options presented at checkout. Any duties, taxes, or local
              requirements that apply to a delivery are handled as shown during checkout or as
              required by the destination.
            </p>
          ),
        },
        {
          number: "09",
          heading: "Contact",
          children: (
            <p>
              For shipping help, please{" "}
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
