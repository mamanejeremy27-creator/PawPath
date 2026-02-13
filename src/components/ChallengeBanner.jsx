import { useApp } from "../context/AppContext.jsx";

const C = { s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", rL: 24 };

export default function ChallengeBanner() {
  const { challengeData, nav, T, lang } = useApp();
  if (!challengeData?.challenge) return null;

  const { challenge, todayDay, todayTask, completedDays, todayCompleted, progress } = challengeData;
  const accent = challenge.color;
  const task = lang === "he" ? todayTask?.taskHe : todayTask?.task;

  return (
    <div style={{ padding: "12px 20px 0" }}>
      <button
        onClick={() => nav("challenge")}
        style={{
          width: "100%", padding: "18px 20px",
          background: `linear-gradient(135deg, ${accent}08, ${accent}14)`,
          border: `1px solid ${accent}30`,
          borderRadius: C.rL, cursor: "pointer",
          color: C.t1, textAlign: "start",
          animation: "fadeIn 0.3s ease",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>{challenge.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 1.5 }}>{T("thisWeeksChallenge")}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: accent }}>{progress}/7</span>
        </div>

        {/* Challenge name */}
        <div style={{ fontSize: 16, fontWeight: 800, color: C.t1, marginBottom: 8 }}>
          {lang === "he" ? challenge.nameHe : challenge.name}
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ height: "100%", width: `${(progress / 7) * 100}%`, background: accent, borderRadius: 10, transition: "width 0.6s ease" }} />
        </div>

        {/* Today's task */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, color: C.t2, flex: 1 }}>
            <span style={{ fontWeight: 700, color: todayCompleted ? accent : C.t1 }}>
              {T("challengeDay")} {todayDay}:
            </span>{" "}
            {task}
            {todayCompleted && <span style={{ marginInlineStart: 6 }}>{"\u2705"}</span>}
          </div>
          {!todayCompleted && (
            <span style={{ fontSize: 11, padding: "5px 12px", borderRadius: 20, background: accent, color: "#000", fontWeight: 700, marginInlineStart: 10, flexShrink: 0 }}>
              {T("challengeGo")} {"\u2192"}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
