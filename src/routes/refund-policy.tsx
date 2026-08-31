import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/photox/policy/PolicyPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({ meta: [{ title: "Refund Policy | photoX" }] }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund Policy"
      updated="August 2026"
      intro="photoX products are made to order from your selected image and configuration. This policy explains how we assess requests for help with a completed order."
      sections={[
        {
          number: "01",
          heading: "Custom products",
          children: (
            <p>
              Because each print is customized and produced to order, a change of mind does not
              automatically make a completed order eligible for a return or refund. Please review
              your image, size, surface, and delivery details carefully before placing an order.
            </p>
          ),
        },
        {
          number: "02",
          heading: "Damaged or defective orders",
          children: (
            <p>
              If an order arrives damaged or has a production defect, please let us know and include
              clear photographs of the item and its packaging. We will review the issue and discuss
              an appropriate resolution based on the order and the available evidence.
            </p>
          ),
        },
        {
          number: "03",
          heading: "Incorrect orders",
          children: (
            <p>
              If the item you receive materially differs from the confirmed order details, contact
              us with your order number and photographs. We will review the order record and the
              item received to determine the next steps.
            </p>
          ),
        },
        {
          number: "04",
          heading: "Cancellations",
          children: (
            <p>
              Contact us promptly if you need to cancel an order. Whether a cancellation can be
              accommodated depends on its production status. We cannot promise changes once an order
              has entered production or been prepared for shipment.
            </p>
          ),
        },
        {
          number: "05",
          heading: "How to request help",
          children: (
            <p>
              Send your order number, a description of the issue, and any helpful photographs to our
              support team. This information helps us identify the order and review the concern
              without unnecessary delay.
            </p>
          ),
        },
        {
          number: "06",
          heading: "Refund processing",
          children: (
            <p>
              When a refund is approved, it is returned to the original payment method unless we
              tell you otherwise. The time it takes to appear on your statement is determined by
              your payment provider. Any business-specific eligibility rules will be confirmed
              before this policy is finalized.
            </p>
          ),
        },
        {
          number: "07",
          heading: "Contact",
          children: (
            <p>
              To ask for help with an order, please{" "}
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
