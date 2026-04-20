"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Syringe, ArrowRight, CheckCircle } from "lucide-react";
import type { TrustBadge } from "@/types/home";

interface CTASectionProps {
  trustBadges: TrustBadge[];
}

export default function CTASection({ trustBadges }: CTASectionProps) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="gradient-border rounded-2xl p-12"
          style={{ background: "var(--surface-raised)" }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-pulse"
            style={{ background: "var(--accent)" }}>
            <Syringe size={24} color="white" />
          </div>

          <h2 className="font-bold mb-4"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "var(--text-primary)", lineHeight: 1.2 }}>
            Start protecting your family{" "}
            <span className="text-gradient">today</span>
          </h2>

          <p className="text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
            Join 2.4 million citizens who trust VaxCare for their vaccination management.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Link href="/register" className="btn-primary glow-pulse" style={{ padding: "14px 32px", fontSize: "1rem" }}>
              Create Free Account <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="btn-ghost" style={{ padding: "14px 32px", fontSize: "1rem" }}>
              Sign In
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {trustBadges.map(({ label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                <CheckCircle size={12} color="var(--success)" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
