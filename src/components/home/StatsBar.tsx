"use client";
import { motion } from "framer-motion";
import { Shield, Star, MapPin, Zap } from "lucide-react";
import type { Stat } from "@/types/home";

const ICON_MAP: Record<string, React.ElementType> = { Shield, Star, MapPin, Zap };

interface StatsBarProps {
  stats: Stat[];
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <section
      className="py-10"
      style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon }, i) => {
            const Icon = ICON_MAP[icon];
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: "var(--accent-subtle)" }}>
                  {Icon && <Icon size={18} color="var(--accent)" />}
                </div>
                <p className="font-bold text-3xl tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>{value}</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
