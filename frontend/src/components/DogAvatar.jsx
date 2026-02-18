import { useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import PhotoImg, { clearPhotoCache } from "./PhotoImg.jsx";

export default function DogAvatar({ size = "medium", photo, dogId }) {
  const { appSettings, AVATAR_ACCESSORIES, dogs, activeDogId } = useApp();
  const activeAcc = appSettings.activeAccessories || [];

  const effectiveDogId = dogId || activeDogId;

  // Get photo ONLY from this specific dog — never fall back to another dog's profile
  const thisDogPhoto = dogs[effectiveDogId]?.profile?.photo || null;
  // If photo prop was explicitly provided (even if null/undefined), prefer it; otherwise use this dog's photo
  const photoSrc = photo !== undefined ? (photo || null) : thisDogPhoto;

  // When the effective dog changes, flush cached signed URLs so stale images never linger
  useEffect(() => {
    clearPhotoCache();
  }, [effectiveDogId]);

  const sizes = { small: 44, medium: 64, large: 90 };
  const s = sizes[size] || sizes.medium;
  const dogEmoji = s >= 64 ? "\uD83D\uDC15" : "\uD83D\uDC3E";
  const fontSize = s * 0.55;

  const topAcc = AVATAR_ACCESSORIES.find(a => a.position === "top" && activeAcc.includes(a.id));
  const faceAcc = AVATAR_ACCESSORIES.find(a => a.position === "face" && activeAcc.includes(a.id));
  const backAcc = AVATAR_ACCESSORIES.find(a => a.position === "back" && activeAcc.includes(a.id));

  const placeholder = (
    <div style={{
      width: s, height: s, borderRadius: s * 0.3,
      background: "#131316", border: "2px solid #22C55E",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize, zIndex: 1, position: "relative",
    }}>
      {dogEmoji}
    </div>
  );

  return (
    <div style={{ position: "relative", width: s, height: s, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {/* Back accessory */}
      {backAcc && (
        <span style={{ position: "absolute", bottom: -2, insetInlineEnd: -4, fontSize: s * 0.3, zIndex: 0 }}>
          {backAcc.emoji}
        </span>
      )}
      {/* Base avatar — key by dogId+photo to force full remount on dog switch */}
      {photoSrc ? (
        <PhotoImg
          key={`${effectiveDogId}-${photoSrc}`}
          src={photoSrc}
          alt="Dog"
          fallback={placeholder}
          style={{
            width: s, height: s, borderRadius: "50%",
            border: "2px solid #22C55E",
            objectFit: "cover",
            zIndex: 1, position: "relative",
          }}
        />
      ) : placeholder}
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
