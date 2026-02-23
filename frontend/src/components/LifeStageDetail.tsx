import { useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import BottomNav from "./BottomNav.jsx";
import { cn } from "../lib/cn";

export default function LifeStageDetail() {
  const { lifeStageData, dogProfile, programs, completedExercises, nav, T, rtl } = useApp();

  if (!lifeStageData) {
    return (
      <div className="min-h-screen bg-bg px-5 pt-6">
        <button
          onClick={() => nav("home")}
          className="bg-transparent border-none text-training text-[14px] font-semibold cursor-pointer p-0 flex items-center gap-1.5"
        >
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {T("home")}
        </button>
        <p className="text-muted text-center mt-[60px]">{T("whenBorn").replace("{name}", dogProfile?.name || "")}</p>
      </div>
    );
  }

  const { stage, emoji, color, ageMonths, size, next, allStages } = lifeStageData;
  const stageKey = `stage${stage.charAt(0).toUpperCase() + stage.slice(1)}`;
  const descKey = `${stage}Desc`;
  const sizeKey = `size${size.charAt(0).toUpperCase() + size.slice(1)}`;

  // Get exercises recommended for this stage
  const stageExercises = useMemo(() => {
    const result = [];
    for (const prog of programs) {
      for (const level of prog.levels) {
        for (const ex of level.exercises) {
          if (ex.lifeStages && ex.lifeStages.includes(stage)) {
            result.push({ exercise: ex, program: prog, level, done: completedExercises.includes(ex.id) });
          }
        }
      }
    }
    return result;
  }, [programs, stage, completedExercises]);

  const doneCount = stageExercises.filter(e => e.done).length;

  return (
    <div className="min-h-screen pb-[100px] bg-bg [animation:fadeIn_0.3s_ease]">
      <div className="px-5 pt-6 pb-4">
        <button
          onClick={() => nav("home")}
          className="bg-transparent border-none text-training text-[14px] font-semibold cursor-pointer p-0 mb-4 flex items-center gap-1.5"
        >
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {T("home")}
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-[36px] flex-shrink-0"
            style={{ background: `${color}18` }}
          >
            {emoji}
          </div>
          <div>
            <h2 className="font-display text-[28px] font-extrabold m-0 text-text">{T(stageKey)}</h2>
            <div className="flex gap-2 mt-1.5">
              <span
                className="text-[12px] font-semibold px-2.5 py-[2px] rounded-lg"
                style={{ color, background: `${color}18` }}
              >
                {T(sizeKey)}
              </span>
              <span className="text-[12px] text-muted">
                {ageMonths} {T("daysAgo")}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-5 py-4 bg-surface rounded-3xl border border-border mb-5">
          <p className="text-[14px] text-text-2 leading-[1.7] m-0">{T(descKey)}</p>
        </div>

        {/* Stage timeline */}
        <div className="px-5 py-4 bg-surface rounded-3xl border border-border mb-5">
          <h3 className="text-[14px] font-bold text-text mb-4">{T("lifeStage")}</h3>
          <div className="flex flex-col gap-0">
            {allStages.map((s, i) => {
              const isCurrent = s.stage === stage;
              const isPast = allStages.findIndex(x => x.stage === stage) > i;
              const sKey = `stage${s.stage.charAt(0).toUpperCase() + s.stage.slice(1)}`;
              return (
                <div key={s.stage} className="flex items-center gap-3 py-2.5 relative">
                  {/* Connector line */}
                  {i < allStages.length - 1 && (
                    <div
                      className="absolute start-[15px] top-8 w-0.5 h-[calc(100%-12px)]"
                      style={{ background: isPast ? s.color : "rgba(255,255,255,0.06)" }}
                    />
                  )}
                  {/* Dot */}
                  <div
                    className="rounded-full flex-shrink-0 flex items-center justify-center z-[1]"
                    style={{
                      width: isCurrent ? 32 : 24,
                      height: isCurrent ? 32 : 24,
                      background: isCurrent ? `${s.color}30` : isPast ? `${s.color}20` : "rgba(255,255,255,0.06)",
                      border: isCurrent ? `2px solid ${s.color}` : "none",
                      fontSize: isCurrent ? 16 : 12,
                    }}
                  >
                    {s.emoji}
                  </div>
                  {/* Label */}
                  <div>
                    <span
                      className={cn("text-[14px]", isCurrent ? "font-bold" : "font-medium")}
                      style={{ color: isCurrent ? s.color : isPast ? "#A1A1AA" : "#71717A" }}
                    >
                      {T(sKey)}
                    </span>
                    {isCurrent && (
                      <span className="text-[11px] font-semibold ms-2" style={{ color: s.color }}>
                        {T("stageNow")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {next && (
            <div className="text-[12px] text-muted mt-2 pt-2 border-t border-border">
              {next.emoji} {next.monthsUntil} {T("monthsUntilNext")} {T(`stage${next.stage.charAt(0).toUpperCase() + next.stage.slice(1)}`)}
            </div>
          )}
        </div>

        {/* Best exercises for this stage */}
        <div className="mb-5">
          <h3 className="text-[14px] font-bold text-text mb-1">{T("bestExercises")}</h3>
          <p className="text-[12px] text-muted mb-3">
            {doneCount}/{stageExercises.length} {T("completed")}
          </p>
          <div className="flex flex-col gap-2">
            {stageExercises.slice(0, 10).map(({ exercise, program, level, done }) => (
              <div
                key={exercise.id}
                onClick={() => nav("exercise", { program, level, exercise })}
                className={cn(
                  "px-4 py-3.5 bg-surface rounded-2xl border border-border cursor-pointer flex items-center gap-3",
                  done ? "opacity-60" : "opacity-100"
                )}
              >
                <Icon name={program.icon} size={18} />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-text">{exercise.name}</div>
                  <div className="text-[11px] text-muted">{program.name} · {level.name}</div>
                </div>
                {done && <Check size={16} className="text-training" />}
              </div>
            ))}
          </div>
          {stageExercises.length > 10 && (
            <p className="text-[12px] text-muted text-center mt-2">
              +{stageExercises.length - 10} {T("exercises")}
            </p>
          )}
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  );
}
