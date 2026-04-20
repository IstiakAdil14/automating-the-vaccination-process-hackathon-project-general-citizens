"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Send, HelpCircle } from "lucide-react";
import Fuse from "fuse.js";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import LanguageToggle from "@/components/health-guide/LanguageToggle";
import { useLang } from "@/hooks/useLang";
import { faqData, FAQ_CATEGORIES, type FAQItem, type FAQCategory } from "@/lib/faqData";

// ── Fuse instance ─────────────────────────────────────────────────────────────
const fuse = new Fuse(faqData, { keys: ["question", "answer"], threshold: 0.35, includeScore: true });

// ── FAQ Accordion Item ────────────────────────────────────────────────────────
function FAQAccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  const contentId = `faq-content-${item.id}`;
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors min-h-[56px] gap-3"
      >
        <span className="font-semibold text-gray-800 text-sm leading-snug">{item.question}</span>
        {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" aria-hidden="true" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" aria-hidden="true" />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 border-t border-gray-100 pt-3">
              <p className="text-sm text-gray-600 leading-[1.7]">{item.answer}</p>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-xs text-gray-400">Was this helpful?</span>
                <button
                  onClick={() => setFeedback("up")}
                  aria-label="Yes, this was helpful"
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors min-h-[36px] ${feedback === "up" ? "bg-emerald-50 text-emerald-600" : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"}`}
                >
                  <ThumbsUp size={13} /> Yes
                </button>
                <button
                  onClick={() => setFeedback("down")}
                  aria-label="No, this was not helpful"
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors min-h-[36px] ${feedback === "down" ? "bg-red-50 text-red-500" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
                >
                  <ThumbsDown size={13} /> No
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Contact Support Form ──────────────────────────────────────────────────────
function ContactSupportForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.message) e.message = "Message is required.";
    else if (form.message.length > 500) e.message = "Max 500 characters.";
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/guest/support-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="card p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <Send size={24} className="text-emerald-500" aria-hidden="true" />
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-1">Thanks!</h3>
        <p className="text-gray-500 text-sm">We'll respond within 48 hours.</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
        <HelpCircle size={20} className="text-indigo-500" aria-hidden="true" />
        Still have a question?
      </h3>
      <p className="text-sm text-gray-500 mb-5">We'll get back to you within 48 hours.</p>

      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-gray-400 font-normal">(optional)</span></label>
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            required
            className={`input-field ${errors.email ? "border-red-400" : ""}`}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && <p id="email-error" className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question / Message *
            <span className="text-gray-400 font-normal ml-1">({form.message.length}/500)</span>
          </label>
          <textarea
            required
            rows={4}
            className={`input-field resize-none ${errors.message ? "border-red-400" : ""}`}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Describe your question..."
            aria-describedby={errors.message ? "msg-error" : undefined}
          />
          {errors.message && <p id="msg-error" className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>
        {status === "error" && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
            Something went wrong. Please try again.
          </p>
        )}
        <button type="submit" disabled={status === "loading"} className="btn-primary min-h-[44px]">
          {status === "loading" ? "Sending..." : <><Send size={15} /> Send Message</>}
        </button>
      </form>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FAQClient() {
  const { lang, setLang } = useLang();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("Registration");
  const [openId, setOpenId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  // CMD/CTRL+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filteredItems: FAQItem[] = query.trim()
    ? fuse.search(query).map((r) => r.item)
    : faqData.filter((item) => item.category === activeCategory);

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-b border-indigo-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
            <h1 className="text-4xl font-black text-gray-900 mb-3">Frequently Asked Questions</h1>
            <p className="text-gray-500 text-base">Everything you need to know about VaxEPI.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          {/* Search */}
          <div className="relative mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpenId(null); }}
              placeholder="Search questions... e.g. 'How do I register?' or 'Is it free?'"
              className="input-field pl-11 pr-24"
              aria-label="Search FAQ questions"
              aria-controls="faq-results"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs text-gray-400 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 pointer-events-none">
              ⌘K
            </kbd>
          </div>

          {/* Live region for search results count */}
          <p ref={liveRef} aria-live="polite" className="sr-only">
            {query ? `${filteredItems.length} result${filteredItems.length !== 1 ? "s" : ""} found` : ""}
          </p>

          {/* Category tabs — hidden when searching */}
          {!query && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none" role="tablist" aria-label="FAQ categories">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  onClick={() => { setActiveCategory(cat); setOpenId(null); }}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[40px] border ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          <div id="faq-results" className="flex flex-col gap-2 mb-12">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <FAQAccordionItem
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => toggle(item.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Search size={36} className="mx-auto mb-3 opacity-30" aria-hidden="true" />
                <p className="font-medium">No matching questions</p>
                <p className="text-sm mt-1">Ask us directly below</p>
              </div>
            )}
          </div>

          {/* Contact form */}
          <ContactSupportForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
