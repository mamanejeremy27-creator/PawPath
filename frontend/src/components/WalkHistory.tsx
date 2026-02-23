import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { getWalks, deleteWalk, formatDuration } from "../lib/walkTracker.js";
import BottomNav from "./BottomNav.jsx";
import { Check, Trash2, Footprints } from "lucide-react";
import { cn } from "../lib/cn";

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

      // Load from backend
      if (isAuthenticated) {
        const res = await getWalks(activeDogId);
        if (!res.error && res.data) data = res.data;
      }

      // Merge localStorage walks
      try {
        const local = JSON.parse(localStorage.getItem("pawpath_walks") || "[]");
        const localFiltered = local.filter(w => w.dogId === activeDogId);
        const backendIds = new Set(data.map(w => w.id));
        for (const lw of localFiltered) {
          if (!backendIds.has(lw.id)) data.push(lw);
        }
      } catch { /* silent */ }

      // Sort by start time descending
      data.sort((a, b) => new Date(b.start_time || b.startTime).getTime() - new Date(a.start_time || a.startTime).getTime());

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
    if (isAuthenticated && !String(id).startsWith("local_")) {
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
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 start-1/2 -translate-x-1/2 z-[400] px-6 py-3 rounded-[20px] flex items-center gap-2 animate-[badgeDrop_0.4s_ease]"
          style={{
            background: "rgba(20,20,24,0.95)",
            border: "1px solid rgba(34,197,94,0.25)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            backdropFilter: "blur(16px)",
          }}
        >
          <span className="flex items-center">
            {toast === "saved"
              ? <Check size={18} className="text-training" />
              : <Trash2 size={18} className="text-danger" />
            }
          </span>
          <span className="text-sm font-bold text-text">
            {toast === "saved" ? T("walkSaved") : T("walkDeleted")}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav("home")}
            className="bg-transparent border-none cursor-pointer text-xl text-muted p-1"
          >
            {"\u2190"}
          </button>
          <div>
            <h1 className="font-display text-2xl font-black m-0 mb-1 text-text">{T("walkHistory")}</h1>
            <p className="text-[13px] text-muted m-0">{allWalks.length} {T("walksLogged")}</p>
          </div>
        </div>
        <button
          onClick={() => nav("walkTracker")}
          className="px-[18px] py-2.5 rounded-full bg-training text-black border-none font-black text-[13px] cursor-pointer"
        >
          {T("walkNewWalk")}
        </button>
      </div>

      {/* Weekly Summary Stats */}
      {allWalks.length > 0 && (
        <div className="flex gap-2.5 px-5 pt-4">
          <div className="flex-1 text-center py-3.5 px-1.5 bg-surface rounded-2xl border border-border">
            <div className="text-xl font-black text-training">{thisWeekWalks.length}</div>
            <div className="text-[10px] text-muted uppercase tracking-[1px] font-semibold">{T("walkWeekWalks")}</div>
          </div>
          <div className="flex-1 text-center py-3.5 px-1.5 bg-surface rounded-2xl border border-border">
            <div className="text-xl font-black text-text">{weekDistance.toFixed(1)}</div>
            <div className="text-[10px] text-muted uppercase tracking-[1px] font-semibold">{T("walkWeekDist")}</div>
          </div>
          <div className="flex-1 text-center py-3.5 px-1.5 bg-surface rounded-2xl border border-border">
            <div className="text-xl font-black text-text">{formatDuration(avgDuration)}</div>
            <div className="text-[10px] text-muted uppercase tracking-[1px] font-semibold">{T("walkAvgDuration")}</div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-[3px] border-white/10 border-t-training rounded-full animate-[spin_0.8s_linear_infinite] mx-auto" />
        </div>
      )}

      {/* Empty */}
      {!loading && allWalks.length === 0 && (
        <div className="text-center py-16 px-5">
          <div className="mb-3 flex justify-center"><Footprints size={48} className="text-muted" /></div>
          <div className="text-base font-bold text-text">{T("noWalksYet")}</div>
          <div className="text-[13px] text-muted mt-1.5">{T("noWalksYetSub")}</div>
          <button
            onClick={() => nav("walkTracker")}
            className="mt-5 px-7 py-3.5 rounded-full bg-training text-black border-none font-black text-sm cursor-pointer"
          >
            {T("walkStart")}
          </button>
        </div>
      )}

      {/* Grouped Walk List */}
      {!loading && groups.length > 0 && (
        <div className="px-5 pt-3">
          {groups.map((group) => (
            <div key={group.key} className="mb-4">
              {/* Group Header */}
              <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] py-2 border-b border-border mb-2">
                {group.label}
              </div>
              <div className="flex flex-col gap-2">
                {group.walks.map((w, i) => {
                  const startTime = w.start_time || w.startTime;
                  const dist = w.distance_km || w.distanceKm || 0;
                  const dur = w.duration_seconds || w.durationSeconds || 0;
                  const paceStr = w.average_pace || w.averagePace || "--:--";

                  return (
                    <div key={w.id || i} className="relative">
                      <div className="flex items-center px-[18px] py-4 bg-surface rounded-3xl border border-border text-text">
                        <button
                          onClick={() => nav("walkDetail", { walkData: w })}
                          className="flex-1 flex items-center gap-3.5 bg-transparent border-none text-text cursor-pointer font-sans text-start p-0"
                        >
                          <div className="w-11 h-11 rounded-2xl bg-training/[0.08] border border-training/15 flex items-center justify-center shrink-0">
                            <Footprints size={22} className="text-training" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold">{formatDate(startTime)}</div>
                            <div className="text-xs text-muted mt-0.5">
                              {formatTime(startTime)} · {formatDuration(dur)} · {dist.toFixed(2)} km
                            </div>
                          </div>
                          <div className="text-end shrink-0">
                            <div className="text-sm font-black text-training">{dist.toFixed(1)} km</div>
                            <div className="text-[11px] text-muted">{paceStr} {T("walkPaceUnit")}</div>
                          </div>
                        </button>
                        {/* Delete button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(w.id); }}
                          className="ms-2 p-2 bg-transparent border-none cursor-pointer text-muted text-base shrink-0 rounded-lg transition-colors duration-150 hover:text-danger"
                        >
                          <Trash2 size={16} />
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
              className="w-full py-3.5 mt-2 rounded-full bg-surface text-text border border-border text-sm font-bold cursor-pointer"
            >
              {T("walkLoadMore")} ({allWalks.length - visibleCount} {T("walkMore")})
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-lg flex items-center justify-center">
          <div className="w-[calc(100%-48px)] max-w-[340px] bg-surface rounded-3xl px-6 py-7 animate-[fadeIn_0.2s_ease] text-center">
            <div className="mb-4 flex justify-center"><Footprints size={36} className="text-muted" /></div>
            <div className="text-base font-bold text-text mb-5">{T("walkDeleteConfirm")}</div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3.5 rounded-full bg-transparent border border-border text-text text-sm font-semibold cursor-pointer"
              >
                {T("walkCancel")}
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 py-3.5 rounded-full border-none bg-danger text-white text-sm font-bold cursor-pointer"
              >
                {T("healthDelete")}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
