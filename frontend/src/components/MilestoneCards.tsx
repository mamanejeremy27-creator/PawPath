import { useState, useMemo, useCallback } from "react";
import { useApp } from "../context/AppContext.jsx";
import { gatherMonthlyStats } from "../utils/monthlyStats.js";
import { generateMilestoneCard, shareCard, downloadCard } from "../utils/milestoneCardGenerator.js";
import BottomNav from "./BottomNav.jsx";
import { ChevronRight, Download, ArrowDown, Calendar } from "lucide-react";
import { cn } from "../lib/cn";

export default function MilestoneCards() {
  const { journal, completedExercises, totalXP, currentStreak, totalSessions, totalReviews, dogProfile, nav, T, rtl, lang } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [cardImage, setCardImage] = useState(null);
  const [sharing, setSharing] = useState(false);

  const monthlyData = useMemo(() =>
    gatherMonthlyStats({ journal, completedExercises, totalXP, currentStreak, totalSessions, totalReviews, lang }),
    [journal, completedExercises, totalXP, currentStreak, totalSessions, totalReviews, lang]
  );

  const labels = useMemo(() => ({
    sessionsThisMonth: T("sessionsThisMonth"),
    xpEarned: T("xpEarned"),
    exercisesLearned: T("exercisesLearned"),
    bestStreak: T("bestStreak"),
    reviewsDone: T("reviewsDone"),
    avgRating: "Avg",
    trainingReport: T("trainingReport"),
    monthlyProgress: T("monthlyProgress"),
  }), [T]);

  const handleSelectMonth = useCallback((month) => {
    setSelectedMonth(month);
    const image = generateMilestoneCard({
      monthLabel: month.label,
      dogName: dogProfile?.name,
      stats: {
        sessions: month.sessions,
        xp: month.xp,
        newExercises: month.newExercises.length,
        bestStreak: month.bestStreak,
        reviews: month.reviews,
        avgRating: month.avgRating,
      },
      labels,
    });
    setCardImage(image);
  }, [dogProfile, labels]);

  const handleShare = useCallback(async () => {
    if (!cardImage || !selectedMonth) return;
    setSharing(true);
    await shareCard(cardImage, selectedMonth.label);
    setSharing(false);
  }, [cardImage, selectedMonth]);

  const handleDownload = useCallback(() => {
    if (!cardImage || !selectedMonth) return;
    downloadCard(cardImage, selectedMonth.label);
  }, [cardImage, selectedMonth]);

  // Full card view
  if (selectedMonth && cardImage) {
    return (
      <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
        <div className="px-5 pt-6 pb-4">
          <button
            onClick={() => { setSelectedMonth(null); setCardImage(null); }}
            className="bg-transparent border-0 text-training text-sm font-semibold cursor-pointer p-0 mb-4 flex items-center gap-1.5"
          >
            <span className="text-base">{rtl ? "→" : "←"}</span> {T("milestoneCards")}
          </button>
          <h2 className="font-display text-2xl font-black m-0 text-text">{selectedMonth.label}</h2>
        </div>

        {/* Card preview */}
        <div className="px-5 mb-5">
          <div className="rounded-[20px] overflow-hidden border border-border shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
            <img src={cardImage} alt="Milestone card" className="w-full block" />
          </div>
        </div>

        {/* Stats summary */}
        <div className="px-5 mb-5">
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: selectedMonth.sessions, l: T("sessionsThisMonth"), i: "🎯" },
              { v: selectedMonth.xp, l: T("xpEarned"), i: "⚡" },
              { v: selectedMonth.newExercises.length, l: T("exercisesLearned"), i: "🌟" },
              { v: selectedMonth.bestStreak, l: T("bestStreak"), i: "🔥" },
              { v: selectedMonth.reviews, l: T("reviewsDone"), i: "🔄" },
              { v: selectedMonth.avgRating, l: "Avg ⭐", i: "⭐" },
            ].map((s, i) => (
              <div key={i} className="text-center py-3.5 px-1.5 bg-surface rounded-2xl border border-border">
                <div className="text-base mb-0.5">{s.i}</div>
                <div className="text-xl font-black text-text">{s.v}</div>
                <div className="text-[10px] text-muted font-semibold">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Share/Download buttons */}
        <div className="flex gap-2.5 px-5">
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex-1 py-4 text-[15px] font-bold bg-training text-black border-0 rounded-full cursor-pointer flex items-center justify-center gap-2"
          >
            {sharing ? "..." : <><Download size={18} className="rotate-180" /> {T("shareCard")}</>}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-4 text-[15px] font-bold bg-surface text-text border border-border rounded-full cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowDown size={18} /> {T("downloadCard")}
          </button>
        </div>

        <BottomNav active="dog" />
      </div>
    );
  }

  // Gallery view
  return (
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      <div className="px-5 pt-6 pb-4">
        <button
          onClick={() => nav("home")}
          className="bg-transparent border-0 text-training text-sm font-semibold cursor-pointer p-0 mb-4 flex items-center gap-1.5"
        >
          <span className="text-base">{rtl ? "→" : "←"}</span> {T("home")}
        </button>
        <h2 className="font-display text-[28px] font-black m-0 text-text">{T("milestoneCards")}</h2>
        <p className="text-sm text-muted mt-1">{T("monthlyProgress")}</p>
      </div>

      {monthlyData.length === 0 ? (
        <div className="text-center px-10 py-16 text-muted">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-[15px] leading-relaxed">{T("noReportsYet")}</p>
        </div>
      ) : (
        <div className="px-5 flex flex-col gap-3">
          {monthlyData.map((month: any) => (
            <button
              key={month.key}
              onClick={() => handleSelectMonth(month)}
              className="flex items-center gap-3.5 px-5 py-[18px] bg-surface rounded-3xl border border-border cursor-pointer text-text text-start w-full"
            >
              {/* Month icon */}
              <div className="w-[52px] h-[52px] rounded-2xl bg-training/[0.08] flex items-center justify-center text-2xl flex-shrink-0">
                <Calendar size={24} className="text-training" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-text">{month.label}</div>
                <div className="text-[13px] text-muted mt-1 flex gap-3 flex-wrap">
                  <span>🎯 {month.sessions} {T("sessionsThisMonth").toLowerCase()}</span>
                  <span>⚡ {month.xp} {T("xp")}</span>
                  <span>🌟 {month.newExercises.length}</span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight size={18} className="text-muted" />
            </button>
          ))}
        </div>
      )}

      <BottomNav active="profile" />
    </div>
  );
}
