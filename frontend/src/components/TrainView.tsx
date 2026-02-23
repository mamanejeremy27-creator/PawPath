import { useApp } from "../context/AppContext.jsx";
import { matchBreed } from "../data/breedTraits.js";
import { Lock, ChevronRight, Trophy } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import SkillHealth from "./SkillHealth.jsx";
import BottomNav from "./BottomNav.jsx";
import { Card } from "./ui/Card";
import { GlowBadge } from "./ui/GlowBadge";
import { cn } from "../lib/cn";

export default function TrainView() {
  const { dogProfile, playerLevel, completedExercises, nav, T, programs } = useApp();
  const breedData = matchBreed(dogProfile?.breed);

  return (
    <div className="min-h-screen pb-24 bg-bg [animation:fadeIn_0.3s_ease]">
      <SkillHealth />

      {/* Programs header */}
      <div className="px-5 pt-6 pb-2">
        <h2 className="text-lg font-extrabold m-0 text-text">{T("programs")}</h2>
      </div>

      {/* Programs list */}
      <div className="px-4 flex flex-col gap-2">
        {programs.map((prog, idx) => {
          const unlocked = playerLevel.level >= prog.unlockLevel;
          const tot = prog.levels.reduce((a, l) => a + l.exercises.length, 0);
          const dn = prog.levels.reduce(
            (a, l) => a + l.exercises.filter(e => completedExercises.includes(e.id)).length,
            0
          );
          const pct = tot > 0 ? Math.round((dn / tot) * 100) : 0;
          const isRecommended = unlocked && breedData && breedData.priorityPrograms.includes(prog.id);

          return (
            <Card
              key={prog.id}
              glow={unlocked ? "training" : undefined}
              className={cn(
                "p-0 overflow-hidden [animation:fadeIn_0.3s_ease_both]",
                !unlocked && "opacity-40"
              )}
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              <button
                onClick={() => unlocked && nav("program", { program: prog })}
                className={cn(
                  "flex items-center gap-3.5 w-full p-4 text-text text-start bg-transparent border-none",
                  unlocked ? "cursor-pointer" : "cursor-default"
                )}
              >
                <div
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
                  style={{ background: prog.gradient }}
                >
                  {unlocked
                    ? <Icon name={prog.icon} size={22} color="#fff" />
                    : <Lock size={22} className="text-muted" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[15px] font-bold">{prog.name}</span>
                    {isRecommended && (
                      <GlowBadge color="training" size="sm">
                        {T("recommendedForBreed")}
                      </GlowBadge>
                    )}
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    {unlocked
                      ? `${dn}/${tot} ${T("exercises")}`
                      : `${T("unlockAt")} ${prog.unlockLevel}`}
                  </div>
                  {unlocked && dn > 0 && (
                    <div className="h-[3px] bg-border rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: prog.gradient }}
                      />
                    </div>
                  )}
                </div>

                <ChevronRight size={16} className="text-muted shrink-0" />
              </button>
            </Card>
          );
        })}
      </div>

      {/* Leaderboard entry */}
      <div className="px-4 pt-3">
        <Card glow="achieve" className="p-0">
          <button
            onClick={() => nav("leaderboard")}
            className="w-full flex items-center gap-3.5 px-5 py-4 text-text text-start bg-transparent border-none cursor-pointer"
          >
            <Trophy size={28} className="text-xp" />
            <div className="flex-1">
              <div className="text-sm font-bold">{T("leaderboard")}</div>
              <div className="text-xs text-xp font-semibold mt-0.5">{T("leaderboardSubtitle")}</div>
            </div>
            <ChevronRight size={16} className="text-muted" />
          </button>
        </Card>
      </div>

      <BottomNav active="train" />
    </div>
  );
}
