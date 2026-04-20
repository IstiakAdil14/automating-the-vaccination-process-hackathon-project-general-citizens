"use client";
import { motion } from "framer-motion";
import { UserCheck, MapPin, CalendarCheck, QrCode, Clock, ShieldCheck } from "lucide-react";

const STEPS = [
  { icon: UserCheck,    title: "Register & Verify",   desc: "Sign up with your NID or Birth Certificate. OTP verification takes under 60 seconds.",       color: "#4f46e5" },
  { icon: MapPin,       title: "Find a Center",        desc: "Browse nearby vaccination centers on a live map with real-time slot availability.",           color: "#10b981" },
  { icon: CalendarCheck,title: "Pick a Time Slot",     desc: "Choose a date and time that works for you. AI suggests the best available slots near you.",   color: "#f59e0b" },
  { icon: QrCode,       title: "Get Your QR Pass",     desc: "Receive a digital confirmation with a QR code. Show it at the center — no paperwork needed.", color: "#8b5cf6" },
];

const BENEFITS = [
  { icon: Clock,       text: "Book in under 2 minutes" },
  { icon: ShieldCheck, text: "Instant digital confirmation" },
  { icon: QrCode,      text: "QR pass — no paperwork" },
];

export default function AppointmentInfo() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="pill pill-accent mb-4 mx-auto w-fit"
          >
            How It Works
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-bold mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.15 }}
          >
            Book an appointment in <span className="text-gradient">4 easy steps</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}
          >
            No queues, no paperwork. The entire process is digital and takes less than 2 minutes.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {STEPS.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card p-6 relative"
            >
              {/* Step number */}
              <span
                className="absolute top-4 right-4 text-xs font-bold"
                style={{ color: "var(--text-muted)" }}
              >
                0{i + 1}
              </span>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}15` }}
              >
                <Icon size={20} color={color} />
              </div>
              <h3 className="font-semibold mb-2 text-sm" style={{ color: "var(--text-primary)" }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {BENEFITS.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border-strong)",
                color: "var(--text-secondary)",
              }}
            >
              <Icon size={15} color="var(--accent)" />
              {text}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
