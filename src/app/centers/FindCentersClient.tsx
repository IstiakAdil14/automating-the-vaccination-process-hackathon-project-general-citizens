"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, List, SlidersHorizontal, RefreshCw, Wifi, WifiOff,
  ChevronUp, Sparkles, AlertCircle,
} from "lucide-react";
import type { Center, Filters, SortOption } from "@/types/centers";
import { getStatus } from "@/components/centers/AvailabilityBadge";
import MapContainer from "@/components/centers/MapContainer";
import CenterCard from "@/components/centers/CenterCard";
import CenterCardSkeleton from "@/components/centers/CenterCardSkeleton";
import FilterPanel from "@/components/centers/FilterPanel";
import CenterPopup from "@/components/centers/CenterPopup";
import BookingModal from "@/components/centers/BookingModal";
import BottomSheet from "@/components/centers/BottomSheet";
import SearchBar from "@/components/centers/SearchBar";

const DEFAULT_FILTERS: Filters = {
  vaccines: [], radius: 10, timeSlots: [], availableOnly: false, date: "",
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "nearest",      label: "Nearest"        },
  { value: "availability", label: "Most Available"  },
  { value: "rating",       label: "Top Rated"       },
];

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "YOUR_GOOGLE_MAPS_API_KEY";

export default function FindCentersClient() {
  const [centers, setCenters]           = useState<Center[]>([]);
  const [loading, setLoading]           = useState(true);
  const [offline, setOffline]           = useState(false);
  const [lastUpdated, setLastUpdated]   = useState<Date | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [search, setSearch]             = useState("");
  const [filters, setFilters]           = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort]                 = useState<SortOption>("nearest");
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [bookingCenter, setBookingCenter]   = useState<Center | null>(null);
  const [popupCenter, setPopupCenter]       = useState<Center | null>(null);
  const [mobileView, setMobileView]         = useState<"map" | "list">("map");
  const [showFilters, setShowFilters]       = useState(false);
  const [showListSheet, setShowListSheet]   = useState(false);
  const [alerts, setAlerts]                 = useState<string[]>([]);

  const fetchCenters = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const cached = localStorage.getItem("vax_centers_cache");
      const res = await fetch("/api/centers");
      if (!res.ok) throw new Error("fetch failed");
      const data: Center[] = await res.json();
      setCenters(data);
      localStorage.setItem("vax_centers_cache", JSON.stringify(data));
      setLastUpdated(new Date());
      setOffline(false);
      if (cached) {
        const prev: Center[] = JSON.parse(cached);
        data.forEach((c) => {
          const old = prev.find((p) => p.id === c.id);
          if (old && old.slotsAvailable === 0 && c.slotsAvailable > 0)
            setAlerts((a) => [...a, `🟢 Slots just opened at ${c.name}!`]);
          else if (old && old.slotsAvailable > 3 && c.slotsAvailable <= 3 && c.slotsAvailable > 0)
            setAlerts((a) => [...a, `⚠️ Only ${c.slotsAvailable} slots left at ${c.name}`]);
        });
      }
    } catch {
      const cached = localStorage.getItem("vax_centers_cache");
      if (cached) { setCenters(JSON.parse(cached)); setOffline(true); }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCenters(); }, [fetchCenters]);
  useEffect(() => {
    const id = setInterval(() => fetchCenters(true), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchCenters]);
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 23.7808, lng: 90.4093 })
    );
  }, []);
  useEffect(() => {
    if (alerts.length === 0) return;
    const id = setTimeout(() => setAlerts((a) => a.slice(1)), 4000);
    return () => clearTimeout(id);
  }, [alerts]);

  const filtered = useMemo(() => {
    let list = centers.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.address.toLowerCase().includes(q)) return false;
      }
      if (filters.vaccines.length > 0 && !filters.vaccines.some((v) => c.vaccines.includes(v))) return false;
      if (c.distance > filters.radius) return false;
      if (filters.timeSlots.length > 0 && !filters.timeSlots.some((t) => c.timeSlots.includes(t))) return false;
      if (filters.availableOnly && c.slotsAvailable === 0) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sort === "nearest")      return a.distance - b.distance;
      if (sort === "availability") return b.slotsAvailable - a.slotsAvailable;
      return b.rating - a.rating;
    });
  }, [centers, search, filters, sort]);

  const aiRecommended = useMemo(() => {
    if (filtered.length === 0) return null;
    return [...filtered].filter((c) => c.slotsAvailable > 0).sort((a, b) => {
      const s = (c: Center) => (c.slotsAvailable / c.totalCapacity) * 0.4 + (1 / (c.distance + 0.1)) * 0.4 + (c.rating / 5) * 0.2;
      return s(b) - s(a);
    })[0] ?? null;
  }, [filtered]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.vaccines.length) n++;
    if (filters.radius !== 10) n++;
    if (filters.timeSlots.length) n++;
    if (filters.availableOnly) n++;
    if (filters.date) n++;
    return n;
  }, [filters]);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 4;

  const handleBook = (c: Center) => { setPopupCenter(null); setBookingCenter(c); };

  // reset page when filters/search change
  useEffect(() => { setPage(1); }, [filtered]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Left panel ──────────────────────────────────────────────────────────────
  const ListPanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Search + sort */}
      <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <SearchBar value={search} onChange={setSearch} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12, alignItems: "center" }}>
          {SORT_OPTIONS.map(({ value, label }) => (
            <button key={value} onClick={() => setSort(value)} style={{
              padding: "5px 12px", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600,
              background: sort === value ? "var(--accent)" : "transparent",
              color: sort === value ? "#fff" : "var(--text-muted)",
              border: `1.5px solid ${sort === value ? "var(--accent)" : "var(--border-strong)"}`,
              cursor: "pointer", transition: "all 0.15s",
            }}>
              {label}
            </button>
          ))}
          <button onClick={() => setShowFilters((v) => !v)} style={{
            marginLeft: "auto", display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600,
            background: activeFilterCount > 0 ? "var(--accent-subtle)" : "transparent",
            color: activeFilterCount > 0 ? "var(--accent)" : "var(--text-muted)",
            border: `1.5px solid ${activeFilterCount > 0 ? "var(--accent)" : "var(--border-strong)"}`,
            cursor: "pointer",
          }}>
            <SlidersHorizontal size={13} />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: "hidden", borderBottom: "1px solid var(--border)", flexShrink: 0 }}
          >
            <div style={{ padding: "0 18px" }}>
              <FilterPanel filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} activeCount={activeFilterCount} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Recommendation */}
      {aiRecommended && !loading && (
        <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{
            padding: "14px 16px", borderRadius: 14,
            background: "linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(99,102,241,0.05) 100%)",
            border: "1px solid rgba(79,70,229,0.15)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <Sparkles size={16} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em" }}>AI Recommended</span>
            </div>
            <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{aiRecommended.name}</p>
            <p style={{ fontSize: "0.98rem", color: "var(--text-muted)" }}>
              Best match · {aiRecommended.distance} km · {aiRecommended.slotsAvailable} slots · ⭐ {aiRecommended.rating}
            </p>
          </div>
        </div>
      )}

      {/* Results count */}
      <div style={{ padding: "10px 18px", flexShrink: 0 }}>
        <p style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>
          {loading ? "Loading centers…" : `${filtered.length} center${filtered.length !== 1 ? "s" : ""} found`}
          {offline && <span style={{ color: "#f59e0b", marginLeft: 8 }}>· Offline mode</span>}
        </p>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 18px 18px" }}>
        {loading ? (
          <CenterCardSkeleton />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)" }}>
            <AlertCircle size={44} style={{ margin: "0 auto 14px", opacity: 0.4 }} />
            <p style={{ fontWeight: 700, fontSize: "1.15rem" }}>No centers found</p>
            <p style={{ fontSize: "1rem", marginTop: 6 }}>Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 14, paddingTop: 6,
            }}>
              {paginated.map((c, i) => (
                <CenterCard
                  key={c.id} center={c} index={i}
                  selected={selectedCenter?.id === c.id}
                  onClick={() => { setSelectedCenter(c); setPopupCenter(c); }}
                  onBook={() => handleBook(c)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "18px 0 4px" }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "7px 16px", borderRadius: 999, fontSize: "0.88rem", fontWeight: 600,
                    background: page === 1 ? "var(--bg-secondary)" : "var(--accent-subtle)",
                    color: page === 1 ? "var(--text-muted)" : "var(--accent)",
                    border: `1.5px solid ${page === 1 ? "var(--border)" : "var(--accent)"}`,
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >← Prev</button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} style={{
                    width: 36, height: 36, borderRadius: "50%", fontSize: "0.88rem", fontWeight: 700,
                    background: page === i + 1 ? "var(--accent)" : "transparent",
                    color: page === i + 1 ? "#fff" : "var(--text-muted)",
                    border: `1.5px solid ${page === i + 1 ? "var(--accent)" : "var(--border-strong)"}`,
                    cursor: "pointer", transition: "all 0.15s",
                  }}>{i + 1}</button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "7px 16px", borderRadius: 999, fontSize: "0.88rem", fontWeight: 600,
                    background: page === totalPages ? "var(--bg-secondary)" : "var(--accent-subtle)",
                    color: page === totalPages ? "var(--text-muted)" : "var(--accent)",
                    border: `1.5px solid ${page === totalPages ? "var(--border)" : "var(--accent)"}`,
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                  }}
                >Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px", borderBottom: "1px solid var(--border)",
        background: "var(--surface-raised)", flexShrink: 0, gap: 12, flexWrap: "wrap",
      }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "3.25rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
            <MapPin size={40} style={{ color: "var(--accent)" }} />
            Find Vaccination Centers
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginTop: 3 }}>
            {filtered.length} centers near you
            {lastUpdated && ` · Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {offline ? (
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 999, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", fontSize: "0.9rem", fontWeight: 600, color: "#f59e0b" }}>
              <WifiOff size={13} /> Offline
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 999, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", fontSize: "0.9rem", fontWeight: 600, color: "#10b981" }}>
              <Wifi size={13} /> Live
            </div>
          )}
          <button onClick={() => fetchCenters()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 999, fontSize: "0.95rem", fontWeight: 600, background: "var(--accent-subtle)", color: "var(--accent)", border: "1px solid rgba(79,70,229,0.15)", cursor: "pointer" }}>
            <RefreshCw size={15} /> Refresh
          </button>
          {/* Mobile toggle */}
          <div className="lg:hidden" style={{ display: "flex", background: "var(--bg-secondary)", borderRadius: 999, padding: 3, gap: 2 }}>
            {(["map", "list"] as const).map((v) => (
              <button key={v} onClick={() => setMobileView(v)} style={{
                padding: "6px 14px", borderRadius: 999, fontSize: "0.9rem", fontWeight: 600,
                background: mobileView === v ? "var(--accent)" : "transparent",
                color: mobileView === v ? "#fff" : "var(--text-muted)",
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
              }}>
                {v === "map" ? <MapPin size={14} /> : <List size={14} />}
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert toasts */}
      <div style={{ position: "fixed", top: 90, right: 16, zIndex: 100, display: "flex", flexDirection: "column", gap: 8 }}>
        <AnimatePresence>
          {alerts.map((msg, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
              style={{ padding: "12px 18px", borderRadius: 12, fontSize: "0.95rem", fontWeight: 600, background: "var(--surface-raised)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-md)", color: "var(--text-primary)", maxWidth: 300 }}>
              {msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left panel — 50% */}
        <div style={{ flex: 1, borderRight: "1px solid var(--border)", background: "var(--surface-raised)", overflow: "hidden", display: "none" }} className="lg:flex lg:flex-col">
          {ListPanel}
        </div>

        {/* Map — 50% */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", display: mobileView === "map" ? "block" : "none" }} className="lg:block">
            <MapContainer
              centers={filtered}
              selectedId={selectedCenter?.id ?? null}
              userLocation={userLocation}
              onSelectCenter={(c) => { setSelectedCenter(c); setPopupCenter(c); }}
              apiKey={MAPS_KEY}
            />
          </div>

          <div style={{ display: mobileView === "list" ? "flex" : "none", flexDirection: "column", height: "100%", overflow: "hidden" }} className="lg:hidden">
            {ListPanel}
          </div>

          {/* Legend */}
          {mobileView === "map" && (
            <div style={{ position: "absolute", top: 14, left: 14, zIndex: 10, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 7, boxShadow: "var(--shadow-sm)" }}>
              {[{ color: "#10b981", label: "Available" }, { color: "#f59e0b", label: "Limited" }, { color: "#ef4444", label: "Full" }].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: color }} />
                  {label}
                </div>
              ))}
            </div>
          )}

          {/* Mobile list button */}
          {mobileView === "map" && (
            <button onClick={() => setShowListSheet(true)} className="lg:hidden" style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, padding: "13px 26px", borderRadius: 999, fontWeight: 700, fontSize: "1rem", background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 8px 24px var(--accent-glow)", zIndex: 10 }}>
              <List size={18} />
              {filtered.length} Centers
              <ChevronUp size={18} />
            </button>
          )}
        </div>
      </div>

      <BottomSheet open={showListSheet} onClose={() => setShowListSheet(false)} title={`${filtered.length} Centers Found`}>
        {ListPanel}
      </BottomSheet>

      <CenterPopup center={popupCenter} onClose={() => setPopupCenter(null)} onBook={handleBook} />
      <BookingModal center={bookingCenter} date={filters.date} onClose={() => setBookingCenter(null)} />

      <style>{`
        @media (min-width: 1024px) {
          .lg\\:flex { display: flex !important; }
          .lg\\:flex-col { flex-direction: column !important; }
          .lg\\:block { display: block !important; }
          .lg\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
