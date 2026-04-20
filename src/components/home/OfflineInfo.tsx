"use client";
import { motion } from "framer-motion";
import { WifiOff, Database, RefreshCw, CheckCircle } from "lucide-react";

const FEATURES = [
  {
    icon: WifiOff,
    title: "Works Without Internet",
    desc: "Access your vaccine records, appointments, and QR passport even when you're completely offline.",
    color: "#4f46e5",
  },
  {
    icon: Database,
    title: "Locally Cached Data",
    desc: "Critical health data is securely stored on your device so it's always available when you need it most.",
    color: "#10b981",
  },
  {
    icon: RefreshCw,
    title: "Auto Sync When Online",
    desc: "Any actions taken offline — bookings, updates, reports — are automatically synced the moment you reconnect.",
    color: "#f59e0b",
  },
];

export default function OfflineInfo() {
  return (
    <section className="py-24" style={{ background: "var(--surface)" }}>
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="pill pill-accent mb-4 mx-auto w-fit"
          >
            Offline-First
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-bold mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.15 }}
          >
            Works everywhere — <span className="text-gradient">even offline</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}
          >
            Designed for areas with limited connectivity. Your health data is always accessible, online or not.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="card p-6 text-center"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `${color}15` }}
              >
                <Icon size={22} color={color} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {["Service Workers", "IndexedDB Storage", "Background Sync API"].map((tech) => (
            <div
              key={tech}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
              style={{
                background: "var(--accent-subtle)",
                color: "var(--accent)",
                border: "1px solid rgba(79,70,229,0.15)",
              }}
            >
              <CheckCircle size={12} />
              {tech}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
