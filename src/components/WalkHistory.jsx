import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { getWalks, formatDuration } from "../lib/walkTracker.js";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };

export default function WalkHistory() {
  const { nav, T, lang, isAuthenticated, activeDogId } = useApp();
  const [walks, setWalks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      let data = [];

      // Try Supabase first
      if (isAuthenticated) {
        const res = await getWalks(activeDogId);
        if (!res.error && res.data) data = res.data;
      }

      // Merge localStorage walks
      try {
        const local = JSON.parse(localStorage.getItem("pawpath_walks") || "[]");
        const localFiltered = local.filter(w => w.dogId === activeDogId);
        // Merge — use Supabase IDs to deduplicate
        const supaIds = new Set(data.map(w => w.id));
        for (const lw of localFiltered) {
          if (!supaIds.has(lw.id)) data.push(lw);
        }
      } catch { /* silent */ }

      // Sort by start time descending
      data.sort((a, b) => new Date(b.start_time || b.startTime) - new Date(a.start_time || a.startTime));

      if (!cancelled) {
        setWalks(data);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, activeDogId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString(lang === "he" ? "he-IL" : "en-US", { hour: "2-digit", minute: "2-digit" });
  };

  // Total stats
  const totalDistance = walks.reduce((a, w) => a + (w.distance_km || w.distanceKm || 0), 0);
  const totalDuration = walks.reduce((a, w) => a + (w.duration_seconds || w.durationSeconds || 0), 0);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => nav("home")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.t3, padding: 4 }}>
            {"\u2190"}
          </button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: C.t1 }}>{T("walkHistory")}</h1>
            <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{walks.length} {T("walksLogged")}</p>
          </div>
        </div>
        <button onClick={() => nav("walkTracker")} style={{
          padding: "10px 18px", borderRadius: 50,
          background: C.acc, color: "#000", border: "none",
          fontWeight: 800, fontSize: 13, cursor: "pointer",
        }}>{T("walkNewWalk")}</button>
      </div>

      {/* Summary Stats */}
      {walks.length > 0 && (
        <div style={{ display: "flex", gap: 10, padding: "16px 20px 0" }}>
          <div style={{ flex: 1, textAlign: "center", padding: "14px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.acc }}>{totalDistance.toFixed(1)}</div>
            <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("walkTotalKm")}</div>
          </div>
          <div style={{ flex: 1, textAlign: "center", padding: "14px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>{formatDuration(totalDuration)}</div>
            <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("walkTotalTime")}</div>
          </div>
          <div style={{ flex: 1, textAlign: "center", padding: "14px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>{walks.length}</div>
            <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("walksTotal")}</div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
        </div>
      )}

      {/* Empty */}
      {!loading && walks.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{"\uD83D\uDEB6"}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{T("noWalksYet")}</div>
          <div style={{ fontSize: 13, color: C.t3, marginTop: 6 }}>{T("noWalksYetSub")}</div>
          <button onClick={() => nav("walkTracker")} style={{
            marginTop: 20, padding: "14px 28px", borderRadius: 50,
            background: C.acc, color: "#000", border: "none",
            fontWeight: 800, fontSize: 14, cursor: "pointer",
          }}>{T("walkStart")}</button>
        </div>
      )}

      {/* Walk List */}
      {!loading && walks.length > 0 && (
        <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
          {walks.map((w, i) => {
            const startTime = w.start_time || w.startTime;
            const dist = w.distance_km || w.distanceKm || 0;
            const dur = w.duration_seconds || w.durationSeconds || 0;
            const paceStr = w.average_pace || w.averagePace || "--:--";
            const routeLen = (w.route_coords || w.routeCoords || []).length;

            return (
              <button
                key={w.id || i}
                onClick={() => nav("walkDetail", { walkData: w })}
                style={{
                  width: "100%", textAlign: "start", cursor: "pointer",
                  padding: "16px 18px", background: C.s1, borderRadius: C.rL,
                  border: `1px solid ${C.b1}`, color: C.t1, fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {"\uD83D\uDEB6"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{formatDate(startTime)}</div>
                    <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>
                      {formatTime(startTime)} · {formatDuration(dur)} · {dist.toFixed(2)} km
                    </div>
                  </div>
                  <div style={{ textAlign: "end", flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.acc }}>{dist.toFixed(1)} km</div>
                    <div style={{ fontSize: 11, color: C.t3 }}>{paceStr} {T("walkPaceUnit")}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
