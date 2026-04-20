"use client";
import { useEffect, useRef, useCallback } from "react";
import type { Center } from "@/types/centers";
import { getStatus } from "./AvailabilityBadge";

interface Props {
  centers: Center[];
  selectedId: string | null;
  userLocation: { lat: number; lng: number } | null;
  onSelectCenter: (c: Center) => void;
  apiKey: string;
}

const PIN_COLORS = { available: "#10b981", limited: "#f59e0b", full: "#ef4444" };

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

export default function MapContainer({ centers, selectedId, userLocation, onSelectCenter, apiKey }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const buildPinEl = useCallback((center: Center, isSelected: boolean) => {
    const status = getStatus(center.slotsAvailable, center.totalCapacity);
    const color = PIN_COLORS[status];
    const size = isSelected ? 44 : 36;

    const el = document.createElement("div");
    el.style.cssText = `
      width:${size}px; height:${size}px; border-radius:50% 50% 50% 0;
      transform:rotate(-45deg); background:${color};
      border:3px solid #fff; box-shadow:0 4px 16px ${color}60;
      display:flex; align-items:center; justify-content:center;
      transition:all 0.2s; cursor:pointer;
      ${status === "available" ? `animation:mapPing 2s ease-in-out infinite;` : ""}
    `;
    const inner = document.createElement("div");
    inner.style.cssText = `transform:rotate(45deg); color:#fff; font-size:${isSelected ? 16 : 13}px; font-weight:800;`;
    inner.textContent = center.slotsAvailable === 0 ? "✕" : String(center.slotsAvailable);
    el.appendChild(inner);
    return el;
  }, []);

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    const center = userLocation ?? { lat: 23.7808, lng: 90.4093 };
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 12,
      mapId: "vaccination_map",
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "simplified" }] },
      ],
    });
    mapInstanceRef.current = map;

    // User location marker
    if (userLocation) {
      const userEl = document.createElement("div");
      userEl.style.cssText = `
        width:18px; height:18px; border-radius:50%;
        background:#4f46e5; border:3px solid #fff;
        box-shadow:0 0 0 6px rgba(79,70,229,0.2);
        animation:userPulse 2s ease-in-out infinite;
      `;
      userMarkerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
        map, position: userLocation, content: userEl, title: "Your Location",
      });
    }

    // Center markers
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = centers.map((center) => {
      const isSelected = center.id === selectedId;
      const pinEl = buildPinEl(center, isSelected);
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map, position: center.location, content: pinEl, title: center.name,
      });
      marker.addListener("click", () => onSelectCenter(center));
      return marker;
    });
  }, [centers, selectedId, userLocation, onSelectCenter, buildPinEl]);

  // Load Google Maps script once
  useEffect(() => {
    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY") return;
    if (document.getElementById("gmap-script")) { initMap(); return; }

    const script = document.createElement("script");
    script.id = "gmap-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,visualization&v=beta`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
  }, [apiKey, initMap]);

  // Re-render markers when centers/selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps?.marker) return;
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = centers.map((center) => {
      const isSelected = center.id === selectedId;
      const pinEl = buildPinEl(center, isSelected);
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapInstanceRef.current!, position: center.location, content: pinEl, title: center.name,
      });
      marker.addListener("click", () => onSelectCenter(center));
      return marker;
    });

    if (selectedId) {
      const sel = centers.find((c) => c.id === selectedId);
      if (sel) mapInstanceRef.current.panTo(sel.location);
    }
  }, [centers, selectedId, buildPinEl, onSelectCenter]);

  // Fallback static map when no API key
  const noKey = !apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <style>{`
        @keyframes mapPing { 0%,100%{box-shadow:0 4px 16px var(--c,#10b981)60} 50%{box-shadow:0 4px 32px var(--c,#10b981)90,0 0 0 8px var(--c,#10b981)20} }
        @keyframes userPulse { 0%,100%{box-shadow:0 0 0 6px rgba(79,70,229,0.2)} 50%{box-shadow:0 0 0 12px rgba(79,70,229,0.1)} }
      `}</style>

      <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: "inherit" }} />

      {noKey && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 16,
          background: "linear-gradient(135deg, #eef1fb 0%, #e8ecf8 100%)",
          borderRadius: "inherit",
        }}>
          {/* Decorative fake map grid */}
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={`${(i + 1) * 8}%`} x2="100%" y2={`${(i + 1) * 8}%`} stroke="#4f46e5" strokeWidth="1" />
            ))}
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`v${i}`} x1={`${(i + 1) * 6.25}%`} y1="0" x2={`${(i + 1) * 6.25}%`} y2="100%" stroke="#4f46e5" strokeWidth="1" />
            ))}
            {/* Fake roads */}
            <path d="M 0 45% Q 30% 42%, 60% 48% T 100% 44%" stroke="#4f46e5" strokeWidth="3" fill="none" opacity="0.5" />
            <path d="M 20% 0 Q 22% 40%, 25% 100%" stroke="#4f46e5" strokeWidth="3" fill="none" opacity="0.5" />
            <path d="M 65% 0 Q 68% 50%, 70% 100%" stroke="#4f46e5" strokeWidth="2" fill="none" opacity="0.4" />
          </svg>

          {/* Center pins on fake map */}
          {centers.slice(0, 6).map((c, i) => {
            const status = getStatus(c.slotsAvailable, c.totalCapacity);
            const color = PIN_COLORS[status];
            const positions = [
              { top: "30%", left: "25%" }, { top: "55%", left: "45%" },
              { top: "20%", left: "65%" }, { top: "70%", left: "30%" },
              { top: "45%", left: "72%" }, { top: "60%", left: "58%" },
            ];
            return (
              <div
                key={c.id}
                onClick={() => onSelectCenter(c)}
                style={{
                  position: "absolute", ...positions[i],
                  width: 32, height: 32, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
                  background: color, border: "2.5px solid #fff",
                  boxShadow: `0 4px 12px ${color}60`, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "transform 0.2s",
                  animation: status === "available" ? "mapPing 2s ease-in-out infinite" : "none",
                }}
              >
                <span style={{ transform: "rotate(45deg)", color: "#fff", fontSize: 10, fontWeight: 800 }}>
                  {c.slotsAvailable === 0 ? "✕" : c.slotsAvailable}
                </span>
              </div>
            );
          })}

          {/* User dot */}
          <div style={{
            position: "absolute", top: "50%", left: "40%",
            width: 16, height: 16, borderRadius: "50%",
            background: "#4f46e5", border: "3px solid #fff",
            boxShadow: "0 0 0 8px rgba(79,70,229,0.2)",
            animation: "userPulse 2s ease-in-out infinite",
          }} />

          {/* Notice */}
          <div style={{
            position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
            border: "1px solid var(--border)", borderRadius: 12,
            padding: "10px 18px", fontSize: "0.78rem", color: "var(--text-secondary)",
            fontWeight: 600, whiteSpace: "nowrap", boxShadow: "var(--shadow-sm)",
          }}>
            🗺️ Add <code style={{ background: "var(--accent-subtle)", color: "var(--accent)", padding: "1px 5px", borderRadius: 4 }}>NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> to enable live map
          </div>
        </div>
      )}
    </div>
  );
}
