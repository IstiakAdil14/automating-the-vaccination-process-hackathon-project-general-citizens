"use client";
import { useState } from "react";
import useSWR from "swr";
import { Calendar, MapPin, Clock, Plus, CheckCircle, AlertCircle, X, ChevronRight, Search, Loader2 } from "lucide-react";
import { authedFetcher as fetcher, getAuthHeader } from "@/lib/fetcher";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Appointment {
  id: string;
  vaccine: string;
  doseNumber: number;
  date: string;
  time: string;
  datetime: string;
  facility: string;
  facilityAddress: string;
  status: "confirmed" | "pending" | "completed" | "cancelled" | "rescheduled";
  googleMapsLink: string | null;
  notes: string | null;
}

// ── Config ────────────────────────────────────────────────────────────────────
const statusConfig = {
  confirmed:   { label: "Confirmed",   color: "#10b981", bg: "var(--success-subtle)",        icon: CheckCircle  },
  pending:     { label: "Pending",     color: "#f59e0b", bg: "rgba(245,158,11,0.08)",         icon: Clock        },
  completed:   { label: "Completed",   color: "#8896b3", bg: "rgba(136,150,179,0.08)",        icon: CheckCircle  },
  cancelled:   { label: "Cancelled",   color: "#ef4444", bg: "rgba(239,68,68,0.08)",          icon: AlertCircle  },
  rescheduled: { label: "Rescheduled", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)",         icon: Calendar     },
};

