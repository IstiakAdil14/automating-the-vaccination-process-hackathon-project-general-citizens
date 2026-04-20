"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, QrCode, ScanLine, AlertTriangle } from "lucide-react";

const ACTIONS = [
  { label: "Book Appointment",   href: "/appointments",  icon: Calendar,      color: "#4f46e5" },
  { label: "Vaccine Card",       href: "/vaccine-card",  icon: QrCode,        color: "#10b981" },
  { label: "Scan Card",          href: "/vaccine-card",  icon: ScanLine,      color: "#f59e0b" },
  { label: "Report Side Effect", href: "/profile",       icon: AlertTriangle, color: "#ef4444" },
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6"
    >
      <h2 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ACTIONS.map(({ label, href, icon: Icon, color }) => (
          <motion.div key={label} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={href}
              className="flex flex-col items-center gap-2.5 p-4 rounded-xl text-center transition-colors hover:bg-[var(--accent-subtle)]"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}18` }}
              >
                <Icon size={18} color={color} />
              </div>
              <span className="text-xs font-medium leading-tight" style={{ color: "var(--text-secondary)" }}>
                {label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
