import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emergency Info — VaxEPI Health Guide",
  description:
    "Critical vaccine reaction guidance, emergency hotlines, nearest hospital finder, and severity checker. Available offline.",
  openGraph: {
    title: "Emergency Info — VaxEPI",
    description: "Emergency hotlines, reaction guides, and hospital finder for vaccine-related emergencies.",
    url: "https://vaxepi.gov.bd/health-guide/emergency-info",
    siteName: "VaxEPI",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
