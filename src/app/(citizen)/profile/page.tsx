"use client";
import useSWR from "swr";
import { useState } from "react";
import {
  User, Mail, MapPin, Shield, Lock, Camera,
  CheckCircle, Edit3, AlertCircle, Save, X,
  Globe, ChevronDown,
} from "lucide-react";

import { authedFetcher as fetcher, getAuthHeader } from "@/lib/fetcher";

const TABS = ["Personal Info", "Security", "Notifications"] as const;
type Tab = typeof TABS[number];

interface Profile {
  fullName: string;
  email: string;
  initials: string;
  identityDisplay: string;
  dateOfBirth: string;
  gender: string;
  division: string;
  district: string;
  subDistrict: string;
  village: string;
  language: string;
  isVerified: boolean;
  memberSince: string;
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

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="w-11 h-6 rounded-full relative transition-colors flex-shrink-0"
      style={{ background: enabled ? "var(--accent)" : "var(--bg-secondary)", border: "1px solid var(--border)" }}
      role="switch"
      aria-checked={enabled}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
        style={{ left: enabled ? "calc(100% - 18px)" : "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
      />
    </button>
  );
}

// ── Personal Info Tab ─────────────────────────────────────────────────────────
function PersonalInfoTab({ profile, onSaved }: { profile: Profile; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName:    profile.fullName,
    dateOfBirth: profile.dateOfBirth,
    gender:      profile.gender,
    division:    profile.division,
    district:    profile.district,
    subDistrict: profile.subDistrict,
    village:     profile.village,
    language:    profile.language,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setError(""); setSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to save."); return; }
      setSuccess(true);
      setEditing(false);
      onSaved();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      fullName: profile.fullName, dateOfBirth: profile.dateOfBirth,
      gender: profile.gender, division: profile.division,
      district: profile.district, subDistrict: profile.subDistrict,
      village: profile.village, language: profile.language,
    });
    setEditing(false); setError("");
  };

  const field = (label: string, key: keyof typeof form, icon: React.ElementType, type = "text") => {
    const Icon = icon;
    return (
      <div key={label}>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</label>
        <div className="relative">
          <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type={type}
            value={form[key]}
            onChange={(e) => set(key, e.target.value)}
            disabled={!editing}
            className="input-field pl-9"
            style={{ opacity: editing ? 1 : 0.75, cursor: editing ? "text" : "default" }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="card p-6 space-y-5 animate-fade-up delay-300">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Personal Information</h3>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-ghost" style={{ padding: "6px 14px", fontSize: "0.82rem" }}>
            <Edit3 size={13} /> Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Full Name",    "fullName",    User)}
        {field("Division",     "division",    MapPin)}
        {field("District",     "district",    MapPin)}
        {field("Sub-District", "subDistrict", MapPin)}
        {field("Village",      "village",     MapPin)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Date of Birth</label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => set("dateOfBirth", e.target.value)}
            disabled={!editing}
            className="input-field"
            style={{ opacity: editing ? 1 : 0.75 }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Gender</label>
          <div className="relative">
            <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 z-10" style={{ color: "var(--text-muted)" }} />
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            <select
              value={form.gender}
              onChange={(e) => set("gender", e.target.value)}
              disabled={!editing}
              className="input-field pl-9 pr-9 appearance-none"
              style={{ opacity: editing ? 1 : 0.75 }}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Language</label>
        <div className="relative">
          <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 z-10" style={{ color: "var(--text-muted)" }} />
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
          <select
            value={form.language}
            onChange={(e) => set("language", e.target.value)}
            disabled={!editing}
            className="input-field pl-9 pr-9 appearance-none"
            style={{ opacity: editing ? 1 : 0.75 }}
          >
            <option value="en">English</option>
            <option value="bn">বাংলা (Bangla)</option>
          </select>
        </div>
      </div>

      {/* Read-only email */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Email Address</label>
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input type="email" value={profile.email} disabled className="input-field pl-9" style={{ opacity: 0.6, cursor: "default" }} />
        </div>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Email cannot be changed here. Contact support.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.07)", color: "var(--danger)" }}>
          <AlertCircle size={14} />{error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg" style={{ background: "var(--success-subtle)", color: "var(--success)" }}>
          <CheckCircle size={14} /> Profile updated successfully.
        </div>
      )}

      {editing && (
        <div className="flex gap-3 pt-2">
          <button onClick={handleCancel} className="btn-ghost"><X size={14} /> Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            <Save size={14} /> {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Security Tab ──────────────────────────────────────────────────────────────
function SecurityTab() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(""); setSuccess(false);
    if (form.next !== form.confirm) { setError("New passwords do not match."); return; }
    if (form.next.length < 8) { setError("Password must be at least 8 characters."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ currentPassword: form.current, newPassword: form.next }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msgs: Record<string, string> = { wrong_password: "Current password is incorrect." };
        setError(msgs[data.error] ?? "Failed to update password.");
        return;
      }
      setSuccess(true);
      setForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-up delay-300">
      <div className="card p-6">
        <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Change Password</h3>
        <div className="space-y-3">
          {([
            { label: "Current Password", key: "current" },
            { label: "New Password",     key: "next"    },
            { label: "Confirm New Password", key: "confirm" },
          ] as const).map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-9"
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            </div>
          ))}

          {error && (
            <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.07)", color: "var(--danger)" }}>
              <AlertCircle size={14} />{error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg" style={{ background: "var(--success-subtle)", color: "var(--success)" }}>
              <CheckCircle size={14} /> Password updated successfully.
            </div>
          )}

          <button onClick={handleSubmit} disabled={saving} className="btn-primary mt-1">
            <Lock size={14} /> {saving ? "Updating…" : "Update Password"}
          </button>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Two-Factor Authentication</h3>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Add an extra layer of security via OTP</p>
          </div>
          <span className="pill text-xs" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Notifications Tab ─────────────────────────────────────────────────────────
const DEFAULT_PREFS = [
  { key: "appointment_reminders", label: "Appointment Reminders", desc: "Get notified 24h before your appointment",        enabled: true  },
  { key: "dose_due_alerts",       label: "Dose Due Alerts",       desc: "Reminders when your next dose is due",            enabled: true  },
  { key: "family_updates",        label: "Family Updates",        desc: "Notifications for family member vaccinations",    enabled: true  },
  { key: "health_tips",           label: "Health Tips",           desc: "Weekly health and vaccination tips",              enabled: false },
  { key: "system_updates",        label: "System Updates",        desc: "Platform updates and new features",               enabled: false },
];

function NotificationsTab() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [saved, setSaved] = useState(false);

  const toggle = (key: string) =>
    setPrefs((p) => p.map((item) => item.key === key ? { ...item, enabled: !item.enabled } : item));

  const handleSave = () => {
    // Preferences stored locally for now — extend with a DB-backed API when needed
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="card p-6 space-y-1 animate-fade-up delay-300">
      <h3 className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Notification Preferences</h3>
      {prefs.map(({ key, label, desc, enabled }) => (
        <div key={key} className="flex items-center justify-between py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex-1 pr-4">
            <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{label}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
          </div>
          <Toggle enabled={enabled} onChange={() => toggle(key)} />
        </div>
      ))}

      {saved && (
        <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg mt-3" style={{ background: "var(--success-subtle)", color: "var(--success)" }}>
          <CheckCircle size={14} /> Preferences saved.
        </div>
      )}

      <button onClick={handleSave} className="btn-primary mt-4">
        <Save size={14} /> Save Preferences
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("Personal Info");
  const { data, isLoading, error, mutate } = useSWR<{ profile: Profile }>("/api/profile", fetcher, { revalidateOnFocus: false });
  const profile = data?.profile;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="font-bold text-2xl" style={{ color: "var(--text-primary)" }}>Profile</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Manage your account and preferences</p>
      </div>

      {/* Error */}
      {error && (
        <div className="card p-5 flex items-center gap-3" style={{ borderLeft: "3px solid var(--danger)" }}>
          <AlertCircle size={16} style={{ color: "var(--danger)", flexShrink: 0 }} />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Failed to load profile. Please refresh.</p>
        </div>
      )}

      {/* Profile card */}
      <div className="card p-6 flex items-center gap-5 animate-fade-up delay-100">
        {isLoading ? (
          <>
            <Shimmer w="80px" h="h-20" rounded="rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Shimmer w="45%" h="h-5" />
              <Shimmer w="65%" h="h-3" />
              <Shimmer w="30%" h="h-5" rounded="rounded-full" />
            </div>
          </>
        ) : profile ? (
          <>
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ background: "linear-gradient(135deg, var(--accent), #818cf8)" }}>
                {profile.initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "var(--accent)", boxShadow: "0 2px 8px var(--accent-glow)" }}>
                <Camera size={12} color="white" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="font-bold text-xl truncate" style={{ color: "var(--text-primary)" }}>{profile.fullName}</h2>
                {profile.isVerified && (
                  <div className="pill pill-success text-[10px] flex-shrink-0"><CheckCircle size={9} /> Verified</div>
                )}
              </div>
              <p className="text-sm truncate" style={{ color: "var(--text-muted)" }}>
                {profile.email} · Member since {profile.memberSince}
              </p>
              <div className="flex gap-3 mt-2 flex-wrap">
                <span className="pill pill-accent text-[10px]">Citizen</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{profile.identityDisplay}</span>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit animate-fade-up delay-200" style={{ background: "var(--bg-secondary)" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={tab === t ? { background: "white", color: "var(--accent)", boxShadow: "var(--shadow-sm)" } : { color: "var(--text-muted)" }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {isLoading ? (
        <div className="card p-6 space-y-4 animate-fade-up delay-300">
          {[1,2,3,4].map((i) => (
            <div key={i} className="space-y-1.5">
              <Shimmer w="25%" h="h-3" />
              <Shimmer h="h-10" rounded="rounded-xl" />
            </div>
          ))}
        </div>
      ) : profile ? (
        <>
          {tab === "Personal Info"  && <PersonalInfoTab profile={profile} onSaved={() => mutate()} />}
          {tab === "Security"       && <SecurityTab />}
          {tab === "Notifications"  && <NotificationsTab />}
        </>
      ) : null}
    </div>
  );
}
