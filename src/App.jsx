import { useApp } from "./context/AppContext.jsx";
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

const C = { bg: "#0A0A0C", t1: "#F5F5F7", acc: "#22C55E" };

export default function App() {
  const { screen, xpAnim, newBadge, rtl } = useApp();

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

      {/* Stage Transition */}
      <StageTransitionModal />

      {/* Feedback */}
      <FeedbackButton />
      <FeedbackPrompt />

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
