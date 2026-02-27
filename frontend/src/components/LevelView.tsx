import { useApp } from "../context/AppContext.jsx";
import { ArrowLeft, ArrowRight, Check, Clock, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

export default function LevelView() {
  const { selLevel, selProgram, completedExercises, nav, T, rtl } = useApp();
  if (!selLevel || !selProgram) return null;

  return (
    <div className="min-h-screen bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <button
          onClick={() => nav("program", { level: null })}
          className="inline-flex items-center gap-1.5 bg-surface brut-border-sm px-3 py-1.5 rounded-xl text-sm font-semibold text-text cursor-pointer border-none mb-4"
        >
          {rtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />} {selProgram.name}
        </button>
        <h2 className="font-display text-2xl font-extrabold m-0 text-text">{selLevel.name}</h2>
        {selLevel.description && (
          <p className="text-sm text-muted mt-1.5">{selLevel.description}</p>
        )}
      </div>

      {/* Exercise list */}
      <div className="px-5">
        {selLevel.exercises.map((ex, idx) => {
          const done = completedExercises.includes(ex.id);
          return (
            <button
              key={ex.id}
              onClick={() => nav("exercise", { exercise: ex })}
              className={cn(
                "flex items-center gap-3.5 w-full p-[18px] mb-2 bg-surface rounded-3xl cursor-pointer text-text text-start border",
                done ? "border-training/20" : "border-border",
              )}
              style={{ animation: `fadeIn 0.3s ease ${idx * 0.06}s both` }}
            >
              {/* Step / done indicator */}
              <div
                className={cn(
                  "w-[42px] h-[42px] rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0",
                  done ? "bg-training text-black" : "bg-border text-muted",
                )}
              >
                {done ? <Check size={18} strokeWidth={3} /> : idx + 1}
              </div>

              <div className="flex-1">
                <div className="text-[15px] font-bold">{ex.name}</div>
                <div className="flex items-center gap-1 text-xs text-muted mt-[3px]">
                  <Clock size={11} />
                  {Math.floor(ex.duration / 60)} {T("min")} · {"●".repeat(ex.difficulty) + "○".repeat(4 - ex.difficulty)}
                  {done && (
                    <> · <Check size={11} /> {T("done")}</>
                  )}
                </div>
              </div>

              <ChevronRight size={18} className="text-muted" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
