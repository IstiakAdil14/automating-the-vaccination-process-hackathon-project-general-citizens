"use client";
import useSWR from "swr";
import { useState } from "react";
import {
  Users, Plus, CheckCircle, Clock, Syringe,
  X, Calendar, ChevronRight, Trash2, AlertCircle, UserX,
} from "lucide-react";

import { authedFetcher as fetcher, getAuthHeader } from "@/lib/fetcher";

const AVATAR_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#0891b2"];

interface Member {
  id: string;
  name: string;
  relation: string;
  age: number | null;
  progress: number;
  vaccinesGiven: number;
  vaccinesTotal: number;
  nextDue: string | null;
  status: "complete" | "partial" | "none";
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Shimmer({ w = "100%", h = "h-4", rounded = "rounded-full" }: { w?: string; h?: string; rounded?: string }) {
  return (
    <div className={`${h} ${rounded}`} style={{
      width: w,
      background: "linear-gradient(90deg,var(--border) 25%,var(--bg-secondary) 50%,var(--border) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s linear infinite",
    }} />
  );
}

function MemberSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-4">
        <Shimmer w="48px" h="h-12" rounded="rounded-full" />
        <div className="flex-1 space-y-2">
          <Shimmer w="55%" />
          <Shimmer w="30%" h="h-3" />
        </div>
        <Shimmer w="60px" h="h-6" rounded="rounded-full" />
      </div>
      <Shimmer h="h-1.5" rounded="rounded-full" />
    </div>
  );
}

