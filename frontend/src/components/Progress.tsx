import {
  BookOpen,
  Award,
  Trophy,
  Target,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import BottomNav from "./BottomNav.jsx";
import { Card } from "./ui/Card";
import Icon from "./ui/Icon.jsx";
import { cn } from "../lib/cn";
import { hasPreviousMonthReport } from "../utils/monthlyStats.js";
import { CHALLENGES } from "../data/challenges.js";

export default function Progress() {
  const {
    nav,
    T,
    journal,
    earnedBadges,
    badges,
    totalXP,
    completedExercises,
    challengeState,
    lang,
  } = useApp();

  const uniqueActiveDays = new Set(
    journal.map((e: { date: string }) => new Date(e.date).toDateString())
  ).size;

  const hasEnoughForRecap = uniqueActiveDays >= 30;

  return (
    <div className="min-h-screen pb-32 bg-bg [animation:fadeIn_0.3s_ease]">
      <div className="px-4 pt-6 flex flex-col gap-4 pb-6">

        {/* Header */}
        <div className="mb-2">
          <h1 className="font-display text-3xl font-black text-black leading-none">
            {T("progress")}
          </h1>
          <p className="text-sm font-bold text-muted mt-1">
            {T("progressSubtitle")}
          </p>
        </div>

        {/* Stats hero row */}
        <div className="flex gap-2">
          <div className="flex-1 bg-xp brut-border brut-shadow rounded-2xl p-3 text-center">
            <div className="text-2xl font-black text-black">{totalXP}</div>
            <div className="text-[10px] font-black text-black uppercase tracking-wide">
              {T("xp")}
            </div>
          </div>
          <div className="flex-1 bg-training brut-border brut-shadow rounded-2xl p-3 text-center">
            <div className="text-2xl font-black text-black">
              {completedExercises.length}
            </div>
            <div className="text-[10px] font-black text-black uppercase tracking-wide">
              {T("exercises")}
            </div>
          </div>
          <div className="flex-1 bg-achieve brut-border brut-shadow rounded-2xl p-3 text-center">
            <div className="text-2xl font-black text-black">
              {earnedBadges.length}
              <span className="text-sm">/{badges.length}</span>
            </div>
            <div className="text-[10px] font-black text-black uppercase tracking-wide">
              {T("badges")}
            </div>
          </div>
        </div>

        {/* Entry point cards */}

        {/* Journal */}
        <Card glow="training">
          <button
            onClick={() => nav("journal")}
            className="w-full flex items-center gap-4 p-1 bg-transparent border-none cursor-pointer text-start"
          >
            <div className="w-12 h-12 rounded-xl bg-training flex items-center justify-center shrink-0 brut-border-sm">
              <BookOpen size={24} className="text-black" />
            </div>
            <div className="flex-1">
              <div className="text-base font-black text-black">
                {T("trainingJournal")}
              </div>
              <div className="text-xs font-bold text-muted mt-0.5">
                {journal.length} {T("entriesLogged")}
              </div>
            </div>
            <ChevronRight size={18} className="text-muted shrink-0" />
          </button>
        </Card>

        {/* Badges */}
        <Card glow="achieve">
          <button
            onClick={() => nav("badges")}
            className="w-full flex items-center gap-4 p-1 bg-transparent border-none cursor-pointer text-start"
          >
            <div className="w-12 h-12 rounded-xl bg-achieve flex items-center justify-center shrink-0 brut-border-sm">
              <Award size={24} className="text-black" />
            </div>
            <div className="flex-1">
              <div className="text-base font-black text-black">
                {T("achievements")}
              </div>
              <div className="text-xs font-bold text-muted mt-0.5">
                {earnedBadges.length}/{badges.length} {T("unlocked")}
              </div>
            </div>
            <ChevronRight size={18} className="text-muted shrink-0" />
          </button>
        </Card>

        {/* Milestones — only if previous month has data */}
        {hasPreviousMonthReport(journal) && (
          <Card glow="xp">
            <button
              onClick={() => nav("milestoneCards")}
              className="w-full flex items-center gap-4 p-1 bg-transparent border-none cursor-pointer text-start"
            >
              <div className="w-12 h-12 rounded-xl bg-xp flex items-center justify-center shrink-0 brut-border-sm">
                <Trophy size={24} className="text-black" />
              </div>
              <div className="flex-1">
                <div className="text-base font-black text-black">
                  {T("reportReady")}
                </div>
                <div className="text-xs font-bold text-muted mt-0.5">
                  {T("viewReport")}
                </div>
              </div>
              <ChevronRight size={18} className="text-muted shrink-0" />
            </button>
          </Card>
        )}

        {/* Challenges */}
        <Card glow="social">
          <button
            onClick={() => nav("challenge")}
            className="w-full flex items-center gap-4 p-1 bg-transparent border-none cursor-pointer text-start"
          >
            <div className="w-12 h-12 rounded-xl bg-social flex items-center justify-center shrink-0 brut-border-sm">
              <Target size={24} className="text-black" />
            </div>
            <div className="flex-1">
              <div className="text-base font-black text-black">
                {T("thisWeeksChallenge")}
              </div>
              <div className="text-xs font-bold text-muted mt-0.5">
                {challengeState.stats.totalCompleted} {T("completed")}
              </div>
            </div>
            <ChevronRight size={18} className="text-muted shrink-0" />
          </button>
        </Card>

        {/* Annual Recap */}
        <div>
          <Card
            glow="achieve"
            className={cn(!hasEnoughForRecap && "opacity-50")}
          >
            <button
              onClick={() => nav("annualRecap")}
              className="w-full flex items-center gap-4 p-1 bg-transparent border-none cursor-pointer text-start"
            >
              <div className="w-12 h-12 rounded-xl bg-health flex items-center justify-center shrink-0 brut-border-sm">
                <Sparkles size={24} className="text-black" />
              </div>
              <div className="flex-1">
                <div className="text-base font-black text-black">
                  {T("viewRecap")}
                </div>
                {!hasEnoughForRecap && (
                  <div className="text-xs font-bold text-muted mt-0.5">
                    {T("keepTrainingRecap")}
                  </div>
                )}
              </div>
              <ChevronRight size={18} className="text-muted shrink-0" />
            </button>
          </Card>
        </div>

        {/* Challenge History */}
        <div className="mt-2">
          <h3 className="text-base font-black text-black mb-3 uppercase tracking-wide">
            {T("challengeHistory")}
          </h3>
          {challengeState.history.length > 0 ? (
            <>
              <div className="flex gap-2 mb-3">
                {(
                  [
                    [challengeState.stats.totalCompleted, T("completed")],
                    [challengeState.stats.currentStreak, T("weeks")],
                    [challengeState.stats.bestStreak, T("challengeBestStreak")],
                  ] as [number, string][]
                ).map(([val, lbl], i) => (
                  <div
                    key={i}
                    className="flex-1 text-center py-2.5 px-1 bg-surface brut-border-sm rounded-xl"
                  >
                    <div className="text-lg font-black text-black">{val}</div>
                    <div className="text-[9px] text-muted uppercase tracking-wide font-bold">
                      {lbl}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                {challengeState.history
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map(
                    (
                      h: {
                        challengeId: string;
                        completedDays: string[];
                        xpEarned: number;
                        fullComplete: boolean;
                      },
                      i: number
                    ) => {
                      const chDef = CHALLENGES.find(
                        (c) => c.id === h.challengeId
                      );
                      return (
                        <div
                          key={i}
                          className="px-4 py-3 bg-surface brut-border-sm rounded-xl flex items-center gap-3"
                        >
                          <Icon
                            name={(chDef?.icon || "Trophy") as any}
                            size={18}
                            style={{ color: "var(--color-muted)" }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-bold text-black truncate">
                              {lang === "he" ? chDef?.nameHe : chDef?.name}
                            </div>
                            <div className="text-[11px] text-muted">
                              {h.completedDays.length}/7 days · +{h.xpEarned}{" "}
                              XP
                            </div>
                          </div>
                          {h.fullComplete && (
                            <CheckCircle2
                              size={14}
                              className="text-training"
                            />
                          )}
                        </div>
                      );
                    }
                  )}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">{T("noChallengesYet")}</p>
          )}
        </div>
      </div>

      <BottomNav active="progress" />
    </div>
  );
}
