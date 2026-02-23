import { useApp } from "../context/AppContext.jsx";
import { Lightbulb } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { Card } from "./ui/Card";
import { GlowBadge } from "./ui/GlowBadge";
import { cn } from "../lib/cn";

export default function DailyPlan() {
  const { dailyPlan, dailyMsg, nav, T, lang, completedExercises } = useApp();

  return (
    <div className="px-4 pt-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-extrabold m-0 text-text">{T("todaysPlan")}</h2>
        <GlowBadge color="training" size="sm">
          {new Date().toLocaleDateString(lang === "he" ? "he-IL" : "en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </GlowBadge>
      </div>

      {/* Daily message */}
      <div className="px-4 py-3.5 bg-training/5 rounded-2xl border border-training/10 mb-3">
        <p className="text-[13px] text-text-2 m-0 leading-relaxed italic flex items-start gap-1.5">
          <Lightbulb size={14} className="text-training shrink-0 mt-0.5" />
          &ldquo;{dailyMsg}&rdquo;
        </p>
      </div>

      {/* Exercise rows */}
      {dailyPlan.map((item, idx) => {
        const isDone = completedExercises?.includes(item.exercise.id);
        return (
          <button
            key={idx}
            onClick={() => nav("exercise", { program: item.program, level: item.level, exercise: item.exercise })}
            className={cn(
              "flex items-center gap-3.5 w-full p-4 mb-2 rounded-2xl border cursor-pointer text-text text-start transition-colors [animation:fadeIn_0.3s_ease_both]",
              isDone
                ? "bg-training/5 border-training/30"
                : "bg-surface border-border"
            )}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: item.program.gradient }}
            >
              <Icon name={item.program.icon} size={20} color="#fff" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold">{item.exercise.name}</div>
              <div
                className={cn(
                  "text-xs mt-0.5",
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
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-border text-muted font-semibold">
              {Math.floor(item.exercise.duration / 60)}m
            </span>
          </button>
        );
      })}
    </div>
  );
}
