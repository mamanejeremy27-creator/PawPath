import { useApp } from "../context/AppContext.jsx";
import { RefreshCw, ArrowRight } from "lucide-react";

export default function StreakBrokenScreen() {
  const { streakBrokenModal, setStreakBrokenModal, startRecovery, T } = useApp();
  if (!streakBrokenModal) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-black/[0.92] flex items-center justify-center animate-[fadeIn_0.3s_ease]">
      <div className="bg-surface rounded-[28px] px-7 py-9 max-w-[340px] w-[90%] text-center border border-border">
        <div className="text-[56px] mb-4">😢</div>
        <h2 className="text-[22px] font-black text-text m-0 mb-2">{T("streakBroken")}</h2>
        <p className="text-sm text-muted m-0 mb-2 leading-relaxed">
          {streakBrokenModal.previous} {T("dayStreak")}
        </p>
        <p className="text-sm text-xp m-0 mb-6 leading-relaxed">
          {T("dontWorry")}
        </p>

        {/* Recovery Challenge */}
        <div className="bg-training/[0.06] border border-training/15 rounded-[20px] px-4 py-[18px] mb-5">
          <RefreshCw size={28} className="text-training mb-2 mx-auto" />
          <div className="text-[15px] font-bold text-text mb-1">{T("recoveryChallenge")}</div>
          <div className="text-[13px] text-muted mb-3.5 leading-relaxed">{T("trainToRecover")}</div>
          <button
            onClick={startRecovery}
            className="px-7 py-3 text-sm font-bold bg-training text-black border-0 rounded-full cursor-pointer"
          >
            <span className="inline-flex items-center gap-1.5">
              {T("startRecovery")} <ArrowRight size={14} />
            </span>
          </button>
        </div>

        <p className="text-xs text-muted leading-relaxed m-0 mb-4">
          {T("rewardsSafe")}
        </p>

        <button
          onClick={() => setStreakBrokenModal(null)}
          className="px-6 py-2.5 text-[13px] font-semibold bg-transparent text-muted border border-border rounded-full cursor-pointer"
        >
          {T("back")}
        </button>
      </div>
    </div>
  );
}
