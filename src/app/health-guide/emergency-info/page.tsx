"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, AlertTriangle, ChevronDown, ChevronUp,
  MapPin, Wifi, WifiOff, ExternalLink, X, ShieldAlert,
  Activity, Car, Building2, StopCircle,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import LanguageToggle from "@/components/health-guide/LanguageToggle";
import { useLang } from "@/hooks/useLang";
import { getNearestHospitals, getHospitalsByDistrict, districts } from "@/lib/hospitals";
import type { Hospital } from "@/lib/hospitals";
import en from "../../../../locales/en.json";

type Severity = "mild" | "moderate" | "severe";
type T = typeof en;

// ── Offline Banner ──────────────────────────────────────────────────────────
function OfflineBanner({ text }: { text: string }) {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);
  if (!offline) return null;
  return (
    <div className="flex items-center gap-2 bg-gray-800 text-white text-sm px-4 py-3 rounded-xl mb-6" role="alert">
      <WifiOff size={16} aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}

// ── Emergency Hotline ───────────────────────────────────────────────────────
function EmergencyHotline({ t }: { t: T }) {
  return (
    <div className="bg-red-600 rounded-2xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 opacity-60 pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <Phone size={28} className="text-white" />
          </motion.div>
          <div>
            <p className="text-red-100 text-sm font-medium mb-0.5">{t.emergency.hotlineTitle}</p>
            <a
              href={`tel:${t.emergency.hotlineNumber}`}
              className="text-4xl sm:text-5xl font-black tracking-tight hover:text-red-100 transition-colors focus-visible:outline-white focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
              aria-label={`${t.emergency.hotlineTap}: ${t.emergency.hotlineNumber}`}
            >
              {t.emergency.hotlineNumber}
            </a>
          </div>
        </div>
        <span className="bg-white/20 border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-full">
          {t.emergency.hotlineAvailable}
        </span>
      </div>
    </div>
  );
}

// ── Severe Reaction Guide ───────────────────────────────────────────────────
const STEP_ICONS = [StopCircle, Phone, Car, Building2];

