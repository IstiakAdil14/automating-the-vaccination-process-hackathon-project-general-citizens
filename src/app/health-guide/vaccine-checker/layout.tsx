import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vaccine Checker — VaxEPI Health Guide",
  description:
    "Find out which vaccines are recommended for your age group. Free, no login required. Based on WHO and national immunization schedules.",
  openGraph: {
    title: "Vaccine Checker — VaxEPI",
    description: "Personalized vaccine recommendations based on your age group.",
    url: "https://vaxepi.gov.bd/health-guide/vaccine-checker",
    siteName: "VaxEPI",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
