import { Snowflake } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };

export default function StreakWidget() {
  const { streakData, nav, T, lang } = useApp();
  const { current, fire, nextMilestone, progress, freezesAvailable } = streakData;

  return (
    <button
      onClick={() => nav("streakView")}
      style={{
        width: "100%", textAlign: "start", cursor: "pointer",
        padding: "16px 18px", background: C.s1, borderRadius: C.rL,
        border: `1px solid ${current > 0 ? "rgba(34,197,94,0.15)" : C.b1}`,
        color: C.t1, display: "flex", flexDirection: "column", gap: 8,
      }}
    >
      {/* Streak count + fire */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22, animation: current > 0 ? "pulse 2s infinite" : "none" }}>{fire}</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: C.t1 }}>{current}</span>
          <span style={{ fontSize: 13, color: C.t3, fontWeight: 600 }}>{T("dayStreak")}</span>
        </div>
        {freezesAvailable > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.t3 }}>
            {Array.from({ length: freezesAvailable }).map((_, i) => (
              <Snowflake key={i} size={14} color="#93C5FD" />
            ))}
            <span style={{ marginInlineStart: 2 }}>{freezesAvailable}</span>
          </div>
        )}
      </div>

      {/* Progress bar toward next milestone */}
      {nextMilestone && (
        <>
          <div style={{ width: "100%", height: 4, background: C.b1, borderRadius: 10, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${Math.min(progress * 100, 100)}%`,
              background: "linear-gradient(90deg, #22C55E, #4ADE80)",
              borderRadius: 10, transition: "width 0.6s ease",
            }} />
          </div>
          <div style={{ fontSize: 11, color: C.t3, display: "flex", justifyContent: "space-between", width: "100%" }}>
            <span>{T("nextReward")}: {lang === "he" ? (nextMilestone.nameHe || nextMilestone.name) : nextMilestone.name}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name={nextMilestone.icon || "Trophy"} size={11} color={C.t3} /> {nextMilestone.days} {T("daysOfStreak")}</span>
          </div>
        </>
      )}
    </button>
  );
}
