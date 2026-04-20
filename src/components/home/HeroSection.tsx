"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, QrCode, CheckCircle, Star } from "lucide-react";

const AVATAR_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#8b5cf6"];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-0 pb-0 overflow-hidden">
      {/* Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="pill pill-accent mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block" />
              AI-Powered Health Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
              className="font-bold leading-[1.1] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)", color: "var(--text-primary)" }}
            >
              Your Health,{" "}
              <span className="text-gradient">Intelligently</span>{" "}
              Protected
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg leading-relaxed mb-8 max-w-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Book vaccinations in under 2 minutes, manage your family's health records, and carry a
              tamper-proof digital vaccine passport — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link href="/register" className="btn-primary glow-pulse" style={{ padding: "13px 28px", fontSize: "0.95rem" }}>
                Get Started Free <ArrowRight size={16} />
              </Link>
              <Link href="#how-it-works" className="btn-ghost" style={{ padding: "13px 28px", fontSize: "0.95rem" }}>
                See How It Works
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-6"
            >
              <div className="flex -space-x-2">
                {AVATAR_COLORS.map((bg, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: bg, zIndex: 4 - i }}>
                    {["A", "B", "C", "D"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Trusted by <strong style={{ color: "var(--text-primary)" }}>2.4M+</strong> citizens
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — floating preview card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="float">
              <div className="glass-strong rounded-2xl p-6 max-w-sm mx-auto" style={{ boxShadow: "var(--shadow-glow)" }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>Next Appointment</p>
                    <p className="font-bold" style={{ color: "var(--text-primary)" }}>COVID-19 Booster</p>
                  </div>
                  <div className="pill pill-success">Confirmed</div>
                </div>

                <div className="rounded-xl p-4 mb-4" style={{ background: "var(--accent-subtle)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
                      <Calendar size={18} color="white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Thursday, 24 April 2025</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>10:30 AM · Dhaka Medical Center</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                    <span>Vaccination Progress</span>
                    <span style={{ color: "var(--accent)", fontWeight: 600 }}>3 / 4 doses</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                    <div className="h-full rounded-full" style={{ width: "75%", background: "linear-gradient(90deg, var(--accent), #818cf8)" }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Family members</p>
                  <div className="flex -space-x-1.5">
                    {["#4f46e5", "#10b981", "#f59e0b"].map((bg, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-white flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: bg }}>
                        {["M", "F", "K"][i]}
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>+2</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 animate-fade-up delay-500" style={{ boxShadow: "var(--shadow-md)" }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--success-subtle)" }}>
                  <CheckCircle size={12} color="var(--success)" />
                </div>
                <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Fully Vaccinated</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 glass rounded-xl px-3 py-2 animate-fade-up delay-600" style={{ boxShadow: "var(--shadow-md)" }}>
              <div className="flex items-center gap-2">
                <QrCode size={16} color="var(--accent)" />
                <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Passport Ready</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
