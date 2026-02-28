import { useApp } from "../context/AppContext.jsx";
import { PartyPopper, Home, LayoutGrid, ChevronRight } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { cn } from "../lib/cn";

export default function CompletionScreen() {
  const { screenParams, nav, T, rtl, completedExercises } = useApp();
  const { completedExercise, program, level, xpEarned, navSource } = screenParams ?? {};

  if (!completedExercise || !program) return null;

  // Calculate program progress
  const allExercises = program.levels.flatMap((l: any) => l.exercises);
  const totalCount = allExercises.length;
  const doneCount = allExercises.filter((e: any) => completedExercises.includes(e.id)).length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const isProgramComplete = doneCount === totalCount;

  // Find next incomplete exercise
  let nextExInfo: { exercise: any; level: any } | null = null;
  if (!isProgramComplete) {
    outer: for (let i = 0; i < program.levels.length; i++) {
      const lvl = program.levels[i];
      if (i > 0 && !program.levels[i - 1].exercises.every((e: any) => completedExercises.includes(e.id))) continue;
      for (const ex of lvl.exercises) {
        if (!completedExercises.includes(ex.id)) {
          nextExInfo = { exercise: ex, level: lvl };
          break outer;
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-5 pb-10 animate-[fadeIn_0.4s_ease]">
      {/* Celebration icon */}
      <div className="w-24 h-24 rounded-[28px] bg-training/10 brut-border flex items-center justify-center mb-6 animate-[badgeDrop_0.5s_ease]">
        <PartyPopper size={48} className="text-training" />
      </div>

      {/* Exercise name + heading */}
      <div className="text-center mb-2">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-white mb-3"
          style={{ background: program.gradient }}
        >
          <Icon name={program.icon} size={12} color="#fff" /> {program.name}
        </div>
        <h1 className="font-display text-[32px] font-black text-text leading-tight m-0">
          {completedExercise.name}
        </h1>
        <p className="text-xl font-black text-training mt-1">{T("exerciseCompleteHeading")}</p>
      </div>

      {/* XP earned */}
      {xpEarned > 0 && (
        <div className="flex items-center gap-2 bg-xp/10 brut-border-sm px-5 py-2.5 rounded-full mt-3 mb-6">
          <span className="text-2xl">⚡</span>
          <span className="text-lg font-black text-black">+{xpEarned} {T("xp")}</span>
        </div>
      )}

      {/* Program progress bar */}
      <div className="w-full bg-surface brut-border rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-text">{program.name}</span>
          <span className="text-sm font-black text-muted">{doneCount}/{totalCount}</span>
        </div>
        <div className="h-2.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: program.gradient }}
          />
        </div>
        {isProgramComplete && (
          <p className="text-xs font-bold text-training mt-2 text-center">{T("programCompleteSubtitle")}</p>
        )}
      </div>

      {/* Program complete celebration */}
      {isProgramComplete && (
        <div className="text-center mb-6">
          <div className="text-3xl mb-1">🏆</div>
          <div className="text-base font-black text-text uppercase tracking-wide">{T("programComplete")}</div>
        </div>
      )}

      {/* Action buttons */}
      <div className={cn("w-full flex flex-col gap-3", rtl && "rtl")}>
        {/* Next Exercise — only if there is one */}
        {nextExInfo && (
          <button
            onClick={() => nav("exercise", { exercise: nextExInfo!.exercise, level: nextExInfo!.level, from: navSource })}
            className="w-full py-4 text-base font-extrabold bg-training text-black brut-border brut-shadow rounded-full cursor-pointer flex items-center justify-center gap-2"
          >
            {T("nextExercise")} <ChevronRight size={18} />
          </button>
        )}

        {/* Programs */}
        <button
          onClick={() => nav("program", { exercise: null, level: null })}
          className="w-full py-4 text-base font-extrabold bg-surface text-text brut-border brut-shadow rounded-full cursor-pointer flex items-center justify-center gap-2"
        >
          <LayoutGrid size={18} /> {T("programs")}
        </button>

        {/* Back Home */}
        <button
          onClick={() => nav("today")}
          className="w-full py-3 text-sm font-bold text-muted cursor-pointer bg-transparent border-none flex items-center justify-center gap-1.5"
        >
          <Home size={15} /> {T("backHome")}
        </button>
      </div>
    </div>
  );
}
