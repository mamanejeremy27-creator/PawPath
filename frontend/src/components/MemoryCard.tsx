import { useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { getTodaysMemory, recordMemoryShown } from "../utils/memories.js";
import { ChevronRight } from "lucide-react";

const C = { s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", rL: 24 };

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
    <div style={{ padding: "12px 20px 0" }}>
      <button
        onClick={handleTap}
        style={{
          width: "100%",
          padding: "16px 20px",
          background: config.gradient,
          border: `1px solid ${config.border}`,
          borderRadius: C.rL,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 14,
          color: C.t1,
          textAlign: "start",
          animation: "fadeIn 0.4s ease",
        }}
      >
        <span style={{ fontSize: 32, flexShrink: 0 }}>{memory.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.acc, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 2 }}>
            {T(config.label)}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {memory.title}
          </div>
          {timeLabel && (
            <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>
              {timeLabel}{(memory as any).year ? ` \u00B7 ${(memory as any).year}` : ""}
            </div>
          )}
        </div>
        <ChevronRight size={18} color={C.t3} />
      </button>
    </div>
  );
}
