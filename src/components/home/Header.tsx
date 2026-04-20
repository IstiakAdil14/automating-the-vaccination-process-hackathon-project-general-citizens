"use client";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useState } from "react";
import NotificationBell from "@/components/shared/NotificationBell";

interface HeaderProps {
  unreadCount: number;
}

export default function Header({ unreadCount: _ }: HeaderProps) {
  const [lang, setLang] = useState<"EN" | "বাং">("EN");

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between"
    >
      <div>
        <h1 className="font-bold text-2xl" style={{ color: "var(--text-primary)" }}>
          Home 💉
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Your vaccination overview at a glance
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setLang((l) => (l === "EN" ? "বাং" : "EN"))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
          style={{
            background: "var(--accent-subtle)",
            color: "var(--accent)",
            border: "1px solid rgba(79,70,229,0.15)",
          }}
        >
          <Globe size={13} />
          {lang}
        </button>

        {/* Live notification bell — replaces static bell */}
        <NotificationBell />

        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: "var(--accent)", boxShadow: "0 4px 12px var(--accent-glow)" }}
        >
          U
        </div>
      </div>
    </motion.div>
  );
}
