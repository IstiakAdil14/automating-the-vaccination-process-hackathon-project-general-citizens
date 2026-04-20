"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

const SUGGESTIONS = [
  "When is my next vaccine due?",
  "How do I book an appointment?",
  "What vaccines are available?",
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([
    { from: "bot", text: "Hi! I'm VaxBot 👋 How can I help you today?" },
  ]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text },
      { from: "bot", text: "Thanks for your message! A health worker will follow up shortly." },
    ]);
    setInput("");
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="chatbot-trigger fixed right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
            style={{ background: "var(--accent)", boxShadow: "0 8px 32px var(--accent-glow)" }}
          >
            <MessageCircle size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
          <Dialog.Content asChild>
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="chatbot-panel fixed right-6 z-50 w-80 rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: "var(--surface-raised)",
                border: "1px solid var(--border-strong)",
                boxShadow: "var(--shadow-lg)",
                maxHeight: "480px",
              }}
            >
              <VisuallyHidden.Root asChild>
                <Dialog.Title>VaxBot Assistant</Dialog.Title>
              </VisuallyHidden.Root>

              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ background: "var(--accent)", color: "white" }}
              >
                <div className="flex items-center gap-2">
                  <Bot size={18} />
                  <span className="font-semibold text-sm">VaxBot Assistant</span>
                </div>
                <Dialog.Close asChild>
                  <button className="p-1 rounded-lg hover:bg-white/20 transition-colors">
                    <X size={16} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                      style={
                        msg.from === "user"
                          ? { background: "var(--accent)", color: "white" }
                          : { background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Suggestions */}
                {messages.length === 1 && (
                  <div className="space-y-1.5 pt-1">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors hover:bg-[var(--accent-subtle)]"
                        style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div
                className="flex items-center gap-2 p-3"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Type a message…"
                  className="input-field text-xs py-2"
                />
                <button
                  onClick={() => send(input)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white transition-opacity hover:opacity-80"
                  style={{ background: "var(--accent)" }}
                >
                  <Send size={14} />
                </button>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
