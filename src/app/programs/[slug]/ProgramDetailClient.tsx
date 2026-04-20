"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CalendarDays, MapPin, Users, Syringe,
  ChevronDown, CheckCircle, Clock, XCircle,
  Share2, BookOpen, Building2, Package,
} from "lucide-react";
import type { Program } from "@/types/home";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS = {
  Upcoming:  { color: "#4f46e5", bg: "rgba(79,70,229,0.10)",  border: "rgba(79,70,229,0.20)",  icon: Clock,        label: "Upcoming"  },
  Ongoing:   { color: "#10b981", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.20)", icon: CheckCircle,  label: "Ongoing"   },
  Completed: { color: "#6b7280", bg: "rgba(107,114,128,0.10)",border: "rgba(107,114,128,0.20)",icon: XCircle,      label: "Completed" },
};

// ── FAQ item ──────────────────────────────────────────────────────────────────
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        style={{ background: open ? "var(--accent-subtle)" : "var(--surface-raised)" }}
      >
        <span className="font-medium text-sm pr-4" style={{ color: "var(--text-primary)" }}>{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
          <ChevronDown size={16} style={{ color: "var(--accent)" }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 py-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)", borderTop: "1px solid var(--border)" }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Info card ─────────────────────────────────────────────────────────────────
function InfoCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="card p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{value}</p>
      </div>
    </div>
  );
}

// ── Main client component ─────────────────────────────────────────────────────
export default function ProgramDetailClient({ program }: { program: Program }) {
  const s = STATUS[program.status];
  const StatusIcon = s.icon;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: program.title, text: program.description, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* ── Hero ── */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden">
        <Image
          src={program.image}
          alt={program.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,14,26,0.25) 0%, rgba(10,14,26,0.75) 100%)" }} />

        {/* Back + Share */}
        <div className="absolute top-5 left-0 right-0 px-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <ArrowLeft size={15} /> Back
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <Share2 size={15} /> Share
          </button>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-7">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span
              className="inline-flex items-center gap-1.5 pill text-xs font-semibold mb-3"
              style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, backdropFilter: "blur(8px)" }}
            >
              <StatusIcon size={11} />
              {s.label}
            </span>
            <h1 className="font-bold text-white leading-tight mb-2" style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)" }}>
              {program.title}
            </h1>
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5 text-white/80 text-sm">
                <CalendarDays size={13} /> {program.date}
              </span>
              <span className="flex items-center gap-1.5 text-white/80 text-sm">
                <MapPin size={13} /> {program.location}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Info grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {program.targetGroup && (
            <InfoCard icon={Users}    label="Target Group" value={program.targetGroup} color="#4f46e5" />
          )}
          {program.doses && (
            <InfoCard icon={Syringe}  label="Doses Required" value={`${program.doses} dose${program.doses > 1 ? "s" : ""}`} color="#10b981" />
          )}
          {program.organizer && (
            <InfoCard icon={Building2} label="Organizer" value={program.organizer} color="#f59e0b" />
          )}
          <InfoCard icon={MapPin} label="Location" value={program.location} color="#8b5cf6" />
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} style={{ color: "var(--accent)" }} />
                <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>About This Program</h2>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{program.description}</p>
              {program.eligibility && (
                <div className="mt-4 px-4 py-3 rounded-xl" style={{ background: "var(--accent-subtle)", border: "1px solid rgba(79,70,229,0.12)" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>Eligibility</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{program.eligibility}</p>
                </div>
              )}
            </motion.div>

            {/* What to bring */}
            {program.whatToBring && program.whatToBring.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package size={16} style={{ color: "#f59e0b" }} />
                  <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>What to Bring</h2>
                </div>
                <ul className="space-y-2.5">
                  {program.whatToBring.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(245,158,11,0.12)" }}>
                        <CheckCircle size={11} style={{ color: "#f59e0b" }} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* FAQ */}
            {program.faqs && program.faqs.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h2 className="font-semibold mb-4 px-0.5" style={{ color: "var(--text-primary)" }}>Frequently Asked Questions</h2>
                <div className="space-y-2">
                  {program.faqs.map((faq, i) => (
                    <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right — sticky CTA sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-6 space-y-4"
            >
              {/* CTA card */}
              <div className="card p-6 space-y-4">
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Program Status</p>
                  <span
                    className="inline-flex items-center gap-1.5 pill text-xs font-semibold"
                    style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                  >
                    <StatusIcon size={11} />
                    {s.label}
                  </span>
                </div>

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Date</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{program.date}</p>
                </div>

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Location</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{program.location}</p>
                </div>

                {program.status !== "Completed" ? (
                  <Link
                    href="/appointments"
                    className="btn-primary w-full justify-center"
                    style={{ marginTop: "0.5rem" }}
                  >
                    <Syringe size={15} /> Book Appointment
                  </Link>
                ) : (
                  <div
                    className="w-full text-center py-2.5 rounded-full text-sm font-medium"
                    style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}
                  >
                    Program Ended
                  </div>
                )}

                <Link
                  href="/register"
                  className="btn-ghost w-full justify-center"
                  style={{ fontSize: "0.85rem" }}
                >
                  Create Free Account
                </Link>
              </div>

              {/* Organizer card */}
              {program.organizer && (
                <div className="card p-4">
                  <p className="text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Organized by</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent-subtle)" }}>
                      <Building2 size={14} style={{ color: "var(--accent)" }} />
                    </div>
                    <p className="text-sm font-medium leading-snug" style={{ color: "var(--text-primary)" }}>{program.organizer}</p>
                  </div>
                </div>
              )}

              {/* Back to programs */}
              <Link
                href="/#programs"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70 px-1"
                style={{ color: "var(--text-muted)" }}
              >
                <ArrowLeft size={14} /> All Programs
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
