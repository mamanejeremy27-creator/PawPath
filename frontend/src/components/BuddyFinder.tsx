import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import { ArrowLeft, AlertTriangle, PawPrint } from "lucide-react";
import BottomNav from "./BottomNav.jsx";
import { Card } from "./ui/Card";
import { GlowBadge } from "./ui/GlowBadge";
import { cn } from "../lib/cn";

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
    if (score >= 70) return "text-training";
    if (score >= 40) return "text-xp";
    return "text-muted";
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return T("buddyGreatMatch");
    if (score >= 40) return T("buddyGoodMatch");
    return T("buddyMatch");
  };

  return (
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-5 flex items-center gap-3">
        <button onClick={() => nav("buddyDashboard")} className="bg-transparent border-none cursor-pointer text-muted p-1">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-extrabold mb-1 text-text">{T("findBuddy")}</h1>
          <p className="text-[13px] text-muted m-0">{T("findBuddySub")}</p>
        </div>
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
          <AlertTriangle size={32} className="text-muted mb-2 mx-auto" />
          <div className="text-sm font-semibold">{T("buddyUnavailable")}</div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && candidates.length === 0 && (
        <div className="text-center py-16 px-5">
          <PawPrint size={48} className="text-muted mb-3 mx-auto" />
          <div className="text-base font-bold text-text">{T("noBuddiesFound")}</div>
          <div className="text-[13px] text-muted mt-1.5">{T("noBuddiesFoundSub")}</div>
        </div>
      )}

      {/* Candidate Cards */}
      {!loading && candidates.length > 0 && (
        <div className="px-5 pt-4 flex flex-col gap-3">
          {candidates.map(c => {
            const isSent = sentIds.has(c.userId);
            const isSending = sending === c.userId;
            return (
              <Card key={c.userId} glow="social" className="px-5 py-[18px]">
                {/* Top row: dog info + score */}
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-full bg-training/10 flex items-center justify-center text-2xl shrink-0 border-2",
                    c.score >= 70 ? "border-training" : c.score >= 40 ? "border-xp" : "border-muted"
                  )}>
                    {"\uD83D\uDC36"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-text overflow-hidden text-ellipsis whitespace-nowrap">
                      {c.dogName}
                    </div>
                    <div className="text-xs text-muted mt-0.5">
                      {c.breed || T("buddyMixedBreed")}
                      {c.ownerName ? ` · ${c.ownerName}` : ""}
                    </div>
                  </div>
                  <div className="text-center shrink-0">
                    <div className={cn("text-[20px] font-extrabold", getScoreColor(c.score))}>{c.score}%</div>
                    <div className={cn("text-[10px] font-semibold", getScoreColor(c.score))}>{getScoreLabel(c.score)}</div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex gap-3 mt-[14px] py-[10px] border-t border-border">
                  <div className="flex-1 text-center">
                    <div className="text-base font-extrabold text-text">{c.currentStreak}</div>
                    <div className="text-[10px] text-muted uppercase tracking-widest font-semibold">{T("streak")}</div>
                  </div>
                  <div className="w-px bg-border" />
                  <div className="flex-1 text-center">
                    <div className="text-base font-extrabold text-text">{c.totalXP}</div>
                    <div className="text-[10px] text-muted uppercase tracking-widest font-semibold">{T("xp")}</div>
                  </div>
                  <div className="w-px bg-border" />
                  <div className="flex-1 text-center">
                    <div className="text-base font-extrabold text-text">{c.weeklyXP}</div>
                    <div className="text-[10px] text-muted uppercase tracking-widest font-semibold">{T("lbWeekly")}</div>
                  </div>
                </div>

                {/* Send Request button */}
                <button
                  onClick={() => !isSent && !isSending && handleSendRequest(c)}
                  disabled={isSent || isSending}
                  className={cn(
                    "w-full mt-3 py-3 rounded-full border-none text-sm font-bold text-center transition-opacity",
                    isSent ? "bg-training/10 text-training cursor-default" : "bg-training text-black cursor-pointer",
                    isSending && "opacity-60"
                  )}
                >
                  {isSending ? (
                    <div className="w-[18px] h-[18px] border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto" />
                  ) : isSent ? (
                    `${T("buddyRequestSent")} \u2713`
                  ) : (
                    T("sendBuddyRequest")
                  )}
                </button>
              </Card>
            );
          })}
        </div>
      )}

      <BottomNav active="community" />
    </div>
  );
}
