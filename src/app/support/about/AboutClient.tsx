"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import {
  ShieldCheck, CreditCard, Users, MapPin, Wifi, ScanLine,
  Bot, ArrowRight, ExternalLink, Lock, Eye, Trash2,
  UserCheck, Baby, FootprintsIcon,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import LanguageToggle from "@/components/health-guide/LanguageToggle";
import { useLang } from "@/hooks/useLang";

// ── Types ────────────────────────────────────────────────────────────────────
type Stats = {
  dosesAdministered: number;
  registeredCitizens: number;
  activeCenters: number;
  divisionsCovered: number;
  coveragePercent: number;
};

// ── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);

  useEffect(() => {
    return spring.on("change", (v) => {
      setDisplay(
        v >= 1_000_000
          ? (v / 1_000_000).toFixed(1) + "M"
          : v >= 1_000
          ? (v / 1_000).toFixed(0) + "K"
          : Math.round(v).toString()
      );
    });
  }, [spring]);

  return <span ref={ref}>{display}{suffix}</span>;
}

// ── Shield SVG Illustration ──────────────────────────────────────────────────
function ShieldIllustration() {
  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[220px]" aria-hidden="true">
      <path d="M100 10 L180 45 L180 110 C180 155 145 190 100 210 C55 190 20 155 20 110 L20 45 Z"
        fill="url(#shieldGrad)" stroke="#4f46e5" strokeWidth="2" />
      <path d="M100 30 L165 58 L165 110 C165 147 138 176 100 193 C62 176 35 147 35 110 L35 58 Z"
        fill="white" fillOpacity="0.15" />
      <circle cx="100" cy="105" r="32" fill="white" fillOpacity="0.9" />
      <path d="M88 105 L96 113 L114 97" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="72" y="68" width="56" height="8" rx="4" fill="white" fillOpacity="0.6" />
      <rect x="80" y="82" width="40" height="6" rx="3" fill="white" fillOpacity="0.4" />
      <rect x="76" y="148" width="48" height="6" rx="3" fill="white" fillOpacity="0.5" />
      <rect x="84" y="160" width="32" height="5" rx="2.5" fill="white" fillOpacity="0.35" />
      <defs>
        <linearGradient id="shieldGrad" x1="20" y1="10" x2="180" y2="210" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Section 1: Hero ──────────────────────────────────────────────────────────
function HeroSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section id="hero" className="py-16 sm:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="pill pill-accent mb-4 inline-flex">
              <ShieldCheck size={13} /> Government of Bangladesh
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">
              Bangladesh's National<br />
              <span className="text-gradient">Vaccination Platform</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-[65ch]">
              Register, book, and manage your family's vaccinations — free, secure, and government-backed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn-primary">
                <LayoutDashboardIcon size={16} /> Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/register" className="btn-primary">Register Now <ArrowRight size={15} /></Link>
                <Link href="/centers" className="btn-ghost">Find a Center <MapPin size={15} /></Link>
              </>
            )}
          </motion.div>

          {/* Government badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl w-fit"
          >
            <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-emerald-800">Verified Government Platform</p>
              <a
                href="https://mohfw.gov.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
                aria-label="Visit Ministry of Health official portal (opens in new tab)"
              >
                Ministry of Health &amp; Family Welfare <ExternalLink size={10} />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center lg:justify-end"
        >
          <ShieldIllustration />
        </motion.div>
      </div>

      {/* Intro text */}
      <div className="mt-14 grid sm:grid-cols-3 gap-6 border-t border-gray-100 pt-10">
        {[
          {
            title: "What is VaxEPI?",
            text: "VaxEPI is Bangladesh's official digital immunization registry. It connects citizens, vaccination centers, and health authorities on a single secure platform.",
          },
          {
            title: "What problem does it solve?",
            text: "It eliminates paper-based records, long queues, and missed doses by enabling online booking, digital vaccine cards, and smart reminders for every citizen.",
          },
          {
            title: "Who operates it?",
            text: "VaxEPI is operated by the Directorate General of Health Services (DGHS) under the Ministry of Health & Family Welfare, Government of Bangladesh.",
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[65ch]">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Section 2: How It Works ──────────────────────────────────────────────────
const STEPS = [
  { icon: UserCheck, title: "Register", desc: "Create your free account using your NID or Birth Certificate. Takes under 5 minutes with OTP verification.", link: "#faq-registration" },
  { icon: MapPin,    title: "Book",     desc: "Choose a vaccine, find a nearby center on the map, and pick a convenient time slot — or simply walk in.", link: "#faq-booking" },
  { icon: ShieldCheck, title: "Get Vaccinated", desc: "Attend your appointment. Your digital vaccine card updates automatically after each dose.", link: "#faq-vaccine-card" },
];

const FEATURES = [
  { icon: CreditCard, title: "Digital Vaccine Card",   desc: "QR-based certificate accepted by institutions and borders." },
  { icon: Users,      title: "Family Management",      desc: "Manage up to 6 family members under one account." },
  { icon: Bot,        title: "AI Chatbot Support",     desc: "24/7 assistant answers questions in English and Bangla." },
  { icon: Wifi,       title: "Offline Access",         desc: "View your card and history without internet." },
  { icon: ScanLine,   title: "OCR Card Scanner",       desc: "Digitize your paper vaccine card with a photo." },
  { icon: MapPin,     title: "Real-time Center Map",   desc: "Live slot availability across all centers nationwide." },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-14 border-t border-gray-100">
      <h2 className="text-2xl font-black text-gray-900 mb-10">How It Works</h2>

      {/* Step flow */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card p-6 relative"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl font-black text-indigo-100 leading-none select-none">{i + 1}</span>
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-indigo-600" aria-hidden="true" />
                </div>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">{step.desc}</p>
              <a href={step.link} className="text-xs text-indigo-500 hover:underline font-medium">
                Learn more →
              </a>
              {/* Connector arrow (desktop) */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center">
                  <div className="w-8 border-t-2 border-dashed border-indigo-300" />
                  <ArrowRight size={14} className="text-indigo-400 -ml-1" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="card p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-indigo-600" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ── Section 3: Who Can Use It ────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Free to Use" },
  { icon: ShieldCheck, label: "Government Verified" },
  { icon: Lock,        label: "Data Encrypted" },
  { icon: ShieldCheck, label: "WHO Schedule Aligned" },
];

function WhoCanUseSection() {
  return (
    <section id="who-can-use" className="py-14 border-t border-gray-100">
      <h2 className="text-2xl font-black text-gray-900 mb-8">Who Can Use It</h2>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {[
          {
            icon: UserCheck,
            title: "Individual Citizens",
            desc: "Any Bangladeshi with an NID or Birth Certificate. Register in minutes and manage your full vaccination history.",
            link: "/register",
            primary: true,
          },
          {
            icon: Users,
            title: "Family Groups",
            desc: "Register and manage up to 6 family members under one account. Book appointments and track records for everyone.",
            link: "/register",
            primary: false,
          },
          {
            icon: FootprintsIcon,
            title: "Walk-in Patients",
            desc: "No app needed. Visit any center and receive a token. Staff will record your vaccination directly in the system.",
            link: "/centers",
            primary: false,
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`card p-6 flex flex-col gap-4 ${card.primary ? "border-2 border-indigo-400 shadow-md shadow-indigo-100" : ""}`}
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Icon size={22} className="text-indigo-600" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
              <Link href={card.link} className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                Get Started <ArrowRight size={13} />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-3 mb-8">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-600">
            <Icon size={14} className="text-emerald-500" aria-hidden="true" />
            {label}
          </div>
        ))}
      </div>

      {/* Supported documents */}
      <div className="grid sm:grid-cols-2 gap-4 p-5 bg-blue-50 border border-blue-100 rounded-xl">
        <div>
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">✅ Accepted Documents</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• National ID (NID) — 10 or 17 digits</li>
            <li>• Birth Certificate — 17 digits</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">ℹ️ Optional (not required)</p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Passport</li>
            <li>• Driving License</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// ── Section 4: Statistics ────────────────────────────────────────────────────
function StatCard({ label, value, suffix, ariaLabel }: { label: string; value: number; suffix?: string; ariaLabel: string }) {
  return (
    <div className="card p-6 text-center" aria-label={ariaLabel}>
      <p className="text-3xl sm:text-4xl font-black text-indigo-600 mb-1">
        <AnimatedCounter value={value} suffix={suffix} />
      </p>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  );
}

function StatsSection({ stats }: { stats: Stats | null }) {
  const barRef = useRef<HTMLDivElement>(null);
  const barInView = useInView(barRef, { once: true });
  const coverage = stats?.coveragePercent ?? 0;
  const barColor = coverage >= 70 ? "bg-emerald-500" : coverage >= 40 ? "bg-amber-500" : "bg-red-500";

  return (
    <section id="statistics" className="py-14 border-t border-gray-100">
      <h2 className="text-2xl font-black text-gray-900 mb-8">Platform Statistics</h2>

      {stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Doses Administered" value={stats.dosesAdministered} ariaLabel={`${stats.dosesAdministered.toLocaleString()} doses administered`} />
            <StatCard label="Registered Citizens" value={stats.registeredCitizens} ariaLabel={`${stats.registeredCitizens.toLocaleString()} registered citizens`} />
            <StatCard label="Active Centers" value={stats.activeCenters} ariaLabel={`${stats.activeCenters.toLocaleString()} active vaccination centers`} />
            <StatCard label="Divisions Covered" value={stats.divisionsCovered} suffix="/8" ariaLabel={`${stats.divisionsCovered} out of 8 divisions covered`} />
          </div>

          {/* Coverage bar */}
          <div ref={barRef} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">National Coverage</span>
              <span className="text-sm font-bold text-gray-800">{coverage}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${barColor}`}
                initial={{ width: 0 }}
                animate={barInView ? { width: `${coverage}%` } : { width: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Updated daily · Source: DGHS MIS</p>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-8 bg-gray-100 rounded mb-2" />
              <div className="h-4 bg-gray-100 rounded w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Section 5: Privacy ───────────────────────────────────────────────────────
function PrivacySection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section id="privacy" className="py-14 border-t border-gray-100">
      <h2 className="text-2xl font-black text-gray-900 mb-8">Data Privacy</h2>

      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        {[
          {
            icon: Eye,
            title: "What We Collect",
            color: "text-blue-600",
            bg: "bg-blue-50",
            items: ["NID (AES-256 encrypted)", "Phone number & email", "Vaccination records", "Appointment history"],
          },
          {
            icon: ShieldCheck,
            title: "What We Never Do",
            color: "text-teal-600",
            bg: "bg-teal-50",
            items: ["Sell your data", "Share with advertisers", "Expose full NID publicly", "Use data for profiling"],
          },
          {
            icon: Trash2,
            title: "Your Rights",
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            items: ["View all your data", "Export records (PDF/JSON)", "Request deletion", "90-day retention after deletion"],
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                <Icon size={20} className={card.color} aria-hidden="true" />
              </div>
              <h3 className="font-bold text-gray-800 mb-3">{card.title}</h3>
              <ul className="space-y-1.5">
                {card.items.map((item) => (
                  <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <a
          href="/privacy-policy.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
          aria-label="Read full privacy policy (opens PDF in new tab)"
        >
          <ExternalLink size={15} /> Read Full Privacy Policy
        </a>
        <p className="text-xs text-gray-400">
          Last updated: January 2026 · Compliant with Bangladesh ICT Act 2006.
        </p>
      </div>

      {isLoggedIn && (
        <div className="mt-4">
          <Link href="/profile" className="text-sm text-indigo-600 hover:underline font-medium">
            Request your data export →
          </Link>
        </div>
      )}
    </section>
  );
}

// ── Sticky TOC ───────────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { id: "hero",        label: "Platform Intro" },
  { id: "how-it-works", label: "How It Works" },
  { id: "who-can-use", label: "Who Can Use It" },
  { id: "statistics",  label: "Statistics" },
  { id: "privacy",     label: "Data Privacy" },
];

function StickyTOC({ active }: { active: string }) {
  return (
    <nav aria-label="Page sections" className="hidden lg:flex flex-col gap-1 sticky top-32 w-44 shrink-0">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">On this page</p>
      {TOC_ITEMS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`text-sm py-1 px-3 rounded-lg transition-all duration-200 ${
            active === id
              ? "text-indigo-600 font-semibold bg-indigo-50"
              : "text-gray-500 hover:text-gray-800"
          }`}
          aria-current={active === id ? "location" : undefined}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

// ── Missing icon shim ────────────────────────────────────────────────────────
function LayoutDashboardIcon({ size }: { size: number }) {
  return <LayoutDashboard size={size} />;
}
import { LayoutDashboard } from "lucide-react";

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AboutClient() {
  const { lang, setLang } = useLang();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const stored = localStorage.getItem("vaxcare_user") ?? sessionStorage.getItem("vaxcare_user");
    setIsLoggedIn(!!stored);
  }, []);

  useEffect(() => {
    fetch("/api/public/stats").then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  // IntersectionObserver for TOC
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {/* Page header */}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex gap-12">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <HeroSection isLoggedIn={isLoggedIn} />
              <HowItWorksSection />
              <WhoCanUseSection />
              <StatsSection stats={stats} />
              <PrivacySection isLoggedIn={isLoggedIn} />
            </div>
            {/* Sticky TOC */}
            <StickyTOC active={activeSection} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
