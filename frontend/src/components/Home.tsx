import { useApp } from "../context/AppContext.jsx";
import { hasPreviousMonthReport } from "../utils/monthlyStats.js";
import { CheckCircle2, Award, Trophy, ArrowRight, Users, Footprints, Heart, Sparkles } from "lucide-react";
import DailyPlan from "./DailyPlan.jsx";
import LifeStageBanner from "./LifeStageBanner.jsx";
import MemoryCard from "./MemoryCard.jsx";
import DogSwitcher from "./DogSwitcher.jsx";
import DogAvatar from "./DogAvatar.jsx";
import ChallengeBanner from "./ChallengeBanner.jsx";
import BottomNav from "./BottomNav.jsx";
import LanguageToggle from "./LanguageToggle.jsx";
import LostDogAlert from "./LostDogAlert.jsx";
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
    <div className="relative min-h-screen pb-32 bg-bg [animation:fadeIn_0.3s_ease]">
      {/* Playful Floating Elements for Background */}
      <div className="absolute top-10 left-4 w-8 h-8 rounded-full bg-xp brut-border-sm brut-shadow-sm rotate-12" />
      <div className="absolute top-40 right-8 w-6 h-6 rounded-sm bg-training brut-border-sm brut-shadow-sm -rotate-12" />
      <div className="absolute top-80 left-8 w-10 h-10 rounded-full bg-achieve brut-border-sm brut-shadow-sm rotate-45" />

      <div className="relative z-10">
        <div className="grid grid-cols-2 gap-4 px-4 pt-6">

          {/* ── Header ── col-span-2 */}
          <div className="col-span-2 flex justify-between items-center bg-white brut-border brut-shadow p-3 rounded-2xl mb-2">
            <div className="flex items-center gap-3">
              <div className="rotate-3"><DogAvatar key={activeDogId} size="small" dogId={activeDogId} /></div>
              <div>
                <p className="text-[12px] font-bold text-black uppercase tracking-widest m-0 bg-yellow-200 inline-block px-1 -rotate-2">{T("welcomeBack")}</p>
                <h1 className="font-display text-3xl font-black m-0 mt-1 text-black leading-none drop-shadow-[2px_2px_0_rgba(0,0,0,0.15)]">
                  {dogProfile?.name}
                </h1>
                <p className="text-[13px] font-bold text-muted m-0 mt-0.5">{dogProfile?.breed}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <LanguageToggle />
              <div className="bg-xp brut-border-sm px-3 py-1 rounded-xl text-center rotate-2 hover:rotate-0 transition-transform cursor-pointer">
                <div className="text-xl font-black text-black">{totalXP}</div>
                <div className="text-[10px] text-black uppercase tracking-widest font-black">{T("xp")}</div>
              </div>
            </div>
          </div>

          {/* Dog switcher + alerts — full width */}
          {dogCount > 1 && <div className="col-span-2"><DogSwitcher /></div>}
          <div className="col-span-2"><LostDogAlert /></div>

          {/* ── ProgressRing ── col-span-1 */}
          <Card glow="training" className="col-span-1 flex flex-col items-center justify-center gap-2 py-6 rotate-[-1deg] hover:rotate-1">
            <ProgressRing value={xpProgress} size={84} strokeWidth={8} color="#000000">
              <span className="text-2xl font-black text-black">{playerLevel.level}</span>
            </ProgressRing>
            <div className="text-[12px] font-black text-black text-center leading-tight bg-white px-2 py-1 rounded-sm brut-border-sm mt-1">
              {playerLevel.title}
            </div>
          </Card>

          {/* ── Streak ── col-span-1 */}
          <Card glow="xp" className="col-span-1 rotate-[2deg] hover:rotate-[-1deg]">
            <button
              onClick={() => nav("streakView")}
              className="w-full h-full flex flex-col items-center justify-center gap-2 bg-transparent border-none cursor-pointer p-0"
            >
              <div className="bg-white rounded-full p-2 brut-border-sm">
                <span
                  className="text-4xl block"
                  style={{ animation: streakData?.current > 0 ? "pulse 2s infinite" : "none" }}
                >
                  {streakData?.fire ?? "🔥"}
                </span>
              </div>
              <StatHero
                value={streakData?.current ?? 0}
                label={T("dayStreak")}
                colorClass="text-black"
              />
            </button>
          </Card>

          {/* ── Sessions done ── col-span-1 */}
          <Card className="col-span-1 flex flex-col items-center gap-2 py-5 bg-health rotate-[-1deg] hover:rotate-1">
            <div className="bg-white p-2 rounded-full brut-border-sm">
              <CheckCircle2 size={28} className="text-black" strokeWidth={3} />
            </div>
            <StatHero value={completedExercises.length} label={T("done")} />
          </Card>

          {/* ── Badges ── col-span-1 */}
          <Card glow="achieve" className="col-span-1 flex flex-col items-center gap-2 py-5 rotate-[1deg] hover:rotate-[-1deg]">
            <div className="bg-white p-2 rounded-full brut-border-sm">
              <Award size={28} className="text-black" strokeWidth={3} />
            </div>
            <StatHero value={earnedBadges.length} label={T("badges")} colorClass="text-black" />
          </Card>

          {/* ── Life stage banner ── col-span-2 */}
          <div className="col-span-2 mt-2"><LifeStageBanner /></div>

          {/* ── Monthly report banner ── col-span-2 */}
          {showReportBanner && (
            <div className="col-span-2">
              <button
                onClick={() => nav("milestoneCards")}
                className="w-full px-5 py-4 rounded-2xl brut-border brut-shadow bg-social flex items-center gap-4 text-black text-start cursor-pointer hover:translate-y-1 transition-transform"
              >
                <div className="bg-white p-3 rounded-full brut-border-sm">
                  <Trophy size={32} className="text-black" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-black uppercase">{T("reportReady")}</div>
                  <div className="text-sm font-bold mt-0.5 flex items-center gap-1 bg-white/50 inline-flex px-2 py-0.5 rounded-md brut-border-sm">
                    {T("viewReport")} <ArrowRight size={16} strokeWidth={3} />
                  </div>
                </div>
              </button>
            </div>
          )}

          <div className="col-span-2 mt-2"><MemoryCard /></div>

          {/* ── Daily Plan ── col-span-2 */}
          <div className="col-span-2 mt-2"><DailyPlan /></div>

          {/* ── Challenge Banner ── col-span-2 */}
          <div className="col-span-2 mt-2"><ChallengeBanner /></div>

          {/* ── Quick-access row ── col-span-2 */}
          <div className="col-span-2 grid grid-cols-3 gap-3 pb-4 mt-2">
            <button
              onClick={() => nav("community")}
              className="p-4 bg-social brut-border brut-shadow rounded-2xl text-black cursor-pointer text-center hover:-translate-y-1 transition-transform"
            >
              <div className="flex justify-center mb-2">
                <div className="bg-white p-2 rounded-full brut-border-sm rotate-6">
                  <Users size={24} strokeWidth={2.5} className="text-black" />
                </div>
              </div>
              <div className="text-[11px] font-black uppercase">{T("community")}</div>
            </button>
            <button
              onClick={() => nav("walkTracker")}
              className="p-4 bg-training brut-border brut-shadow rounded-2xl text-black cursor-pointer text-center hover:-translate-y-1 transition-transform"
            >
              <div className="flex justify-center mb-2">
                <div className="bg-white p-2 rounded-full brut-border-sm -rotate-6">
                  <Footprints size={24} strokeWidth={2.5} className="text-black" />
                </div>
              </div>
              <div className="text-[11px] font-black uppercase">{T("walkTracker")}</div>
            </button>
            <button
              onClick={() => nav("healthDashboard")}
              className="p-4 bg-danger brut-border brut-shadow rounded-2xl text-black cursor-pointer text-center hover:-translate-y-1 transition-transform"
            >
              <div className="flex justify-center mb-2">
                <div className="bg-white p-2 rounded-full brut-border-sm rotate-3">
                  <Heart size={24} strokeWidth={2.5} className="text-black" />
                </div>
              </div>
              <div className="text-[11px] font-black uppercase">{T("healthDashboard")}</div>
            </button>
          </div>

        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
