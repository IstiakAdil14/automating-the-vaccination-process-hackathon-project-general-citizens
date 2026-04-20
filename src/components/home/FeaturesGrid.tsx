"use client";
import { motion } from "framer-motion";
import { Calendar, QrCode, Users, Brain, MapPin, Bell } from "lucide-react";
import type { Feature } from "@/types/home";

const ICON_MAP: Record<string, React.ElementType> = { Calendar, QrCode, Users, Brain, MapPin, Bell };

interface FeaturesGridProps {
  features: Feature[];
}

export default function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="pill pill-accent mb-4 mx-auto w-fit"
          >
            Everything You Need
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-bold mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.15 }}
          >
            Built for the modern{" "}
            <span className="text-gradient">health citizen</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-lg max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Every feature designed to make vaccination effortless, transparent, and accessible for everyone.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon, title, desc, color }, i) => {
            const Icon = ICON_MAP[icon];
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="card p-6 group"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${color}15` }}>
                  {Icon && <Icon size={20} color={color} />}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
