"use client";
import { Component, ReactNode, Suspense } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";

// ── Components ────────────────────────────────────────────────────────────────
import GreetingBar         from "@/components/home/GreetingBar";
import AIInsightStrip      from "@/components/home/AIInsightStrip";
import OverviewCard        from "@/components/home/OverviewCard";
import VaccinationStatusCard from "@/components/home/VaccinationStatusCard";
import NextAppointmentCard, { NextAppointmentSkeleton } from "@/components/home/NextAppointmentCard";
import QuickActionGrid     from "@/components/home/QuickActionGrid";
import SmartRemindersWidget from "@/components/home/SmartRemindersWidget";
import FamilyStatusPanel   from "@/components/home/FamilyStatusPanel";
import OfflineBanner       from "@/components/home/OfflineBanner";

// ── Mock fallbacks (used until real API is wired) ─────────────────────────────
import {
  homeStats, vaccineReminders, familyMembers,
} from "@/lib/mock-data";

import { Syringe, Calendar, Users, TrendingUp, AlertTriangle } from "lucide-react";
import type { VaccineEntry, VaccineReminder, FamilyMember } from "@/types/home";

// ── SWR fetcher ───────────────────────────────────────────────────────────────
import { authedFetcher as fetcher } from "@/lib/fetcher";

// ── Error boundary ────────────────────────────────────────────────────────────
class SectionErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          className="card p-5 flex items-center gap-3"
          style={{ borderLeft: "3px solid var(--danger)" }}
          role="alert"
        >
          <AlertTriangle size={16} style={{ color: "var(--danger)", flexShrink: 0 }} />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            This section failed to load. Please refresh.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Card skeleton ─────────────────────────────────────────────────────────────
function CardSkeleton({ rows = 3, height = "h-4" }: { rows?: number; height?: string }) {
  return (
    <div className="card p-6 space-y-3" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`${height} rounded-full`}
          style={{
            width: `${70 + (i % 3) * 10}%`,
            background:
              "linear-gradient(90deg,var(--border) 25%,var(--bg-secondary) 50%,var(--border) 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s linear infinite",
          }}
        />
      ))}
    </div>
  );
}

