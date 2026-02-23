import { useApp } from "./context/AppContext.jsx";
import { useAuth } from "./hooks/useAuth.js";
import Auth from "./components/Auth.jsx";
import Splash from "./components/Splash.jsx";
import Onboarding from "./components/Onboarding.jsx";
import Home from "./components/Home.jsx";
import TrainView from "./components/TrainView.jsx";
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
import EmergencyGuide from "./components/EmergencyGuide.jsx";
import EmergencyDetail from "./components/EmergencyDetail.jsx";
import VetDirectory from "./components/VetDirectory.jsx";
import NutritionGuide from "./components/NutritionGuide.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import CreatePost from "./components/CreatePost.jsx";
import CommunityFeed from "./components/CommunityFeed.jsx";
import BuddyFinder from "./components/BuddyFinder.jsx";
import BuddyDashboard from "./components/BuddyDashboard.jsx";
import BuddyNudgeNotification from "./components/BuddyNudgeNotification.jsx";
import WalkTracker from "./components/WalkTracker.jsx";
import WalkHistory from "./components/WalkHistory.jsx";
import WalkDetail from "./components/WalkDetail.jsx";
import HealthDashboard from "./components/HealthDashboard.jsx";
import WeightTracker from "./components/WeightTracker.jsx";
import VaccinationTracker from "./components/VaccinationTracker.jsx";
import VetVisitLog from "./components/VetVisitLog.jsx";
import MedicationTracker from "./components/MedicationTracker.jsx";
import ReportLostDog from "./components/ReportLostDog.jsx";
import LostDogTracker from "./components/LostDogTracker.jsx";
import ReportSighting from "./components/ReportSighting.jsx";
import LostDogPublicPage from "./components/LostDogPublicPage.jsx";
import LostDogFeedList from "./components/LostDogFeedList.jsx";
import { cn } from "./lib/cn.js";

export default function App() {
  const { screen, xpAnim, newBadge, rtl, challengeDayToast, T, streakFreezeNotif, nav } = useApp();
  const { user, loading } = useAuth();

  // Handle /lost/{shareToken} URL for public lost dog pages
  const lostMatch = typeof window !== "undefined" && window.location.pathname.match(/^\/lost\/([A-Za-z0-9]+)$/);
  if (lostMatch) {
    return (
      <div className={cn("min-h-screen max-w-[480px] mx-auto bg-bg text-text antialiased", rtl ? "rtl text-right" : "ltr text-left")}>
        <LostDogPublicPage shareTokenFromUrl={lostMatch[1]} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-10 h-10 border-4 border-black border-t-training rounded-full animate-spin brut-shadow-sm" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn("min-h-screen max-w-[480px] mx-auto bg-bg text-text antialiased", rtl ? "rtl text-right" : "ltr text-left")}>
        <Auth />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen max-w-[480px] mx-auto relative bg-bg text-text antialiased overflow-x-hidden", rtl ? "rtl text-right" : "ltr text-left")}>
      {/* XP Animation */}
      {xpAnim && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[400] animate-[xpFloat_2s_ease_forwards] bg-training text-black px-6 py-3 rounded-full text-xl font-black brut-border brut-shadow-sm">
          +{xpAnim} XP ⚡
        </div>
      )}

      {/* Badge Notification */}
      {newBadge && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 bg-white brut-border brut-shadow p-4 rounded-2xl animate-[badgeDrop_0.5s_ease] w-[calc(100%-40px)] max-w-[340px]">
          <span className="text-4xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{newBadge.emoji}</span>
          <div>
            <div className="text-[10px] text-black uppercase tracking-widest font-black bg-achieve inline-block px-1 mb-1 brut-border-sm">Achievement Unlocked</div>
            <div className="text-lg font-black text-black leading-tight">{newBadge.name}</div>
          </div>
        </div>
      )}

      {/* Screens */}
      {screen === "splash" && <Splash />}
      {screen === "onboard" && <Onboarding />}
      {screen === "home" && <Home />}
      {screen === "train" && <TrainView />}
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
      {screen === "emergency" && <EmergencyGuide />}
      {screen === "emergencyDetail" && <EmergencyDetail />}
      {screen === "vetDirectory" && <VetDirectory />}
      {screen === "nutrition" && <NutritionGuide />}
      {screen === "leaderboard" && <Leaderboard />}
      {screen === "createPost" && <CreatePost />}
      {screen === "community" && <CommunityFeed />}
      {screen === "buddyFinder" && <BuddyFinder />}
      {screen === "buddyDashboard" && <BuddyDashboard />}
      {screen === "walkTracker" && <WalkTracker />}
      {screen === "walkHistory" && <WalkHistory />}
      {screen === "walkDetail" && <WalkDetail />}
      {screen === "healthDashboard" && <HealthDashboard />}
      {screen === "weightTracker" && <WeightTracker />}
      {screen === "vaccinationTracker" && <VaccinationTracker />}
      {screen === "vetVisitLog" && <VetVisitLog />}
      {screen === "medicationTracker" && <MedicationTracker />}
      {screen === "reportLostDog" && <ReportLostDog />}
      {screen === "lostDogTracker" && <LostDogTracker />}
      {screen === "reportSighting" && <ReportSighting />}
      {screen === "lostDogPublic" && <LostDogPublicPage />}
      {screen === "lostDogFeedList" && <LostDogFeedList />}

      {/* Streak Freeze Notification */}
      {streakFreezeNotif && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 bg-health brut-border brut-shadow px-4 py-3 rounded-2xl animate-[badgeDrop_0.5s_ease] max-w-[340px]">
          <span className="text-3xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{"\uD83E\uDDCA"}</span>
          <div className="text-[13px] font-black text-black">{T("streakFreezeUsed")}</div>
        </div>
      )}

      {/* Challenge Day Toast */}
      {challengeDayToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[400] bg-white brut-border brut-shadow px-5 py-3 rounded-2xl animate-[badgeDrop_0.4s_ease] text-center">
          <div className="text-sm font-black text-black">{T("challengeDay")} {challengeDayToast.day} {"\u2705"}</div>
          <div className="text-xs font-bold text-muted mt-1">{challengeDayToast.remaining} {T("moreToGo")}</div>
        </div>
      )}

      {/* Buddy Nudge Notification */}
      <BuddyNudgeNotification />

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
