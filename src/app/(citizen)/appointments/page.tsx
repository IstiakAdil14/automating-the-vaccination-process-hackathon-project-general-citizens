"use client";
import { useState } from "react";
import { Calendar, MapPin, Clock, Plus, CheckCircle, AlertCircle, X, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const appointments = [
  { id: 1, vaccine: "COVID-19 Booster (4th Dose)", date: "Apr 24, 2025", time: "10:30 AM", center: "Dhaka Medical Center", address: "Dhaka, Bangladesh", status: "confirmed", dose: "4th" },
  { id: 2, vaccine: "Hepatitis B (Dose 3)", date: "May 12, 2025", time: "2:00 PM", center: "Square Hospital", address: "Panthapath, Dhaka", status: "pending", dose: "3rd" },
  { id: 3, vaccine: "Influenza (Annual)", date: "Oct 10, 2024", time: "11:00 AM", center: "BIRDEM Hospital", address: "Shahbag, Dhaka", status: "completed", dose: "Annual" },
  { id: 4, vaccine: "COVID-19 (3rd Dose)", date: "Jan 15, 2025", time: "9:00 AM", center: "Dhaka Medical Center", address: "Dhaka, Bangladesh", status: "completed", dose: "3rd" },
];

const statusConfig = {
  confirmed: { label: "Confirmed", color: "#10b981", bg: "var(--success-subtle)", icon: CheckCircle },
  pending:   { label: "Pending",   color: "#f59e0b", bg: "rgba(245,158,11,0.08)", icon: Clock },
  completed: { label: "Completed", color: "#8896b3", bg: "rgba(136,150,179,0.08)", icon: CheckCircle },
};

const tabs = ["All", "Upcoming", "Completed"];

export default function AppointmentsPage() {
  const [tab, setTab] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const filtered = appointments.filter((a) => {
    if (tab === "Upcoming") return a.status !== "completed";
    if (tab === "Completed") return a.status === "completed";
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-bold text-2xl" style={{ color: "var(--text-primary)" }}>Appointments</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Manage your vaccination schedule</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: "10px 18px" }}>
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
          <input type="text" placeholder="Search appointments..." className="input-field pl-9" style={{ width: "220px", padding: "8px 12px 8px 36px" }} />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 animate-fade-up delay-200">
        {filtered.map(({ id, vaccine, date, time, center, address, status, dose }) => {
          const cfg = statusConfig[status as keyof typeof statusConfig];
          const Icon = cfg.icon;
          return (
            <div key={id} className="card p-5 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                <Icon size={20} color={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{vaccine}</p>
                  <span className="pill text-[10px] px-2 py-0.5" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}25` }}>{cfg.label}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1"><Calendar size={11} />{date}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{time}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} />{center}</span>
                </div>
              </div>
              {status !== "completed" && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}>Reschedule</button>
                  <button className="p-1.5 rounded-lg transition-colors hover:bg-red-50" style={{ color: "var(--text-muted)" }}><X size={14} /></button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Book modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,14,26,0.4)", backdropFilter: "blur(8px)" }}>
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Book Appointment</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg" style={{ color: "var(--text-muted)" }}><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Vaccine Type</label>
                <select className="input-field">
                  <option>Select vaccine</option>
                  {["COVID-19 Booster","Influenza","Hepatitis B","Measles (MMR)","Typhoid"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Vaccination Center</label>
                <select className="input-field">
                  <option>Select center</option>
                  {["Dhaka Medical Center","Square Hospital","BIRDEM Hospital","Evercare Hospital"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Date</label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Time Slot</label>
                  <select className="input-field">
                    <option>Select slot</option>
                    {["9:00 AM","10:30 AM","12:00 PM","2:00 PM","3:30 PM"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button className="btn-primary flex-1 justify-center">Confirm Booking <ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
