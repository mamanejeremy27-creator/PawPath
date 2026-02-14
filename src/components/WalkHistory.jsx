import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { getWalks, deleteWalk, formatDuration } from "../lib/walkTracker.js";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", danger: "#EF4444", r: 16, rL: 24 };
const PAGE_SIZE = 20;

// ── Date grouping helpers ────────────────────────────

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getGroupKey(dateStr, lang) {
  const d = new Date(dateStr);
  const now = new Date();
  const thisWeekStart = getWeekStart(now);
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  if (d >= thisWeekStart) return "thisWeek";
  if (d >= lastWeekStart) return "lastWeek";

  // Month/Year label
  const month = d.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "long", year: "numeric" });
  return month;
}

function getGroupLabel(key, T) {
  if (key === "thisWeek") return T("walkThisWeek");
  if (key === "lastWeek") return T("walkLastWeek");
  return key; // Already formatted month name
}

export default function WalkHistory() {
  const { nav, T, lang, isAuthenticated, activeDogId, walkSavedToast: toastFlag } = useApp();
  const [allWalks, setAllWalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [deleteTarget, setDeleteTarget] = useState(null); // walk id to confirm delete
  const [toast, setToast] = useState(toastFlag ? "saved" : null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

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
        const supaIds = new Set(data.map(w => w.id));
        for (const lw of localFiltered) {
          if (!supaIds.has(lw.id)) data.push(lw);
        }
      } catch { /* silent */ }

      // Sort by start time descending
      data.sort((a, b) => new Date(b.start_time || b.startTime) - new Date(a.start_time || a.startTime));

      if (!cancelled) {
        setAllWalks(data);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, activeDogId]);

  const handleDelete = async (id) => {
    // Delete from Supabase
    if (isAuthenticated && !String(id).startsWith("local_") && typeof id !== "number") {
      await deleteWalk(id);
    }
    // Delete from localStorage
    try {
      const local = JSON.parse(localStorage.getItem("pawpath_walks") || "[]");
      localStorage.setItem("pawpath_walks", JSON.stringify(local.filter(w => w.id !== id)));
    } catch { /* silent */ }

    setAllWalks(prev => prev.filter(w => w.id !== id));
    setDeleteTarget(null);
    setToast("deleted");
  };

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

  // ── This week's stats ──────────────────────────────
  const thisWeekStart = getWeekStart(new Date());
  const thisWeekWalks = allWalks.filter(w => new Date(w.start_time || w.startTime) >= thisWeekStart);
  const weekDistance = thisWeekWalks.reduce((a, w) => a + (w.distance_km || w.distanceKm || 0), 0);
  const weekDuration = thisWeekWalks.reduce((a, w) => a + (w.duration_seconds || w.durationSeconds || 0), 0);
  const avgDuration = thisWeekWalks.length > 0 ? Math.round(weekDuration / thisWeekWalks.length) : 0;

  // ── Visible walks + grouping ───────────────────────
  const visible = allWalks.slice(0, visibleCount);
  const hasMore = visibleCount < allWalks.length;

  // Group walks
  const groups = [];
  let currentKey = null;
  for (const w of visible) {
    const startTime = w.start_time || w.startTime;
    const key = getGroupKey(startTime, lang);
    if (key !== currentKey) {
      groups.push({ key, label: getGroupLabel(key, T), walks: [] });
      currentKey = key;
    }
    groups[groups.length - 1].walks.push(w);
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 400,
          background: "rgba(20,20,24,0.95)", border: `1px solid rgba(34,197,94,0.25)`,
          padding: "12px 24px", borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          backdropFilter: "blur(16px)", animation: "badgeDrop 0.4s ease",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 18 }}>{toast === "saved" ? "\u2705" : "\uD83D\uDDD1\uFE0F"}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>
            {toast === "saved" ? T("walkSaved") : T("walkDeleted")}
          </span>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => nav("home")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.t3, padding: 4 }}>
            {"\u2190"}
          </button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: C.t1 }}>{T("walkHistory")}</h1>
            <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{allWalks.length} {T("walksLogged")}</p>
          </div>
        </div>
        <button onClick={() => nav("walkTracker")} style={{
          padding: "10px 18px", borderRadius: 50,
          background: C.acc, color: "#000", border: "none",
          fontWeight: 800, fontSize: 13, cursor: "pointer",
        }}>{T("walkNewWalk")}</button>
      </div>

      {/* Weekly Summary Stats */}
      {allWalks.length > 0 && (
        <div style={{ display: "flex", gap: 10, padding: "16px 20px 0" }}>
          <div style={{ flex: 1, textAlign: "center", padding: "14px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.acc }}>{thisWeekWalks.length}</div>
            <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("walkWeekWalks")}</div>
          </div>
          <div style={{ flex: 1, textAlign: "center", padding: "14px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>{weekDistance.toFixed(1)}</div>
            <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("walkWeekDist")}</div>
          </div>
          <div style={{ flex: 1, textAlign: "center", padding: "14px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>{formatDuration(avgDuration)}</div>
            <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("walkAvgDuration")}</div>
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
      {!loading && allWalks.length === 0 && (
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

      {/* Grouped Walk List */}
      {!loading && groups.length > 0 && (
        <div style={{ padding: "12px 20px 0" }}>
          {groups.map((group) => (
            <div key={group.key} style={{ marginBottom: 16 }}>
              {/* Group Header */}
              <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, padding: "8px 0 8px", borderBottom: `1px solid ${C.b1}`, marginBottom: 8 }}>
                {group.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {group.walks.map((w, i) => {
                  const startTime = w.start_time || w.startTime;
                  const dist = w.distance_km || w.distanceKm || 0;
                  const dur = w.duration_seconds || w.durationSeconds || 0;
                  const paceStr = w.average_pace || w.averagePace || "--:--";

                  return (
                    <div key={w.id || i} style={{ position: "relative" }}>
                      <div
                        style={{
                          display: "flex", alignItems: "center",
                          padding: "16px 18px", background: C.s1, borderRadius: C.rL,
                          border: `1px solid ${C.b1}`, color: C.t1,
                        }}
                      >
                        <button
                          onClick={() => nav("walkDetail", { walkData: w })}
                          style={{
                            flex: 1, display: "flex", alignItems: "center", gap: 14,
                            background: "none", border: "none", color: C.t1, cursor: "pointer",
                            fontFamily: "inherit", textAlign: "start", padding: 0,
                          }}
                        >
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
                        </button>
                        {/* Delete button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(w.id); }}
                          style={{
                            marginLeft: 8, padding: "8px", background: "none", border: "none",
                            cursor: "pointer", color: C.t3, fontSize: 16, flexShrink: 0,
                            borderRadius: 8, transition: "color 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = C.danger}
                          onMouseLeave={e => e.currentTarget.style.color = C.t3}
                        >
                          {"\uD83D\uDDD1\uFE0F"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Load More */}
          {hasMore && (
            <button
              onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
              style={{
                width: "100%", padding: "14px", marginTop: 8, borderRadius: 50,
                background: C.s1, color: C.t1, border: `1px solid ${C.b1}`,
                fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}
            >
              {T("walkLoadMore")} ({allWalks.length - visibleCount} {lang === "he" ? "נוספות" : "more"})
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "calc(100% - 48px)", maxWidth: 340, background: C.s1, borderRadius: C.rL, padding: "28px 24px", animation: "fadeIn 0.2s ease", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>{"\uD83D\uDEB6"}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 20 }}>{T("walkDeleteConfirm")}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  flex: 1, padding: "14px", borderRadius: 50,
                  background: "transparent", border: `1px solid ${C.b1}`,
                  color: C.t1, fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
              >{T("walkCancel")}</button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                style={{
                  flex: 1, padding: "14px", borderRadius: 50, border: "none",
                  background: C.danger, color: "#fff",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                }}
              >{T("healthDelete")}</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
