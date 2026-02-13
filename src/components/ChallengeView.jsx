import { useApp } from "../context/AppContext.jsx";
import { CHALLENGES, getWeekNumber } from "../data/challenges.js";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };

export default function ChallengeView() {
  const { challengeData, completeChallengeDay, challengeCelebration, setChallengeCelebration, nav, T, lang, programs } = useApp();
  if (!challengeData?.challenge) return null;

  const { challenge, todayDay, completedDays, daysRemaining, progress, nextWeekChallenge } = challengeData;
  const accent = challenge.color;

  // Find exercise/program references for GO navigation
  const findExercise = (exId) => {
    for (const p of programs) {
      for (const l of p.levels) {
        const ex = l.exercises.find(e => e.id === exId);
        if (ex) return { exercise: ex, level: l, program: p };
      }
    }
    return null;
  };

  // Celebration overlay
  if (challengeCelebration) {
    const cc = challengeCelebration;
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40, animation: "fadeIn 0.4s ease" }}>
        <div style={{ fontSize: 80, marginBottom: 20, animation: "badgeDrop 0.6s ease" }}>{cc.challenge?.emoji || "\uD83C\uDFC6"}</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: C.t1, margin: "0 0 8px" }}>{T("challengeCompleteTitle")}</h1>
        <p style={{ fontSize: 15, color: C.t2, margin: "0 0 24px", lineHeight: 1.6 }}>{T("challengeCompleteSub")}</p>

        <div style={{ padding: "16px 28px", background: "rgba(34,197,94,0.08)", borderRadius: C.rL, border: "1px solid rgba(34,197,94,0.2)", marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>{cc.challenge?.emoji}</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: C.acc }}>{lang === "he" ? cc.challenge?.nameHe : cc.challenge?.name}</span>
        </div>

        <div style={{ fontSize: 20, fontWeight: 800, color: accent || C.acc, marginBottom: 32 }}>+{cc.xp} XP {"\u26A1"}</div>

        {nextWeekChallenge && (
          <div style={{ padding: "14px 20px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}`, marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.t3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{T("nextWeekPreview")}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>{nextWeekChallenge.emoji}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{lang === "he" ? nextWeekChallenge.nameHe : nextWeekChallenge.name}</span>
            </div>
          </div>
        )}

        <button
          onClick={() => { setChallengeCelebration(null); nav("home"); }}
          style={{ padding: "14px 36px", fontSize: 15, fontWeight: 700, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer" }}
        >
          {"\uD83C\uDFE0"} {T("home")}
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 40, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Back button */}
      <div style={{ padding: "16px 20px 0" }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.t3, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
          {"\u2190"} {T("back")}
        </button>
      </div>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "20px 20px 0" }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>{challenge.emoji}</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: C.t1, margin: "0 0 6px" }}>
          {lang === "he" ? challenge.nameHe : challenge.name}
        </h1>
        <p style={{ fontSize: 14, color: C.t2, margin: 0, fontStyle: "italic" }}>
          "{lang === "he" ? challenge.descriptionHe : challenge.description}"
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{progress}/7</span>
          <span style={{ fontSize: 13, color: C.t3 }}>{daysRemaining} {T("daysRemaining")}</span>
        </div>
        <div style={{ height: 6, background: C.b1, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(progress / 7) * 100}%`, background: accent, borderRadius: 10, transition: "width 0.6s ease" }} />
        </div>
      </div>

      {/* Reward */}
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: `${accent}0A`, borderRadius: C.r, border: `1px solid ${accent}20` }}>
          <span style={{ fontSize: 18 }}>{"\uD83C\uDFC6"}</span>
          <span style={{ fontSize: 13, color: C.t2 }}>
            {T("challengeReward")}: <span style={{ fontWeight: 700, color: accent }}>{lang === "he" ? challenge.nameHe : challenge.name}</span> badge + <span style={{ fontWeight: 700, color: accent }}>{challenge.bonusXP} XP</span>
          </span>
        </div>
      </div>

      {/* Day list */}
      <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 6 }}>
        {challenge.days.map((d) => {
          const done = completedDays.includes(d.day);
          const isToday = d.day === todayDay;
          const isPast = d.day < todayDay && !done;
          const isFuture = d.day > todayDay;
          const ref = findExercise(d.exerciseId);

          let icon, iconColor;
          if (done) { icon = "\u2705"; iconColor = C.acc; }
          else if (isToday) { icon = "\uD83D\uDD35"; iconColor = accent; }
          else if (isPast) { icon = "\u274C"; iconColor = "#EF4444"; }
          else { icon = "\u26AA"; iconColor = C.t3; }

          return (
            <div
              key={d.day}
              style={{
                padding: isToday ? "16px 18px" : "12px 18px",
                background: isToday ? `${accent}0A` : C.s1,
                borderRadius: C.r,
                border: `1px solid ${isToday ? `${accent}30` : C.b1}`,
                display: "flex", alignItems: "center", gap: 12,
                ...(isToday && { boxShadow: `0 0 16px ${accent}15` }),
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: done ? C.t3 : (isToday ? C.t1 : (isPast ? "#EF4444" : C.t3)) }}>
                  {T("challengeDay")} {d.day}
                </div>
                <div style={{ fontSize: 12, color: done ? C.t3 : C.t2, marginTop: 2, ...(done && { textDecoration: "line-through", opacity: 0.6 }) }}>
                  {lang === "he" ? d.taskHe : d.task}
                </div>
              </div>
              {isToday && !done && ref && (
                <button
                  onClick={(e) => { e.stopPropagation(); nav("exercise", { program: ref.program, level: ref.level, exercise: ref.exercise }); }}
                  style={{
                    padding: "8px 18px", fontSize: 13, fontWeight: 800,
                    background: accent, color: "#000", border: "none",
                    borderRadius: 20, cursor: "pointer", flexShrink: 0,
                  }}
                >
                  {T("challengeGo")}
                </button>
              )}
              {isToday && !done && (
                <button
                  onClick={(e) => { e.stopPropagation(); completeChallengeDay(todayDay); }}
                  style={{
                    padding: "8px 14px", fontSize: 12, fontWeight: 700,
                    background: "transparent", color: accent, border: `1px solid ${accent}50`,
                    borderRadius: 20, cursor: "pointer", flexShrink: 0,
                  }}
                >
                  {"\u2713"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
