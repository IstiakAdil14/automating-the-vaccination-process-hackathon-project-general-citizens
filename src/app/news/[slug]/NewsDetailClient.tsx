"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Clock, Calendar, Share2,
  ChevronRight, Newspaper, Tag,
} from "lucide-react";
import type { NewsArticle } from "@/types/home";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const CATEGORY_COLORS: Record<NewsArticle["category"], { bg: string; text: string; dot: string }> = {
  Bangladesh: { bg: "rgba(79,70,229,0.1)",   text: "#4f46e5", dot: "#4f46e5" },
  Research:   { bg: "rgba(16,185,129,0.1)",   text: "#10b981", dot: "#10b981" },
  Policy:     { bg: "rgba(245,158,11,0.1)",   text: "#d97706", dot: "#f59e0b" },
  Outbreak:   { bg: "rgba(239,68,68,0.1)",    text: "#ef4444", dot: "#ef4444" },
  Innovation: { bg: "rgba(139,92,246,0.1)",   text: "#8b5cf6", dot: "#8b5cf6" },
  Global:     { bg: "rgba(6,182,212,0.1)",    text: "#0891b2", dot: "#06b6d4" },
};

interface Props {
  article: NewsArticle;
  related: NewsArticle[];
}

export default function NewsDetailClient({ article, related }: Props) {
  const cat = CATEGORY_COLORS[article.category];

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: article.title, text: article.excerpt, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative h-72 sm:h-[420px] w-full overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(10,14,26,0.2) 0%, rgba(10,14,26,0.85) 100%)" }}
        />

        {/* Back + Share */}
        <div className="absolute top-5 left-0 right-0 px-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <ArrowLeft size={15} /> Back
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <Share2 size={15} /> Share
          </button>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span
                className="pill text-xs font-bold"
                style={{ background: cat.bg, color: cat.text, border: `1px solid ${cat.dot}40`, backdropFilter: "blur(8px)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block mr-1" style={{ background: cat.dot }} />
                {article.category}
              </span>
              {article.featured && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white/80" style={{ background: "rgba(255,255,255,0.12)" }}>
                  ⭐ Featured
                </span>
              )}
              <span className="flex items-center gap-1 text-white/60 text-xs"><Clock size={11} /> {article.readTime}</span>
              <span className="flex items-center gap-1 text-white/60 text-xs"><Calendar size={11} /> {article.date}</span>
            </div>
            <h1 className="font-bold text-white leading-tight" style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)", maxWidth: "720px" }}>
              {article.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Article content ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Source + meta bar */}
            <div
              className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 rounded-xl"
              style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-subtle)" }}>
                  <Newspaper size={13} style={{ color: "var(--accent)" }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Source</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{article.source}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1"><Calendar size={11} /> {article.date}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime}</span>
              </div>
            </div>

            {/* Excerpt lead */}
            <p
              className="text-lg leading-relaxed font-medium"
              style={{ color: "var(--text-secondary)", borderLeft: "3px solid var(--accent)", paddingLeft: "1rem" }}
            >
              {article.excerpt}
            </p>

            {/* Body paragraphs */}
            <div className="space-y-5">
              {article.content?.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="text-base leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                <Tag size={13} style={{ color: "var(--text-muted)" }} />
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="pill text-xs"
                    style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share row */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleShare}
                className="btn-ghost"
                style={{ padding: "9px 20px", fontSize: "0.85rem" }}
              >
                <Share2 size={14} /> Share Article
              </button>
              <Link href="/" className="btn-ghost" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
                <ArrowLeft size={14} /> Back to Home
              </Link>
            </div>
          </motion.div>

          {/* ── Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* About source */}
            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Published by</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent-subtle)" }}>
                  <Newspaper size={16} style={{ color: "var(--accent)" }} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{article.source}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{article.date}</p>
                </div>
              </div>
            </div>

            {/* Category badge */}
            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Category</p>
              <span
                className="pill text-sm font-semibold"
                style={{ background: cat.bg, color: cat.text, border: `1px solid ${cat.dot}40` }}
              >
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: cat.dot }} />
                {article.category}
              </span>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="card p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
                  Related Articles
                </p>
                <div className="space-y-4">
                  {related.map((r) => {
                    const rc = CATEGORY_COLORS[r.category];
                    return (
                      <Link
                        key={r.id}
                        href={`/news/${r.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={r.image}
                            alt={r.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: rc.bg, color: rc.text }}
                          >
                            {r.category}
                          </span>
                          <p
                            className="text-xs font-semibold leading-snug mt-1 line-clamp-2 transition-colors group-hover:text-[var(--accent)]"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {r.title}
                          </p>
                          <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                            <Clock size={9} /> {r.readTime}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-1 text-xs font-semibold mt-4 transition-colors hover:opacity-70"
                  style={{ color: "var(--accent)" }}
                >
                  View all news <ChevronRight size={13} />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
