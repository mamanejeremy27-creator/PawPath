import { useApp } from "../context/AppContext.jsx";
import { hasPreviousMonthReport } from "../utils/monthlyStats.js";
import { Users, Footprints, Heart, ArrowRight, Trophy } from "lucide-react";
import DailyPlan from "./DailyPlan.jsx";
import LifeStageBanner from "./LifeStageBanner.jsx";
import MemoryCard from "./MemoryCard.jsx";
import DogSwitcher from "./DogSwitcher.jsx";
import DogAvatar from "./DogAvatar.jsx";
import ChallengeBanner from "./ChallengeBanner.jsx";
import BottomNav from "./BottomNav.jsx";
import LanguageToggle from "./LanguageToggle.jsx";
import LostDogAlert from "./LostDogAlert.jsx";
import { ProgressRing } from "./ui/ProgressRing";

export default function Today() {
  const {
    dogProfile, totalXP, playerLevel, xpProgress,
    completedExercises, earnedBadges, journal,
    nav, T, dogCount, activeDogId, streakData,
  } = useApp();

  const showReportBanner = hasPreviousMonthReport(journal);

  return (
    <div className="relative min-h-screen pb-32 bg-bg [animation:fadeIn_0.3s_ease]">
      <div className="relative z-10 px-4 pt-5 flex flex-col gap-3">

        {/* ── Header ── */}
        <div className="flex justify-between items-center bg-surface brut-border brut-shadow p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <DogAvatar key={activeDogId} size="small" dogId={activeDogId} />
            <div>
              <p className="text-[11px] font-black text-black uppercase tracking-widest bg-yellow-200 inline-block px-1">
                {T("welcomeBack")}
              </p>
              <h1 className="font-display text-2xl font-black text-black leading-none mt-0.5">
                {dogProfile?.name}
              </h1>
              <p className="text-[12px] font-bold text-muted">{dogProfile?.breed}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <LanguageToggle />
            <div className="bg-xp brut-border-sm px-2.5 py-1 rounded-xl text-center rotate-2 hover:rotate-0 transition-transform cursor-default">
              <div className="text-lg font-black text-black">{totalXP}</div>
              <div className="text-[9px] text-black uppercase tracking-widest font-black">{T("xp")}</div>
            </div>
          </div>
        </div>

        {/* ── Quick stats bar ── */}
        <div className="flex gap-2">
          {/* Streak */}
          <button
            onClick={() => nav("streakView")}
            className="flex-1 bg-xp brut-border-sm brut-shadow-sm rounded-xl p-3 flex flex-col items-center gap-1 cursor-pointer rotate-[-1deg] hover:rotate-1 transition-transform"
          >
            <span className="text-xl">{streakData?.fire ?? "🔥"}</span>
            <span className="text-sm font-black text-black">{streakData?.current ?? 0}</span>
            <span className="text-[9px] font-black text-black uppercase tracking-wide">{T("dayStreak")}</span>
          </button>

          {/* Level */}
          <div className="flex-1 bg-surface brut-border-sm brut-shadow-sm rounded-xl p-3 flex flex-col items-center gap-1">
            <ProgressRing value={xpProgress} size={32} strokeWidth={4} color="#000000">
              <span className="text-[10px] font-black text-black">{playerLevel.level}</span>
            </ProgressRing>
            <span className="text-[9px] font-black text-black uppercase tracking-wide leading-tight text-center mt-0.5">
              {playerLevel.title}
            </span>
          </div>

          {/* Sessions */}
          <div className="flex-1 bg-training brut-border-sm brut-shadow-sm rounded-xl p-3 flex flex-col items-center gap-1">
            <span className="text-xl">✅</span>
            <span className="text-sm font-black text-black">{completedExercises.length}</span>
            <span className="text-[9px] font-black text-black uppercase tracking-wide">{T("done")}</span>
          </div>

          {/* Badges */}
          <div className="flex-1 bg-achieve brut-border-sm brut-shadow-sm rounded-xl p-3 flex flex-col items-center gap-1">
            <span className="text-xl">🏆</span>
            <span className="text-sm font-black text-black">{earnedBadges.length}</span>
            <span className="text-[9px] font-black text-black uppercase tracking-wide">{T("badges")}</span>
          </div>
        </div>

        {/* ── Daily Plan ── (most prominent, first content section) */}
        <DailyPlan />

        {/* ── Challenge Banner ── */}
        <ChallengeBanner />

        {/* ── Life Stage Banner ── (always show) */}
        <LifeStageBanner />

        {/* ── Memory Card ── */}
        <MemoryCard />

        {/* ── Monthly report banner ── (conditional) */}
        {showReportBanner && (
          <button
            onClick={() => nav("milestoneCards")}
            className="w-full px-5 py-4 rounded-2xl brut-border brut-shadow bg-social flex items-center gap-4 text-black text-start cursor-pointer hover:translate-y-1 transition-transform"
          >
            <div className="bg-white p-3 rounded-full brut-border-sm">
              <Trophy size={28} className="text-black" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <div className="text-base font-black uppercase">{T("reportReady")}</div>
              <div className="text-sm font-bold mt-0.5 flex items-center gap-1">
                {T("viewReport")} <ArrowRight size={14} strokeWidth={3} />
              </div>
            </div>
          </button>
        )}

        {/* ── Dog Switcher ── (only if multiple dogs) */}
        {dogCount > 1 && <DogSwitcher />}

        {/* ── Lost Dog Alert ── (handles its own visibility) */}
        <LostDogAlert />

        {/* ── Quick-access row ── */}
        <div className="grid grid-cols-3 gap-3 pb-4">
          <button
            onClick={() => nav("community")}
            className="p-4 bg-social brut-border brut-shadow rounded-2xl text-black cursor-pointer text-center hover:-translate-y-1 transition-transform"
          >
            <div className="flex justify-center mb-2">
              <div className="bg-white p-2 rounded-full brut-border-sm">
                <Users size={22} strokeWidth={2.5} className="text-black" />
              </div>
            </div>
            <div className="text-[11px] font-black uppercase">{T("community")}</div>
          </button>
          <button
            onClick={() => nav("walkTracker")}
            className="p-4 bg-training brut-border brut-shadow rounded-2xl text-black cursor-pointer text-center hover:-translate-y-1 transition-transform"
          >
            <div className="flex justify-center mb-2">
              <div className="bg-white p-2 rounded-full brut-border-sm">
                <Footprints size={22} strokeWidth={2.5} className="text-black" />
              </div>
            </div>
            <div className="text-[11px] font-black uppercase">{T("walkTracker")}</div>
          </button>
          <button
            onClick={() => nav("healthDashboard")}
            className="p-4 bg-health brut-border brut-shadow rounded-2xl text-black cursor-pointer text-center hover:-translate-y-1 transition-transform"
          >
            <div className="flex justify-center mb-2">
              <div className="bg-white p-2 rounded-full brut-border-sm">
                <Heart size={22} strokeWidth={2.5} className="text-black" />
              </div>
            </div>
            <div className="text-[11px] font-black uppercase">{T("healthDashboard")}</div>
          </button>
        </div>

      </div>

      <BottomNav active="today" />
    </div>
  );
}
