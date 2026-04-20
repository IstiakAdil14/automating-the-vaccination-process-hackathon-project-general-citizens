import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About VaxEPI — Bangladesh's National Vaccination Platform",
  description:
    "Learn about VaxEPI, Bangladesh's government-backed vaccination management system. Register, book, and manage your family's vaccinations — free and secure.",
  keywords: ["vaccination", "Bangladesh", "VaxEPI", "MoH", "immunization", "vaccine booking"],
  openGraph: {
    title: "About VaxEPI — Bangladesh's National Vaccination Platform",
    description: "Free, secure, government-backed vaccination management for every Bangladeshi citizen.",
    url: "https://vaxepi.gov.bd/support/about",
    siteName: "VaxEPI",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
