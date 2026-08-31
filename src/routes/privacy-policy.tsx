import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/photox/policy/PolicyPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({ meta: [{ title: "Privacy Policy | photoX" }] }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      updated="August 2026"
      intro="This policy explains how photoX handles information when you visit our site, customize a product, upload an image, or place an order."
      sections={[
        {
          number: "01",
          heading: "Information we collect",
          children: (
            <p>
              We collect information you provide to us, such as your name, email address, delivery
              address, order details, and messages to our team. We also receive limited technical
              information when you use the site, including device, browser, and usage information.
            </p>
          ),
        },
        {
          number: "02",
          heading: "How we use information",
          children: (
            <p>
              We use information to operate photoX, customize and fulfill orders, communicate about
              purchases and support requests, protect against fraud or misuse, and understand how
              the site can be improved.
            </p>
          ),
        },
        {
          number: "03",
          heading: "Uploaded images",
          children: (
            <p>
              Your uploaded images are processed to provide the customization, preview, and print
              services you request. You retain ownership of your images. Please upload only images
              you own or have permission to use.
            </p>
          ),
        },
        {
          number: "04",
          heading: "Cookies and analytics",
          children: (
            <p>
              We and our service providers may use cookies or similar technologies to keep the site
              working, remember preferences, measure site performance, and understand aggregate
              usage. Your browser settings may allow you to manage certain cookies.
            </p>
          ),
        },
        {
          number: "05",
          heading: "Service providers",
          children: (
            <p>
              We may share the information needed to provide our service with providers that help us
              process payments, produce orders, deliver packages, host the site, or provide customer
              support. They may use that information only to perform their services for us.
            </p>
          ),
        },
        {
          number: "06",
          heading: "Data retention",
          children: (
            <p>
              We keep information for as long as reasonably needed to provide the service, maintain
              our records, resolve issues, and meet applicable obligations. Image retention and
              deletion practices follow the operational policy in effect for the service.
            </p>
          ),
        },
        {
          number: "07",
          heading: "Your choices and rights",
          children: (
            <p>
              Depending on where you live, you may have rights to request access to, correction of,
              or deletion of certain personal information, or to object to particular processing. We
              will consider requests in accordance with applicable law.
            </p>
          ),
        },
        {
          number: "08",
          heading: "Security",
          children: (
            <p>
              We use reasonable administrative, technical, and organizational measures designed to
              protect information. No online service or transmission can be guaranteed completely
              secure, so please use care when sharing information online.
            </p>
          ),
        },
        {
          number: "09",
          heading: "Children's privacy",
          children: (
            <p>
              photoX is not intended for children where consent is required to use the service. If
              you believe a child has provided personal information without appropriate permission,
              please contact us so we can review the request.
            </p>
          ),
        },
        {
          number: "10",
          heading: "Changes to this policy",
          children: (
            <p>
              We may update this policy when our practices or legal requirements change. The date
              above shows when it was last revised. Continued use of photoX after an update is
              subject to the revised policy.
            </p>
          ),
        },
        {
          number: "11",
          heading: "Contact",
          children: (
            <p>
              For privacy questions or requests, please{" "}
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
