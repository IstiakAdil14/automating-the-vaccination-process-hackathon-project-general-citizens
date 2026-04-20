"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface GreetingBarProps {
  name: string;
}

function getGreeting(): { text: string; emoji: string } {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", emoji: "🌅" };
  if (h < 17) return { text: "Good afternoon", emoji: "☀️" };
  return { text: "Good evening", emoji: "🌙" };
}

export default function GreetingBar({ name }: GreetingBarProps) {
  const { text, emoji } = useMemo(getGreeting, []);
  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
          className="text-2xl select-none"
          aria-hidden="true"
        >
          {emoji}
        </motion.span>
        <h1 className="font-bold text-2xl" style={{ color: "var(--text-primary)" }}>
          {text}, {name}!
        </h1>
      </div>
      <p className="text-sm mt-0.5 ml-9" style={{ color: "var(--text-muted)" }}>
        {date}
      </p>
    </motion.div>
  );
}
