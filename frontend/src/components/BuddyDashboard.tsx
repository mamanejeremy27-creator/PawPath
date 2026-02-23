import { useState, useEffect, useCallback } from "react";
import { Lock, AlertTriangle, Dog, PawPrint, Flame, Handshake, Hand, Dumbbell, PartyPopper } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { api } from "../lib/api.js";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", danger: "#EF4444", r: 16, rL: 24 };

const NUDGE_PRESETS = [
  { key: "nudgeTrain", icon: Dumbbell },
  { key: "nudgeStreak", icon: Flame },
  { key: "nudgeBoth", icon: Handshake },
  { key: "nudgeCheer", icon: PartyPopper },
];

export default function BuddyDashboard() {
  const { nav, T, isAuthenticated, currentStreak, dogProfile } = useApp();
  const { user } = useAuth();

  const [pairs, setPairs] = useState([]);
  const [buddyStats, setBuddyStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nudgeOpen, setNudgeOpen] = useState(null); // userId of buddy to nudge
  const [nudgeSent, setNudgeSent] = useState(new Set());
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmEnd, setConfirmEnd] = useState(null);

  const userId = user?.id;

  const loadPairs = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(false);

    try {
      const data = await api.getBuddies();
      const pairs = data.pairs || data || [];
      setPairs(pairs);
      if (data.stats) setBuddyStats(data.stats);
    } catch (err) {
      setError(true);
      setPairs([]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (isAuthenticated) loadPairs();
  }, [isAuthenticated, loadPairs]);

  const activePairs = pairs.filter(p => p.status === "active");
  const pendingIncoming = pairs.filter(p => p.status === "pending" && p.user_b === userId);
  const pendingSent = pairs.filter(p => p.status === "pending" && p.user_a === userId);

  const handleAccept = async (pairId) => {
    setActionLoading(pairId);
    try { await api.acceptBuddy(pairId); await loadPairs(); } catch {}
    setActionLoading(null);
  };

  const handleDecline = async (pairId) => {
    setActionLoading(pairId);
    try { await api.rejectBuddy(pairId); setPairs(prev => prev.filter(p => p.id !== pairId)); } catch {}
    setActionLoading(null);
  };

  const handleEnd = async (pairId) => {
    setActionLoading(pairId);
    try { await api.removeBuddy(pairId); setPairs(prev => prev.filter(p => p.id !== pairId)); } catch {}
    setActionLoading(null);
    setConfirmEnd(null);
  };

  const handleNudge = async (toUserId, messageKey) => {
    const message = T(messageKey);
    // Nudge is handled through buddy system; for now just show sent state
    setNudgeSent(prev => new Set([...prev, toUserId]));
    setTimeout(() => setNudgeSent(prev => { const next = new Set(prev); next.delete(toUserId); return next; }), 3000);
    setNudgeOpen(null);
  };

  const getBuddyId = (pair) => pair.user_a === userId ? pair.user_b : pair.user_a;
  const getBuddyName = (pair) => {
    const buddyId = getBuddyId(pair);
    const stats = buddyStats[buddyId];
    if (stats) return stats.dog_name || stats.owner_name || T("buddyTrainer");
    return pair.user_a === userId ? (pair.user_b_name || T("buddyTrainer")) : (pair.user_a_name || T("buddyTrainer"));
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}${T("feedMinAgo")}`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}${T("feedHrAgo")}`;
    return `${Math.floor(hrs / 24)}${T("feedDayAgo")}`;
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, animation: "fadeIn 0.3s ease" }}>
        <div style={{ padding: "20px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: C.t1 }}>{T("trainingBuddy")}</h1>
        </div>
        <div style={{ textAlign: "center", padding: "60px 20px", color: C.t3 }}>
          <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}><Lock size={40} color={C.t3} /></div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{T("lbSignIn")}</div>
        </div>
        <BottomNav active="community" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: C.t1 }}>{T("trainingBuddy")}</h1>
          <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{T("trainingBuddySub")}</p>
        </div>
        {activePairs.length < 3 && (
          <button
            onClick={() => nav("buddyFinder")}
            style={{
              padding: "10px 18px", borderRadius: 50,
              background: C.acc, color: "#000", border: "none",
              fontWeight: 800, fontSize: 13, cursor: "pointer",
              boxShadow: "0 4px 16px rgba(34,197,94,0.25)",
            }}
          >{T("findBuddy")}</button>
        )}
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
          <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}><AlertTriangle size={32} color="#F59E0B" /></div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{T("buddyUnavailable")}</div>
        </div>
      )}

      {!loading && !error && (
        <div style={{ padding: "16px 20px 0" }}>

          {/* Pending Incoming Requests */}
          {pendingIncoming.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.t1, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>{T("pendingRequests")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {pendingIncoming.map(p => (
                  <div key={p.id} style={{ padding: "16px 18px", background: C.s1, borderRadius: C.r, border: `1px solid rgba(34,197,94,0.2)`, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(34,197,94,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                      <Dog size={20} color="#22C55E" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{p.user_a_name || T("buddyTrainer")}</div>
                      <div style={{ fontSize: 11, color: C.t3 }}>{T("wantsToBeBuddy")}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => handleAccept(p.id)}
                        disabled={actionLoading === p.id}
                        style={{ padding: "8px 14px", fontSize: 12, fontWeight: 700, background: C.acc, color: "#000", border: "none", borderRadius: 20, cursor: "pointer", opacity: actionLoading === p.id ? 0.5 : 1 }}
                      >{T("accept")}</button>
                      <button
                        onClick={() => handleDecline(p.id)}
                        disabled={actionLoading === p.id}
                        style={{ padding: "8px 14px", fontSize: 12, fontWeight: 600, background: "rgba(239,68,68,0.08)", color: C.danger, border: "none", borderRadius: 20, cursor: "pointer", opacity: actionLoading === p.id ? 0.5 : 1 }}
                      >{T("decline")}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Buddies */}
          {activePairs.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.t1, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>{T("activeBuddies")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {activePairs.map(p => {
                  const buddyId = getBuddyId(p);
                  const stats = buddyStats[buddyId];
                  const buddyName = getBuddyName(p);
                  const buddyStreak = stats?.current_streak || 0;
                  const buddyXP = stats?.total_xp || 0;
                  const lastActive = stats?.updated_at;
                  const isNudgeSent = nudgeSent.has(buddyId);

                  return (
                    <div key={p.id} style={{ padding: "20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` }}>
                      {/* Buddy header */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(34,197,94,0.08)", border: `2px solid ${C.acc}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                          <Dog size={20} color="#22C55E" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{buddyName}</div>
                          <div style={{ fontSize: 12, color: C.t3 }}>
                            {stats?.breed || ""}
                            {lastActive && ` · ${T("lastActive")} ${timeAgo(lastActive)}`}
                          </div>
                        </div>
                      </div>

                      {/* Streak comparison */}
                      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "12px 6px", background: "rgba(34,197,94,0.04)", borderRadius: C.r, border: `1px solid rgba(34,197,94,0.1)` }}>
                          <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>{T("you")}</div>
                          <div style={{ fontSize: 22, fontWeight: 800, color: C.acc }}>{currentStreak}</div>
                          <div style={{ fontSize: 10, color: C.t3, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>{T("dayStreak")} <Flame size={10} /></div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", fontSize: 18, color: C.t3 }}>vs</div>
                        <div style={{ flex: 1, textAlign: "center", padding: "12px 6px", background: "rgba(139,92,246,0.04)", borderRadius: C.r, border: `1px solid rgba(139,92,246,0.1)` }}>
                          <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>{T("buddy")}</div>
                          <div style={{ fontSize: 22, fontWeight: 800, color: "#8B5CF6" }}>{buddyStreak}</div>
                          <div style={{ fontSize: 10, color: C.t3, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>{T("dayStreak")} <Flame size={10} /></div>
                        </div>
                      </div>

                      {/* XP comparison */}
                      <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: `1px solid ${C.b1}`, marginBottom: 12 }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: C.t1 }}>{buddyXP}</div>
                          <div style={{ fontSize: 10, color: C.t3, fontWeight: 600 }}>{T("buddyTotalXP")}</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: C.t1 }}>{stats?.weekly_xp || 0}</div>
                          <div style={{ fontSize: 10, color: C.t3, fontWeight: 600 }}>{T("buddyWeeklyXP")}</div>
                        </div>
                      </div>

                      {/* Nudge button */}
                      {nudgeOpen === buddyId ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1 }}>{T("pickNudge")}</div>
                          {NUDGE_PRESETS.map(n => (
                            <button
                              key={n.key}
                              onClick={() => handleNudge(buddyId, n.key)}
                              style={{ padding: "10px 16px", background: "rgba(34,197,94,0.04)", border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "start", display: "flex", alignItems: "center", gap: 8 }}
                            >
                              <n.icon size={14} /> {T(n.key)}
                            </button>
                          ))}
                          <button onClick={() => setNudgeOpen(null)} style={{ padding: "8px", background: "none", border: "none", color: C.t3, fontSize: 12, cursor: "pointer" }}>
                            {T("back")}
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => setNudgeOpen(buddyId)}
                            style={{
                              flex: 1, padding: "12px", borderRadius: 50, border: "none", cursor: "pointer",
                              background: isNudgeSent ? "rgba(34,197,94,0.08)" : C.acc,
                              color: isNudgeSent ? C.acc : "#000",
                              fontSize: 14, fontWeight: 700, textAlign: "center",
                            }}
                          >
                            {isNudgeSent ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{T("nudgeSent")} <span>&#10003;</span></span> : <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{T("sendNudge")} <Hand size={14} /></span>}
                          </button>
                          <button
                            onClick={() => setConfirmEnd(p.id)}
                            style={{ padding: "12px 16px", borderRadius: 50, border: `1px solid ${C.b1}`, background: "transparent", color: C.t3, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                          >
                            {T("endBuddy")}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pending Sent */}
          {pendingSent.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.t1, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>{T("sentRequests")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {pendingSent.map(p => (
                  <div key={p.id} style={{ padding: "14px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}`, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.b1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      <PawPrint size={18} color={C.t3} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{T("buddyRequestPending")}</div>
                      <div style={{ fontSize: 11, color: C.t3 }}>{timeAgo(p.created_at)}</div>
                    </div>
                    <span style={{ fontSize: 11, color: C.t3, fontWeight: 600, padding: "4px 10px", background: C.b1, borderRadius: 20 }}>{T("pending")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state — no buddies at all */}
          {activePairs.length === 0 && pendingIncoming.length === 0 && pendingSent.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><Handshake size={56} color={C.acc} /></div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 }}>{T("noBuddiesYet")}</div>
              <div style={{ fontSize: 13, color: C.t3, marginBottom: 24, lineHeight: 1.6 }}>{T("noBuddiesYetSub")}</div>
              <button
                onClick={() => nav("buddyFinder")}
                style={{
                  padding: "14px 32px", borderRadius: 50,
                  background: C.acc, color: "#000", border: "none",
                  fontWeight: 800, fontSize: 15, cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
                }}
              >{T("findBuddy")}</button>
            </div>
          )}
        </div>
      )}

      {/* Confirm end buddy modal */}
      {confirmEnd && (
        <div onClick={() => setConfirmEnd(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.s1, borderRadius: 24, padding: "28px 24px", maxWidth: 320, width: "90%", textAlign: "center" }}>
            <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}><Hand size={40} color={C.t3} /></div>
            <p style={{ fontSize: 15, color: C.t1, margin: "0 0 20px", lineHeight: 1.6 }}>{T("confirmEndBuddy")}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmEnd(null)} style={{ flex: 1, padding: "12px", fontSize: 14, fontWeight: 600, background: "transparent", color: C.t3, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>
                {T("back")}
              </button>
              <button onClick={() => handleEnd(confirmEnd)} style={{ flex: 1, padding: "12px", fontSize: 14, fontWeight: 700, background: C.danger, color: "#fff", border: "none", borderRadius: 50, cursor: "pointer" }}>
                {T("endBuddy")}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="community" />
    </div>
  );
}
