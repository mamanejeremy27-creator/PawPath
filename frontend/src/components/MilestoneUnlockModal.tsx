import { useApp } from "../context/AppContext.jsx";
import BadgeIcon from "./ui/BadgeIcon.jsx";
import { Palette, Crown, Medal, Snowflake } from "lucide-react";

export default function MilestoneUnlockModal() {
  const { milestoneUnlock, setMilestoneUnlock, T, lang } = useApp();
  if (!milestoneUnlock) return null;

  const m = milestoneUnlock;
  const name = lang === "he" ? (m.nameHe || m.name) : m.name;
  const desc = lang === "he" ? (m.descriptionHe || m.description) : m.description;

  return (
    <div
      onClick={() => setMilestoneUnlock(null)}
      className="fixed inset-0 z-[600] bg-black/90 flex items-center justify-center animate-[fadeIn_0.3s_ease]"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-surface rounded-[28px] px-7 py-10 max-w-[320px] w-[90%] text-center border border-training/20 shadow-[0_0_60px_rgba(34,197,94,0.15)] animate-[badgeDrop_0.5s_ease]"
      >
        {/* Celebration glow */}
        <div className="mb-4 flex justify-center animate-[pulse_1.5s_infinite] drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]">
          <BadgeIcon icon={m.icon || "Award"} category={m.category || "streak"} size={80} earned={true} />
        </div>

        <div className="text-[10px] text-training uppercase tracking-[2px] font-black mb-1.5">
          {T("milestoneUnlocked")}
        </div>

        <h2 className="text-[22px] font-black text-text m-0 mb-2">{name}</h2>
        <p className="text-sm text-muted m-0 mb-4 leading-relaxed">{desc}</p>

        {m.xpBonus > 0 && (
          <div className="inline-block px-5 py-2 bg-training/10 border border-training/20 rounded-full text-sm font-bold text-training mb-2">
            +{m.xpBonus} XP
          </div>
        )}

        {m.freezeReward && (
          <div className="text-[13px] text-health mb-2">
            <Snowflake size={14} color="#60A5FA" className="inline align-middle" /> {T("streakFreeze")} +1
          </div>
        )}

        {/* Reward type indicator */}
        <div className="text-xs text-muted mb-5">
          {m.reward === "theme" && (
            <span className="inline-flex items-center gap-1"><Palette size={14} /> {T("themes")}</span>
          )}
          {m.reward === "avatar" && (
            <span className="inline-flex items-center gap-1"><Crown size={14} /> {T("accessories")}</span>
          )}
          {m.reward === "badge" && (
            <span className="inline-flex items-center gap-1"><Medal size={14} /> {T("badges")}</span>
          )}
        </div>

        <button
          onClick={() => setMilestoneUnlock(null)}
          className="px-9 py-3.5 text-[15px] font-bold bg-training text-black border-0 rounded-full cursor-pointer"
        >
          {T("back")}
        </button>
      </div>
    </div>
  );
}
