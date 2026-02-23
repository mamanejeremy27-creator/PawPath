import { useApp } from "../context/AppContext.jsx";
import { hasPreviousMonthReport } from "../utils/monthlyStats.js";
import { CheckCircle2, Award, Trophy, ArrowRight, Users, Footprints, Heart } from "lucide-react";
import DailyPlan from "./DailyPlan.jsx";
import LifeStageBanner from "./LifeStageBanner.jsx";
import MemoryCard from "./MemoryCard.jsx";
import DogSwitcher from "./DogSwitcher.jsx";
import DogAvatar from "./DogAvatar.jsx";
import ChallengeBanner from "./ChallengeBanner.jsx";
import BottomNav from "./BottomNav.jsx";
import LanguageToggle from "./LanguageToggle.jsx";
import LostDogAlert from "./LostDogAlert.jsx";
import { MeshBackground } from "./ui/MeshBackground";
import { Card } from "./ui/Card";
import { StatHero } from "./ui/StatHero";
import { ProgressRing } from "./ui/ProgressRing";

export default function Home() {
  const {
    dogProfile, totalXP, playerLevel, xpProgress,
    completedExercises, earnedBadges, journal,
    nav, T, dogCount, activeDogId, streakData,
  } = useApp();
  const showReportBanner = hasPreviousMonthReport(journal);

  return (
    <div className="relative min-h-screen pb-24 bg-bg [animation:fadeIn_0.3s_ease]">
      <MeshBackground />

      <div className="relative z-10">
        <div className="grid grid-cols-2 gap-3 px-4 pt-5">

          {/* ── Header ── col-span-2 */}
          <div className="col-span-2 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <DogAvatar key={activeDogId} size="small" dogId={activeDogId} />
              <div>
                <p className="text-[13px] text-muted m-0">{T("welcomeBack")}</p>
                <h1 className="font-display text-3xl font-black m-0 mt-1 text-text leading-none">
                  {dogProfile?.name}
                </h1>
                <p className="text-[13px] text-muted m-0 mt-0.5">{dogProfile?.breed}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <Card className="p-3 text-center min-w-[60px]">
                <div className="text-xl font-black text-xp">{totalXP}</div>
                <div className="text-[10px] text-muted uppercase tracking-widest font-bold">{T("xp")}</div>
              </Card>
            </div>
          </div>

          {/* Dog switcher + alerts — full width */}
          {dogCount > 1 && <div className="col-span-2"><DogSwitcher /></div>}
          <div className="col-span-2"><LostDogAlert /></div>

          {/* ── ProgressRing ── col-span-1 */}
          <Card glow="training" className="col-span-1 flex flex-col items-center gap-2 py-4">
            <ProgressRing value={xpProgress} size={72} strokeWidth={6} color="#22C55E">
              <span className="text-lg font-black text-training">{playerLevel.level}</span>
            </ProgressRing>
            <div className="text-[11px] font-bold text-text-2 text-center leading-tight">
              {playerLevel.title}
            </div>
          </Card>

          {/* ── Streak ── col-span-1 */}
          <Card glow="xp" className="col-span-1">
            <button
              onClick={() => nav("streakView")}
              className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-transparent border-none cursor-pointer p-0"
            >
              <span
                className="text-2xl"
                style={{ animation: streakData?.current > 0 ? "pulse 2s infinite" : "none" }}
              >
                {streakData?.fire ?? "🔥"}
              </span>
              <StatHero
                value={streakData?.current ?? 0}
                label={T("dayStreak")}
                colorClass="text-xp"
              />
            </button>
          </Card>

          {/* ── Sessions done ── col-span-1 */}
          <Card className="col-span-1 flex flex-col items-center gap-2 py-4">
            <CheckCircle2 size={22} className="text-training" />
            <StatHero value={completedExercises.length} label={T("done")} />
          </Card>

          {/* ── Badges ── col-span-1 */}
          <Card glow="achieve" className="col-span-1 flex flex-col items-center gap-2 py-4">
            <Award size={22} className="text-xp" />
            <StatHero value={earnedBadges.length} label={T("badges")} colorClass="text-xp" />
          </Card>

          {/* ── Life stage banner ── col-span-2 */}
          <div className="col-span-2"><LifeStageBanner /></div>

          {/* ── Monthly report banner ── col-span-2 */}
          {showReportBanner && (
            <div className="col-span-2">
              <button
                onClick={() => nav("milestoneCards")}
                className="w-full px-5 py-4 rounded-3xl border border-training/20 bg-gradient-to-r from-training/[0.08] to-health/[0.08] flex items-center gap-3.5 text-text text-start cursor-pointer"
              >
                <Trophy size={28} className="text-training" />
                <div className="flex-1">
                  <div className="text-sm font-bold">{T("reportReady")}</div>
                  <div className="text-xs text-training font-semibold mt-0.5 flex items-center gap-1">
                    {T("viewReport")} <ArrowRight size={14} />
                  </div>
                </div>
              </button>
            </div>
          )}

          <div className="col-span-2"><MemoryCard /></div>

          {/* ── Daily Plan ── col-span-2 */}
          <div className="col-span-2"><DailyPlan /></div>

          {/* ── Challenge Banner ── col-span-2 */}
          <div className="col-span-2"><ChallengeBanner /></div>

          {/* ── Quick-access row ── col-span-2 */}
          <div className="col-span-2 grid grid-cols-3 gap-2.5 pb-2">
            <button
              onClick={() => nav("community")}
              className="p-3.5 bg-social/[0.06] border border-social/15 rounded-2xl text-text cursor-pointer text-center"
            >
              <div className="flex justify-center mb-1">
                <Users size={20} className="text-social" />
              </div>
              <div className="text-xs font-bold">{T("community")}</div>
            </button>
            <button
              onClick={() => nav("walkTracker")}
              className="p-3.5 bg-health/[0.06] border border-health/15 rounded-2xl text-text cursor-pointer text-center"
            >
              <div className="flex justify-center mb-1">
                <Footprints size={20} className="text-health" />
              </div>
              <div className="text-xs font-bold">{T("walkTracker")}</div>
            </button>
            <button
              onClick={() => nav("healthDashboard")}
              className="p-3.5 bg-danger/[0.06] border border-danger/15 rounded-2xl text-text cursor-pointer text-center"
            >
              <div className="flex justify-center mb-1">
                <Heart size={20} className="text-danger" />
              </div>
              <div className="text-xs font-bold">{T("healthDashboard")}</div>
            </button>
          </div>

        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
