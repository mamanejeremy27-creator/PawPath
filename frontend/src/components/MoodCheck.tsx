import { useApp } from "../context/AppContext.jsx";
import { cn } from "../lib/cn";

const MOODS = [
  { key: "nailed", emoji: "😊", colorClass: "text-training" },
  { key: "getting", emoji: "😐", colorClass: "text-xp" },
  { key: "tricky", emoji: "😕", colorClass: "text-danger" },
];

export default function MoodCheck() {
  const { moodCheck, recordMoodCheck, T } = useApp();
  if (!moodCheck) return null;

  return (
    <div className="fixed bottom-0 start-0 end-0 bg-black/85 backdrop-blur-xl px-5 pt-5 pb-9 z-[999] [animation:slideUp_0.3s_ease]">
      <div className="text-center text-[14px] font-bold text-text mb-3.5">
        {T("howDidThatGo")}
      </div>
      <div className="flex justify-center gap-4">
        {MOODS.map(m => (
          <button
            key={m.key}
            onClick={() => recordMoodCheck(moodCheck.exId, m.key)}
            className="flex flex-col items-center gap-1.5 px-[18px] py-3 bg-surface rounded-3xl border border-border cursor-pointer min-w-[80px]"
          >
            <span className="text-[28px]">{m.emoji}</span>
            <span className={cn("text-[11px] font-semibold", m.colorClass)}>{T(m.key + "It")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
