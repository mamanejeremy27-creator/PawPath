import Icon from "./Icon.jsx";

const CATEGORY_COLORS = {
  streaks: { bg: "rgba(249,115,22,0.15)", ring: "rgba(249,115,22,0.3)", icon: "#F97316" },
  streak: { bg: "rgba(249,115,22,0.15)", ring: "rgba(249,115,22,0.3)", icon: "#F97316" },
  training: { bg: "rgba(59,130,246,0.15)", ring: "rgba(59,130,246,0.3)", icon: "#3B82F6" },
  programs: { bg: "rgba(139,92,246,0.15)", ring: "rgba(139,92,246,0.3)", icon: "#8B5CF6" },
  journal: { bg: "rgba(34,197,94,0.15)", ring: "rgba(34,197,94,0.3)", icon: "#22C55E" },
  skills: { bg: "rgba(6,182,212,0.15)", ring: "rgba(6,182,212,0.3)", icon: "#06B6D4" },
  challenge: { bg: "rgba(245,158,11,0.15)", ring: "rgba(245,158,11,0.3)", icon: "#F59E0B" },
  special: { bg: "rgba(255,215,0,0.15)", ring: "rgba(255,215,0,0.3)", icon: "#FFD700" },
};

export default function BadgeIcon({ icon, category, size = 48, earned = true }) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.training;
  const iconSize = Math.round(size * 0.45);

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: earned ? colors.bg : "rgba(255,255,255,0.04)",
      border: `2px solid ${earned ? colors.ring : "rgba(255,255,255,0.08)"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity: earned ? 1 : 0.4,
      flexShrink: 0,
    }}>
      <Icon name={icon} size={iconSize} color={earned ? colors.icon : "#71717A"} strokeWidth={2} />
    </div>
  );
}
