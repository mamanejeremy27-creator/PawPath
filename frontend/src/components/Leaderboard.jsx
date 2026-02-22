import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { api } from "../lib/api.js";
import BottomNav from "./BottomNav.jsx";
import { Trophy, Flame, Lock, ArrowLeft, AlertTriangle } from "lucide-react";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", r: 16 };

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export default function Leaderboard() {
  const { nav, T, dogProfile, appSettings, setAppSettings, isAuthenticated, activeDogId, getDogBackendId } = useApp();
  const { user } = useAuth();

  const [tab, setTab] = useState("weekly");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userEntry, setUserEntry] = useState(null);

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
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "40px 20px 0" }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.t3, fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
          <ArrowLeft size={16} /> {T("back")}
        </button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: C.t1, margin: 0 }}>{T("leaderboard")}</h1>
        <p style={{ fontSize: 14, color: C.t3, margin: "4px 0 0" }}>{T("leaderboardSubtitle")}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, padding: "20px 20px 0" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 700, borderRadius: 50, border: "none", cursor: "pointer", background: tab === t.id ? C.acc : C.s1, color: tab === t.id ? "#000" : C.t3, transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Opt-in toggle */}
      {isAuthenticated && (
        <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: optIn ? C.acc : C.t3, fontWeight: 600 }}>
            {optIn ? T("lbOptIn") : T("lbOptOut")}
          </span>
          <button onClick={handleOptInToggle}
            style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: optIn ? C.acc : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.2s" }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 3, left: optIn ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
          </button>
        </div>
      )}

      {/* Subtitle */}
      <div style={{ padding: "12px 20px 0" }}>
        <p style={{ fontSize: 12, color: C.t3, margin: 0 }}>{subtitle}</p>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px 0" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ marginBottom: 12 }}><AlertTriangle size={40} color="#F59E0B" /></div>
            <p style={{ fontSize: 15, color: C.t3 }}>{T("lbUnavailable")}</p>
          </div>
        ) : !isAuthenticated ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ marginBottom: 12 }}><Lock size={40} color={C.t3} /></div>
            <p style={{ fontSize: 15, color: C.t3 }}>{T("lbSignIn")}</p>
          </div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ marginBottom: 12 }}><Trophy size={40} color="#FFD700" /></div>
            <p style={{ fontSize: 15, color: C.t1, fontWeight: 700 }}>{T("lbEmpty")}</p>
            <p style={{ fontSize: 13, color: C.t3, marginTop: 4 }}>{T("lbEmptySub")}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {entries.map((entry, i) => {
              const rank = i + 1;
              const isSelf = isCurrentUser(entry);
              const posColor = rank <= 3 ? MEDAL_COLORS[rank - 1] : C.t3;
              return (
                <div key={entry.id} style={{
                  padding: "14px 16px", borderRadius: C.r,
                  border: isSelf ? "1px solid rgba(34,197,94,0.3)" : `1px solid ${C.b1}`,
                  background: isSelf ? "rgba(34,197,94,0.04)" : C.s1,
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  {/* Rank */}
                  <div style={{ width: 28, textAlign: "center", fontSize: 16, fontWeight: 800, color: posColor, flexShrink: 0 }}>
                    #{rank}
                  </div>

                  {/* Dog info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.dogName}</span>
                      {isSelf && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 6, background: "rgba(34,197,94,0.15)", color: C.acc, fontWeight: 700 }}>{T("lbYou")}</span>}
                    </div>
                    <div style={{ fontSize: 11, color: C.t3, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {entry.breed || ""}
                    </div>
                  </div>

                  {/* Streak */}
                  {entry.currentStreak > 0 && (
                    <div style={{ fontSize: 12, color: "#F59E0B", fontWeight: 600, display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                      <Flame size={14} color="#F59E0B" /> {entry.currentStreak}
                    </div>
                  )}

                  {/* XP */}
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.acc, flexShrink: 0 }}>
                    {(entry[xpKey] || 0).toLocaleString()} <span style={{ fontSize: 11, fontWeight: 600 }}>XP</span>
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
