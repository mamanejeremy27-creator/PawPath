import { useApp } from "../context/AppContext.jsx";
import Icon from "./ui/Icon.jsx";
import { cn } from "../lib/cn";

export default function SkillHealth() {
  const { skillHealthData, nav, T } = useApp();

  if (skillHealthData.length === 0) return null;

  const needsReview = skillHealthData.filter(s => s.label !== "fresh").length;

  return (
    <div className="px-5 pt-5">
      {/* Section header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-extrabold m-0 text-text">{T("skillHealth")}</h2>
        <span className={cn("text-xs font-semibold", needsReview > 0 ? "text-xp" : "text-training")}>
          {needsReview > 0 ? `${needsReview} ${T("skillsNeedReview")}` : T("allSkillsFresh")}
        </span>
      </div>

      {/* Horizontal scroll strip */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none]">
        {skillHealthData.map(s => (
          <button
            key={s.exerciseId}
            onClick={() => nav("exercise", { program: s.program, level: s.level, exercise: s.exercise })}
            className="shrink-0 w-[60px] h-[72px] flex flex-col items-center justify-center gap-1 bg-surface rounded-2xl cursor-pointer text-text p-0 border-2"
            style={{ borderColor: s.color }}
          >
            {/* Program icon square — gradient is dynamic */}
            <div
              className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center"
              style={{ background: s.program.gradient }}
            >
              <Icon name={s.program.icon} size={16} color="#fff" />
            </div>
            {/* Freshness dot — colour is dynamic */}
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: s.color }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
