// Phase 2: replace mock imports with → const data = await fetch("/api/home")
import {
  features, stats, steps, testimonials, trustBadges,
  vaccinationPrograms, quickActionsLanding, remindersInfo, vaccinationNews,
} from "@/lib/mock-data";

import Navbar                from "@/components/shared/Navbar";
import Footer                from "@/components/shared/Footer";
import HeroSection           from "@/components/home/HeroSection";
import StatsBar              from "@/components/home/StatsBar";
import GovtHealthActivity    from "@/components/home/GovtHealthActivity";
import FeaturesGrid          from "@/components/home/FeaturesGrid";
import VaccinationPrograms   from "@/components/home/VaccinationPrograms";
import AppointmentInfo       from "@/components/home/AppointmentInfo";
import QuickActionsLanding   from "@/components/home/QuickActionsLanding";
import RemindersInfo         from "@/components/home/RemindersInfo";
import FamilyInfoSection     from "@/components/home/FamilyInfoSection";
import OfflineInfo           from "@/components/home/OfflineInfo";
import HowItWorks            from "@/components/home/HowItWorks";
import Testimonials          from "@/components/home/Testimonials";
import VaccinationNews       from "@/components/home/VaccinationNews";
import CTASection            from "@/components/home/CTASection";
import ChatbotWidget         from "@/components/home/ChatbotWidget";
import CTAGuard              from "@/components/home/CTAGuard";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* 1. Hero */}
      <HeroSection />
      {/* 2. Stats */}
      <StatsBar stats={stats} />
      {/* 4. Vaccination Programs ⭐ */}
      <VaccinationPrograms programs={vaccinationPrograms} />
      {/* 3. Govt Health Activity */}
      <GovtHealthActivity />
      {/* 12. Vaccination News */}
      <VaccinationNews articles={vaccinationNews} />
      {/* 4. Features */}
      <FeaturesGrid features={features} />
      {/* 5. Appointment Info */}
      <AppointmentInfo />
      {/* 6. Quick Actions */}
      <QuickActionsLanding actions={quickActionsLanding} />
      {/* 7. Smart Reminders */}
      <RemindersInfo remindersInfo={remindersInfo} />
      {/* 8. Family Benefits */}
      <FamilyInfoSection />
      {/* 9. Offline Info */}
      <OfflineInfo />
      {/* 10. How It Works */}
      <HowItWorks steps={steps} />
      {/* 11. Testimonials */}
      <Testimonials testimonials={testimonials} />
      {/* 13. CTA — hidden when logged in */}
      <CTAGuard trustBadges={trustBadges} />
      <Footer />
      {/* Floating chatbot */}
      <ChatbotWidget />
    </div>
  );
}
