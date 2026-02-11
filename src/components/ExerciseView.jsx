import { useApp } from "../context/AppContext.jsx";
import Timer from "./Timer.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", warn: "#F59E0B", rL: 24, r: 16 };
const cardStyle = { padding: "18px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` };
const sectionLabel = (text) => <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{text}</div>;

export default function ExerciseView() {
  const { selExercise, selLevel, selProgram, completedExercises, journal, triggerComplete, nav, T, rtl, lang, gear: gearData } = useApp();
  if (!selExercise || !selLevel || !selProgram) return null;
  const ex = selExercise;
  const done = completedExercises.includes(ex.id);
  const gear = (ex.gear || []).map(id => gearData.find(g => g.id === id)).filter(Boolean);
  const journalEntries = journal.filter(j => j.exerciseId === ex.id);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 40, animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <button onClick={() => nav("level", { exercise: null })} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>{rtl ? "→" : "←"}</span> {selLevel.name}
        </button>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "inline-flex", padding: "6px 14px", borderRadius: 8, background: selProgram.gradient, fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 14 }}>{selProgram.emoji} {selProgram.name}</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, margin: 0, color: C.t1 }}>{ex.name}</h2>
        <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 13, color: C.t3 }}>
          <span>⏱ {Math.floor(ex.duration / 60)} {T("min")}</span>
          <span style={{ color: selProgram.color }}>{"●".repeat(ex.difficulty)}{"○".repeat(4 - ex.difficulty)}</span>
        </div>
        <p style={{ fontSize: 15, color: C.t2, marginTop: 14, lineHeight: 1.7 }}>{ex.description}</p>

        {!done && <Timer duration={ex.duration} />}

        {/* Steps */}
        <div style={{ marginTop: 20, ...cardStyle }}>
          {sectionLabel(T("howToDoIt"))}
          {ex.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < ex.steps.length - 1 ? 16 : 0, alignItems: "flex-start" }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: selProgram.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.65, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        <div style={{ marginTop: 14, padding: "18px", background: "rgba(34,197,94,0.05)", borderRadius: C.rL, border: "1px solid rgba(34,197,94,0.1)", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 800, margin: 0, color: C.acc, textTransform: "uppercase", letterSpacing: 1 }}>{T("proTip")}</h4>
            <p style={{ fontSize: 13, color: C.t2, marginTop: 6, lineHeight: 1.6 }}>{ex.tips}</p>
          </div>
        </div>

        {/* Gear */}
        {gear.length > 0 && (
          <div style={{ marginTop: 14, ...cardStyle }}>
            <h4 style={{ fontSize: 12, fontWeight: 800, margin: "0 0 12px", color: C.warn, textTransform: "uppercase", letterSpacing: 1 }}>{T("recommendedGear")}</h4>
            {gear.map(g => (
              <div key={g.id} style={{ display: "flex", gap: 10, marginBottom: 10, padding: "10px", background: "rgba(255,255,255,0.02)", borderRadius: 10 }}>
                <span style={{ fontSize: 22 }}>{g.emoji}</span>
                <div><div style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{g.name} <span style={{ color: C.t3, fontWeight: 500 }}>· <span dir="ltr" style={{ direction: "ltr", unicodeBidi: "embed" }}>{g.price}</span></span></div><div style={{ fontSize: 12, color: C.t3, marginTop: 3, lineHeight: 1.5 }}>{g.tip}</div></div>
              </div>
            ))}
          </div>
        )}

        {/* Past journal entries */}
        {journalEntries.length > 0 && (
          <div style={{ marginTop: 14, ...cardStyle }}>
            <h4 style={{ fontSize: 12, fontWeight: 800, margin: "0 0 12px", color: "#8B5CF6", textTransform: "uppercase", letterSpacing: 1 }}>{T("yourPastNotes")}</h4>
            {journalEntries.slice(-3).map(j => (
              <div key={j.id} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 10, marginBottom: 8, borderLeft: `3px solid ${selProgram.color}` }}>
                <div style={{ fontSize: 11, color: C.t3, marginBottom: 4 }}>{new Date(j.date).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", day: "numeric" })} · {["😟","😐","🙂","😊","🤩"][j.rating - 1]} {j.rating}/5</div>
                <p style={{ fontSize: 13, color: C.t2, margin: 0, lineHeight: 1.5 }}>{j.note}</p>
              </div>
            ))}
          </div>
        )}

        {/* Complete */}
        {!done ? (
          <button onClick={() => triggerComplete(ex.id, selLevel.id, selProgram.id)}
            style={{ width: "100%", padding: "20px", marginTop: 24, fontSize: 16, fontWeight: 800, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer", boxShadow: "0 8px 32px rgba(34,197,94,0.25)" }}>
            {T("markComplete")}
          </button>
        ) : (
          <div style={{ marginTop: 24, padding: "18px", textAlign: "center", background: "rgba(34,197,94,0.08)", borderRadius: C.rL, border: "1px solid rgba(34,197,94,0.2)" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.acc }}>{T("exerciseCompleted")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
