"use client";
import { motion } from "framer-motion";
import { Bell, HeartPulse, RefreshCw } from "lucide-react";
import type { InfoCard } from "@/types/home";

const ICON_MAP: Record<string, React.ElementType> = { Bell, HeartPulse, RefreshCw };

interface Props { remindersInfo: InfoCard[] }

export default function RemindersInfo({ remindersInfo }: Props) {
  return (
    <section className="py-24" style={{ background: "var(--surface)" }}>
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} className="pill pill-accent mb-5 w-fit"
            >
              Smart Reminders
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="font-bold mb-4"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "var(--text-primary)", lineHeight: 1.2 }}
            >
              Never miss a <span className="text-gradient">dose again</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-base leading-relaxed mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              Our intelligent reminder system keeps you and your family on track with personalized
              alerts via SMS, email, and in-app notifications — at exactly the right time.
            </motion.p>

            {/* Channel pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {["SMS Alerts", "Email Notifications", "In-App Push", "WhatsApp (coming soon)"].map((ch) => (
                <span key={ch} className="pill pill-accent text-xs">{ch}</span>
              ))}
            </motion.div>
          </div>

          {/* Right — info cards */}
          <div className="flex flex-col gap-4">
            {remindersInfo.map(({ icon, title, description, color }, i) => {
              const Icon = ICON_MAP[icon];
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="card p-5 flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}15` }}
                  >
                    {Icon && <Icon size={18} color={color} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
