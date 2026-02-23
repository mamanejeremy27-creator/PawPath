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
    <button
      onClick={() => nav("challenge")}
      className="w-full px-5 py-[18px] rounded-2xl cursor-pointer text-black text-start bg-achieve brut-border brut-shadow hover:-translate-y-1 transition-transform"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 bg-white brut-border-sm px-2 py-1 rounded-sm rotate-[-2deg]">
          <Icon name={challenge.icon || "Trophy"} size={18} color="#000" />
          <span className="text-[10px] font-black uppercase tracking-[1.5px] text-black">
            {T("thisWeeksChallenge")}
          </span>
        </div>
        <span className="text-[14px] font-black bg-white brut-border-sm px-2 py-0.5 rounded-sm rotate-[2deg]">
          {progress}/7
        </span>
      </div>

      {/* Challenge name */}
      <div className="text-xl font-display font-black text-black mb-3 drop-shadow-[1px_1px_0_rgba(255,255,255,1)]">
        {lang === "he" ? challenge.nameHe : challenge.name}
      </div>

      {/* Progress bar */}
      <div className="h-4 bg-white brut-border-sm rounded-full overflow-hidden mb-4 p-[2px]">
        <div
          className="h-full rounded-full transition-[width] duration-[600ms] ease-in-out bg-black"
          style={{ width: `${(progress / 7) * 100}%` }}
        />
      </div>

      {/* Today's task */}
      <div className="flex justify-between items-center bg-white brut-border-sm p-3 rounded-xl rotate-[1deg]">
        <div className="text-[13px] font-bold text-black flex-1">
          <span className="font-black bg-yellow-200 px-1 brut-border-sm inline-block mb-1">
            {T("challengeDay")} {todayDay}:
          </span>
          <br/>
          {task}
          {todayCompleted && (
            <span className="ms-2 inline-flex align-middle">
              <CheckCircle2 size={18} color="#000" strokeWidth={3} />
            </span>
          )}
        </div>
        {!todayCompleted && (
          <span className="text-[11px] py-1.5 px-3 rounded-md font-black ms-3 shrink-0 text-white bg-black brut-border-sm">
            <span className="flex items-center gap-1.5">
              {T("challengeGo")} <ArrowRight size={14} strokeWidth={3} />
            </span>
          </span>
        )}
      </div>
    </button>
  );
}
