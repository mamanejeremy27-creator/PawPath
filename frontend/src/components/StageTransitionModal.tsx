import { useApp } from "../context/AppContext.jsx";
import { ArrowRight } from "lucide-react";

export default function StageTransitionModal() {
  const { stageTransition, setStageTransition, dogProfile, T } = useApp();
  if (!stageTransition) return null;

  const { stage, emoji, color } = stageTransition;
  const stageKey = `stage${stage.charAt(0).toUpperCase() + stage.slice(1)}`;

  return (
    <div
      onClick={() => setStageTransition(null)}
      className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center [animation:fadeIn_0.3s_ease]"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-surface rounded-[28px] px-9 pt-12 pb-9 text-center max-w-[340px] w-[90%] [animation:fadeIn_0.4s_ease]"
        style={{
          border: `1px solid ${color}33`,
          boxShadow: `0 0 80px ${color}22`,
        }}
      >
        {/* Big emoji */}
        <div className="text-[64px] mb-4 [filter:drop-shadow(0_4px_20px_rgba(0,0,0,0.3))]">
          {emoji}
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl font-extrabold text-text mb-2">
          {T("newStageUnlocked")}
        </h2>

        {/* Subtitle */}
        <p className="text-[15px] text-text-2 mb-1">
          {dogProfile?.name} {T("congratsNewStage")}
        </p>

        {/* Stage name — dynamic color kept as inline style */}
        <div
          className="inline-block px-5 py-2 rounded-full text-base font-bold mt-4"
          style={{ background: `${color}18`, color }}
        >
          {T(stageKey)}
        </div>

        {/* Dismiss button — dynamic bg color */}
        <button
          onClick={() => setStageTransition(null)}
          className="block w-full mt-7 py-3.5 border-none rounded-full text-[15px] font-bold text-black cursor-pointer"
          style={{ background: color }}
        >
          <span className="inline-flex items-center gap-1">{T("stageInfo")} <ArrowRight size={16} /></span>
        </button>
      </div>
    </div>
  );
}
