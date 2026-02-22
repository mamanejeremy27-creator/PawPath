import { useApp } from "../context/AppContext.jsx";
import { ChevronRight } from "lucide-react";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E" };

export default function LifeStageBanner() {
  const { lifeStageData, dogProfile, T, nav } = useApp();
  if (!lifeStageData) return null;

  const { stage, emoji, color, ageMonths, size, next } = lifeStageData;
  const stageKey = `stage${stage.charAt(0).toUpperCase() + stage.slice(1)}`;
  const sizeKey = `size${size.charAt(0).toUpperCase() + size.slice(1)}`;

  return (
    <div
      onClick={() => nav("lifeStageDetail")}
      style={{
        padding: "16px 20px",
        background: C.s1,
        borderRadius: 20,
        border: `1px solid ${color}22`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      {/* Emoji circle */}
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        background: `${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, flexShrink: 0,
      }}>
        {emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{T(stageKey)}</span>
          <span style={{ fontSize: 11, color, fontWeight: 600, background: `${color}18`, padding: "2px 8px", borderRadius: 8 }}>
            {T(sizeKey)}
          </span>
        </div>
        <div style={{ fontSize: 12, color: C.t3 }}>
          {dogProfile?.name} · {ageMonths} {T("monthsUntilNext").includes("months") ? "months" : T("daysAgo")}
        </div>
        {next && (
          <div style={{ fontSize: 12, color: C.t2, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <span>{next.emoji}</span>
            <span>{next.monthsUntil} {T("monthsUntilNext")} {T(`stage${next.stage.charAt(0).toUpperCase() + next.stage.slice(1)}`)}</span>
          </div>
        )}
      </div>

      {/* Arrow */}
      <div style={{ flexShrink: 0 }}><ChevronRight size={16} color={C.t3} /></div>
    </div>
  );
}
