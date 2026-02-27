import { useApp } from "../context/AppContext.jsx";
import { Lightbulb } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { GlowBadge } from "./ui/GlowBadge";
import { cn } from "../lib/cn";

export default function DailyPlan() {
  const { dailyPlan, dailyMsg, nav, T, lang, completedExercises } = useApp();

  return (
    <div className="bg-white brut-border brut-shadow p-4 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-display font-black m-0 text-black uppercase">{T("todaysPlan")}</h2>
        <GlowBadge color="training" size="sm">
          {new Date().toLocaleDateString(lang === "he" ? "he-IL" : "en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </GlowBadge>
      </div>

      {/* Daily message */}
      <div className="px-4 py-3 bg-[#FFF3E3] rounded-xl brut-border-sm mb-4">
        <p className="text-[13px] font-bold text-black m-0 leading-relaxed italic flex items-start gap-2">
          <Lightbulb size={18} className="text-black shrink-0 mt-0.5" strokeWidth={3} />
          &ldquo;{dailyMsg}&rdquo;
        </p>
      </div>

      {/* Exercise rows */}
      <div className="flex flex-col gap-2">
        {dailyPlan.map((item, idx) => {
          const isDone = completedExercises?.includes(item.exercise.id);
          return (
            <button
              key={idx}
              onClick={() => nav("exercise", { program: item.program, level: item.level, exercise: item.exercise })}
              className={cn(
                "flex items-center gap-3 w-full p-3 rounded-xl cursor-pointer text-black text-start transition-transform hover:-translate-y-1 brut-border-sm brut-shadow-sm",
                isDone ? "bg-training opacity-80" : "bg-white"
              )}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 brut-border-sm bg-white"
              >
                <Icon name={item.program.icon} size={24} color="#000" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-black">{item.exercise.name}</div>
                <div
                  className={cn(
                    "text-xs font-bold mt-1 bg-black/5 inline-flex px-1.5 py-0.5 rounded-sm",
                    item.reason === "needsReview" ? "text-danger" : "text-muted"
                  )}
                >
                  {item.program.name} ·{" "}
                  {item.reason === "needsReview"
                    ? T("needsReview")
                    : item.reason === "continueProgress"
                      ? T("continueProgress")
                      : T("reviewReinforce")}
                </div>
              </div>
              <span className="text-[12px] px-2 py-1 rounded-sm bg-white brut-border-sm text-black font-black">
                {Math.floor(item.exercise.duration / 60)}m
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
