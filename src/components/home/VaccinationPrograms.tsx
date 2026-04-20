"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import type { Program } from "@/types/home";

const STATUS_STYLES: Record<Program["status"], { bg: string; color: string; dot: string }> = {
  Upcoming:  { bg: "rgba(79,70,229,0.1)",  color: "#4f46e5", dot: "#4f46e5" },
  Ongoing:   { bg: "rgba(16,185,129,0.1)", color: "#10b981", dot: "#10b981" },
  Completed: { bg: "rgba(107,114,128,0.1)",color: "#6b7280", dot: "#6b7280" },
};

interface Props { programs: Program[] }

export default function VaccinationPrograms({ programs }: Props) {
  return (
    <section className="py-16" style={{ background: "var(--surface)" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="pill pill-accent mb-4 mx-auto w-fit"
          >
            Active Programs
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-bold mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.15 }}
          >
            Vaccination <span className="text-gradient">Programs</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}
          >
            Stay up to date with nationwide immunization drives. Register early to secure your slot.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.slice(0, 3).map((prog, i) => {
            const s = STATUS_STYLES[prog.status];
            return (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.22 } }}
                className="card overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={prog.image} alt={prog.title} fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Status badge over image */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="pill text-xs font-semibold flex items-center gap-1.5"
                      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: s.dot }} />
                      {prog.status}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <h3 className="font-semibold text-base leading-snug" style={{ color: "var(--text-primary)" }}>
                    {prog.title}
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <CalendarDays size={13} />
                      <span>{prog.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <MapPin size={13} />
                      <span>{prog.location}</span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
                    {prog.description}
                  </p>

                  {/* CTAs */}
                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/programs/${prog.slug}`}
                      className="flex-1 text-center py-2 rounded-xl text-xs font-semibold transition-colors"
                      style={{
                        background: "var(--accent-subtle)",
                        color: "var(--accent)",
                        border: "1px solid rgba(79,70,229,0.15)",
                      }}
                    >
                      View Details
                    </Link>
                    {prog.status !== "Completed" && (
                      <Link
                        href="/register"
                        className="flex-1 text-center py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: "var(--accent)" }}
                      >
                        Register
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Explore more */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/programs"
            className="btn-primary inline-flex items-center gap-2"
            style={{ padding: "12px 32px", fontSize: "0.95rem" }}
          >
            Explore All Programs
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
          <p className="text-sm mt-3" style={{ color: "var(--text-muted)" }}>
            {programs.length}+ active programs nationwide
          </p>
        </motion.div>
      </div>
    </section>
  );
}
