import { useApp } from "../context/AppContext.jsx";
import BottomNav from "./BottomNav.jsx";
import LanguageToggle from "./LanguageToggle.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", danger: "#EF4444", r: 16 };

export default function Profile() {
  const { dogProfile, totalXP, currentStreak, completedExercises, completedLevels, earnedBadges, totalSessions, journal, playerLevel, resetAllData, T, badges } = useApp();

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      <div style={{ textAlign: "center", padding: "40px 20px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: 20, insetInlineEnd: 20 }}>
          <LanguageToggle />
        </div>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: C.s1, border: `2px solid ${C.acc}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🐕</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: "16px 0 0", color: C.t1 }}>{dogProfile?.name}</h2>
        <p style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>{dogProfile?.breed} · {dogProfile?.age}</p>
        <div style={{ marginTop: 12, display: "inline-block", padding: "8px 22px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 24, color: C.acc, fontSize: 14, fontWeight: 700 }}>{T("level")} {playerLevel.level} — {playerLevel.title}</div>
      </div>
      <div style={{ padding: "0 20px" }}>
        {[
          [T("totalXP"), `${totalXP} ${T("xp")}`],
          [T("streak"), `${currentStreak} ${T("dayStreak")} 🔥`],
          [T("exercises"), completedExercises.length],
          [T("levels"), completedLevels.length],
          [T("badges"), `${earnedBadges.length}/${badges.length}`],
          [T("sessions"), totalSessions],
          [T("journalEntries"), journal.length],
        ].map(([l, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${C.b1}` }}>
            <span style={{ fontSize: 15, color: C.t3 }}>{l}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{v}</span>
          </div>
        ))}
        <button onClick={resetAllData}
          style={{ marginTop: 32, width: "100%", padding: "14px", fontSize: 14, fontWeight: 600, background: "rgba(239,68,68,0.08)", color: C.danger, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: C.r, cursor: "pointer" }}>{T("resetAllData")}</button>
      </div>
      <BottomNav active="profile" />
    </div>
  );
}
