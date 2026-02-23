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
          onClick={() => nav("home", { program: null })}
          className="inline-flex items-center gap-1.5 bg-black/20 text-white text-sm font-semibold px-4 py-2 rounded-[20px] mb-5 backdrop-blur-[10px] border-0 cursor-pointer"
        >
          {rtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />} {T("back")}
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

      {/* Level list */}
      <div className="p-5">
        {p.levels.map((lv, idx) => {
          const dn = lv.exercises.filter(e => completedExercises.includes(e.id)).length;
          const tot = lv.exercises.length;
          const done = dn === tot;
          const prevOk = idx === 0 || p.levels[idx - 1].exercises.every(e => completedExercises.includes(e.id));
          const locked = idx > 0 && !prevOk;
          const pct = (dn / tot) * 100;

          return (
            <button
              key={lv.id}
              onClick={() => !locked && nav("level", { level: lv })}
              className={cn(
                "flex items-center gap-4 w-full p-[18px] mb-2 bg-surface rounded-3xl border border-border text-start text-text",
                locked ? "opacity-35 cursor-default" : "cursor-pointer",
              )}
              style={{ animation: `fadeIn 0.3s ease ${idx * 0.06}s both` }}
            >
              {/* Icon square */}
              <div
                className={cn(
                  "w-[46px] h-[46px] rounded-[14px] flex items-center justify-center shrink-0 font-extrabold",
                  done ? "text-white" : locked ? "bg-surface-2 text-muted" : "bg-border text-text",
                )}
                style={done ? { background: p.gradient } : undefined}
              >
                {done ? <Check size={18} strokeWidth={3} /> : locked ? <Lock size={16} /> : idx + 1}
              </div>

              <div className="flex-1">
                <div className="text-[15px] font-bold">{lv.name}</div>
                <div className="text-xs text-muted mt-0.5">{dn}/{tot} · +{lv.xpReward} {T("xp")}</div>
                {dn > 0 && (
                  <div className="h-[3px] bg-border rounded-[10px] overflow-hidden mt-2">
                    <div
                      className="h-full rounded-[10px]"
                      style={{ width: `${pct}%`, background: p.gradient }}
                    />
                  </div>
                )}
              </div>

              <ChevronRight size={16} className="text-muted" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
