import { useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { getTodaysMemory, recordMemoryShown } from "../utils/memories.js";
import { ChevronRight } from "lucide-react";

const TYPE_CONFIG = {
  onThisDay: { gradient: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.08))", border: "rgba(139,92,246,0.2)", label: "onThisDay" },
  anniversary: { gradient: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.08))", border: "rgba(245,158,11,0.2)", label: "trainingAnniversary" },
  throwback: { gradient: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(59,130,246,0.08))", border: "rgba(34,197,94,0.2)", label: "throwback" },
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
    <div className="px-5 pt-3">
      <button
        onClick={handleTap}
        className="w-full px-5 py-4 rounded-3xl cursor-pointer flex items-center gap-3.5 text-text text-start"
        style={{
          background: config.gradient,
          border: `1px solid ${config.border}`,
          animation: "fadeIn 0.4s ease",
        }}
      >
        <span className="text-[32px] shrink-0">{memory.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-training uppercase tracking-[1.5px] mb-0.5">
            {T(config.label)}
          </div>
          <div className="text-[14px] font-bold text-text overflow-hidden text-ellipsis whitespace-nowrap">
            {memory.title}
          </div>
          {timeLabel && (
            <div className="text-[12px] text-muted mt-0.5">
              {timeLabel}{(memory as any).year ? ` \u00B7 ${(memory as any).year}` : ""}
            </div>
          )}
        </div>
        <ChevronRight size={18} color="#71717A" />
      </button>
    </div>
  );
}
