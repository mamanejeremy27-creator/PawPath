import { useApp } from "../context/AppContext.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E" };

export default function StageTransitionModal() {
  const { stageTransition, setStageTransition, dogProfile, T } = useApp();
  if (!stageTransition) return null;

  const { stage, emoji, color } = stageTransition;
  const stageKey = `stage${stage.charAt(0).toUpperCase() + stage.slice(1)}`;

  return (
    <div
      onClick={() => setStageTransition(null)}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.s1, borderRadius: 28,
          padding: "48px 36px 36px", textAlign: "center",
          maxWidth: 340, width: "90%",
          border: `1px solid ${color}33`,
          boxShadow: `0 0 80px ${color}22`,
          animation: "fadeIn 0.4s ease",
        }}
      >
        {/* Big emoji */}
        <div style={{
          fontSize: 64, marginBottom: 16,
          filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))",
        }}>
          {emoji}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 24, fontWeight: 800,
          color: C.t1, margin: "0 0 8px",
        }}>
          {T("newStageUnlocked")}
        </h2>

        {/* Subtitle */}
        <p style={{ fontSize: 15, color: C.t2, margin: "0 0 4px" }}>
          {dogProfile?.name} {T("congratsNewStage")}
        </p>

        {/* Stage name */}
        <div style={{
          display: "inline-block",
          padding: "8px 20px", borderRadius: 50,
          background: `${color}18`, color,
          fontSize: 16, fontWeight: 700,
          marginTop: 16,
        }}>
          {T(stageKey)}
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setStageTransition(null)}
          style={{
            display: "block", width: "100%",
            marginTop: 28, padding: "14px",
            background: color, color: "#000",
            border: "none", borderRadius: 50,
            fontSize: 15, fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {T("stageInfo")} →
        </button>
      </div>
    </div>
  );
}
