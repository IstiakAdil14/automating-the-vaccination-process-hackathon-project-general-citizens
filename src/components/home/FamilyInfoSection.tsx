"use client";
import { motion } from "framer-motion";
import { Users, CheckCircle, BarChart2, ShieldCheck } from "lucide-react";

const POINTS = [
  { icon: Users,      text: "Add unlimited family members under one account" },
  { icon: CheckCircle,text: "Track each member's vaccination progress individually" },
  { icon: BarChart2,  text: "View a unified health dashboard for the whole family" },
  { icon: ShieldCheck,text: "Get separate reminders tailored to each member's schedule" },
];

const MEMBER_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];
const MEMBER_LABELS = ["You", "Spouse", "Child 1", "Child 2", "Parent"];
const MEMBER_PROGRESS = [75, 100, 40, 60, 90];

export default function FamilyInfoSection() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — illustration card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="relative"
          >
            <div
              className="rounded-2xl p-6"
              style={{
                background: "var(--surface-raised)",
                border: "1px solid var(--border-strong)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>Family Overview</p>
                  <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>5 Members Tracked</p>
                </div>
                <div className="pill pill-success text-xs">All Active</div>
              </div>

              <div className="flex flex-col gap-4">
                {MEMBER_LABELS.map((label, i) => (
                  <div key={label} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: MEMBER_COLORS[i] }}
                    >
                      {label[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
                        <span style={{ color: "var(--accent)", fontWeight: 600 }}>{MEMBER_PROGRESS[i]}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${MEMBER_PROGRESS[i]}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${MEMBER_COLORS[i]}, ${MEMBER_COLORS[i]}99)` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-6 pt-4 flex items-center justify-between text-xs"
                style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}
              >
                <span>Overall family protection</span>
                <span className="font-bold" style={{ color: "var(--success)" }}>73% complete</span>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 animate-fade-up"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <div className="flex items-center gap-2">
                <Users size={13} color="var(--accent)" />
                <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Family Mode</span>
              </div>
            </div>
          </motion.div>

          {/* Right — text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} className="pill pill-accent mb-5 w-fit"
            >
              Family Management
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="font-bold mb-4"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "var(--text-primary)", lineHeight: 1.2 }}
            >
              Protect your <span className="text-gradient">entire family</span> from one place
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-base leading-relaxed mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              Managing vaccination records for multiple family members used to be a hassle.
              VaxEPI brings everyone under one roof — with individual tracking, reminders, and digital passports for each member.
            </motion.p>

            <div className="flex flex-col gap-3">
              {POINTS.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "var(--accent-subtle)" }}
                  >
                    <Icon size={15} color="var(--accent)" />
                  </div>
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{text}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
