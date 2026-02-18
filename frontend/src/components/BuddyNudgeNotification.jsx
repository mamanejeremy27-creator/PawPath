import { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";

const C = { s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E" };

export default function BuddyNudgeNotification() {
  const { isAuthenticated, T } = useApp();
  const [nudge, setNudge] = useState(null);
  const [visible, setVisible] = useState(false);

  const checkNudges = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await api.getBuddies();
      const nudges = data.nudges || [];
      if (nudges.length > 0) {
        setNudge(nudges[0]);
        setVisible(true);
      }
    } catch {}
  }, [isAuthenticated]);

  // Check for nudges on mount and every 60 seconds
  useEffect(() => {
    checkNudges();
    const interval = setInterval(checkNudges, 60000);
    return () => clearInterval(interval);
  }, [checkNudges]);

  const dismiss = async () => {
    setVisible(false);
    if (nudge) {
      // Mark nudge as read; handled through buddy API
      // Check for more nudges after a brief delay
      setTimeout(checkNudges, 500);
    }
  };

  if (!visible || !nudge) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
        zIndex: 500, display: "flex", alignItems: "center", gap: 12,
        background: "rgba(20,20,24,0.95)", border: "1px solid rgba(34,197,94,0.25)",
        padding: "14px 20px", borderRadius: 20,
        boxShadow: "0 16px 48px rgba(0,0,0,0.6)", backdropFilter: "blur(24px)",
        animation: "badgeDrop 0.5s ease", cursor: "pointer",
        width: "calc(100% - 40px)", maxWidth: 360,
      }}
    >
      <span style={{ fontSize: 28, flexShrink: 0 }}>{"\uD83D\uDC4B"}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: C.acc, textTransform: "uppercase", letterSpacing: 2, fontWeight: 800 }}>
          {T("buddyNudge")}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, marginTop: 2 }}>
          {nudge.from_name || T("buddyTrainer")}
        </div>
        <div style={{ fontSize: 13, color: C.t3, marginTop: 2 }}>
          {nudge.message}
        </div>
      </div>
      <span style={{ fontSize: 11, color: C.t3, flexShrink: 0 }}>{T("tapDismiss")}</span>
    </div>
  );
}
