import { useApp } from "../context/AppContext.jsx";
import { hasPreviousMonthReport } from "../utils/monthlyStats.js";
import { CheckCircle2, Award, Trophy, ArrowRight, Users, Footprints, Heart } from "lucide-react";
import DailyPlan from "./DailyPlan.jsx";
import LifeStageBanner from "./LifeStageBanner.jsx";
import MemoryCard from "./MemoryCard.jsx";
import DogSwitcher from "./DogSwitcher.jsx";
import DogAvatar from "./DogAvatar.jsx";
import ChallengeBanner from "./ChallengeBanner.jsx";
import StreakWidget from "./StreakWidget.jsx";
import BottomNav from "./BottomNav.jsx";
import LanguageToggle from "./LanguageToggle.jsx";
import LostDogAlert from "./LostDogAlert.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };
const cardStyle = { padding: "18px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` };

export default function Home() {
  const { dogProfile, totalXP, playerLevel, xpProgress, completedExercises, earnedBadges, journal, nav, T, dogCount, activeDogId } = useApp();
  const showReportBanner = hasPreviousMonthReport(journal);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <DogAvatar key={activeDogId} size="small" dogId={activeDogId} />
          <div>
            <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{T("welcomeBack")}</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: "4px 0 0", color: C.t1 }}>{dogProfile?.name}</h1>
            <p style={{ fontSize: 13, color: C.t3, margin: "2px 0 0" }}>{dogProfile?.breed}</p>
          </div>
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

      {/* Lost Dog Alert (appears if nearby lost dogs detected) */}
      <LostDogAlert />

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
        {[{ v: completedExercises.length, l: T("done"), i: <CheckCircle2 size={18} color="#22C55E" strokeWidth={2} /> }, { v: earnedBadges.length, l: T("badges"), i: <Award size={18} color="#F59E0B" strokeWidth={2} /> }].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", padding: "14px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
            <div style={{ marginBottom: 4 }}>{s.i}</div>
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
            <Trophy size={28} color="#22C55E" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{T("reportReady")}</div>
              <div style={{ fontSize: 12, color: C.acc, fontWeight: 600, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>{T("viewReport")} <ArrowRight size={14} color={C.acc} /></div>
            </div>
          </button>
        </div>
      )}

      <MemoryCard />
      <DailyPlan />
      <ChallengeBanner />

      {/* Quick-access row: Community · Walk · Health */}
      <div style={{ display: "flex", gap: 10, padding: "20px 20px 0" }}>
        <button onClick={() => nav("community")} style={{ flex: 1, padding: "14px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: C.r, color: C.t1, cursor: "pointer", textAlign: "center" }}>
          <div style={{ marginBottom: 4, display: "flex", justifyContent: "center" }}><Users size={20} color="#22C55E" /></div>
          <div style={{ fontSize: 12, fontWeight: 700 }}>{T("community")}</div>
        </button>
        <button onClick={() => nav("walkTracker")} style={{ flex: 1, padding: "14px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: C.r, color: C.t1, cursor: "pointer", textAlign: "center" }}>
          <div style={{ marginBottom: 4, display: "flex", justifyContent: "center" }}><Footprints size={20} color="#3B82F6" /></div>
          <div style={{ fontSize: 12, fontWeight: 700 }}>{T("walkTracker")}</div>
        </button>
        <button onClick={() => nav("healthDashboard")} style={{ flex: 1, padding: "14px", background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.15)", borderRadius: C.r, color: C.t1, cursor: "pointer", textAlign: "center" }}>
          <div style={{ marginBottom: 4, display: "flex", justifyContent: "center" }}><Heart size={20} color="#EC4899" /></div>
          <div style={{ fontSize: 12, fontWeight: 700 }}>{T("healthDashboard")}</div>
        </button>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
