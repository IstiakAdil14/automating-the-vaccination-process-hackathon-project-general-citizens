import type { Metadata } from "next";
import "./globals.css";
import ChatbotWidget from "@/components/home/ChatbotWidget";
import NavigationLoader from "@/components/ui/NavigationLoader";
import ServiceWorkerRegistrar from "@/components/ui/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "VaxCare — Smart Vaccination Platform",
  description: "AI-powered vaccination management for citizens. Book appointments, track your vaccine history, and manage your family's health.",
  keywords: ["vaccination", "health", "appointment", "vaccine passport"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="noise-overlay mesh-bg">
        <NavigationLoader />
        {children}
        <ChatbotWidget />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
