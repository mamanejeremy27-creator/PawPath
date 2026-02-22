import { useApp } from "../context/AppContext.jsx";
import { Lightbulb } from "lucide-react";
import Icon from "./ui/Icon.jsx";

const C = { s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16 };

export default function DailyPlan() {
  const { dailyPlan, dailyMsg, nav, T, lang } = useApp();

  return (
    <div style={{ padding: "24px 20px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: C.t1 }}>{T("todaysPlan")}</h2>
        <span style={{ fontSize: 12, color: C.acc, fontWeight: 600 }}>
          {new Date().toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { weekday: "short", month: "short", day: "numeric" })}
        </span>
      </div>
      <div style={{ padding: "14px 18px", background: "rgba(34,197,94,0.05)", borderRadius: C.r, border: "1px solid rgba(34,197,94,0.1)", marginBottom: 12 }}>
        <p style={{ fontSize: 13, color: C.t2, margin: 0, lineHeight: 1.6, fontStyle: "italic", display: "flex", alignItems: "flex-start", gap: 6 }}><Lightbulb size={14} color={C.acc} style={{ flexShrink: 0, marginTop: 2 }} /> "{dailyMsg}"</p>
      </div>
      {dailyPlan.map((item, idx) => (
        <button key={idx} onClick={() => nav("exercise", { program: item.program, level: item.level, exercise: item.exercise })}
          style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px", marginBottom: 8, background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}`, cursor: "pointer", color: C.t1, textAlign: "start", animation: `fadeIn 0.3s ease ${idx * 0.05}s both` }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: item.program.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={item.program.icon} size={20} color="#fff" /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{item.exercise.name}</div>
            <div style={{ fontSize: 12, color: item.reason === "needsReview" ? "#EF4444" : C.t3, marginTop: 2 }}>{item.program.name} · {item.reason === "needsReview" ? T("needsReview") : item.reason === "continueProgress" ? T("continueProgress") : T("reviewReinforce")}</div>
          </div>
          <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, background: C.b1, color: C.t3, fontWeight: 600 }}>{Math.floor(item.exercise.duration / 60)}m</span>
        </button>
      ))}
    </div>
  );
}
