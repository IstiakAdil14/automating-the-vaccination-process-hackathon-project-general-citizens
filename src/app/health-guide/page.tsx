import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Syringe, AlertTriangle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Health Guide — VaxEPI",
  description: "Vaccine recommendations and emergency information for all citizens. No login required.",
  openGraph: {
    title: "Health Guide — VaxEPI",
    description: "Vaccine checker and emergency info for all citizens.",
    url: "https://vaxepi.gov.bd/health-guide",
    siteName: "VaxEPI",
    type: "website",
  },
};

const sections = [
  {
    href: "/health-guide/vaccine-checker",
    icon: Syringe,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    accentColor: "border-indigo-200 hover:border-indigo-400",
    badge: "bg-indigo-50 text-indigo-600",
    badgeText: "Personalized",
    title: "Vaccine Checker",
    description:
      "Find out which vaccines are recommended for your age group. Check off what you've already received and see what's still needed — no login required.",
    cta: "Check My Vaccines",
    ctaClass: "bg-indigo-600 hover:bg-indigo-700",
  },
  {
    href: "/health-guide/emergency-info",
    icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    accentColor: "border-red-200 hover:border-red-400",
    badge: "bg-red-50 text-red-500",
    badgeText: "Available Offline",
    title: "Emergency Info",
    description:
      "Critical hotlines, step-by-step severe reaction guide, symptom severity checker, and nearest hospital finder. Designed for fast access in distress.",
    cta: "View Emergency Info",
    ctaClass: "bg-red-600 hover:bg-red-700",
  },
];

export default function HealthGuidePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-red-50 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 text-center">
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-3 block">
              Public Health Resource
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Health Guide</h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Free tools for every citizen — no account needed. Vaccine recommendations and emergency information at your fingertips.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 gap-6">
            {sections.map(({ href, icon: Icon, iconBg, iconColor, accentColor, badge, badgeText, title, description, cta, ctaClass }) => (
              <div
                key={href}
                className={`card p-6 flex flex-col gap-5 border-2 transition-all duration-200 ${accentColor}`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
                    <Icon size={24} className={iconColor} aria-hidden="true" />
                  </div>
                  <span className={`pill ${badge} text-xs font-semibold`}>{badgeText}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                </div>
                <Link
                  href={href}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 min-h-[48px] ${ctaClass} shadow-sm hover:shadow-md`}
                >
                  {cta}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
