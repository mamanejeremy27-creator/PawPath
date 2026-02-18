import { useApp } from "../context/AppContext.jsx";

const C = { s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16 };

export default function SkillHealth() {
  const { skillHealthData, nav, T } = useApp();

  if (skillHealthData.length === 0) return null;

  const needsReview = skillHealthData.filter(s => s.label !== "fresh").length;

  return (
    <div style={{ padding: "20px 20px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: C.t1 }}>{T("skillHealth")}</h2>
        <span style={{ fontSize: 12, color: needsReview > 0 ? "#F59E0B" : C.acc, fontWeight: 600 }}>
          {needsReview > 0 ? `${needsReview} ${T("skillsNeedReview")}` : T("allSkillsFresh")}
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
        {skillHealthData.map(s => (
          <button
            key={s.exerciseId}
            onClick={() => nav("exercise", { program: s.program, level: s.level, exercise: s.exercise })}
            style={{
              flexShrink: 0, width: 60, height: 72, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 4,
              background: C.s1, borderRadius: 14, border: `2px solid ${s.color}`,
              cursor: "pointer", color: C.t1, padding: 0,
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: s.program.gradient, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>
              {s.program.emoji}
            </div>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: s.color,
            }} />
          </button>
        ))}
      </div>
    </div>
  );
}