function SevereReactionGuide({ t }: { t: T }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-5">{t.emergency.reactionGuideTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {t.emergency.steps.map((step, i) => {
          const Icon = STEP_ICONS[i];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="card p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-indigo-100 leading-none">{i + 1}</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-indigo-600" aria-hidden="true" />
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{step.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{step.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Symptom Severity Classifier ─────────────────────────────────────────────
function SymptomSeverityClassifier({ t, isOnline }: { t: T; isOnline: boolean }) {
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState<Severity | null>(null);

  const reset = () => { setSymptom(""); setSeverity(null); };

  const resultConfig: Record<Severity, { bg: string; border: string; text: string; icon: string }> = {
    mild:     { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", icon: "✅" },
    moderate: { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-800",   icon: "⚠️" },
    severe:   { bg: "bg-red-50",     border: "border-red-200",     text: "text-red-800",     icon: "🚨" },
  };

  if (!isOnline) {
    return (
      <div className="card p-6 mb-8 flex items-center gap-3 text-gray-400">
        <Wifi size={20} aria-hidden="true" />
        <span className="text-sm">{t.emergency.requiresInternet}</span>
      </div>
    );
  }

  return (
    <div className="card p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        <Activity size={20} className="text-indigo-600" aria-hidden="true" />
        {t.emergency.symptomTitle}
      </h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">{t.emergency.symptomQ1}</label>
        <select
          value={symptom}
          onChange={(e) => { setSymptom(e.target.value); setSeverity(null); }}
          className="input-field"
          aria-label={t.emergency.symptomQ1}
        >
          <option value="">— Select —</option>
          {t.emergency.symptoms.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <AnimatePresence>
        {symptom && !severity && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="text-sm font-medium text-gray-700 mb-3">{t.emergency.symptomQ2}</p>
            <div className="grid grid-cols-3 gap-3">
              {(["mild", "moderate", "severe"] as Severity[]).map((s) => {
                const cfg = resultConfig[s];
                return (
                  <button
                    key={s}
                    onClick={() => setSeverity(s)}
                    className={`${cfg.bg} ${cfg.border} ${cfg.text} border-2 rounded-xl py-4 font-bold text-sm transition-all hover:scale-105 active:scale-95 min-h-[64px] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`}
                    aria-label={t.emergency.severities[s]}
                  >
                    <span className="block text-xl mb-1">{cfg.icon}</span>
                    {t.emergency.severities[s]}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {severity && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            role="status"
            aria-live="assertive"
            className={`${resultConfig[severity].bg} ${resultConfig[severity].border} ${resultConfig[severity].text} border-2 rounded-xl p-4 mt-4`}
          >
            <p className="font-bold text-base mb-1">
              {resultConfig[severity].icon} {t.emergency.severities[severity]}
            </p>
            <p className="text-sm">{t.emergency.results[severity]}</p>
            {severity === "severe" && (
              <a href={`tel:${t.emergency.hotlineNumber}`} className="mt-3 flex items-center gap-2 font-black text-2xl text-red-700 hover:text-red-900">
                <Phone size={20} aria-hidden="true" /> {t.emergency.hotlineNumber}
              </a>
            )}
            <button onClick={reset} className="mt-3 text-xs underline opacity-70 hover:opacity-100 min-h-[44px]">
              {t.emergency.reset}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Nearest Hospital Finder ─────────────────────────────────────────────────
function NearestHospitalFinder({ t, isOnline }: { t: T; isOnline: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "denied">("idle");
  const [results, setResults] = useState<Array<Hospital & { distance?: number }>>([]);
  const [district, setDistrict] = useState("");

  const locate = () => {
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const found = getNearestHospitals(pos.coords.latitude, pos.coords.longitude);
        setResults(found as Array<Hospital & { distance?: number }>);
        setStatus("success");
      },
      () => setStatus("denied"),
      { timeout: 8000 }
    );
  };

  const handleDistrict = (d: string) => {
    setDistrict(d);
    const found = getHospitalsByDistrict(d);
    setResults(found as Array<Hospital & { distance?: number }>);
    setStatus("success");
  };

  if (!isOnline) {
    return (
      <div className="card p-6 mb-8 flex items-center gap-3 text-gray-400">
        <Wifi size={20} aria-hidden="true" />
        <span className="text-sm">{t.emergency.requiresInternet}</span>
      </div>
    );
  }

  return (
    <div className="card p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <MapPin size={20} className="text-indigo-600" aria-hidden="true" />
        {t.emergency.hospitalTitle}
      </h2>

      {status === "idle" && (
        <button onClick={locate} className="btn-primary min-h-[44px]">
          <MapPin size={16} aria-hidden="true" /> {t.emergency.findHospital}
        </button>
      )}

      {status === "loading" && (
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full" aria-hidden="true" />
          {t.emergency.locating}
        </div>
      )}

      {status === "denied" && (
        <div>
          <p className="text-sm text-gray-500 mb-3">{t.emergency.locationDenied}</p>
          <select
            value={district}
            onChange={(e) => handleDistrict(e.target.value)}
            className="input-field max-w-xs"
            aria-label={t.emergency.selectDistrict}
          >
            <option value="">{t.emergency.selectDistrict}</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      )}

      {status === "success" && results.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
          {results.map((h) => (
            <div key={h.name} className="border border-gray-100 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
              <p className="font-semibold text-gray-800 text-sm mb-1">{h.name}</p>
              <p className="text-xs text-gray-500 mb-2">{h.address}</p>
              {"distance" in h && typeof h.distance === "number" && (
                <p className="text-xs text-indigo-500 font-medium mb-2">
                  ~{h.distance.toFixed(1)} {t.emergency.distance}
                </p>
              )}
              <a href={`tel:${h.phone}`} className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-800 min-h-[44px]">
                <Phone size={14} aria-hidden="true" /> {h.phone}
              </a>
            </div>
          ))}
        </div>
      )}

      {status === "success" && results.length === 0 && (
        <p className="text-sm text-gray-400 mt-2">No hospitals found for selected district.</p>
      )}
    </div>
  );
}

// ── Vaccine Reaction Accordion ──────────────────────────────────────────────
function VaccineReactionAccordion({ t }: { t: T }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ShieldAlert size={20} className="text-indigo-600" aria-hidden="true" />
        {t.emergency.reactionAccordionTitle}
      </h2>
      <div className="flex flex-col gap-2">
        {t.emergency.vaccineReactions.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={item.vaccine} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-4 py-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors min-h-[56px]"
                aria-expanded={isOpen}
              >
                <span>{item.vaccine}</span>
                {isOpen ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Known Severe Reactions</p>
                        <ul className="space-y-1">
                          {item.reactions.map((r) => (
                            <li key={r.label} className="flex items-center gap-2 text-sm text-gray-700">
                              <span className={`pill text-xs ${r.rarity.toLowerCase().includes("very") ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                                {r.rarity}
                              </span>
                              {r.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Emergency Step</p>
                        <p className="text-sm text-gray-700">{item.emergencyStep}</p>
                      </div>
                      <a
                        href={item.whoRef}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline min-h-[44px]"
                      >
                        <ExternalLink size={12} aria-hidden="true" /> WHO Reference
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Report Reaction Modal ───────────────────────────────────────────────────
function ReportModal({ t, onClose }: { t: T; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", vaccine: "", description: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/guest/reaction-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={t.emergency.reportModal.title}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">{t.emergency.reportModal.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={t.emergency.reportModal.close}>
            <X size={20} />
          </button>
        </div>

        {status === "success" ? (
          <p className="text-emerald-600 font-medium text-center py-6">{t.emergency.reportModal.success}</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.emergency.reportModal.name}</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.emergency.reportModal.phone} *</label>
              <input required className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.emergency.reportModal.vaccine} *</label>
              <input required className="input-field" value={form.vaccine} onChange={(e) => setForm({ ...form, vaccine: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.emergency.reportModal.description} *</label>
              <textarea required rows={3} className="input-field resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            {status === "error" && <p className="text-red-500 text-sm">Submission failed. Please try again.</p>}
            <button type="submit" disabled={status === "loading"} className="btn-primary w-full justify-center min-h-[44px]">
              {status === "loading" ? t.emergency.reportModal.submitting : t.emergency.reportModal.submit}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

// ── Emergency Contacts Table ────────────────────────────────────────────────
function EmergencyContactsTable({ t }: { t: T }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Phone size={20} className="text-indigo-600" aria-hidden="true" />
        {t.emergency.contactsTitle}
      </h2>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">{t.emergency.contactsHeaders.authority}</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">{t.emergency.contactsHeaders.phone}</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">{t.emergency.contactsHeaders.available}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {t.emergency.contacts.map((c) => (
              <tr key={c.authority} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">{c.authority}</td>
                <td className="px-4 py-3">
                  <a href={`tel:${c.phone}`} className="text-red-600 font-semibold hover:text-red-800 flex items-center gap-1.5 min-h-[44px]">
                    <Phone size={13} aria-hidden="true" /> {c.phone}
                  </a>
                </td>
                <td className="px-4 py-3 text-gray-500">{c.available}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right">
        <button onClick={() => setShowModal(true)} className="text-sm text-indigo-600 hover:underline font-medium min-h-[44px]">
          {t.emergency.reportReaction} →
        </button>
      </div>
      <AnimatePresence>
        {showModal && <ReportModal t={t} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function EmergencyInfoPage() {
  const { lang, setLang, t } = useLang();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Page header */}
        <div className="bg-gradient-to-br from-red-50 via-white to-orange-50 border-b border-red-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={22} className="text-red-500" aria-hidden="true" />
                <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">
                  {t.nav.healthGuide}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{t.emergency.title}</h1>
              <p className="text-gray-500 text-base max-w-xl">{t.emergency.subtitle}</p>
            </div>
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <OfflineBanner text={t.emergency.offlineBanner} />
          <EmergencyHotline t={t} />
          <SevereReactionGuide t={t} />
          <SymptomSeverityClassifier t={t} isOnline={isOnline} />
          <NearestHospitalFinder t={t} isOnline={isOnline} />
          <VaccineReactionAccordion t={t} />
          <EmergencyContactsTable t={t} />
        </div>
      </main>
      <Footer />
    </>
  );
}
