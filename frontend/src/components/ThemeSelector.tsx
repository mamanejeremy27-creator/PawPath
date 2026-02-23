import { useApp } from "../context/AppContext.jsx";
import { CheckCircle2, Lock } from "lucide-react";
import { cn } from "../lib/cn";

export default function ThemeSelector() {
  const { appSettings, setActiveTheme, THEMES, STREAK_MILESTONES, T, lang } = useApp();
  const themeEntries = Object.values(THEMES);

  return (
    <div className="mt-8">
      <h3 className="text-base font-bold text-text mb-4">{T("themes")}</h3>
      <div className="grid grid-cols-2 gap-2.5">
        {themeEntries.map((theme: any) => {
          const isActive = appSettings.activeTheme === theme.id;
          const isUnlocked = appSettings.unlockedThemes.includes(theme.id);
          const milestone = STREAK_MILESTONES.find(m => m.rewardId === `theme-${theme.id}`);

          return (
            <button
              key={theme.id}
              onClick={() => isUnlocked && setActiveTheme(theme.id)}
              className={cn(
                "px-3.5 py-4 bg-surface rounded-2xl border text-center text-text relative transition-all",
                isActive
                  ? "border-training/40 shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                  : "border-border",
                isUnlocked ? "cursor-pointer opacity-100" : "cursor-default opacity-50"
              )}
            >
              {isActive && (
                <span className="absolute top-2 end-2 flex"><CheckCircle2 size={16} className="text-training" /></span>
              )}
              {!isUnlocked && (
                <span className="absolute top-2 end-2 flex"><Lock size={16} className="text-muted" /></span>
              )}
              {/* Color swatches */}
              <div className="flex justify-center gap-1.5 mb-2.5">
                <div className="w-5 h-5 rounded-full" style={{ background: theme.accent }} />
                <div className="w-5 h-5 rounded-full" style={{ background: theme.surface }} />
                <div className="w-5 h-5 rounded-full" style={{ background: theme.gradient, backgroundSize: "100% 100%" }} />
              </div>
              <div className={cn("text-[13px] font-bold", isUnlocked ? "text-text" : "text-muted")}>
                {lang === "he" ? (theme.nameHe || theme.name) : theme.name}
              </div>
              {!isUnlocked && milestone && (
                <div className="text-[11px] text-muted mt-1">
                  {milestone.days} {T("daysOfStreak")}
                </div>
              )}
              {isActive && (
                <div className="text-[10px] text-training font-bold mt-1 uppercase tracking-[1px]">
                  {T("activeTheme")}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
