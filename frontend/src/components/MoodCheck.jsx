import { useApp } from "../context/AppContext.jsx";

const C = { s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", acc: "#22C55E", rL: 24 };

const MOODS = [
  { key: "nailed", emoji: "😊", color: "#22C55E" },
  { key: "getting", emoji: "😐", color: "#F59E0B" },
  { key: "tricky", emoji: "😕", color: "#EF4444" },
];

export default function MoodCheck() {
  const { moodCheck, recordMoodCheck, T } = useApp();
  if (!moodCheck) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
      padding: "20px 20px 36px", zIndex: 999,
      animation: "slideUp 0.3s ease",
    }}>
      <div style={{ textAlign: "center", fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 14 }}>
        {T("howDidThatGo")}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        {MOODS.map(m => (
          <button
            key={m.key}
            onClick={() => recordMoodCheck(moodCheck.exId, m.key)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              padding: "12px 18px", background: C.s1, borderRadius: C.rL,
              border: `1px solid ${C.b1}`, cursor: "pointer", minWidth: 80,
            }}
          >
            <span style={{ fontSize: 28 }}>{m.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: m.color }}>{T(m.key + "It")}</span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
