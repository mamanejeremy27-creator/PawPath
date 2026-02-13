import { useApp } from "../context/AppContext.jsx";

const C = { s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", r: 16 };

export default function ThemeSelector() {
  const { appSettings, setActiveTheme, THEMES, STREAK_MILESTONES, T, lang } = useApp();
  const themeEntries = Object.values(THEMES);

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: "0 0 16px" }}>{T("themes")}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {themeEntries.map(theme => {
          const isActive = appSettings.activeTheme === theme.id;
          const isUnlocked = appSettings.unlockedThemes.includes(theme.id);
          const milestone = STREAK_MILESTONES.find(m => m.rewardId === `theme-${theme.id}`);

          return (
            <button
              key={theme.id}
              onClick={() => isUnlocked && setActiveTheme(theme.id)}
              style={{
                padding: "16px 14px", background: C.s1, borderRadius: C.r,
                border: `1px solid ${isActive ? "rgba(34,197,94,0.4)" : C.b1}`,
                cursor: isUnlocked ? "pointer" : "default",
                opacity: isUnlocked ? 1 : 0.5,
                textAlign: "center", color: C.t1, position: "relative",
                ...(isActive && { boxShadow: "0 0 12px rgba(34,197,94,0.15)" }),
              }}
            >
              {isActive && (
                <span style={{ position: "absolute", top: 8, insetInlineEnd: 8, fontSize: 14 }}>{"\u2705"}</span>
              )}
              {!isUnlocked && (
                <span style={{ position: "absolute", top: 8, insetInlineEnd: 8, fontSize: 14 }}>{"\uD83D\uDD12"}</span>
              )}
              {/* Color swatches */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: theme.accent }} />
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: theme.surface }} />
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: theme.gradient, backgroundSize: "100% 100%" }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: isUnlocked ? C.t1 : C.t3 }}>
                {lang === "he" ? (theme.nameHe || theme.name) : theme.name}
              </div>
              {!isUnlocked && milestone && (
                <div style={{ fontSize: 11, color: C.t3, marginTop: 4 }}>
                  {milestone.days} {T("daysOfStreak")}
                </div>
              )}
              {isActive && (
                <div style={{ fontSize: 10, color: C.acc, fontWeight: 700, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>
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
