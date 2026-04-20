"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Clock, ExternalLink, ChevronRight, BookOpen, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { NewsArticle } from "@/types/home";

const CATEGORY_COLORS: Record<NewsArticle["category"], { bg: string; text: string; dot: string }> = {
  Bangladesh:  { bg: "rgba(79,70,229,0.1)",   text: "#4f46e5", dot: "#4f46e5" },
  Research:    { bg: "rgba(16,185,129,0.1)",   text: "#10b981", dot: "#10b981" },
  Policy:      { bg: "rgba(245,158,11,0.1)",   text: "#d97706", dot: "#f59e0b" },
  Outbreak:    { bg: "rgba(239,68,68,0.1)",    text: "#ef4444", dot: "#ef4444" },
  Innovation:  { bg: "rgba(139,92,246,0.1)",   text: "#8b5cf6", dot: "#8b5cf6" },
  Global:      { bg: "rgba(6,182,212,0.1)",    text: "#0891b2", dot: "#06b6d4" },
};

const ALL_CATEGORIES = ["All", "Bangladesh", "Research", "Policy", "Outbreak", "Innovation", "Global"] as const;

interface Props {
  articles: NewsArticle[];
}

export default function VaccinationNews({ articles }: Props) {
  const [activeCategory, setActiveCategory] = useState<typeof ALL_CATEGORIES[number]>("All");

  const featured = articles.find((a) => a.featured)!;
  const rest = articles.filter((a) => !a.featured);

  const filtered = (activeCategory === "All" ? rest : rest.filter((a) => a.category === activeCategory));
  const visible = filtered.slice(0, 6);

  return (
    <section className="py-20" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <Newspaper size={13} style={{ color: "#10b981" }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#10b981" }}>
                Vaccination News
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
              Latest in Global &<br />
              <span className="text-gradient">Bangladesh Health</span>
            </h2>
            <p className="mt-2 text-base" style={{ color: "var(--text-muted)", maxWidth: 440 }}>
              Research breakthroughs, policy updates, outbreak alerts, and innovation in immunization.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl shrink-0"
            style={{ background: "var(--surface-raised)", border: "1px solid var(--border-strong)" }}>
            <TrendingUp size={15} style={{ color: "var(--accent)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Updated daily
            </span>
          </div>
        </div>

        {/* Featured article */}
        <div
          className="relative rounded-3xl overflow-hidden mb-10 group cursor-pointer"
          style={{ minHeight: 340, boxShadow: "var(--shadow-lg)" }}
        >
          {/* Background image */}
          <img
            src={featured.image}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,14,26,0.92) 0%, rgba(10,14,26,0.5) 50%, rgba(10,14,26,0.15) 100%)" }} />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full p-8 sm:p-10" style={{ minHeight: 340 }}>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: CATEGORY_COLORS[featured.category].bg, color: CATEGORY_COLORS[featured.category].text, backdropFilter: "blur(8px)" }}
              >
                {featured.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
                <Clock size={11} /> {featured.readTime}
              </span>
              <span className="text-xs text-white/60">{featured.date}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white/80"
                style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                ⭐ Featured
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-3 max-w-3xl">
              {featured.title}
            </h3>
            <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-2xl line-clamp-2">
              {featured.excerpt}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                {featured.source}
              </span>
              <Link
                href={`/news/${featured.slug}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(10px)" }}
              >
                Read Full Story <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const color = cat !== "All" ? CATEGORY_COLORS[cat as NewsArticle["category"]] : null;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={isActive
                  ? {
                      background: color ? color.bg : "var(--accent-subtle)",
                      color: color ? color.text : "var(--accent)",
                      border: `1.5px solid ${color ? color.dot : "var(--accent)"}`,
                    }
                  : {
                      background: "var(--surface-raised)",
                      color: "var(--text-muted)",
                      border: "1.5px solid var(--border-strong)",
                    }}
              >
                {cat !== "All" && color && (
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: isActive ? color.dot : "var(--text-muted)" }} />
                )}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Articles grid */}
        {visible.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No articles in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((article) => {
              const cat = CATEGORY_COLORS[article.category];
              return (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 block"
                  style={{
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(10,14,26,0.4) 0%, transparent 60%)" }} />
                    <span
                      className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: cat.bg, color: cat.text, backdropFilter: "blur(8px)", border: `1px solid ${cat.dot}30` }}
                    >
                      {article.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                        {article.source}
                      </span>
                      <span className="w-1 h-1 rounded-full inline-block" style={{ background: "var(--border-strong)" }} />
                      <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                        <Clock size={10} /> {article.readTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-[var(--accent)]"
                      style={{ color: "var(--text-primary)" }}>
                      {article.title}
                    </h3>

                    <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: "var(--text-secondary)" }}>
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{article.date}</span>
                      <span
                        className="flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
                        style={{ color: "var(--accent)" }}
                      >
                        Read more <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Explore all articles */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <Link
            href="/news"
            className="btn-primary inline-flex items-center gap-2"
            style={{ padding: "12px 32px", fontSize: "0.95rem" }}
          >
            Explore All Articles
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {articles.length}+ articles across {Object.keys(CATEGORY_COLORS).length} categories
          </p>
        </motion.div>

      </div>
    </section>
  );
}
