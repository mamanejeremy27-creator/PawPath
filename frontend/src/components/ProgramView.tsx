import { useApp } from "../context/AppContext.jsx";
import { Lock, Check, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import Icon from "./ui/Icon.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", s2: "#1A1A1F", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", rL: 24 };

export default function ProgramView() {
  const { selProgram, completedExercises, nav, T, rtl } = useApp();
  if (!selProgram) return null;
  const p = selProgram;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "24px 20px 32px", background: p.gradient, borderRadius: "0 0 32px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <button onClick={() => nav("home", { program: null })} style={{ background: "rgba(0,0,0,0.2)", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 16px", borderRadius: 20, marginBottom: 20, backdropFilter: "blur(10px)", display: "inline-flex", alignItems: "center", gap: 6 }}>
          {rtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />} {T("back")}
        </button>
        <div style={{ marginBottom: 12, width: 64, height: 64, borderRadius: 18, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={p.icon} size={32} color="#fff" />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, margin: 0, color: "#fff" }}>{p.name}</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 8, lineHeight: 1.6 }}>{p.description}</p>
        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.15)", padding: "5px 12px", borderRadius: 8, fontWeight: 600 }}>{p.difficulty}</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.15)", padding: "5px 12px", borderRadius: 8, fontWeight: 600 }}>{p.duration}</span>
        </div>
      </div>
      <div style={{ padding: "20px" }}>
        {p.levels.map((lv, idx) => {
          const dn = lv.exercises.filter(e => completedExercises.includes(e.id)).length;
          const tot = lv.exercises.length;
          const done = dn === tot;
          const prevOk = idx === 0 || p.levels[idx - 1].exercises.every(e => completedExercises.includes(e.id));
          const locked = idx > 0 && !prevOk;
          return (
            <button key={lv.id} onClick={() => !locked && nav("level", { level: lv })}
              style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", padding: "18px", marginBottom: 8, background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`, cursor: locked ? "default" : "pointer", opacity: locked ? 0.35 : 1, color: C.t1, textAlign: "start", animation: `fadeIn 0.3s ease ${idx * 0.06}s both` }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: done ? p.gradient : locked ? C.s2 : C.b1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: done ? 18 : 16, fontWeight: 800, color: done ? "#fff" : locked ? C.t3 : C.t1, flexShrink: 0 }}>{done ? <Check size={18} strokeWidth={3} /> : locked ? <Lock size={16} /> : idx + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{lv.name}</div>
                <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{dn}/{tot} · +{lv.xpReward} {T("xp")}</div>
                {dn > 0 && <div style={{ height: 3, background: C.b1, borderRadius: 10, overflow: "hidden", marginTop: 8 }}><div style={{ height: "100%", width: `${(dn / tot) * 100}%`, background: p.gradient, borderRadius: 10 }} /></div>}
              </div>
              <ChevronRight size={16} color={C.t3} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
