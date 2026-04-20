import type { Metadata } from "next";
import Script from "next/script";
import FAQClient from "./FAQClient";
import { faqData } from "@/lib/faqData";

export const metadata: Metadata = {
  title: "FAQ — VaxEPI Vaccination Platform",
  description:
    "Answers to common questions about registration, booking, vaccine cards, privacy, and family accounts on VaxEPI.",
  openGraph: {
    title: "FAQ — VaxEPI",
    description: "Find answers about registration, booking, vaccine cards, and more.",
    url: "https://vaxepi.gov.bd/support/faq",
    siteName: "VaxEPI",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqData.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FAQPage() {
  return (
    <>
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FAQClient />
    </>
  );
}