// ── Stagger wrapper ───────────────────────────────────────────────────────────
function Row({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Sections that use SWR ─────────────────────────────────────────────────────
function VaccinationSection() {
  const { data, isLoading } = useSWR("/api/vaccinations", fetcher, { fallbackData: null, revalidateOnFocus: false, shouldRetryOnError: false });

  const vaccines: VaccineEntry[] = data?.vaccines
    ? data.vaccines.map((v: { vaccine: string; doseNumber: number; status: string; completedDate?: string }) => ({
        name:      v.vaccine,
        doses:     v.doseNumber,
        completed: v.completedDate ? v.doseNumber : v.doseNumber - 1,
        status:
          v.status === "completed"  ? "Complete"  :
          v.status === "due_soon"   ? "Due Soon"  :
          v.status === "overdue"    ? "Overdue"   : "Scheduled",
      }))
    : [
        { name: "COVID-19",    doses: 3, completed: 3, status: "Complete"  },
        { name: "Hepatitis B", doses: 3, completed: 2, status: "Due Soon"  },
        { name: "Measles",     doses: 2, completed: 1, status: "Scheduled" },
        { name: "Influenza",   doses: 1, completed: 0, status: "Overdue"   },
      ];

  if (isLoading) return <CardSkeleton rows={4} height="h-3" />;
  return <VaccinationStatusCard vaccines={vaccines} />;
}

function AppointmentSection() {
  const { data, isLoading } = useSWR("/api/appointments/next", fetcher, {
    revalidateOnFocus: true, shouldRetryOnError: false,
  });

  if (isLoading) return <NextAppointmentSkeleton />;
  return (
    <NextAppointmentCard
      appointment={data?.appointment ?? null}
      onReschedule={() => {}}
    />
  );
}

function RemindersSection() {
  const { data, isLoading } = useSWR("/api/vaccinations", fetcher, { fallbackData: null, revalidateOnFocus: false, shouldRetryOnError: false });

  const reminders: VaccineReminder[] = data?.vaccines
    ? data.vaccines
        .filter((v: { status: string }) => v.status !== "completed")
        .map((v: { _id: string; vaccine: string; dueDate: string; status: string }) => ({
          id:       v._id ?? v.vaccine,
          vaccine:  v.vaccine,
          dueDate:  v.dueDate,
          priority: v.status === "overdue" ? "high" : v.status === "due_soon" ? "medium" : "low",
        }))
    : vaccineReminders;

  if (isLoading) return <CardSkeleton rows={3} />;
  return <SmartRemindersWidget reminders={reminders} />;
}

function FamilySection() {
  const { data, isLoading } = useSWR("/api/family", fetcher, { fallbackData: null, revalidateOnFocus: false, shouldRetryOnError: false });

  const members: FamilyMember[] = data?.members
    ? data.members.map((m: FamilyMember & { id: string }, i: number) => ({
        ...m,
        label:       m.name ?? `Member ${i + 1}`,
        avatarColor: undefined,
      }))
    : familyMembers;

  if (isLoading) return <CardSkeleton rows={2} height="h-20" />;
  return <FamilyStatusPanel members={members} />;
}

// ── Overview cards (static from homeStats for now) ────────────────────────────
const OVERVIEW_CARDS = [
  { label: "Vaccines Received", value: String(homeStats.vaccinesReceived), sub: `of ${homeStats.vaccinesScheduled} scheduled`, icon: Syringe,    color: "#4f46e5", bg: "var(--accent-subtle)"          },
  { label: "Next Appointment",  value: homeStats.nextAppointmentDate,      sub: homeStats.nextAppointmentTime,                  icon: Calendar,   color: "#10b981", bg: "rgba(16,185,129,0.08)"         },
  { label: "Family Members",    value: String(homeStats.familyMembersCount), sub: "All tracked",                                icon: Users,      color: "#f59e0b", bg: "rgba(245,158,11,0.08)"         },
  { label: "Overall Progress",  value: `${homeStats.overallProgress}%`,    sub: homeStats.overallProgress >= 80 ? "Well protected" : "In progress", icon: TrendingUp, color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
];

// ── AI insight (session-scoped) ───────────────────────────────────────────────
function AIInsightSection() {
  const { data } = useSWR("/api/ai/recommend", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    fallbackData:      null,
  });
  return <AIInsightStrip insight={data?.tip ?? "💡 Your Hepatitis B Dose 3 is due in 6 days"} />;
}

// ── Dashboard shell ───────────────────────────────────────────────────────────
export default function CitizenDashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-24 md:pb-8">

      {/* Offline banner */}
      <OfflineBanner />

      {/* Row 1 — Header + Greeting + AI strip */}
      <Row delay={0}>
        <div className="space-y-3">
          <GreetingBar name="Rahim" />
          <SectionErrorBoundary>
            <AIInsightSection />
          </SectionErrorBoundary>
        </div>
      </Row>

      {/* Row 2 — Overview stats */}
      <Row delay={0.07}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {OVERVIEW_CARDS.map((card, i) => (
            <OverviewCard key={card.label} {...card} delay={i * 0.06} />
          ))}
        </div>
      </Row>

      {/* Row 3 — Quick actions (full width) */}
      <Row delay={0.12}>
        <SectionErrorBoundary>
          <QuickActionGrid />
        </SectionErrorBoundary>
      </Row>

      {/* Row 4 — Vaccination status + Next appointment */}
      <Row delay={0.17}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionErrorBoundary>
            <Suspense fallback={<CardSkeleton rows={4} height="h-3" />}>
              <VaccinationSection />
            </Suspense>
          </SectionErrorBoundary>
          <SectionErrorBoundary>
            <Suspense fallback={<NextAppointmentSkeleton />}>
              <AppointmentSection />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      </Row>

      {/* Row 5 — Smart reminders + Family status */}
      <Row delay={0.22}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionErrorBoundary>
            <Suspense fallback={<CardSkeleton rows={3} />}>
              <RemindersSection />
            </Suspense>
          </SectionErrorBoundary>
          <SectionErrorBoundary>
            <Suspense fallback={<CardSkeleton rows={2} height="h-20" />}>
              <FamilySection />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      </Row>

    </div>
  );
}
