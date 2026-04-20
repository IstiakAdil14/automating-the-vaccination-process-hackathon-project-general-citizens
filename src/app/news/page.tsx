"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper, Clock, Search, X,
  ChevronLeft, ChevronRight, TrendingUp, BookOpen,
} from "lucide-react";
import { vaccinationNews } from "@/lib/mock-data";
import type { NewsArticle } from "@/types/home";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const PER_PAGE = 6;

const CATEGORY_COLORS: Record<NewsArticle["category"], { bg: string; text: string; dot: string }> = {
  Bangladesh: { bg: "rgba(79,70,229,0.1)",   text: "#4f46e5", dot: "#4f46e5" },
  Research:   { bg: "rgba(16,185,129,0.1)",   text: "#10b981", dot: "#10b981" },
  Policy:     { bg: "rgba(245,158,11,0.1)",   text: "#d97706", dot: "#f59e0b" },
  Outbreak:   { bg: "rgba(239,68,68,0.1)",    text: "#ef4444", dot: "#ef4444" },
  Innovation: { bg: "rgba(139,92,246,0.1)",   text: "#8b5cf6", dot: "#8b5cf6" },
  Global:     { bg: "rgba(6,182,212,0.1)",    text: "#0891b2", dot: "#06b6d4" },
};

const ALL_CATEGORIES = ["All", "Bangladesh", "Research", "Policy", "Outbreak", "Innovation", "Global"] as const;
type Filter = typeof ALL_CATEGORIES[number];