const VACCINES = ["COVID-19 Booster", "Influenza", "Hepatitis B", "Measles (MMR)", "Typhoid", "Polio", "HPV"];
const CENTERS  = [
  { name: "Dhaka Medical Center",           address: "Zahir Raihan Rd, Dhaka 1000"              },
  { name: "Square Hospital",                address: "18/F West Panthapath, Dhaka 1205"          },
  { name: "BIRDEM Hospital",                address: "Shahbag, Dhaka 1000"                       },
  { name: "Evercare Hospital Dhaka",        address: "Plot 81, Block E, Bashundhara R/A, Dhaka"  },
  { name: "Labaid Specialized Hospital",    address: "House 1, Road 4, Dhanmondi, Dhaka 1205"    },
];
const TIME_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30"];
const tabs = ["All", "Upcoming", "Completed"];

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card p-5 flex items-center gap-4" aria-busy="true">
          <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: "var(--bg-secondary)", animation: "shimmer 1.4s linear infinite" }} />
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded-full w-2/3" style={{ background: "var(--border)", animation: "shimmer 1.4s linear infinite" }} />
            <div className="h-3 rounded-full w-1/2" style={{ background: "var(--border)", animation: "shimmer 1.4s linear infinite" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const [tab, setTab]           = useState("All");
  const [search, setSearch]     = useState("");
  const [showBook, setShowBook] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);

  const { data, isLoading, mutate } = useSWR<{ appointments: Appointment[] }>(
    "/api/appointments", fetcher, { revalidateOnFocus: true }
  );

  const all = data?.appointments ?? [];

  const filtered = all.filter((a) => {
    const matchTab =
      tab === "Upcoming"  ? a.status !== "completed" && a.status !== "cancelled" :
      tab === "Completed" ? a.status === "completed" || a.status === "cancelled" :
      true;
    const matchSearch = search === "" ||
      a.vaccine.toLowerCase().includes(search.toLowerCase()) ||
      a.facility.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  async function cancelAppointment(id: string) {
    await fetch(`/api/appointments/${id}`, { method: "PATCH", headers: getAuthHeader() });
    mutate();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-bold text-2xl" style={{ color: "var(--text-primary)" }}>Appointments</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Manage your vaccination schedule</p>
        </div>
        <button onClick={() => setShowBook(true)} className="btn-primary" style={{ padding: "10px 18px" }}>
          <Plus size={15} /> Book New
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center justify-between gap-4 animate-fade-up delay-100">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={tab === t ? { background: "white", color: "var(--accent)", boxShadow: "var(--shadow-sm)" } : { color: "var(--text-muted)" }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
            style={{ width: "220px", padding: "8px 12px 8px 36px" }}
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 animate-fade-up delay-200">
        {isLoading ? (
          <ListSkeleton />
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center" style={{ color: "var(--text-muted)" }}>
            <Calendar size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No appointments found</p>
          </div>
        ) : (
          filtered.map((a) => {
            const cfg  = statusConfig[a.status] ?? statusConfig.pending;
            const Icon = cfg.icon;
            const canAct = a.status !== "completed" && a.status !== "cancelled";
            return (
              <div key={a.id} className="card p-5 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                  <Icon size={20} color={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      {a.vaccine} <span className="font-normal opacity-60">(Dose {a.doseNumber})</span>
                    </p>
                    <span className="pill text-[10px] px-2 py-0.5" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}25` }}>{cfg.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1"><Calendar size={11} />{a.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{a.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={11} />{a.facility}</span>
                  </div>
                </div>
                {canAct && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setRescheduleTarget(a)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => cancelAppointment(a.id)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Book modal */}
      {showBook && (
        <BookModal onClose={() => setShowBook(false)} onBooked={() => { setShowBook(false); mutate(); }} />
      )}

      {/* Reschedule modal */}
      {rescheduleTarget && (
        <RescheduleModal
          appointment={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onRescheduled={() => { setRescheduleTarget(null); mutate(); }}
        />
      )}
    </div>
  );
}

// ── Book modal ────────────────────────────────────────────────────────────────
function BookModal({ onClose, onBooked }: { onClose: () => void; onBooked: () => void }) {
  const [vaccine, setVaccine]     = useState("");
  const [dose, setDose]           = useState("1");
  const [centerIdx, setCenterIdx] = useState("");
  const [date, setDate]           = useState("");
  const [slot, setSlot]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  async function submit() {
    if (!vaccine || !centerIdx || !date || !slot) { setError("All fields are required."); return; }
    const center = CENTERS[Number(centerIdx)];
    const datetime = new Date(`${date}T${slot}:00`).toISOString();
    setLoading(true); setError("");
    const res = await fetch("/api/appointments/book", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ vaccine, doseNumber: Number(dose), facility: center.name, facilityAddress: center.address, datetime }),
    });
    setLoading(false);
    if (res.ok) { onBooked(); return; }
    const json = await res.json();
    setError(json.error === "duplicate_booking" ? "You already have an active booking for this vaccine and dose." : "Booking failed. Please try again.");
  }

  return (
    <Modal title="Book Appointment" onClose={onClose}>
      <div className="space-y-4">
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Field label="Vaccine Type">
          <select className="input-field" value={vaccine} onChange={(e) => setVaccine(e.target.value)}>
            <option value="">Select vaccine</option>
            {VACCINES.map((v) => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Dose Number">
          <select className="input-field" value={dose} onChange={(e) => setDose(e.target.value)}>
            {[1,2,3,4,5].map((n) => <option key={n} value={n}>Dose {n}</option>)}
          </select>
        </Field>
        <Field label="Vaccination Center">
          <select className="input-field" value={centerIdx} onChange={(e) => setCenterIdx(e.target.value)}>
            <option value="">Select center</option>
            {CENTERS.map((c, i) => <option key={c.name} value={i}>{c.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date">
            <input type="date" className="input-field" value={date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Time Slot">
            <select className="input-field" value={slot} onChange={(e) => setSlot(e.target.value)}>
              <option value="">Select slot</option>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{formatSlot(t)}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={submit} disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <>Confirm Booking <ChevronRight size={14} /></>}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Reschedule modal ──────────────────────────────────────────────────────────
function RescheduleModal({ appointment, onClose, onRescheduled }: { appointment: Appointment; onClose: () => void; onRescheduled: () => void }) {
  const [date, setDate]     = useState("");
  const [slot, setSlot]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  async function submit() {
    if (!date || !slot) { setError("Please select a date and time."); return; }
    const datetime = new Date(`${date}T${slot}:00`).toISOString();
    setLoading(true); setError("");
    const res = await fetch(`/api/appointments/${appointment.id}/reschedule`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ datetime }),
    });
    setLoading(false);
    if (res.ok) { onRescheduled(); return; }
    setError("Reschedule failed. Please try again.");
  }

  return (
    <Modal title="Reschedule Appointment" onClose={onClose}>
      <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        {appointment.vaccine} — Dose {appointment.doseNumber} at {appointment.facility}
      </p>
      <div className="space-y-4">
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <Field label="New Date">
            <input type="date" className="input-field" value={date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="New Time Slot">
            <select className="input-field" value={slot} onChange={(e) => setSlot(e.target.value)}>
              <option value="">Select slot</option>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{formatSlot(t)}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={submit} disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <>Confirm <ChevronRight size={14} /></>}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,14,26,0.4)", backdropFilter: "blur(8px)" }}>
      <div className="glass-strong rounded-2xl p-6 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: "var(--text-muted)" }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
      {children}
    </div>
  );
}

function formatSlot(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}
