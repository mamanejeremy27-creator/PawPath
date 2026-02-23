import { useApp } from "../context/AppContext.jsx";
import { Lightbulb, CheckCircle2, CircleDot } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { cn } from "../lib/cn";

export default function DifficultyCard({ exerciseId, program }) {
  const {
    isExerciseStruggling, dismissDifficultySuggestion,
    completedExercises, programs, nav, T, rtl, lang,
    EXERCISE_PREREQUISITES,
  } = useApp();

  if (!isExerciseStruggling(exerciseId)) return null;

  const prereqData = EXERCISE_PREREQUISITES[exerciseId];
  if (!prereqData || prereqData.prerequisites.length === 0) return null;

  // Find prerequisite exercises with their program/level info
  const prereqs = prereqData.prerequisites.map(pid => {
    for (const p of programs) {
      for (const l of p.levels) {
        const ex = l.exercises.find(e => e.id === pid);
        if (ex) return { exercise: ex, program: p, level: l, done: completedExercises.includes(pid) };
      }
    }
    return null;
  }).filter(Boolean);

  if (prereqs.length === 0) return null;

  const allPrereqsDone = prereqs.every(p => p.done);
  const tip = prereqData.tips ? prereqData.tips[lang] || prereqData.tips.en : null;

  return (
    <div className="mt-3.5 px-5 py-[18px] bg-xp/[0.08] rounded-3xl border border-xp/15 animate-[slideDown_0.3s_ease]">
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-3">
        <Lightbulb size={20} className="text-xp shrink-0" />
        <div>
          <h4 className="text-sm font-extrabold m-0 text-xp">{T("needAHand")}</h4>
          <p className="text-[13px] text-text-2 mt-1 leading-snug">
            {allPrereqsDone ? T("youveMasteredPrereqs") : T("thisOneCanBeTricky") + " " + T("tryTheseFirst")}
          </p>
        </div>
      </div>

      {/* Prerequisite exercise rows */}
      {!allPrereqsDone && prereqs.map(({ exercise: ex, program: prog, level: lvl, done }) => (
        <div
          key={ex.id}
          className="flex items-center gap-2.5 px-3 py-2.5 mb-2 bg-white/[0.03] rounded-xl border border-border"
        >
          {done
            ? <CheckCircle2 size={16} className="text-training shrink-0" />
            : <CircleDot size={16} className="text-muted shrink-0" />
          }
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-text">{ex.name}</div>
            <div className="flex items-center gap-1 text-[11px] text-muted">
              <Icon name={prog.icon} size={11} color="#71717A" /> {prog.name}
            </div>
          </div>
          {done ? (
            <span className="text-[11px] text-training font-semibold">{T("alreadyDone")}</span>
          ) : (
            <button
              onClick={() => nav("exercise", { exercise: ex, level: lvl, program: prog })}
              className="px-3.5 py-1.5 text-xs font-extrabold text-white border-0 rounded-lg cursor-pointer"
              style={{ background: prog.gradient || "#22C55E" }}
            >
              {T("challengeGo")}
            </button>
          )}
        </div>
      ))}

      {/* Inline tip */}
      {tip && (
        <div className="mt-2 px-3 py-2.5 bg-white/[0.02] rounded-[10px] border-s-[3px] border-xp">
          <span className="text-[11px] font-bold text-xp uppercase tracking-[1px]">{T("tipLabel")}</span>
          <p className="text-xs text-text-2 mt-1 leading-relaxed">{tip}</p>
        </div>
      )}

      {/* Dismiss */}
      <button
        onClick={() => dismissDifficultySuggestion(exerciseId)}
        className="mt-3 px-5 py-2.5 w-full text-[13px] font-bold bg-white/[0.05] text-text-2 border border-border rounded-full cursor-pointer"
      >
        {T("gotItThanks")}
      </button>
    </div>
  );
}