// ── Article card ──────────────────────────────────────────────────────────────
function ArticleCard({ article, index }: { article: NewsArticle; index: number }) {
  const cat = CATEGORY_COLORS[article.category];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Link
        href={`/news/${article.slug}`}
        className="group rounded-2xl overflow-hidden block transition-all duration-300 hover:-translate-y-1.5"
        style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image} alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,14,26,0.45) 0%, transparent 60%)" }} />
          <span
            className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: cat.bg, color: cat.text, backdropFilter: "blur(8px)", border: `1px solid ${cat.dot}30` }}
          >
            {article.category}
          </span>
          {article.featured && (
            <span className="absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
              ⭐ Featured
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider truncate" style={{ color: "var(--text-muted)" }}>{article.source}</span>
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--border-strong)" }} />
            <span className="flex items-center gap-1 text-xs flex-shrink-0" style={{ color: "var(--text-muted)" }}>
              <Clock size={10} /> {article.readTime}
            </span>
          </div>
          <h3
            className="font-bold text-base leading-snug mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-[var(--accent)]"
            style={{ color: "var(--text-primary)" }}
          >
            {article.title}
          </h3>
          <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: "var(--text-secondary)" }}>
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{article.date}</span>
            <span className="flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2" style={{ color: "var(--accent)" }}>
              Read more <ChevronRight size={13} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => onChange(page - 1)} disabled={page === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
        style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", background: "var(--surface-raised)" }}
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p} onClick={() => onChange(p)}
          className="w-9 h-9 rounded-xl text-sm font-semibold transition-all"
          style={p === page
            ? { background: "var(--accent)", color: "white", boxShadow: "0 4px 12px var(--accent-glow)" }
            : { border: "1px solid var(--border)", color: "var(--text-secondary)", background: "var(--surface-raised)" }}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)} disabled={page === Math.ceil(total / perPage)}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
        style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", background: "var(--surface-raised)" }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function NewsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const featured = vaccinationNews.find((a) => a.featured)!;

  const filtered = useMemo(() => {
    let list = vaccinationNews;
    if (filter !== "All") list = list.filter((a) => a.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.source.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, search]);

  const handleFilter = (f: Filter) => { setFilter(f); setPage(1); };
  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: vaccinationNews.length };
    ALL_CATEGORIES.slice(1).forEach((cat) => {
      c[cat] = vaccinationNews.filter((a) => a.category === cat).length;
    });
    return c;
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* ── Hero banner ── */}
      <div className="py-16 text-center mesh-bg" style={{ borderBottom: "1px solid var(--border)" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          <Newspaper size={13} style={{ color: "#10b981" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#10b981" }}>Vaccination News</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="font-bold mb-3"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.15 }}
        >
          Latest in Global &{" "}
          <span className="text-gradient">Bangladesh Health</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-lg max-w-xl mx-auto px-4" style={{ color: "var(--text-secondary)" }}
        >
          Research breakthroughs, policy updates, outbreak alerts, and innovation in immunization.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="flex items-center justify-center gap-2 mt-4"
        >
          <TrendingUp size={14} style={{ color: "var(--accent)" }} />
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>Updated daily · {vaccinationNews.length} articles</span>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* ── Featured hero card ── */}
        {filter === "All" && !search && page === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link
              href={`/news/${featured.slug}`}
              className="relative rounded-3xl overflow-hidden block group"
              style={{ minHeight: 320, boxShadow: "var(--shadow-lg)" }}
            >
              <img
                src={featured.image} alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,14,26,0.92) 0%, rgba(10,14,26,0.45) 60%, rgba(10,14,26,0.1) 100%)" }} />
              <div className="relative z-10 flex flex-col justify-end h-full p-8 sm:p-10" style={{ minHeight: 320 }}>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: CATEGORY_COLORS[featured.category].bg, color: CATEGORY_COLORS[featured.category].text, backdropFilter: "blur(8px)" }}>
                    {featured.category}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white/80" style={{ background: "rgba(255,255,255,0.12)" }}>⭐ Featured</span>
                  <span className="flex items-center gap-1 text-white/60 text-xs"><Clock size={11} /> {featured.readTime}</span>
                  <span className="text-white/60 text-xs">{featured.date}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-2 max-w-3xl">{featured.title}</h2>
                <p className="text-white/70 text-sm leading-relaxed max-w-2xl line-clamp-2 mb-4">{featured.excerpt}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">{featured.source}</span>
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all group-hover:bg-white/25"
                    style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(10px)" }}>
                    Read Full Story <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* ── Filters + Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <div className="flex gap-1.5 p-1 rounded-xl flex-wrap" style={{ background: "var(--bg-secondary)" }}>
            {ALL_CATEGORIES.map((f) => {
              const color = f !== "All" ? CATEGORY_COLORS[f as NewsArticle["category"]] : null;
              return (
                <button
                  key={f} onClick={() => handleFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
                  style={filter === f
                    ? { background: "white", color: color?.text ?? "var(--accent)", boxShadow: "var(--shadow-sm)" }
                    : { color: "var(--text-muted)" }}
                >
                  {color && <span className="w-1.5 h-1.5 rounded-full" style={{ background: filter === f ? color.dot : "var(--text-muted)" }} />}
                  {f}
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={filter === f
                      ? { background: color ? color.bg : "var(--accent-subtle)", color: color?.text ?? "var(--accent)" }
                      : { background: "var(--border)", color: "var(--text-muted)" }}>
                    {counts[f]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text" placeholder="Search articles..."
              value={search} onChange={(e) => handleSearch(e.target.value)}
              className="input-field pl-9 pr-9" style={{ padding: "9px 36px" }}
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
          Showing <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{filtered.length}</span> article{filtered.length !== 1 ? "s" : ""}
          {filter !== "All" && <> · <span style={{ color: "var(--accent)" }}>{filter}</span></>}
          {search && <> matching "<span style={{ color: "var(--accent)" }}>{search}</span>"</>}
        </p>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          {paginated.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="card p-16 flex flex-col items-center justify-center gap-4 text-center"
            >
              <span className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--accent-subtle)" }}>
                <BookOpen size={28} color="var(--accent)" />
              </span>
              <div>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>No articles found</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Try a different category or search term</p>
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {paginated.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ── */}
        <Pagination
          page={page} total={filtered.length} perPage={PER_PAGE}
          onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        />
      </div>

      <Footer />
    </div>
  );
}
