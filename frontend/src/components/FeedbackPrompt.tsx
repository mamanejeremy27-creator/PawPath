import { PawPrint } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

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
    <div className="fixed bottom-[88px] start-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[440px] z-[200] [animation:slideUp_0.4s_ease]">
      <div className="bg-surface border border-border rounded-[20px] px-5 pt-5 pb-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 mb-3.5">
          <PawPrint size={28} color="#22C55E" />
          <div className="flex-1">
            <div className="text-[15px] font-bold text-text">{T("enjoyingPawPath")}</div>
            <div className="text-[13px] text-muted mt-0.5">{T("sendFeedback")}</div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={handleRate}
            className="flex-1 py-3 text-[14px] font-bold bg-training text-black border-none rounded-[14px] cursor-pointer shadow-[0_4px_16px_rgba(34,197,94,0.2)]"
          >
            {T("rateTheApp")}
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 py-3 text-[14px] font-bold bg-white/[0.04] text-muted border border-border rounded-[14px] cursor-pointer"
          >
            {T("maybeLater")}
          </button>
        </div>
      </div>
    </div>
  );
}
