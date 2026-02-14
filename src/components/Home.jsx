import { useApp } from "../context/AppContext.jsx";
import { hasPreviousMonthReport } from "../utils/monthlyStats.js";
import { matchBreed } from "../data/breedTraits.js";
import DailyPlan from "./DailyPlan.jsx";
import SkillHealth from "./SkillHealth.jsx";
import LifeStageBanner from "./LifeStageBanner.jsx";
import MemoryCard from "./MemoryCard.jsx";
import DogSwitcher from "./DogSwitcher.jsx";
import ChallengeBanner from "./ChallengeBanner.jsx";
import StreakWidget from "./StreakWidget.jsx";
import BottomNav from "./BottomNav.jsx";
import LanguageToggle from "./LanguageToggle.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };
const cardStyle = { padding: "18px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` };

export default function Home() {
  const { dogProfile, totalXP, playerLevel, xpProgress, completedExercises, earnedBadges, journal, nav, setShowGear, setShowReminders, T, programs, dogCount } = useApp();
  const showReportBanner = hasPreviousMonthReport(journal);
  const breedData = matchBreed(dogProfile?.breed);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{T("welcomeBack")}</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: "4px 0 0", color: C.t1 }}>{dogProfile?.name}</h1>
          <p style={{ fontSize: 13, color: C.t3, margin: "2px 0 0" }}>{dogProfile?.breed}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LanguageToggle />
          <div style={{ textAlign: "center", background: C.s1, border: `1px solid ${C.b1}`, borderRadius: C.r, padding: "10px 18px" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.acc }}>{totalXP}</div>
            <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>{T("xp")}</div>
          </div>
        </div>
      </div>

      {dogCount > 1 && <DogSwitcher />}

      {/* Level bar */}
      <div style={{ margin: "16px 20px 0", ...cardStyle }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{T("level")} {playerLevel.level} — {playerLevel.title}</span>
          {playerLevel.next && <span style={{ fontSize: 13, color: C.t3 }}>{totalXP}/{playerLevel.next}</span>}
        </div>
        <div style={{ height: 6, background: C.b1, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(xpProgress, 100)}%`, background: "linear-gradient(90deg, #22C55E, #4ADE80)", borderRadius: 10, transition: "width 0.6s ease" }} />
        </div>
      </div>

      {/* Streak Widget */}
      <div style={{ padding: "12px 20px 0" }}>
        <StreakWidget />
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 10, padding: "10px 20px 0" }}>
        {[{ v: completedExercises.length, l: T("done"), i: "✅" }, { v: earnedBadges.length, l: T("badges"), i: "🏅" }].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", padding: "14px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 14, marginBottom: 2 }}>{s.i}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>{s.v}</div>
            <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 20px 0" }}><LifeStageBanner /></div>

      {/* Monthly Report Banner */}
      {showReportBanner && (
        <div style={{ padding: "12px 20px 0" }}>
          <button
            onClick={() => nav("milestoneCards")}
            style={{
              width: "100%", padding: "16px 20px",
              background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(59,130,246,0.08))",
              border: `1px solid rgba(34,197,94,0.2)`,
              borderRadius: C.rL, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 14,
              color: C.t1, textAlign: "start",
            }}
          >
            <span style={{ fontSize: 28 }}>{"\uD83C\uDFC6"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{T("reportReady")}</div>
              <div style={{ fontSize: 12, color: C.acc, fontWeight: 600, marginTop: 2 }}>{T("viewReport")} \u2192</div>
            </div>
          </button>
        </div>
      )}

      <MemoryCard />
      <SkillHealth />
      <DailyPlan />
      <ChallengeBanner />

      {/* Diagnostic Entry */}
      <div style={{ padding: "12px 20px 0" }}>
        <button
          onClick={() => nav("diagnostic")}
          style={{
            width: "100%", padding: "16px 20px",
            background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.06))",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: C.rL, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 14,
            color: C.t1, textAlign: "start",
          }}
        >
          <span style={{ fontSize: 28 }}>🩺</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{T("diagCardTitle")}</div>
            <div style={{ fontSize: 12, color: "#F59E0B", fontWeight: 600, marginTop: 2 }}>{T("diagCardSub")}</div>
          </div>
          <span style={{ color: C.t3, fontSize: 18 }}>›</span>
        </button>
      </div>

      {/* Emergency First Aid Entry */}
      <div style={{ padding: "12px 20px 0" }}>
        <button
          onClick={() => nav("emergency")}
          style={{
            width: "100%", padding: "16px 20px",
            background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(220,38,38,0.06))",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: C.rL, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 14,
            color: C.t1, textAlign: "start",
          }}
        >
          <span style={{ fontSize: 28 }}>{"\uD83D\uDEA8"}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{T("emergencyCardTitle")}</div>
            <div style={{ fontSize: 12, color: "#EF4444", fontWeight: 600, marginTop: 2 }}>{T("emergencyCardSub")}</div>
          </div>
          <span style={{ color: C.t3, fontSize: 18 }}>{"\u203A"}</span>
        </button>
      </div>

      {/* Dog Nutrition Guide Entry */}
      <div style={{ padding: "12px 20px 0" }}>
        <button
          onClick={() => nav("nutrition")}
          style={{
            width: "100%", padding: "16px 20px",
            background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.06))",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: C.rL, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 14,
            color: C.t1, textAlign: "start",
          }}
        >
          <span style={{ fontSize: 28 }}>{"\uD83E\uDD62"}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{T("nutritionCardTitle")}</div>
            <div style={{ fontSize: 12, color: C.acc, fontWeight: 600, marginTop: 2 }}>{T("nutritionCardSub")}</div>
          </div>
          <span style={{ color: C.t3, fontSize: 18 }}>{"\u203A"}</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "flex", gap: 10, padding: "20px 20px 0" }}>
        <button onClick={() => setShowGear(true)} style={{ flex: 1, padding: "14px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: C.r, color: C.t1, cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>🛒</div>
          <div style={{ fontSize: 12, fontWeight: 700 }}>{T("gearGuide")}</div>
        </button>
        <button onClick={() => setShowReminders(true)} style={{ flex: 1, padding: "14px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: C.r, color: C.t1, cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>⏰</div>
          <div style={{ fontSize: 12, fontWeight: 700 }}>{T("reminders")}</div>
        </button>
        <button onClick={() => nav("journal")} style={{ flex: 1, padding: "14px", background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: C.r, color: C.t1, cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>📝</div>
          <div style={{ fontSize: 12, fontWeight: 700 }}>{T("journal")}</div>
        </button>
      </div>

      {/* Programs */}
      <div style={{ padding: "24px 20px 8px" }}><h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: C.t1 }}>{T("programs")}</h2></div>
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        {programs.map((prog, idx) => {
          const unlocked = playerLevel.level >= prog.unlockLevel;
          const tot = prog.levels.reduce((a, l) => a + l.exercises.length, 0);
          const dn = prog.levels.reduce((a, l) => a + l.exercises.filter(e => completedExercises.includes(e.id)).length, 0);
          const pct = tot > 0 ? Math.round((dn / tot) * 100) : 0;
          return (
            <button key={prog.id} onClick={() => unlocked && nav("program", { program: prog })}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`, cursor: unlocked ? "pointer" : "default", opacity: unlocked ? 1 : 0.4, color: C.t1, textAlign: "start", width: "100%", animation: `fadeIn 0.3s ease ${idx * 0.04}s both` }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: prog.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{unlocked ? prog.emoji : "🔒"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{prog.name}</div>
                <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{unlocked ? `${dn}/${tot} ${T("exercises")}` : `${T("unlockAt")} ${prog.unlockLevel}`}</div>
                {unlocked && breedData && breedData.priorityPrograms.includes(prog.id) && (
                  <div style={{ marginTop: 4, display: "inline-block", padding: "2px 8px", borderRadius: 6, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", fontSize: 11, color: C.acc, fontWeight: 600 }}>{T("recommendedForBreed")}</div>
                )}
                {unlocked && dn > 0 && <div style={{ height: 3, background: C.b1, borderRadius: 10, overflow: "hidden", marginTop: 8 }}><div style={{ height: "100%", width: `${pct}%`, background: prog.gradient, borderRadius: 10 }} /></div>}
              </div>
              <span style={{ color: C.t3, fontSize: 18 }}>›</span>
            </button>
          );
        })}
      </div>
      {/* Community FAB */}
      <button
        onClick={() => nav("community")}
        style={{
          position: "fixed", bottom: 90, right: "calc(50% - 220px)",
          width: 52, height: 52, borderRadius: 26,
          background: C.acc, color: "#000", fontSize: 24, fontWeight: 800,
          border: "none", cursor: "pointer",
          boxShadow: "0 8px 32px rgba(34,197,94,0.3)",
          zIndex: 99, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >+</button>
      <BottomNav active="home" />
    </div>
  );
}
