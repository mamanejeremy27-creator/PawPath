import { useApp } from "../context/AppContext.jsx";
import { formatDuration } from "../lib/walkTracker.js";
import { Ruler, Timer, Footprints, MapPin } from "lucide-react";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };

/** Project coords to SVG viewport with padding */
function projectRoute(coords, width, height, padding = 20) {
  if (!coords || coords.length < 2) return [];
  const lats = coords.map(c => c.lat);
  const lngs = coords.map(c => c.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const dLat = maxLat - minLat || 0.0001;
  const dLng = maxLng - minLng || 0.0001;
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;
  const scale = Math.min(usableW / dLng, usableH / dLat);

  return coords.map(c => ({
    x: padding + (c.lng - minLng) * scale + (usableW - dLng * scale) / 2,
    y: padding + (maxLat - c.lat) * scale + (usableH - dLat * scale) / 2,
  }));
}

export default function WalkDetail() {
  const { nav, T, lang, walkData } = useApp();

  // walkData comes from nav("walkDetail", { walkData: w })
  // Normalize field names (backend vs localStorage)
  const w = walkData || {};
  const startTime = w.start_time || w.startTime;
  const endTime = w.end_time || w.endTime;
  const duration = w.duration_seconds || w.durationSeconds || 0;
  const distance = w.distance_km || w.distanceKm || 0;
  const pace = w.average_pace || w.averagePace || "--:--";
  const routeCoords = w.route_coords || w.routeCoords || [];
  const notes = w.notes || "";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString(lang === "he" ? "he-IL" : "en-US", { hour: "2-digit", minute: "2-digit" });
  };

  // SVG route
  const svgW = 340;
  const svgH = 240;
  const projected = projectRoute(routeCoords, svgW, svgH);
  const pathD = projected.length >= 2
    ? `M ${projected.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ")}`
    : "";

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 40, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => nav("walkHistory")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.t3, padding: 4 }}>
          {"\u2190"}
        </button>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 2px", color: C.t1 }}>{T("walkDetail")}</h1>
          <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{formatDate(startTime)}</p>
        </div>
      </div>

      {/* Route Visualization */}
      {projected.length >= 2 && (
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`, padding: "16px", overflow: "hidden" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>{T("walkRoute")}</div>
            <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: "block" }}>
              {/* Route path */}
              <path d={pathD} fill="none" stroke="url(#routeGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {/* Start point */}
              <circle cx={projected[0].x} cy={projected[0].y} r="6" fill="#22C55E" stroke="#0A0A0C" strokeWidth="2" />
              {/* End point */}
              <circle cx={projected[projected.length - 1].x} cy={projected[projected.length - 1].y} r="6" fill="#EF4444" stroke="#0A0A0C" strokeWidth="2" />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22C55E" />
                  <stop offset="100%" stopColor="#4ADE80" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.acc }} />
                <span style={{ fontSize: 11, color: C.t3 }}>{T("walkStart")}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: (C as any).danger }} />
                <span style={{ fontSize: 11, color: C.t3 }}>{T("walkFinish")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: T("walkDistance"), value: `${distance.toFixed(2)} km`, icon: <Ruler size={20} color={C.acc} /> },
            { label: T("walkDuration"), value: formatDuration(duration), icon: <Timer size={20} color={C.acc} /> },
            { label: T("walkPace"), value: `${pace} ${T("walkPaceUnit")}`, icon: <Footprints size={20} color={C.acc} /> },
            { label: T("walkPoints"), value: `${routeCoords.length}`, icon: <MapPin size={20} color={C.acc} /> },
          ].map((s, i) => (
            <div key={i} style={{ padding: "16px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}`, textAlign: "center" }}>
              <div style={{ marginBottom: 6, display: "flex", justifyContent: "center" }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.t1 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Details */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ padding: "16px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: C.t3 }}>{T("walkStartTime")}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{formatTime(startTime)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: C.t3 }}>{T("walkEndTime")}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{formatTime(endTime)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ padding: "16px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{T("walkNotes")}</div>
            <p style={{ fontSize: 14, color: C.t2, margin: 0, lineHeight: 1.6 }}>{notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
