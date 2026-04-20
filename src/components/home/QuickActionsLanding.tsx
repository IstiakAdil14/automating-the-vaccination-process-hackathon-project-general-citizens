"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, LogIn, Calendar, ClipboardList } from "lucide-react";
import type { Action } from "@/types/home";

const ICON_MAP: Record<string, React.ElementType> = { UserPlus, LogIn, Calendar, ClipboardList };

interface Props { actions: Action[] }

export default function QuickActionsLanding({ actions }: Props) {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="pill pill-accent mb-4 mx-auto w-fit"
          >
            Get Started
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-bold mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.15 }}
          >
            What would you like to <span className="text-gradient">do today?</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {actions.map(({ label, href, icon, color, description }, i) => {
            const Icon = ICON_MAP[icon];
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href={href}
                  className="card flex flex-col items-center text-center p-8 gap-4 h-full"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${color}15` }}
                  >
                    {Icon && <Icon size={26} color={color} />}
                  </div>
                  <div>
                    <p className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>{label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{description}</p>
                  </div>
                  <div
                    className="mt-auto px-4 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: `${color}15`, color }}
                  >
                    Go →
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
