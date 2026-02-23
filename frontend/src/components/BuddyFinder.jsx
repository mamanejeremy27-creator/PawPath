import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import { ArrowLeft, AlertTriangle, PawPrint } from "lucide-react";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };

export default function BuddyFinder() {
  const { dogProfile, nav, T, isAuthenticated } = useApp();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sentIds, setSentIds] = useState(new Set());
  const [sending, setSending] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    async function load() {
      try {
        const data = await api.getBuddyCandidates();
        if (cancelled) return;
        setCandidates(data || []);
      } catch {
        if (cancelled) return;
        setError(true);
        setCandidates([]);
      }
      setLoading(false);
    }

    if (isAuthenticated) load();
    else { setLoading(false); setError(true); }

    return () => { cancelled = true; };
  }, [dogProfile, isAuthenticated]);

  const handleSendRequest = async (candidate) => {
    setSending(candidate.userId);
    try {
      await api.sendBuddyRequest(candidate.userId);
      setSentIds(prev => new Set([...prev, candidate.userId]));
    } catch { /* silent */ }
    setSending(null);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#22C55E";
    if (score >= 40) return "#F59E0B";
    return "#71717A";
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return T("buddyGreatMatch");
    if (score >= 40) return T("buddyGoodMatch");
    return T("buddyMatch");
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => nav("buddyDashboard")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.t3, padding: 4 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: C.t1 }}>{T("findBuddy")}</h1>
          <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{T("findBuddySub")}</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: C.t3 }}>
          <AlertTriangle size={32} color={C.t3} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 14, fontWeight: 600 }}>{T("buddyUnavailable")}</div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && candidates.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <PawPrint size={48} color={C.t3} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{T("noBuddiesFound")}</div>
          <div style={{ fontSize: 13, color: C.t3, marginTop: 6 }}>{T("noBuddiesFoundSub")}</div>
        </div>
      )}

      {/* Candidate Cards */}
      {!loading && candidates.length > 0 && (
        <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
          {candidates.map(c => {
            const isSent = sentIds.has(c.userId);
            const isSending = sending === c.userId;
            return (
              <div key={c.userId} style={{ padding: "18px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` }}>
                {/* Top row: dog info + score */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(34,197,94,0.08)", border: `2px solid ${getScoreColor(c.score)}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                    {"\uD83D\uDC36"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.dogName}
                    </div>
                    <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>
                      {c.breed || T("buddyMixedBreed")}
                      {c.ownerName ? ` · ${c.ownerName}` : ""}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: getScoreColor(c.score) }}>{c.score}%</div>
                    <div style={{ fontSize: 10, color: getScoreColor(c.score), fontWeight: 600 }}>{getScoreLabel(c.score)}</div>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: 12, marginTop: 14, padding: "10px 0", borderTop: `1px solid ${C.b1}` }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.t1 }}>{c.currentStreak}</div>
                    <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("streak")}</div>
                  </div>
                  <div style={{ width: 1, background: C.b1 }} />
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.t1 }}>{c.totalXP}</div>
                    <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("xp")}</div>
                  </div>
                  <div style={{ width: 1, background: C.b1 }} />
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.t1 }}>{c.weeklyXP}</div>
                    <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("lbWeekly")}</div>
                  </div>
                </div>

                {/* Send Request button */}
                <button
                  onClick={() => !isSent && !isSending && handleSendRequest(c)}
                  disabled={isSent || isSending}
                  style={{
                    width: "100%", marginTop: 12, padding: "12px",
                    borderRadius: 50, border: "none", cursor: isSent ? "default" : "pointer",
                    background: isSent ? "rgba(34,197,94,0.08)" : C.acc,
                    color: isSent ? C.acc : "#000",
                    fontSize: 14, fontWeight: 700, textAlign: "center",
                    opacity: isSending ? 0.6 : 1,
                  }}
                >
                  {isSending ? (
                    <div style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
                  ) : isSent ? (
                    `${T("buddyRequestSent")} \u2713`
                  ) : (
                    T("sendBuddyRequest")
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav active="community" />
    </div>
  );
}
