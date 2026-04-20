"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar, QrCode, ScanLine, AlertTriangle, X,
} from "lucide-react";
import { useState } from "react";

// ── Action config ─────────────────────────────────────────────────────────────
type ActionKind =
  | { type: "route"; href: string }
  | { type: "modal"; modalId: string }
  | { type: "callback" };

interface Action {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  cardBorder: string;
  action: ActionKind;
}

const ACTIONS: Action[] = [
  {
    id: "book",
    label: "Book Appointment",
    sublabel: "Find a slot near you",
    icon: Calendar,
    iconColor: "#4f46e5",
    iconBg: "rgba(79,70,229,0.10)",
    cardBorder: "rgba(79,70,229,0.14)",
    action: { type: "route", href: "/appointments" },
  },
  {
    id: "vaccine-card",
    label: "Vaccine Card",
    sublabel: "View your QR passport",
    icon: QrCode,
    iconColor: "#059669",
    iconBg: "rgba(5,150,105,0.10)",
    cardBorder: "rgba(5,150,105,0.14)",
    action: { type: "route", href: "/vaccine-card" },
  },
  {
    id: "scan",
    label: "Scan Card",
    sublabel: "OCR paper vaccine card",
    icon: ScanLine,
    iconColor: "#7c3aed",
    iconBg: "rgba(124,58,237,0.10)",
    cardBorder: "rgba(124,58,237,0.14)",
    action: { type: "modal", modalId: "scan" },
  },
  {
    id: "report",
    label: "Report Side Effect",
    sublabel: "Log a reaction",
    icon: AlertTriangle,
    iconColor: "#dc2626",
    iconBg: "rgba(220,38,38,0.10)",
    cardBorder: "rgba(220,38,38,0.14)",
    action: { type: "modal", modalId: "report" },
  },
];

// ── Modal stubs ───────────────────────────────────────────────────────────────
const MODAL_CONTENT: Record<string, { title: string; body: string }> = {
  scan: {
    title: "Scan Vaccine Card",
    body: "OCR scanning will be available in the next release. You'll be able to photograph a paper vaccine card and have it digitised automatically.",
  },
  report: {
    title: "Report a Side Effect",
    body: "Use this form to log any adverse reactions after vaccination. Your report helps improve national vaccine safety monitoring.",
  },
};

function Modal({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const { title, body } = MODAL_CONTENT[id] ?? { title: "Info", body: "" };
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(10,14,26,0.45)", backdropFilter: "blur(4px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        className="relative card p-6 w-full max-w-sm"
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start justify-between mb-3">
          <h2 id="modal-title" className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-colors hover:bg-[var(--accent-subtle)]"
            style={{ color: "var(--text-muted)" }}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{body}</p>
        <button
          onClick={onClose}
          className="btn-primary mt-5 w-full justify-center text-sm"
        >
          Got it
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Action button ─────────────────────────────────────────────────────────────
function ActionButton({
  action,
  delay,
  onModalOpen,
  onCallback,
}: {
  action: Action;
  delay: number;
  onModalOpen: (id: string) => void;
  onCallback: (id: string) => void;
}) {
  const router = useRouter();
  const { icon: Icon, iconColor, iconBg, cardBorder, label, sublabel } = action;

  const inner = (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(10,14,26,0.10)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
      className="flex flex-col items-center gap-3 p-5 rounded-2xl cursor-pointer select-none min-w-[120px] sm:min-w-0"
      style={{
        background: "var(--surface-raised)",
        border: `1px solid ${cardBorder}`,
        boxShadow: "var(--shadow-sm)",
      }}
      role="button"
      tabIndex={0}
      aria-label={label}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: iconBg }}
        aria-hidden="true"
      >
        <Icon size={22} color={iconColor} strokeWidth={1.8} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
          {label}
        </p>
        <p className="text-xs mt-0.5 leading-tight" style={{ color: "var(--text-muted)" }}>
          {sublabel}
        </p>
      </div>
    </motion.div>
  );

  function handleClick() {
    if (action.action.type === "modal") onModalOpen(action.action.modalId);
    else if (action.action.type === "callback") onCallback(action.id);
    else router.push(action.action.href);
  }

  // Route actions use Next Link for prefetch; others use div with onClick
  if (action.action.type === "route") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href={action.action.href} className="block outline-none focus-visible:ring-2">
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleClick}
    >
      {inner}
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
interface QuickActionGridProps {
  onCallback?: (actionId: string) => void;
}

export default function QuickActionGrid({ onCallback }: QuickActionGridProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <>
      <section aria-label="Quick actions">
        <h2
          className="font-semibold mb-3 px-0.5"
          style={{ color: "var(--text-primary)" }}
        >
          Quick Actions
        </h2>

        {/* Mobile: horizontal scroll | sm+: 4-col grid */}
        <div
          className="flex sm:grid sm:grid-cols-4 gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-none min-h-[160px]"
          role="list"
        >
          {ACTIONS.map((a, i) => (
            <div key={a.id} role="listitem" className="shrink-0 sm:shrink flex-1">
              <ActionButton
                action={a}
                delay={i * 0.07}
                onModalOpen={setActiveModal}
                onCallback={(id) => onCallback?.(id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Modal portal */}
      <AnimatePresence>
        {activeModal && (
          <Modal id={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
