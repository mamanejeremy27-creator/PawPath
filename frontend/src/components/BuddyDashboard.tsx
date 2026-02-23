import { useState, useEffect, useCallback } from "react";
import { Lock, AlertTriangle, Dog, PawPrint, Flame, Handshake, Hand, Dumbbell, PartyPopper } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { api } from "../lib/api.js";
import BottomNav from "./BottomNav.jsx";
import { Card } from "./ui/Card";
import { GlowBadge } from "./ui/GlowBadge";
import { cn } from "../lib/cn";

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
      <div className="min-h-screen bg-bg animate-[fadeIn_0.3s_ease]">
        <div className="p-5">
          <h1 className="font-display text-2xl font-extrabold mb-1 text-text">{T("trainingBuddy")}</h1>
        </div>
        <div className="text-center py-16 px-5 text-muted">
          <div className="mb-3 flex justify-center"><Lock size={40} className="text-muted" /></div>
          <div className="text-sm font-bold text-text">{T("lbSignIn")}</div>
        </div>
        <BottomNav active="community" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-5 flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl font-extrabold mb-1 text-text">{T("trainingBuddy")}</h1>
          <p className="text-[13px] text-muted m-0">{T("trainingBuddySub")}</p>
        </div>
        {activePairs.length < 3 && (
          <button
            onClick={() => nav("buddyFinder")}
            className="px-[18px] py-[10px] rounded-full bg-training text-black border-none font-extrabold text-[13px] cursor-pointer shadow-[0_4px_16px_rgba(34,197,94,0.25)]"
          >{T("findBuddy")}</button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-[3px] border-white/10 border-t-training rounded-full animate-spin mx-auto" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-16 px-5 text-muted">
          <div className="mb-2 flex justify-center"><AlertTriangle size={32} className="text-xp" /></div>
          <div className="text-sm font-semibold">{T("buddyUnavailable")}</div>
        </div>
      )}

      {!loading && !error && (
        <div className="px-5 pt-4">

          {/* Pending Incoming Requests */}
          {pendingIncoming.length > 0 && (
            <div className="mb-5">
              <h3 className="text-[14px] font-bold text-text mb-[10px] uppercase tracking-widest">{T("pendingRequests")}</h3>
              <div className="flex flex-col gap-[10px]">
                {pendingIncoming.map(p => (
                  <div key={p.id} className="px-[18px] py-4 bg-surface rounded-2xl border border-training/20 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-training/10 flex items-center justify-center shrink-0">
                      <Dog size={20} className="text-training" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-text">{p.user_a_name || T("buddyTrainer")}</div>
                      <div className="text-[11px] text-muted">{T("wantsToBeBuddy")}</div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleAccept(p.id)}
                        disabled={actionLoading === p.id}
                        className={cn("px-[14px] py-2 text-xs font-bold bg-training text-black border-none rounded-[20px] cursor-pointer", actionLoading === p.id && "opacity-50")}
                      >{T("accept")}</button>
                      <button
                        onClick={() => handleDecline(p.id)}
                        disabled={actionLoading === p.id}
                        className={cn("px-[14px] py-2 text-xs font-semibold bg-danger/10 text-danger border-none rounded-[20px] cursor-pointer", actionLoading === p.id && "opacity-50")}
                      >{T("decline")}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Buddies */}
          {activePairs.length > 0 && (
            <div className="mb-5">
              <h3 className="text-[14px] font-bold text-text mb-[10px] uppercase tracking-widest">{T("activeBuddies")}</h3>
              <div className="flex flex-col gap-3">
                {activePairs.map(p => {
                  const buddyId = getBuddyId(p);
                  const stats = buddyStats[buddyId];
                  const buddyName = getBuddyName(p);
                  const buddyStreak = stats?.current_streak || 0;
                  const buddyXP = stats?.total_xp || 0;
                  const lastActive = stats?.updated_at;
                  const isNudgeSent = nudgeSent.has(buddyId);

                  return (
                    <Card key={p.id} glow="social" className="p-5">
                      {/* Buddy header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-training/10 border-2 border-training flex items-center justify-center shrink-0">
                          <Dog size={20} className="text-training" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-bold text-text">{buddyName}</div>
                          <div className="text-xs text-muted">
                            {stats?.breed || ""}
                            {lastActive && ` · ${T("lastActive")} ${timeAgo(lastActive)}`}
                          </div>
                        </div>
                      </div>

                      {/* Streak comparison */}
                      <div className="flex gap-[10px] mb-4">
                        <div className="flex-1 text-center py-3 px-1.5 bg-training/[0.04] rounded-2xl border border-training/10">
                          <div className="text-[10px] text-muted uppercase tracking-widest font-semibold mb-1">{T("you")}</div>
                          <div className="text-[22px] font-extrabold text-training">{currentStreak}</div>
                          <div className="text-[10px] text-muted font-semibold flex items-center justify-center gap-[3px]">{T("dayStreak")} <Flame size={10} /></div>
                        </div>
                        <div className="flex items-center text-lg text-muted">vs</div>
                        <div className="flex-1 text-center py-3 px-1.5 bg-achieve/[0.04] rounded-2xl border border-achieve/10">
                          <div className="text-[10px] text-muted uppercase tracking-widest font-semibold mb-1">{T("buddy")}</div>
                          <div className="text-[22px] font-extrabold text-achieve">{buddyStreak}</div>
                          <div className="text-[10px] text-muted font-semibold flex items-center justify-center gap-[3px]">{T("dayStreak")} <Flame size={10} /></div>
                        </div>
                      </div>

                      {/* XP comparison */}
                      <div className="flex justify-around py-[10px] border-t border-border mb-3">
                        <div className="text-center">
                          <div className="text-sm font-extrabold text-text">{buddyXP}</div>
                          <div className="text-[10px] text-muted font-semibold">{T("buddyTotalXP")}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-extrabold text-text">{stats?.weekly_xp || 0}</div>
                          <div className="text-[10px] text-muted font-semibold">{T("buddyWeeklyXP")}</div>
                        </div>
                      </div>

                      {/* Nudge button */}
                      {nudgeOpen === buddyId ? (
                        <div className="flex flex-col gap-2">
                          <div className="text-xs font-bold text-muted uppercase tracking-widest">{T("pickNudge")}</div>
                          {NUDGE_PRESETS.map(n => (
                            <button
                              key={n.key}
                              onClick={() => handleNudge(buddyId, n.key)}
                              className="px-4 py-[10px] bg-training/[0.04] border border-border rounded-2xl text-text text-[13px] font-semibold cursor-pointer text-start flex items-center gap-2"
                            >
                              <n.icon size={14} /> {T(n.key)}
                            </button>
                          ))}
                          <button onClick={() => setNudgeOpen(null)} className="p-2 bg-transparent border-none text-muted text-xs cursor-pointer">
                            {T("back")}
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setNudgeOpen(buddyId)}
                            className={cn(
                              "flex-1 py-3 rounded-full border-none cursor-pointer text-sm font-bold text-center",
                              isNudgeSent ? "bg-training/10 text-training" : "bg-training text-black"
                            )}
                          >
                            {isNudgeSent
                              ? <span className="inline-flex items-center gap-1">{T("nudgeSent")} <span>&#10003;</span></span>
                              : <span className="inline-flex items-center gap-1">{T("sendNudge")} <Hand size={14} /></span>
                            }
                          </button>
                          <button
                            onClick={() => setConfirmEnd(p.id)}
                            className="px-4 py-3 rounded-full border border-border bg-transparent text-muted text-xs font-semibold cursor-pointer"
                          >
                            {T("endBuddy")}
                          </button>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pending Sent */}
          {pendingSent.length > 0 && (
            <div className="mb-5">
              <h3 className="text-[14px] font-bold text-text mb-[10px] uppercase tracking-widest">{T("sentRequests")}</h3>
              <div className="flex flex-col gap-2">
                {pendingSent.map(p => (
                  <div key={p.id} className="px-[18px] py-[14px] bg-surface rounded-2xl border border-border flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center shrink-0">
                      <PawPrint size={18} className="text-muted" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-text">{T("buddyRequestPending")}</div>
                      <div className="text-[11px] text-muted">{timeAgo(p.created_at)}</div>
                    </div>
                    <span className="text-[11px] text-muted font-semibold px-[10px] py-1 bg-border rounded-[20px]">{T("pending")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state — no buddies at all */}
          {activePairs.length === 0 && pendingIncoming.length === 0 && pendingSent.length === 0 && (
            <div className="text-center py-10 px-5">
              <div className="mb-4 flex justify-center"><Handshake size={56} className="text-training" /></div>
              <div className="text-lg font-bold text-text mb-2">{T("noBuddiesYet")}</div>
              <div className="text-[13px] text-muted mb-6 leading-relaxed">{T("noBuddiesYetSub")}</div>
              <button
                onClick={() => nav("buddyFinder")}
                className="px-8 py-[14px] rounded-full bg-training text-black border-none font-extrabold text-[15px] cursor-pointer shadow-[0_4px_20px_rgba(34,197,94,0.3)]"
              >{T("findBuddy")}</button>
            </div>
          )}
        </div>
      )}

      {/* Confirm end buddy modal */}
      {confirmEnd && (
        <div onClick={() => setConfirmEnd(null)} className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center">
          <div onClick={e => e.stopPropagation()} className="bg-surface rounded-3xl p-7 max-w-xs w-[90%] text-center">
            <div className="mb-3 flex justify-center"><Hand size={40} className="text-muted" /></div>
            <p className="text-[15px] text-text m-0 mb-5 leading-relaxed">{T("confirmEndBuddy")}</p>
            <div className="flex gap-[10px]">
              <button onClick={() => setConfirmEnd(null)} className="flex-1 py-3 text-sm font-semibold bg-transparent text-muted border border-border rounded-full cursor-pointer">
                {T("back")}
              </button>
              <button onClick={() => handleEnd(confirmEnd)} className="flex-1 py-3 text-sm font-bold bg-danger text-white border-none rounded-full cursor-pointer">
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
