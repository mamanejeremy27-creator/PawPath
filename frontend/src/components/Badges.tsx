import { useApp } from "../context/AppContext.jsx";
import BottomNav from "./BottomNav.jsx";
import BadgeIcon from "./ui/BadgeIcon.jsx";
import { cn } from "../lib/cn";

const CATEGORY_ORDER = ["streaks", "training", "programs", "journal", "skills", "streak", "challenge", "special"];
const CATEGORY_KEYS = {
  streaks: "badgeCatStreaks",
  training: "badgeCatTraining",
  programs: "badgeCatPrograms",
  journal: "badgeCatJournal",
  skills: "badgeCatSkills",
  streak: "badgeCatStreak",
  challenge: "badgeCatChallenge",
  special: "badgeCatSpecial",
};

export default function Badges() {
  const { earnedBadges, T, badges } = useApp();

  const grouped = {};
  for (const cat of CATEGORY_ORDER) grouped[cat] = [];
  badges.forEach(b => {
    const cat = b.category || "special";
    if (grouped[cat]) grouped[cat].push(b);
  });

  return (
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      <div className="px-5 pt-6 pb-3.5">
        <h2 className="font-display text-[28px] font-black m-0 text-text">{T("achievements")}</h2>
        <p className="text-sm text-muted mt-1">{earnedBadges.length} {T("of")} {badges.length} {T("unlocked")}</p>
      </div>

      <div className="px-5">
        {CATEGORY_ORDER.map(cat => {
          const items = grouped[cat];
          if (!items || items.length === 0) return null;
          return (
            <div key={cat} className="mb-6">
              <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2.5">
                {T(CATEGORY_KEYS[cat])}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {items.map((b) => {
                  const got = earnedBadges.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      className={cn(
                        "text-center py-5 px-2 rounded-3xl border",
                        got
                          ? "bg-training/5 border-training/15 shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                          : "bg-surface border-border"
                      )}
                    >
                      <div className="mb-1.5 flex justify-center">
                        <BadgeIcon icon={b.icon || "Award"} category={b.category} size={48} earned={got} />
                      </div>
                      <div className={cn("text-[11px] font-black", got ? "text-text" : "text-muted")}>{b.name}</div>
                      <div className="text-[10px] text-muted mt-0.5 leading-snug">{b.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav active="badges" />
    </div>
  );
}
