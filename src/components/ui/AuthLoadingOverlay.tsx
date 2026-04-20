"use client";
import { useEffect, useState } from "react";
import { Syringe, LogIn, UserPlus, LogOut, Loader2 } from "lucide-react";

type Variant = "login" | "signup" | "logout" | "page";

const CONFIG = {
  login: {
    icon: LogIn,
    color: "#4f46e5",
    glow: "rgba(79,70,229,0.35)",
    title: "Signing you in…",
    steps: ["Verifying credentials", "Loading your profile", "Preparing dashboard"],
  },
  signup: {
    icon: UserPlus,
    color: "#10b981",
    glow: "rgba(16,185,129,0.35)",
    title: "Creating your account…",
    steps: ["Securing your data", "Setting up profile", "Almost ready"],
  },
  logout: {
    icon: LogOut,
    color: "#6366f1",
    glow: "rgba(99,102,241,0.35)",
    title: "Signing you out…",
    steps: ["Clearing session", "Securing account", "See you soon!"],
  },
  page: {
    icon: Loader2,
    color: "#4f46e5",
    glow: "rgba(79,70,229,0.35)",
    title: "Loading…",
    steps: ["Fetching data", "Preparing content", "Almost there"],
  },
};

interface Props {
  variant: Variant;
  visible: boolean;
}

export default function AuthLoadingOverlay({ variant, visible }: Props) {
  const cfg = CONFIG[variant];
  const Icon = cfg.icon;

  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  // Animate progress bar
  useEffect(() => {
    if (!visible) { setProgress(0); setStepIdx(0); return; }
    const target = ((stepIdx + 1) / cfg.steps.length) * 100;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= target) { clearInterval(id); return target; }
        return p + 1.2;
      });
    }, 18);
    return () => clearInterval(id);
  }, [visible, stepIdx]);

  // Cycle through steps
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, cfg.steps.length - 1));
    }, 500);
    return () => clearInterval(id);
  }, [visible]);

  // Animated dots
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "rgba(10,14,26,0.55)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        animation: "fade-in 0.2s ease forwards",
      }}
    >
      <div
        className="flex flex-col items-center gap-6 px-10 py-10 rounded-3xl"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border-strong)",
          boxShadow: `0 32px 80px rgba(10,14,26,0.25), 0 0 0 1px ${cfg.glow}`,
          minWidth: 300,
          animation: "scale-in 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
        }}
      >
        {/* Pulsing icon ring */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div
            className="absolute w-24 h-24 rounded-full"
            style={{
              background: `${cfg.color}10`,
              border: `2px solid ${cfg.color}30`,
              animation: "glow-pulse 1.8s ease-in-out infinite",
            }}
          />
          {/* Middle ring */}
          <div
            className="absolute w-16 h-16 rounded-full"
            style={{
              background: `${cfg.color}15`,
              border: `1.5px solid ${cfg.color}40`,
            }}
          />
          {/* Icon circle */}
          <div
            className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`,
              boxShadow: `0 8px 24px ${cfg.glow}`,
            }}
          >
            <Icon size={24} color="white" strokeWidth={2} />
          </div>

          {/* Orbiting syringe dot */}
          <div
            className="absolute w-5 h-5 rounded-full flex items-center justify-center"
            style={{
              background: "var(--surface-raised)",
              border: `2px solid ${cfg.color}`,
              boxShadow: `0 0 8px ${cfg.glow}`,
              animation: "orbit 2s linear infinite",
              transformOrigin: "center",
            }}
          >
            <Syringe size={9} color={cfg.color} />
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="font-bold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>
            {cfg.title}
          </p>
          <p className="text-sm mt-1 h-5 transition-all duration-300" style={{ color: "var(--text-muted)" }}>
            {cfg.steps[stepIdx]}{dots}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-2">
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${cfg.color}99, ${cfg.color})`,
                boxShadow: `0 0 8px ${cfg.glow}`,
              }}
            />
          </div>

          {/* Step dots */}
          <div className="flex justify-between px-0.5">
            {cfg.steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{ background: i <= stepIdx ? cfg.color : "var(--border-strong)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(44px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(44px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
