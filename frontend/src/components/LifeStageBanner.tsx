import { useApp } from "../context/AppContext.jsx";
import { ChevronRight } from "lucide-react";

export default function LifeStageBanner() {
  const { lifeStageData, dogProfile, T, nav } = useApp();
  if (!lifeStageData) return null;

  const { stage, emoji, color, ageMonths, size, next } = lifeStageData;
  const stageKey = `stage${stage.charAt(0).toUpperCase() + stage.slice(1)}`;
  const sizeKey = `size${size.charAt(0).toUpperCase() + size.slice(1)}`;

  return (
    <div
      onClick={() => nav("lifeStageDetail")}
      className="px-5 py-4 bg-surface rounded-[20px] cursor-pointer flex items-center gap-3.5"
      style={{ border: `1px solid ${color}22` }}
    >
      {/* Emoji circle */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
        style={{ background: `${color}18` }}
      >
        {emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[15px] font-bold text-text">{T(stageKey)}</span>
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-lg"
            style={{ color, background: `${color}18` }}
          >
            {T(sizeKey)}
          </span>
        </div>
        <div className="text-[12px] text-muted">
          {dogProfile?.name} · {ageMonths}{" "}
          {T("monthsUntilNext").includes("months") ? "months" : T("daysAgo")}
        </div>
        {next && (
          <div className="text-[12px] text-text-2 mt-1 flex items-center gap-1">
            <span>{next.emoji}</span>
            <span>
              {next.monthsUntil} {T("monthsUntilNext")}{" "}
              {T(`stage${next.stage.charAt(0).toUpperCase() + next.stage.slice(1)}`)}
            </span>
          </div>
        )}
      </div>

      {/* Arrow */}
      <div className="shrink-0">
        <ChevronRight size={16} color="#71717A" />
      </div>
    </div>
  );
}
