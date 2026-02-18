import { useApp } from "../context/AppContext.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", s2: "#1F1F23", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", amber: "#F59E0B", amberBg: "rgba(245,158,11,0.08)", amberBorder: "rgba(245,158,11,0.15)", rL: 24, r: 16 };

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
    <div style={{
      marginTop: 14,
      padding: "18px 20px",
      background: C.amberBg,
      borderRadius: C.rL,
      border: `1px solid ${C.amberBorder}`,
      animation: "slideDown 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: C.amber }}>
            {T("needAHand")}
          </h4>
          <p style={{ fontSize: 13, color: C.t2, marginTop: 4, lineHeight: 1.5 }}>
            {allPrereqsDone ? T("youveMasteredPrereqs") : T("thisOneCanBeTricky") + " " + T("tryTheseFirst")}
          </p>
        </div>
      </div>

      {!allPrereqsDone && prereqs.map(({ exercise: ex, program: prog, level: lvl, done }) => (
        <div key={ex.id} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", marginBottom: 8,
          background: "rgba(255,255,255,0.03)", borderRadius: 12,
          border: `1px solid ${C.b1}`,
        }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>{done ? "✅" : "⚪"}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{ex.name}</div>
            <div style={{ fontSize: 11, color: C.t3 }}>{prog.emoji} {prog.name}</div>
          </div>
          {done ? (
            <span style={{ fontSize: 11, color: C.acc, fontWeight: 600 }}>{T("alreadyDone")}</span>
          ) : (
            <button
              onClick={() => nav("exercise", { exercise: ex, level: lvl, program: prog })}
              style={{
                padding: "6px 14px", fontSize: 12, fontWeight: 800,
                background: prog.gradient || C.acc, color: "#fff",
                border: "none", borderRadius: 8, cursor: "pointer",
              }}
            >
              {T("challengeGo")}
            </button>
          )}
        </div>
      ))}

      {tip && (
        <div style={{
          marginTop: 8, padding: "10px 12px",
          background: "rgba(255,255,255,0.02)", borderRadius: 10,
          borderLeft: `3px solid ${C.amber}`,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.amber, textTransform: "uppercase", letterSpacing: 1 }}>{T("tipLabel")}</span>
          <p style={{ fontSize: 12, color: C.t2, marginTop: 4, lineHeight: 1.6 }}>{tip}</p>
        </div>
      )}

      <button
        onClick={() => dismissDifficultySuggestion(exerciseId)}
        style={{
          marginTop: 12, padding: "10px 20px", fontSize: 13, fontWeight: 700,
          background: "rgba(255,255,255,0.05)", color: C.t2,
          border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer",
          width: "100%",
        }}
      >
        {T("gotItThanks")}
      </button>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
