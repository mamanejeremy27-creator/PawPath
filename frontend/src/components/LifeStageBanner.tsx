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
      className="px-5 py-4 bg-white rounded-2xl cursor-pointer flex items-center gap-4 brut-border brut-shadow hover:-translate-y-1 transition-transform"
    >
      {/* Emoji circle */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-3xl shrink-0 brut-border-sm brut-shadow-sm rotate-[-4deg]"
        style={{ backgroundColor: color }}
      >
        {emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[16px] font-black text-black">{T(stageKey)}</span>
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-sm brut-border-sm uppercase tracking-wider"
            style={{ backgroundColor: color, color: '#000' }}
          >
            {T(sizeKey)}
          </span>
        </div>
        <div className="text-[12px] font-bold text-muted">
          {dogProfile?.name} · {ageMonths}{" "}
          {T("monthsUntilNext").includes("months") ? "months" : T("daysAgo")}
        </div>
        {next && (
          <div className="text-[11px] font-bold text-black mt-2 flex items-center gap-1 bg-gray-100 inline-flex px-2 py-1 rounded-md brut-border-sm">
            <span>{next.emoji}</span>
            <span>
              {next.monthsUntil} {T("monthsUntilNext")}{" "}
              {T(`stage${next.stage.charAt(0).toUpperCase() + next.stage.slice(1)}`)}
            </span>
          </div>
        )}
      </div>

      {/* Arrow */}
      <div className="shrink-0 bg-gray-100 p-2 rounded-full brut-border-sm">
        <ChevronRight size={20} strokeWidth={3} className="text-black" />
      </div>
    </div>
  );
}
