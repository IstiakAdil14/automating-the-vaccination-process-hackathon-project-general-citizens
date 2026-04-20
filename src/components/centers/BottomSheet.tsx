"use client";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function BottomSheet({ open, onClose, children, title }: Props) {
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(10,14,26,0.3)", zIndex: 40 }}
          />
          <motion.div
            ref={constraintsRef}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => { if (info.offset.y > 80) onClose(); }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 41,
              background: "var(--surface-raised)", borderRadius: "20px 20px 0 0",
              border: "1px solid var(--border-strong)", borderBottom: "none",
              boxShadow: "0 -8px 40px rgba(10,14,26,0.12)",
              maxHeight: "80vh", display: "flex", flexDirection: "column",
            }}
          >
            {/* Drag handle */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              style={{ padding: "12px 0 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "grab", flexShrink: 0 }}
            >
              <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--border-strong)" }} />
              {title && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 16px 8px" }}>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{title}</p>
                  <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                    <ChevronDown size={20} />
                  </button>
                </div>
              )}
            </div>
            <div style={{ overflowY: "auto", flex: 1, padding: "0 12px 24px" }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
