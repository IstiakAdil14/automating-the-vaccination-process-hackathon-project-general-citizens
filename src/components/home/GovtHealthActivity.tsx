"use client";
import { useState, useEffect, useRef } from "react";
import {
  Megaphone, ShieldCheck, TrendingUp, AlertTriangle,
  ExternalLink, ChevronRight, Building2, Globe2, Activity,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface Initiative {
  id: string;
  ministry: string;
  title: string;
  description: string;
  target: string;
  progress: number; // 0–100
  status: "active" | "completed" | "planned";
  color: string;
  icon: React.ReactNode;
}

interface Announcement {
  id: string;
  date: string;
  tag: "Advisory" | "Alert" | "Update" | "Notice";
  tagColor: string;
  title: string;
  source: string;
}

interface Partner {
  name: string;
  logo: string; // public path
  role: string;
}

// ── Static data ──────────────────────────────────────────────────────────────

const initiatives: Initiative[] = [
  {
    id: "i1",
    ministry: "Ministry of Health & Family Welfare",
    title: "Expanded Programme on Immunization (EPI)",
    description: "Universal childhood immunization covering 10 antigens for all children under 2 years across Bangladesh.",
    target: "3.2M children targeted",
    progress: 78,
    status: "active",
    color: "#4f46e5",
    icon: <ShieldCheck size={18} />,
  },
  {
    id: "i2",
    ministry: "Directorate General of Health Services",
    title: "National Polio Eradication Initiative",
    description: "Zero-polio goal through supplementary immunization activities and surveillance in all 64 districts.",
    target: "64 districts covered",
    progress: 94,
    status: "active",
    color: "#10b981",
    icon: <Activity size={18} />,
  },
  {
    id: "i3",
    ministry: "Ministry of Health & Family Welfare",
    title: "COVID-19 National Vaccination Drive",
    description: "Ongoing booster campaign targeting high-risk groups, healthcare workers, and elderly population.",
    target: "12M booster doses",
    progress: 61,
    status: "active",
    color: "#f59e0b",
    icon: <TrendingUp size={18} />,
  },
  {
    id: "i4",
    ministry: "DGHS — School Health Programme",
    title: "HPV Vaccination for Adolescent Girls",
    description: "Two-dose HPV vaccine for girls aged 10–14 through school health centres in partnership with UNICEF.",
    target: "1.8M girls targeted",
    progress: 43,
    status: "active",
    color: "#8b5cf6",
    icon: <ShieldCheck size={18} />,
  },
];

const announcements: Announcement[] = [
  {
    id: "a1",
    date: "Apr 22, 2025",
    tag: "Alert",
    tagColor: "#ef4444",
    title: "Dengue fever cases rising in Dhaka — DGHS urges preventive measures and early reporting.",
    source: "DGHS Bangladesh",
  },
  {
    id: "a2",
    date: "Apr 20, 2025",
    tag: "Advisory",
    tagColor: "#f59e0b",
    title: "Measles–Rubella campaign extended to Sylhet division — all children 9 months to 15 years eligible.",
    source: "Ministry of Health",
  },
  {
    id: "a3",
    date: "Apr 18, 2025",
    tag: "Update",
    tagColor: "#4f46e5",
    title: "New vaccination centers added in Rangpur and Mymensingh divisions — 48 new sites operational.",
    source: "VaxCare Operations",
  },
  {
    id: "a4",
    date: "Apr 15, 2025",
    tag: "Notice",
    tagColor: "#10b981",
    title: "WHO commends Bangladesh EPI coverage — 78% national immunization rate achieved in Q1 2025.",
    source: "WHO Bangladesh",
  },
  {
    id: "a5",
    date: "Apr 12, 2025",
    tag: "Advisory",
    tagColor: "#f59e0b",
    title: "Cholera outbreak reported in Cox's Bazar — oral cholera vaccine distribution underway.",
    source: "IEDCR Bangladesh",
  },
];

const partners: Partner[] = [
  { name: "WHO",    logo: "/footerImg/WHO-11.svg",        role: "Technical Partner"    },
  { name: "UNICEF", logo: "/footerImg/unicef_logo.png",   role: "Implementation Partner" },
  { name: "GAVI",   logo: "/footerImg/gavi.png",          role: "Funding Partner"      },
  { name: "MIS",    logo: "/footerImg/mis_logo 1.png",    role: "Data & Systems"       },
];

const statusStyles: Record<Initiative["status"], { label: string; bg: string; text: string }> = {
  active:    { label: "Active",    bg: "rgba(16,185,129,0.1)",  text: "#10b981" },
  completed: { label: "Completed", bg: "rgba(79,70,229,0.1)",   text: "#4f46e5" },
  planned:   { label: "Planned",   bg: "rgba(245,158,11,0.1)",  text: "#f59e0b" },
};

// ── Ticker ───────────────────────────────────────────────────────────────────

function AlertTicker() {
  const alerts = [
    "🔴  Dengue alert: Dhaka division — take preventive action",
    "🟡  MR campaign extended to Sylhet — walk-ins welcome",
    "🟢  78% national immunization rate achieved — Q1 2025",
    "🔵  48 new vaccination centers now operational in Rangpur & Mymensingh",
    "🟡  Cholera vaccine distribution ongoing in Cox's Bazar",
  ];

  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % alerts.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl overflow-hidden"
      style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
    >
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#ef4444" }}>Live</span>
      </div>
      <div className="w-px h-4 shrink-0" style={{ background: "rgba(239,68,68,0.25)" }} />
      <p
        className="text-sm font-medium truncate transition-opacity duration-400"
        style={{ color: "var(--text-secondary)", opacity: visible ? 1 : 0 }}
      >
        {alerts[idx]}
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GovtHealthActivity() {
  const [activeTab, setActiveTab] = useState<"initiatives" | "announcements">("initiatives");

  return (
    <section className="py-20" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
              style={{ background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.15)" }}>
              <Building2 size={13} style={{ color: "var(--accent)" }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                Government Health Activity
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
              National Public Health<br />
              <span className="text-gradient">Initiatives & Alerts</span>
            </h2>
            <p className="mt-2 text-base" style={{ color: "var(--text-muted)", maxWidth: 480 }}>
              Real-time updates from the Ministry of Health, DGHS, and international health partners.
            </p>
          </div>

          {/* Partner logos */}
          <div className="flex items-center gap-3 flex-wrap">
            {partners.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "var(--surface-raised)", border: "1px solid var(--border-strong)" }}
                title={p.role}
              >
                <img src={p.logo} alt={p.name} className="h-5 w-auto object-contain" style={{ maxWidth: 48 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Live ticker */}
        <div className="mb-8">
          <AlertTicker />
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 rounded-xl mb-8 w-fit" style={{ background: "var(--bg-secondary)" }}>
          {(["initiatives", "announcements"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
              style={activeTab === tab
                ? { background: "var(--surface-raised)", color: "var(--accent)", boxShadow: "var(--shadow-sm)" }
                : { color: "var(--text-muted)" }}
            >
              {tab === "initiatives" ? "Active Initiatives" : "Announcements"}
            </button>
          ))}
        </div>

        {/* ── Initiatives tab ── */}
        {activeTab === "initiatives" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {initiatives.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}15`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>{item.ministry}</p>
                      <h3 className="font-bold text-base leading-snug" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                    </div>
                  </div>
                  <span
                    className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: statusStyles[item.status].bg, color: statusStyles[item.status].text }}
                  >
                    {statusStyles[item.status].label}
                  </span>
                </div>

                <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.description}</p>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    <span>{item.target}</span>
                    <span style={{ color: item.color }}>{item.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.progress}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}99)` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Announcements tab ── */}
        {activeTab === "announcements" && (
          <div className="space-y-3">
            {announcements.map((ann, i) => (
              <div
                key={ann.id}
                className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
                style={{
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${ann.tagColor}12`, color: ann.tagColor }}
                >
                  <Megaphone size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${ann.tagColor}12`, color: ann.tagColor }}
                    >
                      {ann.tag}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{ann.date}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>· {ann.source}</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-primary)" }}>{ann.title}</p>
                </div>

                <ChevronRight
                  size={16}
                  className="shrink-0 mt-1 transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: "var(--text-muted)" }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl"
          style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.07) 0%, rgba(16,185,129,0.05) 100%)", border: "1px solid var(--border-strong)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-subtle)" }}>
              <Globe2 size={20} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Stay informed on public health</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Enable notifications to receive real-time health alerts from DGHS & WHO.</p>
            </div>
          </div>
          <button
            className="btn-primary shrink-0"
            style={{ padding: "10px 22px", fontSize: "0.875rem" }}
          >
            Enable Alerts <ExternalLink size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}
