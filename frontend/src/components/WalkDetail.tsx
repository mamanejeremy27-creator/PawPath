import { useApp } from "../context/AppContext.jsx";
import { formatDuration } from "../lib/walkTracker.js";
import { Ruler, Timer, Footprints, MapPin } from "lucide-react";

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
    <div className="min-h-screen pb-10 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-5 flex items-center gap-3">
        <button
          onClick={() => nav("walkHistory")}
          className="bg-transparent border-none cursor-pointer text-xl text-muted p-1"
        >
          {"\u2190"}
        </button>
        <div>
          <h1 className="font-display text-2xl font-black m-0 mb-0.5 text-text">{T("walkDetail")}</h1>
          <p className="text-[13px] text-muted m-0">{formatDate(startTime)}</p>
        </div>
      </div>

      {/* Route Visualization */}
      {projected.length >= 2 && (
        <div className="px-5 pt-5">
          <div className="bg-surface rounded-3xl border border-border p-4 overflow-hidden">
            <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-3">{T("walkRoute")}</div>
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
            <div className="flex justify-between mt-2.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-training" />
                <span className="text-[11px] text-muted">{T("walkStart")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-danger" />
                <span className="text-[11px] text-muted">{T("walkFinish")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="px-5 pt-4">
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: T("walkDistance"), value: `${distance.toFixed(2)} km`, icon: <Ruler size={20} className="text-training" /> },
            { label: T("walkDuration"), value: formatDuration(duration), icon: <Timer size={20} className="text-training" /> },
            { label: T("walkPace"), value: `${pace} ${T("walkPaceUnit")}`, icon: <Footprints size={20} className="text-training" /> },
            { label: T("walkPoints"), value: `${routeCoords.length}`, icon: <MapPin size={20} className="text-training" /> },
          ].map((s, i) => (
            <div key={i} className="p-4 bg-surface rounded-2xl border border-border text-center">
              <div className="mb-1.5 flex justify-center">{s.icon}</div>
              <div className="text-lg font-black text-text">{s.value}</div>
              <div className="text-[10px] text-muted uppercase tracking-[1px] font-semibold mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Details */}
      <div className="px-5 pt-4">
        <div className="px-[18px] py-4 bg-surface rounded-2xl border border-border">
          <div className="flex justify-between mb-2">
            <span className="text-[13px] text-muted">{T("walkStartTime")}</span>
            <span className="text-[13px] font-bold text-text">{formatTime(startTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[13px] text-muted">{T("walkEndTime")}</span>
            <span className="text-[13px] font-bold text-text">{formatTime(endTime)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="px-5 pt-4">
          <div className="px-[18px] py-4 bg-surface rounded-2xl border border-border">
            <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-2">{T("walkNotes")}</div>
            <p className="text-sm text-text-2 m-0 leading-relaxed">{notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
