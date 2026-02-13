import { useApp } from "../context/AppContext.jsx";

export default function DogAvatar({ size = "medium" }) {
  const { appSettings, AVATAR_ACCESSORIES } = useApp();
  const activeAcc = appSettings.activeAccessories || [];
  const unlockedAcc = appSettings.unlockedAccessories || [];

  const sizes = { small: 44, medium: 64, large: 90 };
  const s = sizes[size] || sizes.medium;
  const dogEmoji = s >= 64 ? "\uD83D\uDC15" : "\uD83D\uDC3E";
  const fontSize = s * 0.55;

  const topAcc = AVATAR_ACCESSORIES.find(a => a.position === "top" && activeAcc.includes(a.id));
  const faceAcc = AVATAR_ACCESSORIES.find(a => a.position === "face" && activeAcc.includes(a.id));
  const backAcc = AVATAR_ACCESSORIES.find(a => a.position === "back" && activeAcc.includes(a.id));

  return (
    <div style={{ position: "relative", width: s, height: s, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {/* Back accessory */}
      {backAcc && (
        <span style={{ position: "absolute", bottom: -2, insetInlineEnd: -4, fontSize: s * 0.3, zIndex: 0 }}>
          {backAcc.emoji}
        </span>
      )}
      {/* Base avatar */}
      <div style={{
        width: s, height: s, borderRadius: s * 0.3,
        background: "#131316", border: "2px solid #22C55E",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize, zIndex: 1, position: "relative",
      }}>
        {dogEmoji}
      </div>
      {/* Top accessory */}
      {topAcc && (
        <span style={{ position: "absolute", top: -s * 0.22, left: "50%", transform: "translateX(-50%)", fontSize: s * 0.32, zIndex: 2 }}>
          {topAcc.emoji}
        </span>
      )}
      {/* Face accessory */}
      {faceAcc && (
        <span style={{ position: "absolute", top: s * 0.15, left: "50%", transform: "translateX(-50%)", fontSize: s * 0.28, zIndex: 2 }}>
          {faceAcc.emoji}
        </span>
      )}
    </div>
  );
}
