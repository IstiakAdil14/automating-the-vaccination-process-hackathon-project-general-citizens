"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, X, CheckCircle2, ChevronDown, ChevronUp,
  Syringe, BookOpen, ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import LanguageToggle from "@/components/health-guide/LanguageToggle";
import { useLang } from "@/hooks/useLang";
import vaccineData from "../../../../public/data/vaccineSchedule.json";

type AgeGroup = "infant" | "child" | "teen" | "adult" | "elderly";

interface Vaccine {
  id: string;
  name: string;
  whoCode: string;
  color: string;
  recommendedFor: string[];
  doses: number;
  intervalDays: number;
  preventsDiseases: string[];
  commonSideEffects: string[];
  contraindications: string[];
  learnMoreSlug: string;
}

const AGE_GROUPS: { key: AgeGroup; rangeKey: string }[] = [
  { key: "infant",  rangeKey: "infantRange" },
  { key: "child",   rangeKey: "childRange" },
  { key: "teen",    rangeKey: "teenRange" },
  { key: "adult",   rangeKey: "adultRange" },
  { key: "elderly", rangeKey: "elderlyRange" },
];

function DisclaimerBanner({ text }: { text: string }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("vaxcare_disclaimer_dismissed") === "1") setDismissed(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("vaxcare_disclaimer_dismissed", "1");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6"
      role="alert"
    >
      <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
      <p className="text-amber-800 text-sm flex-1">{text}</p>
      <button
        onClick={dismiss}
        className="text-amber-500 hover:text-amber-700 transition-colors p-1 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Dismiss disclaimer"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

function AgeGroupSelector({
  selected,
  onSelect,
  t,
}: {
  selected: AgeGroup | null;
  onSelect: (g: AgeGroup) => void;
  t: ReturnType<typeof useLang>["t"];
}) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-semibold text-gray-700 mb-3">{t.checker.ageGroup}</h2>
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {AGE_GROUPS.map(({ key, rangeKey }) => {
          const active = selected === key;
          return (
            <motion.button
              key={key}
              layout
              onClick={() => onSelect(key)}
              whileTap={{ scale: 0.96 }}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200 min-h-[64px] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                active
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
              aria-pressed={active}
            >
              <span className="font-semibold">{t.checker.ageGroups[key]}</span>
              <span className={`text-xs ${active ? "text-indigo-200" : "text-gray-400"}`}>
                {t.checker.ageGroups[rangeKey as keyof typeof t.checker.ageGroups]}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

function PreviousVaccinesInput({
  vaccines,
  checked,
  onToggle,
  onSelectAll,
  onClearAll,
  t,
}: {
  vaccines: Vaccine[];
  checked: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  t: ReturnType<typeof useLang>["t"];
}) {
  if (!vaccines.length) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold text-gray-700">{t.checker.previousVaccines}</h2>
        <div className="flex gap-2">
          <button onClick={onSelectAll} className="text-xs text-indigo-600 hover:underline font-medium px-2 py-1 min-h-[44px]">
            {t.checker.selectAll}
          </button>
          <button onClick={onClearAll} className="text-xs text-gray-400 hover:underline font-medium px-2 py-1 min-h-[44px]">
            {t.checker.clearAll}
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-3">{t.checker.previousVaccinesHint}</p>
      <div className="flex flex-wrap gap-2">
        {vaccines.map((v) => {
          const isChecked = checked.has(v.id);
          return (
            <motion.button
              key={v.id}
              onClick={() => onToggle(v.id)}
              animate={isChecked ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 min-h-[44px] focus-visible:ring-2 focus-visible:ring-offset-2`}
              style={
                isChecked
                  ? { backgroundColor: v.color + "22", borderColor: v.color, color: v.color }
                  : { backgroundColor: "white", borderColor: "#e5e7eb", color: "#6b7280" }
              }
              aria-pressed={isChecked}
            >
              {isChecked && <CheckCircle2 size={14} aria-hidden="true" />}
              {v.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function VaccineCard({
  vaccine,
  isLoggedIn,
  t,
  index,
}: {
  vaccine: Vaccine;
  isLoggedIn: boolean;
  t: ReturnType<typeof useLang>["t"];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const bookHref = isLoggedIn
    ? `/appointments/book?vaccine=${vaccine.learnMoreSlug}`
    : `/register?vaccine=${vaccine.learnMoreSlug}`;

  const doseText =
    vaccine.doses === 1
      ? t.checker.singleDose
      : `${vaccine.doses} ${t.checker.dosesPlural}${vaccine.intervalDays > 0 ? `, ${vaccine.intervalDays} ${t.checker.daysApart}` : ""}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="card p-4 border-l-4"
      style={{ borderLeftColor: vaccine.color }}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-800 text-base">{vaccine.name}</h3>
            <span
              className="pill text-xs font-bold"
              style={{ backgroundColor: vaccine.color + "18", color: vaccine.color, border: `1px solid ${vaccine.color}33` }}
            >
              {t.checker.whoCode}: {vaccine.whoCode}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-1">
            <span className="font-medium text-gray-600">{t.checker.prevents}:</span>{" "}
            {vaccine.preventsDiseases.join(", ")}
          </p>
          <p className="text-xs text-indigo-600 font-medium">{doseText}</p>
        </div>
        <Link
          href={bookHref}
          className="btn-primary text-sm shrink-0 min-h-[44px]"
          style={{ background: vaccine.color }}
        >
          <Syringe size={14} aria-hidden="true" />
          {t.checker.bookVaccine}
        </Link>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mt-3 transition-colors min-h-[44px]"
        aria-expanded={open}
      >
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {open ? "Hide details" : "Show details"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-3 grid sm:grid-cols-2 gap-3 border-t border-gray-100 mt-2">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {t.checker.sideEffects}
                </p>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {vaccine.commonSideEffects.map((s) => <li key={s}>• {s}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {t.checker.contraindications}
                </p>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {vaccine.contraindications.map((c) => <li key={c}>• {c}</li>)}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RecommendationOutput({
  ageGroup,
  checkedIds,
  allForAge,
  isLoggedIn,
  t,
}: {
  ageGroup: AgeGroup | null;
  checkedIds: Set<string>;
  allForAge: Vaccine[];
  isLoggedIn: boolean;
  t: ReturnType<typeof useLang>["t"];
}) {
  if (!ageGroup) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BookOpen size={48} className="text-indigo-200 mb-4" aria-hidden="true" />
        <p className="text-gray-400 text-base">{t.checker.emptyState}</p>
      </div>
    );
  }

  const recommended = allForAge.filter((v) => !checkedIds.has(v.id));

  if (recommended.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
        role="status"
        aria-live="polite"
      >
        <ShieldCheck size={56} className="text-emerald-500 mb-4" aria-hidden="true" />
        <h3 className="text-xl font-bold text-emerald-700 mb-1">{t.checker.upToDate}</h3>
        <p className="text-gray-500 text-sm">{t.checker.upToDateSub}</p>
      </motion.div>
    );
  }

  return (
    <div role="region" aria-live="polite" aria-label={t.checker.recommendations}>
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        {t.checker.recommendations}{" "}
        <span className="text-indigo-600 font-bold">({recommended.length})</span>
      </h2>
      <div className="flex flex-col gap-3">
        {recommended.map((v, i) => (
          <VaccineCard key={v.id} vaccine={v} isLoggedIn={isLoggedIn} t={t} index={i} />
        ))}
      </div>
    </div>
  );
}

export default function VaccineCheckerPage() {
  const { lang, setLang, t } = useLang();
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("vaxcare_user") ?? sessionStorage.getItem("vaxcare_user");
    setIsLoggedIn(!!stored);
  }, []);

  const vaccinesForAge: Vaccine[] = ageGroup
    ? (vaccineData.vaccines as Vaccine[]).filter((v) => v.recommendedFor.includes(ageGroup))
    : [];

  const handleAgeSelect = (g: AgeGroup) => {
    setAgeGroup(g);
    setCheckedIds(new Set());
  };

  const toggleVaccine = useCallback((id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setCheckedIds(new Set(vaccinesForAge.map((v) => v.id)));
  }, [vaccinesForAge]);

  const clearAll = useCallback(() => setCheckedIds(new Set()), []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Page header */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-b border-indigo-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Syringe size={22} className="text-indigo-600" aria-hidden="true" />
                <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">
                  {t.nav.healthGuide}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{t.checker.title}</h1>
              <p className="text-gray-500 text-base max-w-xl">{t.checker.subtitle}</p>
            </div>
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <DisclaimerBanner text={t.checker.disclaimer} />
          <AgeGroupSelector selected={ageGroup} onSelect={handleAgeSelect} t={t} />
          <PreviousVaccinesInput
            vaccines={vaccinesForAge}
            checked={checkedIds}
            onToggle={toggleVaccine}
            onSelectAll={selectAll}
            onClearAll={clearAll}
            t={t}
          />
          <div className="border-t border-gray-100 pt-8">
            <RecommendationOutput
              ageGroup={ageGroup}
              checkedIds={checkedIds}
              allForAge={vaccinesForAge}
              isLoggedIn={isLoggedIn}
              t={t}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
