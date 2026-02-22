import { useApp } from "../context/AppContext.jsx";
import BadgeIcon from "./ui/BadgeIcon.jsx";
import { Palette, Crown, Medal, Snowflake } from "lucide-react";

const C = { s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E" };

export default function MilestoneUnlockModal() {
  const { milestoneUnlock, setMilestoneUnlock, T, lang } = useApp();
  if (!milestoneUnlock) return null;

  const m = milestoneUnlock;
  const name = lang === "he" ? (m.nameHe || m.name) : m.name;
  const desc = lang === "he" ? (m.descriptionHe || m.description) : m.description;

  return (
    <div
      onClick={() => setMilestoneUnlock(null)}
      style={{
        position: "fixed", inset: 0, zIndex: 600,
        background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.s1, borderRadius: 28, padding: "40px 28px", maxWidth: 320, width: "90%",
          textAlign: "center", border: `1px solid rgba(34,197,94,0.2)`,
          boxShadow: "0 0 60px rgba(34,197,94,0.15)", animation: "badgeDrop 0.5s ease",
        }}
      >
        {/* Celebration glow */}
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center", animation: "pulse 1.5s infinite", filter: "drop-shadow(0 0 12px rgba(34,197,94,0.4))" }}>
          <BadgeIcon icon={m.icon || "Award"} category={m.category || "streak"} size={80} earned={true} />
        </div>

        <div style={{ fontSize: 10, color: C.acc, textTransform: "uppercase", letterSpacing: 2, fontWeight: 800, marginBottom: 6 }}>
          {T("milestoneUnlocked")}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.t1, margin: "0 0 8px" }}>{name}</h2>
        <p style={{ fontSize: 14, color: C.t3, margin: "0 0 16px", lineHeight: 1.5 }}>{desc}</p>

        {m.xpBonus > 0 && (
          <div style={{
            display: "inline-block", padding: "8px 20px", background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)", borderRadius: 20,
            fontSize: 14, fontWeight: 700, color: C.acc, marginBottom: 8,
          }}>
            +{m.xpBonus} XP
          </div>
        )}

        {m.freezeReward && (
          <div style={{ fontSize: 13, color: "#60A5FA", marginBottom: 8 }}>
            <Snowflake size={14} color="#60A5FA" style={{ display: "inline", verticalAlign: "middle" }} /> {T("streakFreeze")} +1
          </div>
        )}

        {/* Reward type indicator */}
        <div style={{ fontSize: 12, color: C.t3, marginBottom: 20 }}>
          {m.reward === "theme" && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Palette size={14} /> {T("themes")}</span>}
          {m.reward === "avatar" && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Crown size={14} /> {T("accessories")}</span>}
          {m.reward === "badge" && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Medal size={14} /> {T("badges")}</span>}
        </div>

        <button
          onClick={() => setMilestoneUnlock(null)}
          style={{
            padding: "14px 36px", fontSize: 15, fontWeight: 700,
            background: C.acc, color: "#000", border: "none", borderRadius: 50,
            cursor: "pointer",
          }}
        >
          {T("back")}
        </button>
      </div>
    </div>
  );
}
