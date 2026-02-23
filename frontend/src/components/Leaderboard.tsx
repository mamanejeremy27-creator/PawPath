import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { api } from "../lib/api.js";
import BottomNav from "./BottomNav.jsx";
import { Trophy, Flame, Lock, ArrowLeft, AlertTriangle } from "lucide-react";
import { cn } from "../lib/cn";

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export default function Leaderboard() {
  const { nav, T, dogProfile, appSettings, setAppSettings, isAuthenticated, activeDogId, getDogBackendId } = useApp();
  const { user } = useAuth();

  const [tab, setTab] = useState("weekly");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch leaderboard on tab change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    async function load() {
      try {
        let data;
        if (tab === "weekly") {
          data = await api.getWeeklyLeaderboard();
        } else if (tab === "allTime") {
          data = await api.getAllTimeLeaderboard();
        } else {
          data = await api.getBreedLeaderboard(dogProfile?.breed || "");
        }
        if (cancelled) return;
        setEntries(data || []);
      } catch {
        if (!cancelled) { setError(true); setEntries([]); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tab, activeDogId, dogProfile?.breed]);

  const optIn = appSettings.leaderboardOptIn !== false;

  const handleOptInToggle = () => {
    const newVal = !optIn;
    setAppSettings(prev => ({ ...prev, leaderboardOptIn: newVal }));
    api.updateSettings({ leaderboardOptIn: newVal }).catch(() => {});
  };

  const tabs = [
    { id: "weekly", label: T("lbWeekly") },
    { id: "allTime", label: T("lbAllTime") },
    { id: "breed", label: T("lbBreed") },
  ];

  const subtitle = tab === "weekly" ? T("lbThisWeek")
    : tab === "allTime" ? T("lbAllTimeSub")
    : T("lbBreedSub").replace("{breed}", dogProfile?.breed || "");

  const xpKey = tab === "weekly" ? "weeklyXp" : "totalXp";

  const isCurrentUser = (entry) => {
    const backendDogId = getDogBackendId?.(activeDogId);
    return user && backendDogId && entry.dogId === backendDogId;
  };

  return (
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-10">
        <button
          onClick={() => nav("home")}
          className="bg-transparent border-0 text-muted text-sm cursor-pointer p-0 mb-3 flex items-center gap-1"
        >
          <ArrowLeft size={16} /> {T("back")}
        </button>
        <h1 className="font-display text-[28px] font-black text-text m-0">{T("leaderboard")}</h1>
        <p className="text-sm text-muted mt-1 mb-0">{T("leaderboardSubtitle")}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5 pt-5">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 py-2.5 text-[13px] font-bold rounded-full border-0 cursor-pointer transition-all duration-200",
              tab === t.id ? "bg-training text-black" : "bg-surface text-muted"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Opt-in toggle */}
      {isAuthenticated && (
        <div className="px-5 pt-4 flex items-center justify-between">
          <span className={cn("text-[13px] font-semibold", optIn ? "text-training" : "text-muted")}>
            {optIn ? T("lbOptIn") : T("lbOptOut")}
          </span>
          <button
            onClick={handleOptInToggle}
            className="w-11 h-6 rounded-full border-0 cursor-pointer relative transition-[background] duration-200"
            style={{ background: optIn ? "#22C55E" : "rgba(255,255,255,0.1)" }}
          >
            <div
              className="w-[18px] h-[18px] rounded-full bg-white absolute top-[3px] transition-[left] duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
              style={{ left: optIn ? 23 : 3 }}
            />
          </button>
        </div>
      )}

      {/* Subtitle */}
      <div className="px-5 pt-3">
        <p className="text-xs text-muted m-0">{subtitle}</p>
      </div>

      {/* Content */}
      <div className="px-5 pt-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-[3px] border-white/10 border-t-training rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16 px-5">
            <div className="mb-3"><AlertTriangle size={40} color="#F59E0B" /></div>
            <p className="text-[15px] text-muted">{T("lbUnavailable")}</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center py-16 px-5">
            <div className="mb-3"><Lock size={40} className="text-muted" /></div>
            <p className="text-[15px] text-muted">{T("lbSignIn")}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 px-5">
            <div className="mb-3"><Trophy size={40} color="#FFD700" /></div>
            <p className="text-[15px] font-bold text-text">{T("lbEmpty")}</p>
            <p className="text-[13px] text-muted mt-1">{T("lbEmptySub")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {entries.map((entry, i) => {
              const rank = i + 1;
              const isSelf = isCurrentUser(entry);
              const posColor = rank <= 3 ? MEDAL_COLORS[rank - 1] : "#71717A";
              return (
                <div
                  key={entry.id}
                  className={cn(
                    "px-4 py-3.5 rounded-2xl border flex items-center gap-3",
                    isSelf
                      ? "border-training/30 bg-training/[0.04]"
                      : "border-border bg-surface"
                  )}
                >
                  {/* Rank */}
                  <div
                    className="w-7 text-center text-base font-display font-black flex-shrink-0"
                    style={{ color: posColor }}
                  >
                    #{rank}
                  </div>

                  {/* Dog info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-text flex items-center gap-1.5">
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{entry.dogName}</span>
                      {isSelf && (
                        <span className="text-[10px] px-1.5 py-px rounded-md bg-training/15 text-training font-bold">
                          {T("lbYou")}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                      {entry.breed || ""}
                    </div>
                  </div>

                  {/* Streak */}
                  {entry.currentStreak > 0 && (
                    <div className="text-xs text-xp font-semibold flex items-center gap-0.5 flex-shrink-0">
                      <Flame size={14} color="#F59E0B" /> {entry.currentStreak}
                    </div>
                  )}

                  {/* XP */}
                  <div className="text-[15px] font-black text-training flex-shrink-0">
                    {(entry[xpKey] || 0).toLocaleString()}{" "}
                    <span className="text-[11px] font-semibold">XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
}
