import { useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", rL: 24 };

export default function LifeStageDetail() {
  const { lifeStageData, dogProfile, programs, completedExercises, nav, T, rtl } = useApp();

  if (!lifeStageData) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, padding: "24px 20px" }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6 }}>
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {T("home")}
        </button>
        <p style={{ color: C.t3, textAlign: "center", marginTop: 60 }}>{T("whenBorn").replace("{name}", dogProfile?.name || "")}</p>
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
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {T("home")}
        </button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: `${color}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, flexShrink: 0,
          }}>
            {emoji}
          </div>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: 0, color: C.t1 }}>
              {T(stageKey)}
            </h2>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 12, color, fontWeight: 600, background: `${color}18`, padding: "2px 10px", borderRadius: 8 }}>
                {T(sizeKey)}
              </span>
              <span style={{ fontSize: 12, color: C.t3 }}>
                {ageMonths} {T("daysAgo")}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ padding: "16px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`, marginBottom: 20 }}>
          <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.7, margin: 0 }}>{T(descKey)}</p>
        </div>

        {/* Stage timeline */}
        <div style={{ padding: "16px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.t1, margin: "0 0 16px" }}>{T("lifeStage")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {allStages.map((s, i) => {
              const isCurrent = s.stage === stage;
              const isPast = allStages.findIndex(x => x.stage === stage) > i;
              const sKey = `stage${s.stage.charAt(0).toUpperCase() + s.stage.slice(1)}`;
              return (
                <div key={s.stage} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", position: "relative" }}>
                  {/* Connector line */}
                  {i < allStages.length - 1 && (
                    <div style={{
                      position: "absolute", left: 15, top: 32, width: 2, height: "calc(100% - 12px)",
                      background: isPast ? s.color : C.b1,
                    }} />
                  )}
                  {/* Dot */}
                  <div style={{
                    width: isCurrent ? 32 : 24, height: isCurrent ? 32 : 24,
                    borderRadius: "50%", flexShrink: 0,
                    background: isCurrent ? `${s.color}30` : isPast ? `${s.color}20` : C.b1,
                    border: isCurrent ? `2px solid ${s.color}` : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: isCurrent ? 16 : 12,
                    zIndex: 1,
                  }}>
                    {s.emoji}
                  </div>
                  {/* Label */}
                  <div>
                    <span style={{ fontSize: 14, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? s.color : isPast ? C.t2 : C.t3 }}>
                      {T(sKey)}
                    </span>
                    {isCurrent && (
                      <span style={{ fontSize: 11, color: s.color, marginInlineStart: 8, fontWeight: 600 }}>
                        {T("stageNow")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {next && (
            <div style={{ fontSize: 12, color: C.t3, marginTop: 8, padding: "8px 0 0", borderTop: `1px solid ${C.b1}` }}>
              {next.emoji} {next.monthsUntil} {T("monthsUntilNext")} {T(`stage${next.stage.charAt(0).toUpperCase() + next.stage.slice(1)}`)}
            </div>
          )}
        </div>

        {/* Best exercises for this stage */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.t1, margin: "0 0 4px" }}>{T("bestExercises")}</h3>
          <p style={{ fontSize: 12, color: C.t3, margin: "0 0 12px" }}>
            {doneCount}/{stageExercises.length} {T("completed")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stageExercises.slice(0, 10).map(({ exercise, program, level, done }) => (
              <div
                key={exercise.id}
                onClick={() => nav("exercise", { program, level, exercise })}
                style={{
                  padding: "14px 16px", background: C.s1, borderRadius: 16,
                  border: `1px solid ${C.b1}`, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                  opacity: done ? 0.6 : 1,
                }}
              >
                <Icon name={program.icon} size={18} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{exercise.name}</div>
                  <div style={{ fontSize: 11, color: C.t3 }}>{program.name} · {level.name}</div>
                </div>
                {done && <Check size={16} color={C.acc} />}
              </div>
            ))}
          </div>
          {stageExercises.length > 10 && (
            <p style={{ fontSize: 12, color: C.t3, textAlign: "center", marginTop: 8 }}>
              +{stageExercises.length - 10} {T("exercises")}
            </p>
          )}
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  );
}
