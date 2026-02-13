import { useState, useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { CHALLENGES } from "../data/challenges.js";
import BottomNav from "./BottomNav.jsx";
import LanguageToggle from "./LanguageToggle.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", danger: "#EF4444", r: 16 };

export default function Profile() {
  const { dogProfile, totalXP, currentStreak, completedExercises, completedLevels, earnedBadges, totalSessions, journal, playerLevel, resetAllData, T, badges, setShowFeedbackAdmin, dogs, activeDogId, switchDog, removeDog, dogCount, setShowAddDog, nav, challengeState, lang } = useApp();
  const uniqueActiveDays = new Set(journal.map(e => new Date(e.date).toDateString())).size;
  const hasEnoughForRecap = uniqueActiveDays >= 30;
  const [tapCount, setTapCount] = useState(0);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const tapTimer = useRef(null);

  const handleVersionTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    clearTimeout(tapTimer.current);
    if (newCount >= 5) {
      setTapCount(0);
      setShowFeedbackAdmin(true);
    } else {
      tapTimer.current = setTimeout(() => setTapCount(0), 2000);
    }
  };

  const dogEntries = Object.entries(dogs);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      <div style={{ textAlign: "center", padding: "40px 20px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: 20, insetInlineEnd: 20 }}>
          <LanguageToggle />
        </div>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: C.s1, border: `2px solid ${C.acc}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{"\uD83D\uDC15"}</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: "16px 0 0", color: C.t1 }}>{dogProfile?.name}</h2>
        <p style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>{dogProfile?.breed} · {dogProfile?.age}</p>
        <div style={{ marginTop: 12, display: "inline-block", padding: "8px 22px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 24, color: C.acc, fontSize: 14, fontWeight: 700 }}>{T("level")} {playerLevel.level} — {playerLevel.title}</div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Stats */}
        {[
          [T("totalXP"), `${totalXP} ${T("xp")}`],
          [T("streak"), `${currentStreak} ${T("dayStreak")} \uD83D\uDD25`],
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

        {/* My Dogs section */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: "0 0 16px" }}>{T("myDogs")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {dogEntries.map(([id, dog]) => {
              const isActive = id === activeDogId;
              return (
                <div key={id} style={{ padding: "16px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${isActive ? "rgba(34,197,94,0.3)" : C.b1}`, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: isActive ? "rgba(34,197,94,0.1)" : C.b1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {"\uD83D\uDC3E"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{dog.profile?.name}</div>
                    <div style={{ fontSize: 12, color: C.t3 }}>
                      {dog.profile?.breed}
                      {isActive && <span style={{ color: C.acc, marginInlineStart: 8, fontWeight: 600 }}>{T("activeDog")}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {!isActive && (
                      <button onClick={() => switchDog(id)} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, background: "rgba(34,197,94,0.1)", color: C.acc, border: "none", borderRadius: 20, cursor: "pointer" }}>
                        {T("switchDog")}
                      </button>
                    )}
                    {dogCount > 1 && (
                      <button onClick={() => setConfirmRemove(id)} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, background: "rgba(239,68,68,0.08)", color: C.danger, border: "none", borderRadius: 20, cursor: "pointer" }}>
                        {T("removeDog")}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {dogCount < 2 && (
              <button onClick={() => setShowAddDog(true)} style={{ padding: "16px", background: "transparent", border: `1px dashed ${C.t3}`, borderRadius: C.r, color: C.t3, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                + {T("addDog")}
              </button>
            )}
          </div>
        </div>

        {/* Challenge History */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: "0 0 16px" }}>{T("challengeHistory")}</h3>
          {challengeState.history.length > 0 ? (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1, textAlign: "center", padding: "12px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>{challengeState.stats.totalCompleted}</div>
                  <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("completed")}</div>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "12px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>{challengeState.stats.currentStreak}</div>
                  <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("weeks")}</div>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "12px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>{challengeState.stats.bestStreak}</div>
                  <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("challengeBestStreak")}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {challengeState.history.slice().reverse().map((h, i) => {
                  const chDef = CHALLENGES.find(c => c.id === h.challengeId);
                  return (
                    <div key={i} style={{ padding: "12px 16px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}`, display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 20 }}>{chDef?.emoji || "\uD83C\uDFC6"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{lang === "he" ? chDef?.nameHe : chDef?.name}</div>
                        <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>
                          {h.completedDays.length}/7 {T("challengeDay")}s · {h.fullComplete ? T("fullCompletion") : T("partialCompletion")} · +{h.xpEarned} XP
                        </div>
                      </div>
                      {h.fullComplete && <span style={{ fontSize: 14 }}>{"\u2705"}</span>}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p style={{ fontSize: 13, color: C.t3, lineHeight: 1.6 }}>{T("noChallengesYet")}</p>
          )}
        </div>

        <div style={{ marginTop: 32 }}>
          <button onClick={() => hasEnoughForRecap && nav("annualRecap")}
            style={{ width: "100%", padding: "16px", fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(139,92,246,0.08))", color: hasEnoughForRecap ? C.acc : C.t3, border: `1px solid rgba(34,197,94,0.2)`, borderRadius: C.r, cursor: hasEnoughForRecap ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: hasEnoughForRecap ? 1 : 0.7 }}>
            {"\uD83C\uDF1F"} {T("viewRecap")}
          </button>
          {!hasEnoughForRecap && (
            <p style={{ fontSize: 12, color: C.t3, textAlign: "center", margin: "8px 0 0", lineHeight: 1.5 }}>{T("keepTrainingRecap")}</p>
          )}
        </div>

        <button onClick={resetAllData}
          style={{ marginTop: 16, width: "100%", padding: "14px", fontSize: 14, fontWeight: 600, background: "rgba(239,68,68,0.08)", color: C.danger, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: C.r, cursor: "pointer" }}>{T("resetAllData")}</button>
        <div
          onClick={handleVersionTap}
          style={{ textAlign: "center", marginTop: 24, padding: "12px 0", fontSize: 12, color: C.t3, cursor: "default", userSelect: "none" }}
        >
          v2.0.0
        </div>
      </div>

      {/* Confirm remove modal */}
      {confirmRemove && (
        <div onClick={() => setConfirmRemove(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.s1, borderRadius: 24, padding: "28px 24px", maxWidth: 320, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u26A0\uFE0F"}</div>
            <p style={{ fontSize: 15, color: C.t1, margin: "0 0 20px", lineHeight: 1.6 }}>
              {T("confirmRemoveDog").replace("{name}", dogs[confirmRemove]?.profile?.name || "")}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmRemove(null)} style={{ flex: 1, padding: "12px", fontSize: 14, fontWeight: 600, background: "transparent", color: C.t3, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>
                {T("back")}
              </button>
              <button onClick={() => { removeDog(confirmRemove); setConfirmRemove(null); }} style={{ flex: 1, padding: "12px", fontSize: 14, fontWeight: 700, background: C.danger, color: "#fff", border: "none", borderRadius: 50, cursor: "pointer" }}>
                {T("removeDog")}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="profile" />
    </div>
  );
}
