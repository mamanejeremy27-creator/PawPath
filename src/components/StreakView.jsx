import { useApp } from "../context/AppContext.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };

export default function StreakView() {
  const { streakData, nav, T, lang, STREAK_MILESTONES } = useApp();
  const { current, best, fire, freezesAvailable, totalTrainingDays, freezesUsed, unlockedMilestones, progress, nextMilestone, recovery } = streakData;

  const nextFreezeMs = STREAK_MILESTONES.find(m => m.freezeReward && m.days > current);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 40, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.t3, fontSize: 24, cursor: "pointer", padding: 0 }}>{"\u2190"}</button>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: C.t1, margin: 0 }}>{T("streakDetails")}</h2>
      </div>

      {/* Streak hero */}
      <div style={{ textAlign: "center", padding: "24px 20px 32px" }}>
        <div style={{ fontSize: 48, animation: "pulse 2s infinite" }}>{fire}</div>
        <div style={{ fontSize: 42, fontWeight: 800, color: C.t1, marginTop: 8 }}>{current}</div>
        <div style={{ fontSize: 16, color: C.t3, fontWeight: 600 }}>{T("dayStreak")}</div>
        <div style={{ fontSize: 13, color: C.t3, marginTop: 8 }}>{T("bestStreakLabel")}: {best} {T("daysOfStreak")}</div>
        {recovery.active && (
          <div style={{ marginTop: 12, padding: "8px 18px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 20, display: "inline-block", fontSize: 13, color: "#F59E0B", fontWeight: 600 }}>
            {T("recoveryChallenge")}: {recovery.daysCompleted}/3
          </div>
        )}
      </div>

      {/* Milestones */}
      <div style={{ padding: "0 20px", marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{T("milestones")}</div>
        <div style={{ background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`, overflow: "hidden" }}>
          {STREAK_MILESTONES.map((m, i) => {
            const unlocked = unlockedMilestones.includes(m.rewardId);
            const isNext = nextMilestone && m.rewardId === nextMilestone.rewardId;
            return (
              <div key={m.rewardId} style={{
                padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
                borderBottom: i < STREAK_MILESTONES.length - 1 ? `1px solid ${C.b1}` : "none",
                opacity: unlocked ? 1 : isNext ? 0.85 : 0.4,
              }}>
                <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>
                  {unlocked ? "\u2705" : isNext ? "\uD83D\uDD13" : "\uD83D\uDD12"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: unlocked ? C.t1 : C.t3 }}>
                    {m.days} {T("daysOfStreak")} — {lang === "he" ? (m.nameHe || m.name) : m.name}
                  </div>
                  {isNext && (
                    <div style={{ height: 3, background: C.b1, borderRadius: 10, overflow: "hidden", marginTop: 6, maxWidth: 120 }}>
                      <div style={{ height: "100%", width: `${progress * 100}%`, background: C.acc, borderRadius: 10 }} />
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 18 }}>{m.emoji}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak Freezes */}
      <div style={{ padding: "0 20px", marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{T("streakFreeze")}</div>
        <div style={{ background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ fontSize: 20, opacity: i < freezesAvailable ? 1 : 0.2 }}>{"\uD83E\uDDCA"}</span>
            ))}
            <span style={{ fontSize: 14, color: C.t1, fontWeight: 700, marginInlineStart: 8 }}>{freezesAvailable}/3 {T("freezesAvailable")}</span>
          </div>
          {nextFreezeMs && (
            <div style={{ fontSize: 12, color: C.t3 }}>
              {T("nextReward")}: {nextFreezeMs.days} {T("daysOfStreak")}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "0 20px", marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Stats</div>
        <div style={{ background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` }}>
          {[
            [T("currentStreak"), `${current} ${T("daysOfStreak")}`],
            [T("bestStreakLabel"), `${best} ${T("daysOfStreak")}`],
            [T("totalTrainingDays"), totalTrainingDays],
            [T("freezesUsed"), freezesUsed],
          ].map(([label, val], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", borderBottom: i < 3 ? `1px solid ${C.b1}` : "none" }}>
              <span style={{ fontSize: 14, color: C.t3 }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
