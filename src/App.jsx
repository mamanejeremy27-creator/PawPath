import { useApp } from "./context/AppContext.jsx";
import { useAuth } from "./hooks/useAuth.js";
import Auth from "./components/Auth.jsx";
import Splash from "./components/Splash.jsx";
import Onboarding from "./components/Onboarding.jsx";
import Home from "./components/Home.jsx";
import ProgramView from "./components/ProgramView.jsx";
import LevelView from "./components/LevelView.jsx";
import ExerciseView from "./components/ExerciseView.jsx";
import JournalList from "./components/JournalList.jsx";
import Badges from "./components/Badges.jsx";
import Profile from "./components/Profile.jsx";
import GearShop from "./components/GearShop.jsx";
import RemindersModal from "./components/RemindersModal.jsx";
import JournalModal from "./components/JournalModal.jsx";
import FeedbackButton from "./components/FeedbackButton.jsx";
import FeedbackModal from "./components/FeedbackModal.jsx";
import FeedbackPrompt from "./components/FeedbackPrompt.jsx";
import FeedbackAdmin from "./components/FeedbackAdmin.jsx";
import LifeStageDetail from "./components/LifeStageDetail.jsx";
import StageTransitionModal from "./components/StageTransitionModal.jsx";
import MilestoneCards from "./components/MilestoneCards.jsx";
import AddDogModal from "./components/AddDogModal.jsx";
import MemoryDetail from "./components/MemoryDetail.jsx";
import AnnualRecap from "./components/AnnualRecap.jsx";
import ChallengeView from "./components/ChallengeView.jsx";
import StreakView from "./components/StreakView.jsx";
import StreakBrokenScreen from "./components/StreakBrokenScreen.jsx";
import MilestoneUnlockModal from "./components/MilestoneUnlockModal.jsx";
import DiagnosticFlow from "./components/DiagnosticFlow.jsx";

const C = { bg: "#0A0A0C", t1: "#F5F5F7", acc: "#22C55E" };

export default function App() {
  const { screen, xpAnim, newBadge, rtl, challengeDayToast, T, streakFreezeNotif } = useApp();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, color: C.t1, minHeight: "100vh", maxWidth: 480, margin: "0 auto", WebkitFontSmoothing: "antialiased", direction: rtl ? "rtl" : "ltr", textAlign: rtl ? "right" : "left" }}>
        <Auth />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, color: C.t1, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", WebkitFontSmoothing: "antialiased", direction: rtl ? "rtl" : "ltr", textAlign: rtl ? "right" : "left" }}>
      {/* XP Animation */}
      {xpAnim && (
        <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 400, animation: "xpFloat 2s ease forwards", background: C.acc, color: "#000", padding: "12px 28px", borderRadius: 24, fontSize: 18, fontWeight: 800, boxShadow: "0 8px 32px rgba(34,197,94,0.4)" }}>
          +{xpAnim} XP ⚡
        </div>
      )}

      {/* Badge Notification */}
      {newBadge && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 400, display: "flex", alignItems: "center", gap: 14, background: "rgba(20,20,24,0.95)", border: "1px solid rgba(34,197,94,0.25)", padding: "16px 24px", borderRadius: 20, boxShadow: "0 16px 48px rgba(0,0,0,0.6)", backdropFilter: "blur(24px)", animation: "badgeDrop 0.5s ease", width: "calc(100% - 40px)", maxWidth: 340 }}>
          <span style={{ fontSize: 36 }}>{newBadge.emoji}</span>
          <div>
            <div style={{ fontSize: 10, color: C.acc, textTransform: "uppercase", letterSpacing: 2, fontWeight: 800 }}>Achievement Unlocked</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.t1, marginTop: 2 }}>{newBadge.name}</div>
          </div>
        </div>
      )}

      {/* Screens */}
      {screen === "splash" && <Splash />}
      {screen === "onboard" && <Onboarding />}
      {screen === "home" && <Home />}
      {screen === "program" && <ProgramView />}
      {screen === "level" && <LevelView />}
      {screen === "exercise" && <ExerciseView />}
      {screen === "journal" && <JournalList />}
      {screen === "badges" && <Badges />}
      {screen === "profile" && <Profile />}
      {screen === "lifeStageDetail" && <LifeStageDetail />}
      {screen === "milestoneCards" && <MilestoneCards />}
      {screen === "memoryDetail" && <MemoryDetail />}
      {screen === "annualRecap" && <AnnualRecap />}
      {screen === "challenge" && <ChallengeView />}
      {screen === "streakView" && <StreakView />}
      {screen === "diagnostic" && <DiagnosticFlow />}

      {/* Streak Freeze Notification */}
      {streakFreezeNotif && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 400, display: "flex", alignItems: "center", gap: 10, background: "rgba(20,20,24,0.95)", border: "1px solid rgba(96,165,250,0.25)", padding: "14px 22px", borderRadius: 20, boxShadow: "0 12px 40px rgba(0,0,0,0.5)", backdropFilter: "blur(24px)", animation: "badgeDrop 0.5s ease", maxWidth: 340 }}>
          <span style={{ fontSize: 28 }}>{"\uD83E\uDDCA"}</span>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{T("streakFreezeUsed")}</div>
        </div>
      )}

      {/* Challenge Day Toast */}
      {challengeDayToast && (
        <div style={{ position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", zIndex: 400, background: "rgba(20,20,24,0.95)", border: "1px solid rgba(34,197,94,0.25)", padding: "12px 24px", borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", backdropFilter: "blur(16px)", animation: "badgeDrop 0.4s ease", textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{T("challengeDay")} {challengeDayToast.day} {"\u2705"}</div>
          <div style={{ fontSize: 12, color: "#A1A1AA", marginTop: 4 }}>{challengeDayToast.remaining} {T("moreToGo")}</div>
        </div>
      )}

      {/* Stage Transition */}
      <StageTransitionModal />

      {/* Feedback */}
      <FeedbackButton />
      <FeedbackPrompt />

      {/* Streak Overlays */}
      <StreakBrokenScreen />
      <MilestoneUnlockModal />

      {/* Modals */}
      <GearShop />
      <RemindersModal />
      <JournalModal />
      <FeedbackModal />
      <FeedbackAdmin />
      <AddDogModal />
    </div>
  );
}