// ── Add Member Modal ──────────────────────────────────────────────────────────
function AddMemberModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState({ idType: "nid", idValue: "", relation: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.idValue.trim() || !form.relation) { setError("All fields are required."); return; }
    setLoading(true);
    setError("");
    try {
      const body = form.idType === "nid"
        ? { nid: form.idValue.trim(), relation: form.relation }
        : { birthCertNumber: form.idValue.trim(), relation: form.relation };

      const res = await fetch("/api/family", { method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeader() }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) {
        const msgs: Record<string, string> = {
          user_not_found: "No user found with that ID.",
          already_member: "This person is already in your family.",
          cannot_add_self: "You cannot add yourself.",
        };
        setError(msgs[data.error] ?? "Something went wrong.");
        return;
      }
      onAdded();
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,14,26,0.4)", backdropFilter: "blur(8px)" }}>
      <div className="glass-strong rounded-2xl p-6 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Add Family Member</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: "var(--text-muted)" }}><X size={18} /></button>
        </div>

        <div className="space-y-4">
          {/* ID type toggle */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Identity Type</label>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
              {[{ v: "nid", l: "NID" }, { v: "birth_cert", l: "Birth Certificate" }].map(({ v, l }) => (
                <button
                  key={v}
                  onClick={() => setForm((f) => ({ ...f, idType: v }))}
                  className="flex-1 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={form.idType === v ? { background: "white", color: "var(--accent)", boxShadow: "var(--shadow-sm)" } : { color: "var(--text-muted)" }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              {form.idType === "nid" ? "NID Number" : "Birth Certificate Number"}
            </label>
            <input
              type="text"
              placeholder={form.idType === "nid" ? "Enter NID number" : "Enter birth cert number"}
              className="input-field"
              value={form.idValue}
              onChange={(e) => setForm((f) => ({ ...f, idValue: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Relationship</label>
            <select className="input-field" value={form.relation} onChange={(e) => setForm((f) => ({ ...f, relation: e.target.value }))}>
              <option value="">Select relationship</option>
              {["Spouse", "Child", "Parent", "Sibling", "Other"].map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.07)", color: "var(--danger)" }}>
              <AlertCircle size={14} />{error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? "Adding…" : <><span>Add Member</span><ChevronRight size={14} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FamilyPage() {
  const { data, isLoading, error, mutate } = useSWR<{ members: Member[] }>("/api/family", fetcher, { revalidateOnFocus: false });
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const members = data?.members ?? [];
  const fullyVaccinated = members.filter((m) => m.status === "complete").length;
  const pendingCount    = members.filter((m) => m.status === "partial").length;

  const handleRemove = async (id: string) => {
    setRemoving(id);
    try {
      await fetch(`/api/family/${id}`, { method: "DELETE", headers: getAuthHeader() });
      mutate();
      if (selected === id) setSelected(null);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-bold text-2xl" style={{ color: "var(--text-primary)" }}>Family</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Manage vaccination records for your family</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: "10px 18px" }}>
          <Plus size={15} /> Add Member
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="card p-5 flex items-center gap-3" style={{ borderLeft: "3px solid var(--danger)" }}>
          <AlertCircle size={16} style={{ color: "var(--danger)", flexShrink: 0 }} />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Failed to load family data. Please refresh.</p>
        </div>
      )}

      {/* Summary bar */}
      {isLoading ? (
        <div className="card p-5 flex gap-6 animate-fade-up delay-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Shimmer w="40px" h="h-10" rounded="rounded-xl" />
              <div className="space-y-2"><Shimmer w="32px" h="h-5" /><Shimmer w="80px" h="h-3" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-5 flex flex-wrap gap-6 animate-fade-up delay-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-subtle)" }}>
              <Users size={18} color="var(--accent)" />
            </div>
            <div>
              <p className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>{members.length}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Family Members</p>
            </div>
          </div>
          <div className="w-px" style={{ background: "var(--border)" }} />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--success-subtle)" }}>
              <CheckCircle size={18} color="var(--success)" />
            </div>
            <div>
              <p className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>{fullyVaccinated}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Fully Vaccinated</p>
            </div>
          </div>
          <div className="w-px" style={{ background: "var(--border)" }} />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.08)" }}>
              <Clock size={18} color="#f59e0b" />
            </div>
            <div>
              <p className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>{pendingCount}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Doses Pending</p>
            </div>
          </div>
        </div>
      )}

      {/* Members grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <MemberSkeleton key={i} />)}
        </div>
      ) : members.length === 0 ? (
        <div className="card p-12 flex flex-col items-center justify-center gap-4 text-center animate-fade-up delay-200">
          <span className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--accent-subtle)" }}>
            <UserX size={28} color="var(--accent)" />
          </span>
          <div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>No family members yet</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Add members using their NID or Birth Certificate number</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: "10px 20px" }}>
            <Plus size={15} /> Add First Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member, i) => {
            const { id, name, relation, age, vaccinesGiven, vaccinesTotal, nextDue, status, progress } = member;
            const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            const isSelf = relation === "Self";

            return (
              <div
                key={id}
                className="card p-5 cursor-pointer animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s`, border: selected === id ? "1.5px solid var(--accent)" : undefined }}
                onClick={() => setSelected(selected === id ? null : id)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0" style={{ background: color }}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>{name}</p>
                      <span className="pill pill-accent text-[10px] px-2 py-0.5">{relation}</span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {age !== null ? `Age ${age}` : "—"}
                    </p>
                  </div>
                  <div
                    className="pill text-[10px] px-2 py-1 flex-shrink-0"
                    style={
                      status === "complete"
                        ? { background: "var(--success-subtle)", color: "var(--success)", border: "1px solid rgba(16,185,129,0.2)" }
                        : status === "partial"
                        ? { background: "rgba(245,158,11,0.08)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }
                        : { background: "var(--bg-secondary)", color: "var(--text-muted)", border: "1px solid var(--border)" }
                    }
                  >
                    {status === "complete" ? <><CheckCircle size={9} /> Complete</>
                      : status === "partial" ? <><Clock size={9} /> Partial</>
                      : <><Syringe size={9} /> No records</>}
                  </div>
                </div>

                {/* Progress */}
                {vaccinesTotal > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                      <span>Vaccination Progress</span>
                      <span style={{ color: "var(--accent)", fontWeight: 600 }}>{vaccinesGiven}/{vaccinesTotal} doses</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          background: status === "complete" ? "var(--success)" : "linear-gradient(90deg, var(--accent), #818cf8)",
                        }}
                      />
                    </div>
                  </div>
                )}

                {nextDue && (
                  <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg mb-3" style={{ background: "rgba(245,158,11,0.06)", color: "#f59e0b" }}>
                    <Calendar size={11} />
                    Next dose due: <strong>{nextDue}</strong>
                  </div>
                )}

                {selected === id && (
                  <div className="mt-2 pt-4 flex gap-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <a href="/appointments/book" className="btn-primary flex-1 justify-center" style={{ padding: "8px", fontSize: "0.8rem" }}>
                      <Calendar size={13} /> Book Appointment
                    </a>
                    <a href="/vaccine-card" className="btn-ghost flex-1 justify-center" style={{ padding: "8px", fontSize: "0.8rem" }}>
                      <Syringe size={13} /> View Records
                    </a>
                    {!isSelf && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemove(id); }}
                        disabled={removing === id}
                        className="p-2 rounded-xl transition-colors hover:bg-red-50"
                        style={{ color: removing === id ? "var(--text-muted)" : "var(--danger)", border: "1px solid var(--border)" }}
                        title="Remove member"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <AddMemberModal
          onClose={() => setShowModal(false)}
          onAdded={() => mutate()}
        />
      )}
    </div>
  );
}
