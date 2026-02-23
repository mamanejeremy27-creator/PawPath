import { PawPrint } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const C = {
  s1: "#131316",
  b1: "rgba(255,255,255,0.06)",
  t1: "#F5F5F7",
  t3: "#71717A",
  acc: "#22C55E",
};

export default function FeedbackPrompt() {
  const { showFeedbackPrompt, setShowFeedbackPrompt, setShowFeedback, T } = useApp();

  if (!showFeedbackPrompt) return null;

  const handleRate = () => {
    setShowFeedbackPrompt(false);
    setShowFeedback(true);
  };

  const handleDismiss = () => {
    setShowFeedbackPrompt(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 88,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 40px)",
        maxWidth: 440,
        zIndex: 200,
        animation: "slideUp 0.4s ease",
      }}
    >
      <div
        style={{
          background: C.s1,
          border: `1px solid ${C.b1}`,
          borderRadius: 20,
          padding: "20px 20px 16px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <PawPrint size={28} color="#22C55E" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>
              {T("enjoyingPawPath")}
            </div>
            <div style={{ fontSize: 13, color: C.t3, marginTop: 2 }}>
              {T("sendFeedback")}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleRate}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              background: C.acc,
              color: "#000",
              border: "none",
              borderRadius: 14,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(34,197,94,0.2)",
            }}
          >
            {T("rateTheApp")}
          </button>
          <button
            onClick={handleDismiss}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              background: "rgba(255,255,255,0.04)",
              color: C.t3,
              border: `1px solid ${C.b1}`,
              borderRadius: 14,
              cursor: "pointer",
            }}
          >
            {T("maybeLater")}
          </button>
        </div>
      </div>
    </div>
  );
}
