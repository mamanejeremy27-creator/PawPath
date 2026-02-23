import { Snowflake } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";
import { cn } from "../lib/cn";

export default function StreakWidget() {
  const { streakData, nav, T, lang } = useApp();
  const { current, fire, nextMilestone, progress, freezesAvailable } = streakData;

  return (
    <button
      onClick={() => nav("streakView")}
      className={cn(
        "w-full text-start cursor-pointer",
        "px-[18px] py-4 bg-surface rounded-3xl",
        "flex flex-col gap-2 text-text",
        current > 0
          ? "border border-training/15"
          : "border border-border"
      )}
    >
      {/* Streak count + fire */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span
            className="text-[22px]"
            style={{ animation: current > 0 ? "pulse 2s infinite" : "none" }}
          >
            {fire}
          </span>
          <span className="text-[22px] font-extrabold text-text">{current}</span>
          <span className="text-[13px] font-semibold text-muted">{T("dayStreak")}</span>
        </div>
        {freezesAvailable > 0 && (
          <div className="flex items-center gap-1 text-[12px] text-muted">
            {Array.from({ length: freezesAvailable }).map((_, i) => (
              <Snowflake key={i} size={14} color="#93C5FD" />
            ))}
            <span className="ms-0.5">{freezesAvailable}</span>
          </div>
        )}
      </div>

      {/* Progress bar toward next milestone */}
      {nextMilestone && (
        <>
          <div className="w-full h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-[600ms] ease-in-out"
              style={{
                width: `${Math.min(progress * 100, 100)}%`,
                background: "linear-gradient(90deg, #22C55E, #4ADE80)",
              }}
            />
          </div>
          <div className="text-[11px] text-muted flex justify-between w-full">
            <span>
              {T("nextReward")}:{" "}
              {lang === "he"
                ? nextMilestone.nameHe || nextMilestone.name
                : nextMilestone.name}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name={nextMilestone.icon || "Trophy"} size={11} color="#71717A" />
              {nextMilestone.days} {T("daysOfStreak")}
            </span>
          </div>
        </>
      )}
    </button>
  );
}
