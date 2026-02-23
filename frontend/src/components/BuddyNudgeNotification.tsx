import { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";

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
      className="fixed top-4 inset-x-4 z-[500] flex items-center gap-3 bg-surface border border-social/30 px-5 py-[14px] rounded-[20px] shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-[24px] animate-[badgeDrop_0.5s_ease] cursor-pointer max-w-[360px] mx-auto"
    >
      <span className="text-[28px] shrink-0">{"\uD83D\uDC4B"}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-training uppercase tracking-[2px] font-extrabold">
          {T("buddyNudge")}
        </div>
        <div className="text-sm font-bold text-text mt-0.5">
          {nudge.from_name || T("buddyTrainer")}
        </div>
        <div className="text-[13px] text-muted mt-0.5">
          {nudge.message}
        </div>
      </div>
      <span className="text-[11px] text-muted shrink-0">{T("tapDismiss")}</span>
    </div>
  );
}
