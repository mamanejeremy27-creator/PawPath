import { useApp } from "../context/AppContext.jsx";
import { ArrowLeft, ArrowRight, Check, Clock, ChevronRight } from "lucide-react";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", rL: 24 };

export default function LevelView() {
  const { selLevel, selProgram, completedExercises, nav, T, rtl } = useApp();
  if (!selLevel || !selProgram) return null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <button onClick={() => nav("program", { level: null })} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {selProgram.name}
        </button>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: 0, color: C.t1 }}>{selLevel.name}</h2>
        {selLevel.description && <p style={{ fontSize: 14, color: C.t3, marginTop: 6 }}>{selLevel.description}</p>}
      </div>
      <div style={{ padding: "0 20px" }}>
        {selLevel.exercises.map((ex, idx) => {
          const done = completedExercises.includes(ex.id);
          return (
            <button key={ex.id} onClick={() => nav("exercise", { exercise: ex })}
              style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "18px", marginBottom: 8, background: C.s1, borderRadius: C.rL, border: `1px solid ${done ? "rgba(34,197,94,0.2)" : C.b1}`, cursor: "pointer", color: C.t1, textAlign: "start", animation: `fadeIn 0.3s ease ${idx * 0.06}s both` }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: done ? C.acc : C.b1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: done ? "#000" : C.t3, flexShrink: 0 }}>{done ? <Check size={18} strokeWidth={3} /> : idx + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{ex.name}</div>
                <div style={{ fontSize: 12, color: C.t3, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} /> {Math.floor(ex.duration / 60)} {T("min")} · {"●".repeat(ex.difficulty) + "○".repeat(4 - ex.difficulty)}{done ? <> · <Check size={11} /> {T("done")}</> : ""}</div>
              </div>
              <ChevronRight size={18} color={C.t3} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
