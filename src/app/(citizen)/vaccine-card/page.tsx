"use client";
import useSWR from "swr";
import { useState } from "react";
import {
  QrCode, Download, Share2, Shield, CheckCircle,
  Calendar, MapPin, Syringe, AlertCircle,
} from "lucide-react";

import { authedFetcher as fetcher } from "@/lib/fetcher";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Profile {
  fullName: string;
  initials: string;
  identityDisplay: string;
  dateOfBirth: string;
  totalDoses: number;
  isFullyVaccinated: boolean;
  certId: string;
  issuedYear: number;
}
interface HistoryEntry {
  id: string;
  vaccine: string;
  dose: string;
  date: string;
  facility: string;
}
interface SummaryEntry {
  vaccine: string;
  given: number;
  total: number;
  complete: boolean;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = "h-4", rounded = "rounded-full" }: { w?: string; h?: string; rounded?: string }) {
  return (
    <div
      className={`${h} ${rounded} flex-shrink-0`}
      style={{
        width: w,
        background: "linear-gradient(90deg,var(--border) 25%,var(--bg-secondary) 50%,var(--border) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s linear infinite",
      }}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up delay-200">
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
        <div className="p-6 space-y-4" style={{ background: "linear-gradient(135deg,#4f46e5,#818cf8)" }}>
          <div className="flex justify-between"><Skeleton w="140px" h="h-4" /><Skeleton w="40px" h="h-10" rounded="rounded-xl" /></div>
          <div className="flex gap-4 items-center"><Skeleton w="56px" h="h-14" rounded="rounded-full" /><div className="space-y-2 flex-1"><Skeleton w="60%" /><Skeleton w="40%" h="h-3" /></div></div>
          <Skeleton h="h-10" rounded="rounded-xl" />
        </div>
        <div className="p-6 bg-white flex flex-col items-center gap-3">
          <Skeleton w="160px" h="h-40" rounded="rounded-xl" />
          <Skeleton w="180px" h="h-3" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="card p-5 space-y-3"><Skeleton w="40%" h="h-5" />{[1,2,3,4].map(i=><div key={i} className="flex justify-between"><Skeleton w="45%" h="h-3" /><Skeleton w="20%" h="h-3" /></div>)}</div>
        <div className="card p-5 space-y-3"><Skeleton w="40%" h="h-5" />{[1,2,3,4].map(i=><div key={i} className="flex justify-between py-2" style={{borderBottom:"1px solid var(--border)"}}><Skeleton w="35%" h="h-3" /><Skeleton w="45%" h="h-3" /></div>)}</div>
      </div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="card overflow-hidden animate-fade-up delay-200">
      <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}><Skeleton w="200px" h="h-5" /></div>
      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex items-center gap-4 px-6 py-4">
            <Skeleton w="40px" h="h-10" rounded="rounded-xl" />
            <div className="flex-1 space-y-2"><Skeleton w="55%" h="h-3" /><Skeleton w="70%" h="h-3" /></div>
            <Skeleton w="60px" h="h-6" rounded="rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function VaccineCardPage() {
  const [activeTab, setActiveTab] = useState<"card" | "history">("card");

  const { data, isLoading, error } = useSWR<{
    profile: Profile;
    history: HistoryEntry[];
    summary: SummaryEntry[];
  }>("/api/vaccine-card", fetcher, { revalidateOnFocus: false });

  const profile = data?.profile;
  const history = data?.history ?? [];
  const summary = data?.summary ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-bold text-2xl" style={{ color: "var(--text-primary)" }}>Vaccine Passport</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Your digital vaccination certificate</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" style={{ padding: "9px 16px", fontSize: "0.85rem" }}>
            <Share2 size={14} /> Share
          </button>
          <button className="btn-primary" style={{ padding: "9px 16px", fontSize: "0.85rem" }}>
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit animate-fade-up delay-100" style={{ background: "var(--bg-secondary)" }}>
        {(["card", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all"
            style={activeTab === t
              ? { background: "white", color: "var(--accent)", boxShadow: "var(--shadow-sm)" }
              : { color: "var(--text-muted)" }}
          >
            {t === "card" ? "Digital Card" : `Full History${history.length ? ` (${history.length})` : ""}`}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="card p-5 flex items-center gap-3 animate-fade-up" style={{ borderLeft: "3px solid var(--danger)" }}>
          <AlertCircle size={16} style={{ color: "var(--danger)", flexShrink: 0 }} />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Failed to load vaccine card. Please refresh.</p>
        </div>
      )}

      {/* ── Digital Card Tab ── */}
      {activeTab === "card" && (
        isLoading ? <CardSkeleton /> : !profile ? null : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up delay-200">

            {/* Passport card */}
            <div className="gradient-border rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-glow)" }}>
              <div className="p-6" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #818cf8 100%)" }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Vaccination Passport</p>
                    <p className="text-white font-bold text-lg mt-0.5">VaxCare</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Shield size={20} color="white" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold text-white">
                    {profile.initials}
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{profile.fullName}</p>
                    <p className="text-white/70 text-sm">{profile.identityDisplay}</p>
                    {profile.dateOfBirth && (
                      <p className="text-white/70 text-xs">DOB: {profile.dateOfBirth}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/15">
                  <CheckCircle size={14} color={profile.isFullyVaccinated ? "#86efac" : "#fde68a"} />
                  <span className="text-white text-sm font-medium">
                    {profile.isFullyVaccinated ? "Vaccinated" : "Partially Vaccinated"}
                  </span>
                  <span className="ml-auto text-white/60 text-xs">{profile.totalDoses} dose{profile.totalDoses !== 1 ? "s" : ""} recorded</span>
                </div>
              </div>

              <div className="p-6 bg-white">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-40 h-40 rounded-xl flex items-center justify-center" style={{ background: "var(--bg-secondary)", border: "2px dashed var(--border-strong)" }}>
                    <div className="text-center">
                      <QrCode size={48} color="var(--accent)" className="mx-auto mb-2" />
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Scan to verify</p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs font-mono" style={{ color: "var(--text-muted)" }}>{profile.certId}</p>
                <p className="text-center text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Valid · Issued {profile.issuedYear}
                </p>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">

              {/* Vaccination Summary */}
              <div className="card p-5">
                <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Vaccination Summary</h3>
                {summary.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>No vaccination records yet.</p>
                ) : (
                  <div className="space-y-3">
                    {summary.map(({ vaccine, given, total, complete }) => (
                      <div key={vaccine} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: complete ? "var(--success-subtle)" : "var(--bg-secondary)" }}>
                            {complete
                              ? <CheckCircle size={12} color="var(--success)" />
                              : <Syringe size={12} color="var(--text-muted)" />}
                          </div>
                          <span className="text-sm" style={{ color: "var(--text-primary)" }}>{vaccine}</span>
                        </div>
                        <span className="text-xs font-medium" style={{ color: complete ? "var(--success)" : "var(--text-muted)" }}>
                          {given}/{total} doses
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Certificate Details */}
              <div className="card p-5">
                <h3 className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Certificate Details</h3>
                {[
                  { label: "Issued by",      value: "Ministry of Health, Bangladesh" },
                  { label: "Issue Date",     value: `${profile.issuedYear}` },
                  { label: "Valid Until",    value: `${profile.issuedYear + 1}` },
                  { label: "Certificate ID", value: profile.certId },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
                    <span className="text-xs font-medium font-mono" style={{ color: "var(--text-primary)" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}

      {/* ── Full History Tab ── */}
      {activeTab === "history" && (
        isLoading ? <HistorySkeleton /> : (
          <div className="card overflow-hidden animate-fade-up delay-200">
            <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Complete Vaccination History</h2>
            </div>
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <span className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--accent-subtle)" }}>
                  <Syringe size={24} color="var(--accent)" />
                </span>
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>No vaccinations recorded yet</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Completed vaccinations will appear here</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {history.map(({ id, vaccine, dose, date, facility }) => (
                  <div key={id} className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--accent-subtle)] transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--success-subtle)" }}>
                      <CheckCircle size={18} color="var(--success)" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{vaccine}</p>
                      <div className="flex gap-3 mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                        <span className="flex items-center gap-1"><Calendar size={10} />{date}</span>
                        <span className="flex items-center gap-1"><MapPin size={10} />{facility}</span>
                      </div>
                    </div>
                    <span className="pill pill-accent text-[10px]">{dose}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
