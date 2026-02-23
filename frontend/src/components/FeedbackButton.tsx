import { MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const SCREENS_WITH_NAV = ["home", "badges", "profile", "journal"];

export default function FeedbackButton() {
  const { screen, setShowFeedback } = useApp();

  if (!SCREENS_WITH_NAV.includes(screen)) return null;

  return (
    <button
      onClick={() => setShowFeedback(true)}
      className="fixed bottom-[88px] end-5 z-[90] w-12 h-12 rounded-2xl bg-surface border border-border cursor-pointer flex items-center justify-center text-text shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-transform hover:scale-[1.08] hover:shadow-[0_4px_24px_rgba(34,197,94,0.3)]"
    >
      <MessageSquare size={22} />
    </button>
  );
}
