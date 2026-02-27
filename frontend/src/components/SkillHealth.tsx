import { useApp } from "../context/AppContext.jsx";
import Icon from "./ui/Icon.jsx";
import { cn } from "../lib/cn";

export default function SkillHealth() {
  const { skillHealthData, nav, T } = useApp();

  if (skillHealthData.length === 0) return null;

  const needsReview = skillHealthData.filter(s => s.label !== "fresh").length;

  return (
    <div className="px-4 pt-3 pb-1">
      {/* Compact horizontal strip: status chip + exercise chips */}
      <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
        <div className={cn(
          "shrink-0 text-[10px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded-lg border-2 whitespace-nowrap",
          needsReview > 0 ? "bg-xp border-black text-black" : "bg-training border-black text-black"
        )}>
          {needsReview > 0 ? `${needsReview} ${T("skillsNeedReview")}` : T("allSkillsFresh")}
        </div>
        {skillHealthData.map(s => (
          <button
            key={s.exerciseId}
            onClick={() => nav("exercise", { program: s.program, level: s.level, exercise: s.exercise })}
            className="shrink-0 w-[52px] h-[60px] flex flex-col items-center justify-center gap-1 bg-surface rounded-xl cursor-pointer p-0 border-2"
            style={{ borderColor: s.color }}
          >
            <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center" style={{ background: s.program.gradient }}>
              <Icon name={s.program.icon} size={14} color="#fff" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
          </button>
        ))}
      </div>
    </div>
  );
}
