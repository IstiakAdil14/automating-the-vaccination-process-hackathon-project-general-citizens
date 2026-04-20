"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, Search, X, ChevronLeft, ChevronRight, Syringe } from "lucide-react";
import { vaccinationPrograms } from "@/lib/mock-data";
import type { Program } from "@/types/home";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const PER_PAGE = 6;

const STATUS_STYLES: Record<Program["status"], { bg: string; color: string; dot: string }> = {
  Upcoming:  { bg: "rgba(79,70,229,0.1)",   color: "#4f46e5", dot: "#4f46e5" },
  Ongoing:   { bg: "rgba(16,185,129,0.1)",  color: "#10b981", dot: "#10b981" },
  Completed: { bg: "rgba(107,114,128,0.1)", color: "#6b7280", dot: "#6b7280" },
};

const FILTERS = ["All", "Upcoming", "Ongoing", "Completed"] as const;
type Filter = typeof FILTERS[number];

// ── Program card ──────────────────────────────────────────────────────────────
function ProgramCard({ prog, index }: { prog: Program; index: number }) {
  const s = STATUS_STYLES[prog.status];
  return (
    <motion.div
      key={prog.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="card overflow-hidden flex flex-col"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={prog.image} alt={prog.title} fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span
            className="pill text-xs font-semibold flex items-center gap-1.5"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30`, backdropFilter: "blur(8px)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
            {prog.status}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="font-semibold text-base leading-snug" style={{ color: "var(--text-primary)" }}>
          {prog.title}
        </h3>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <CalendarDays size={12} /> {prog.date}
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <MapPin size={12} /> {prog.location}
          </div>
          {prog.targetGroup && (
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <Syringe size={12} /> {prog.targetGroup}
            </div>
          )}
        </div>

        <p className="text-sm leading-relaxed flex-1 line-clamp-3" style={{ color: "var(--text-secondary)" }}>
          {prog.description}
        </p>

        <div className="flex gap-2 pt-1">
          <Link
            href={`/programs/${prog.slug}`}
            className="flex-1 text-center py-2 rounded-xl text-xs font-semibold transition-colors"
            style={{ background: "var(--accent-subtle)", color: "var(--accent)", border: "1px solid rgba(79,70,229,0.15)" }}
          >
            View Details
          </Link>
          {prog.status !== "Completed" && (
            <Link
              href="/appointments"
              className="flex-1 text-center py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)" }}
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
        style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", background: "var(--surface-raised)" }}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className="w-9 h-9 rounded-xl text-sm font-semibold transition-all"
          style={
            p === page
              ? { background: "var(--accent)", color: "white", boxShadow: "0 4px 12px var(--accent-glow)" }
              : { border: "1px solid var(--border)", color: "var(--text-secondary)", background: "var(--surface-raised)" }
          }
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
        style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", background: "var(--surface-raised)" }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProgramsPage() {
  const [filter, setFilter]   = useState<Filter>("All");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);

  const filtered = useMemo(() => {
    let list = vaccinationPrograms;
    if (filter !== "All") list = list.filter((p) => p.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, search]);

  // Reset to page 1 on filter/search change
  const handleFilter = (f: Filter) => { setFilter(f); setPage(1); };
  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = useMemo(() => ({
    All:       vaccinationPrograms.length,
    Upcoming:  vaccinationPrograms.filter((p) => p.status === "Upcoming").length,
    Ongoing:   vaccinationPrograms.filter((p) => p.status === "Ongoing").length,
    Completed: vaccinationPrograms.filter((p) => p.status === "Completed").length,
  }), []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* ── Hero banner ── */}
      <div className="py-16 text-center mesh-bg" style={{ borderBottom: "1px solid var(--border)" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="pill pill-accent mb-4 mx-auto w-fit"
        >
          Nationwide Programs
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="font-bold mb-3"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.15 }}
        >
          Vaccination <span className="text-gradient">Programs</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-lg max-w-xl mx-auto px-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Browse all active, upcoming, and completed immunization drives across Bangladesh.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* ── Filters + Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          {/* Status tabs */}
          <div className="flex gap-1 p-1 rounded-xl flex-wrap" style={{ background: "var(--bg-secondary)" }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
                style={
                  filter === f
                    ? { background: "white", color: "var(--accent)", boxShadow: "var(--shadow-sm)" }
                    : { color: "var(--text-muted)" }
                }
              >
                {f}
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={
                    filter === f
                      ? { background: "var(--accent-subtle)", color: "var(--accent)" }
                      : { background: "var(--border)", color: "var(--text-muted)" }
                  }
                >
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search programs..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field pl-9 pr-9"
              style={{ padding: "9px 36px" }}
            />
            {search && (
              <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                <X size={14} />
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Results count ── */}
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Showing <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{filtered.length}</span> program{filtered.length !== 1 ? "s" : ""}
          {filter !== "All" && <> · <span style={{ color: "var(--accent)" }}>{filter}</span></>}
          {search && <> matching "<span style={{ color: "var(--accent)" }}>{search}</span>"</>}
        </p>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          {paginated.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="card p-16 flex flex-col items-center justify-center gap-4 text-center"
            >
              <span className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--accent-subtle)" }}>
                <Syringe size={28} color="var(--accent)" />
              </span>
              <div>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>No programs found</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Try a different filter or search term</p>
              </div>
              <button onClick={() => { handleFilter("All"); handleSearch(""); }} className="btn-ghost" style={{ fontSize: "0.85rem" }}>
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${filter}-${search}-${page}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginated.map((prog, i) => (
                <ProgramCard key={prog.id} prog={prog} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ── */}
        <Pagination
          page={page}
          total={filtered.length}
          perPage={PER_PAGE}
          onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        />
      </div>

      <Footer />
    </div>
  );
}
