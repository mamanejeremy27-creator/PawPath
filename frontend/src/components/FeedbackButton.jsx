import { MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const C = { s1: "#131316", b1: "rgba(255,255,255,0.06)", acc: "#22C55E" };

const SCREENS_WITH_NAV = ["home", "badges", "profile", "journal"];

export default function FeedbackButton() {
  const { screen, setShowFeedback } = useApp();

  if (!SCREENS_WITH_NAV.includes(screen)) return null;

  return (
    <button
      onClick={() => setShowFeedback(true)}
      style={{
        position: "fixed",
        bottom: 88,
        right: 20,
        zIndex: 90,
        width: 48,
        height: 48,
        borderRadius: 16,
        background: C.s1,
        border: `1px solid ${C.b1}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#F5F5F7",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.08)";
        e.currentTarget.style.boxShadow = `0 4px 24px rgba(34,197,94,0.3)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
      }}
    >
      <MessageSquare size={22} />
    </button>
  );
}
