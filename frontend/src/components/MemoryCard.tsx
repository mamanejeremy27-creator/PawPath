import { useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { getTodaysMemory, recordMemoryShown } from "../utils/memories.js";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/cn.js";

const TYPE_CONFIG = {
  onThisDay: { bg: "bg-social", label: "onThisDay" },
  anniversary: { bg: "bg-xp", label: "trainingAnniversary" },
  throwback: { bg: "bg-training", label: "throwback" },
};

export default function MemoryCard() {
  const { journal, dogProfile, activeDogId, nav, T } = useApp();

  const memory = useMemo(() => {
    return getTodaysMemory(journal, dogProfile, activeDogId);
  }, [journal, dogProfile, activeDogId]);

  if (!memory) return null;

  const config = TYPE_CONFIG[memory.type] || TYPE_CONFIG.throwback;

  const handleTap = () => {
    recordMemoryShown(activeDogId);
    nav("memoryDetail", { program: { memory } });
  };

  const timeLabel = memory.type === "anniversary"
    ? `${(memory as any).daysSince} ${T("daysAgo")}`
    : (memory as any).timeAgo
      ? `${(memory as any).timeAgo} ${T("daysAgo")}`
      : "";

  return (
    <button
      onClick={handleTap}
      className={cn(
        "w-full px-5 py-4 rounded-2xl cursor-pointer flex items-center gap-4 text-black text-start brut-border brut-shadow hover:-translate-y-1 transition-transform",
        config.bg
      )}
    >
      <span className="text-4xl shrink-0 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] rotate-[-6deg]">{memory.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-black uppercase tracking-[1.5px] mb-1 bg-white inline-block px-1 brut-border-sm">
          {T(config.label)}
        </div>
        <div className="text-[16px] font-black overflow-hidden text-ellipsis whitespace-nowrap">
          {memory.title}
        </div>
        {timeLabel && (
          <div className="text-[12px] font-bold mt-1 bg-black/5 inline-flex px-1.5 py-0.5 rounded-sm">
            {timeLabel}{(memory as any).year ? ` \u00B7 ${(memory as any).year}` : ""}
          </div>
        )}
      </div>
      <div className="bg-white p-2 rounded-full brut-border-sm shrink-0">
        <ChevronRight size={20} strokeWidth={3} className="text-black" />
      </div>
    </button>
  );
}
