import { CheckCircle2, ArrowRight } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function ChallengeBanner() {
  const { challengeData, nav, T, lang } = useApp();
  if (!challengeData?.challenge) return null;

  const { challenge, todayDay, todayTask, completedDays, todayCompleted, progress } = challengeData;
  const accent = challenge.color;
  const task = lang === "he" ? todayTask?.taskHe : todayTask?.task;

  return (
    <div className="px-5 pt-3">
      <button
        onClick={() => nav("challenge")}
        className="w-full px-5 py-[18px] rounded-3xl cursor-pointer text-text text-start"
        style={{
          background: `linear-gradient(135deg, ${accent}08, ${accent}14)`,
          border: `1px solid ${accent}30`,
          animation: "fadeIn 0.3s ease",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center gap-2">
            <Icon name={challenge.icon || "Trophy"} size={20} color={accent} />
            <span
              className="text-[11px] font-bold uppercase tracking-[1.5px]"
              style={{ color: accent }}
            >
              {T("thisWeeksChallenge")}
            </span>
          </div>
          <span className="text-[13px] font-extrabold" style={{ color: accent }}>
            {progress}/7
          </span>
        </div>

        {/* Challenge name */}
        <div className="text-base font-extrabold text-text mb-2">
          {lang === "he" ? challenge.nameHe : challenge.name}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-border rounded-full overflow-hidden mb-2.5">
          <div
            className="h-full rounded-full transition-[width] duration-[600ms] ease-in-out"
            style={{ width: `${(progress / 7) * 100}%`, background: accent }}
          />
        </div>

        {/* Today's task */}
        <div className="flex justify-between items-center">
          <div className="text-[13px] text-text-2 flex-1">
            <span
              className="font-bold"
              style={{ color: todayCompleted ? accent : "#F5F5F7" }}
            >
              {T("challengeDay")} {todayDay}:
            </span>{" "}
            {task}
            {todayCompleted && (
              <span className="ms-1.5 inline-flex align-middle">
                <CheckCircle2 size={14} color={accent} />
              </span>
            )}
          </div>
          {!todayCompleted && (
            <span
              className="text-[11px] py-[5px] px-3 rounded-full font-bold ms-2.5 shrink-0 text-black"
              style={{ background: accent }}
            >
              <span className="inline-flex items-center gap-1">
                {T("challengeGo")} <ArrowRight size={11} />
              </span>
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
