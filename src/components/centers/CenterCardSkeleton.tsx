"use client";

const SKELETON_COLORS = ["#4f46e5","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"];

export default function CenterCardSkeleton() {
  const shimmer: React.CSSProperties = {
    background: "linear-gradient(90deg, var(--bg-secondary) 25%, var(--border) 50%, var(--bg-secondary) 75%)",
    backgroundSize: "200% 100%",
    animation: "skshimmer 1.4s ease-in-out infinite",
    borderRadius: 6,
  };

  return (
    <>
      <style>{`@keyframes skshimmer{0%{background-position:200% center}100%{background-position:-200% center}}`}</style>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, paddingTop: 6 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ height: 4, background: `${SKELETON_COLORS[i % SKELETON_COLORS.length]}40` }} />
            <div style={{ padding: "14px 14px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ ...shimmer, height: 15, width: "65%" }} />
                <div style={{ ...shimmer, height: 20, width: 60, borderRadius: 999 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ ...shimmer, height: 11, width: "50%" }} />
                <div style={{ ...shimmer, height: 11, width: 30 }} />
              </div>
              <div style={{ ...shimmer, height: 5, width: "100%", borderRadius: 999, marginBottom: 10 }} />
              <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
                {[50, 60, 45].map((w, j) => <div key={j} style={{ ...shimmer, height: 18, width: w, borderRadius: 999 }} />)}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ ...shimmer, height: 11, width: "40%" }} />
                <div style={{ ...shimmer, height: 28, width: 70, borderRadius: 8 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
