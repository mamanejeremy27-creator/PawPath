import { ArrowLeft, CheckCircle2, Unlock, Lock, Snowflake } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";
import { cn } from "../lib/cn";

export default function StreakView() {
  const { streakData, nav, T, lang, STREAK_MILESTONES } = useApp();
  const { current, best, fire, freezesAvailable, totalTrainingDays, freezesUsed, unlockedMilestones, progress, nextMilestone, recovery } = streakData;

  const nextFreezeMs = STREAK_MILESTONES.find(m => m.freezeReward && m.days > current);

  return (
    <div className="min-h-screen pb-10 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => nav("home")}
          className="bg-transparent border-0 text-muted cursor-pointer p-0 flex items-center"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-black text-text m-0">{T("streakDetails")}</h2>
      </div>

      {/* Streak hero */}
      <div className="text-center px-5 pt-6 pb-8">
        <div className="text-5xl animate-[pulse_2s_infinite]">{fire}</div>
        <div className="text-[42px] font-black text-text mt-2">{current}</div>
        <div className="text-base text-muted font-semibold">{T("dayStreak")}</div>
        <div className="text-[13px] text-muted mt-2">
          {T("bestStreakLabel")}: {best} {T("daysOfStreak")}
        </div>
        {recovery.active && (
          <div className="mt-3 px-[18px] py-2 bg-xp/10 border border-xp/20 rounded-full inline-block text-[13px] text-xp font-semibold">
            {T("recoveryChallenge")}: {recovery.daysCompleted}/3
          </div>
        )}
      </div>

      {/* Milestones */}
      <div className="px-5 mb-6">
        <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-3">{T("milestones")}</div>
        <div className="bg-surface rounded-3xl border border-border overflow-hidden">
          {STREAK_MILESTONES.map((m, i) => {
            const unlocked = unlockedMilestones.includes(m.rewardId);
            const isNext = nextMilestone && m.rewardId === nextMilestone.rewardId;
            return (
              <div
                key={m.rewardId}
                className={cn(
                  "px-[18px] py-3.5 flex items-center gap-3",
                  i < STREAK_MILESTONES.length - 1 && "border-b border-border",
                  unlocked ? "opacity-100" : isNext ? "opacity-85" : "opacity-40"
                )}
              >
                <span className="w-6 flex justify-center items-center">
                  {unlocked
                    ? <CheckCircle2 size={16} className="text-training" />
                    : isNext
                      ? <Unlock size={16} className="text-muted" />
                      : <Lock size={16} className="text-muted" />
                  }
                </span>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-[13px] font-bold", unlocked ? "text-text" : "text-muted")}>
                    {m.days} {T("daysOfStreak")} — {lang === "he" ? (m.nameHe || m.name) : m.name}
                  </div>
                  {isNext && (
                    <div className="h-[3px] bg-border rounded-[10px] overflow-hidden mt-1.5 max-w-[120px]">
                      <div
                        className="h-full bg-training rounded-[10px]"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                <Icon name={m.icon || "Trophy"} size={18} color={unlocked ? "#22C55E" : "#71717A"} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak Freezes */}
      <div className="px-5 mb-6">
        <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-3">{T("streakFreeze")}</div>
        <div className="bg-surface rounded-3xl border border-border px-[18px] py-4">
          <div className="flex items-center gap-2 mb-2">
            {[0, 1, 2].map(i => (
              <Snowflake
                key={i}
                size={20}
                color="#93C5FD"
                style={{ opacity: i < freezesAvailable ? 1 : 0.2 }}
              />
            ))}
            <span className="text-sm text-text font-bold ms-2">
              {freezesAvailable}/3 {T("freezesAvailable")}
            </span>
          </div>
          {nextFreezeMs && (
            <div className="text-xs text-muted">
              {T("nextReward")}: {nextFreezeMs.days} {T("daysOfStreak")}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 mb-6">
        <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-3">Stats</div>
        <div className="bg-surface rounded-3xl border border-border">
          {[
            [T("currentStreak"), `${current} ${T("daysOfStreak")}`],
            [T("bestStreakLabel"), `${best} ${T("daysOfStreak")}`],
            [T("totalTrainingDays"), totalTrainingDays],
            [T("freezesUsed"), freezesUsed],
          ].map(([label, val], i) => (
            <div
              key={i}
              className={cn(
                "flex justify-between px-[18px] py-3.5",
                i < 3 && "border-b border-border"
              )}
            >
              <span className="text-sm text-muted">{label}</span>
              <span className="text-sm font-bold text-text">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
