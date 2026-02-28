import { useApp } from "../context/AppContext.jsx";
import { Lock, Check, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { cn } from "../lib/cn";

export default function ProgramView() {
  const { selProgram, completedExercises, nav, T, rtl } = useApp();
  if (!selProgram) return null;
  const p = selProgram;

  return (
    <div className="min-h-screen bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Hero header — gradient comes from program data, keep as style */}
      <div
        className="px-5 pt-6 pb-8 rounded-b-[32px] relative overflow-hidden"
        style={{ background: p.gradient }}
      >
        {/* Decorative circle */}
        <div className="absolute -top-10 -end-10 w-[200px] h-[200px] rounded-full bg-white/[0.08] pointer-events-none" />

        <button
          onClick={() => nav("train")}
          className="inline-flex items-center gap-1.5 bg-black/20 text-white text-sm font-semibold px-4 py-2 rounded-[20px] mb-5 backdrop-blur-[10px] border-0 cursor-pointer"
        >
          {rtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />} {T("train")}
        </button>

        <div className="mb-3 w-16 h-16 rounded-[18px] bg-white/15 flex items-center justify-center">
          <Icon name={p.icon} size={32} color="#fff" />
        </div>

        <h2 className="font-display text-[28px] font-black m-0 text-white">{p.name}</h2>
        <p className="text-sm text-white/80 mt-2 leading-relaxed">{p.description}</p>

        <div className="flex gap-3 mt-3.5">
          <span className="text-xs text-white/70 bg-black/15 px-3 py-[5px] rounded-lg font-semibold">{p.difficulty}</span>
          <span className="text-xs text-white/70 bg-black/15 px-3 py-[5px] rounded-lg font-semibold">{p.duration}</span>
        </div>
      </div>

      {/* Levels with inline exercises */}
      <div className="px-4 pt-5 pb-24">
        {p.levels.map((lv, lvidx) => {
          const lvDn = lv.exercises.filter(e => completedExercises.includes(e.id)).length;
          const lvTot = lv.exercises.length;
          const lvDone = lvDn === lvTot;
          const prevOk = lvidx === 0 || p.levels[lvidx - 1].exercises.every(e => completedExercises.includes(e.id));
          const locked = lvidx > 0 && !prevOk;
          const pct = lvTot > 0 ? Math.round((lvDn / lvTot) * 100) : 0;

          return (
            <div key={lv.id} className={cn("mb-6", locked && "opacity-35 pointer-events-none")}>
              {/* Level section header */}
              <div className="flex items-center gap-3 mb-2.5">
                <div
                  className={cn(
                    "w-8 h-8 rounded-[10px] flex items-center justify-center text-sm font-extrabold shrink-0",
                    lvDone ? "text-white" : locked ? "bg-surface-2 text-muted" : "bg-border text-text"
                  )}
                  style={lvDone ? { background: p.gradient } : undefined}
                >
                  {lvDone ? <Check size={14} strokeWidth={3} /> : locked ? <Lock size={14} /> : lvidx + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black text-black uppercase tracking-wide">{lv.name}</div>
                  <div className="text-xs text-muted">{lvDn}/{lvTot} · +{lv.xpReward} {T("xp")}</div>
                </div>
                {lvDn > 0 && <span className="text-xs font-black text-muted">{pct}%</span>}
              </div>

              {/* Progress bar (only if started) */}
              {lvDn > 0 && (
                <div className="h-1 bg-border rounded-full overflow-hidden mb-3 ms-11">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: p.gradient }} />
                </div>
              )}

              {/* Exercise rows */}
              <div className="flex flex-col gap-1.5">
                {lv.exercises.map((ex, exidx) => {
                  const done = completedExercises.includes(ex.id);
                  return (
                    <button
                      key={ex.id}
                      onClick={() => nav("exercise", { exercise: ex, level: lv, from: "program" })}
                      className={cn(
                        "flex items-center gap-3 w-full p-3.5 rounded-2xl cursor-pointer text-start text-text brut-border-sm",
                        done ? "bg-training/10 border-training/20" : "bg-surface border-border"
                      )}
                      style={{ animation: `fadeIn 0.3s ease ${exidx * 0.05}s both` }}
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0",
                          done ? "bg-training text-black" : "bg-border text-muted"
                        )}
                      >
                        {done ? <Check size={16} strokeWidth={3} /> : exidx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-bold">{ex.name}</div>
                        <div className="text-xs text-muted mt-0.5">
                          {Math.floor(ex.duration / 60)}m · {"●".repeat(ex.difficulty)}{"○".repeat(4 - ex.difficulty)}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
