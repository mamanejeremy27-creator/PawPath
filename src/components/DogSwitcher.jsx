import { useApp } from "../context/AppContext.jsx";
import PhotoImg from "./PhotoImg.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E" };

export default function DogSwitcher() {
  const { dogs, activeDogId, switchDog, dogCount, setShowAddDog, T } = useApp();
  const dogEntries = Object.entries(dogs);

  if (dogEntries.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 8, padding: "12px 20px 0", overflowX: "auto" }}>
      {dogEntries.map(([id, dog]) => {
        const isActive = id === activeDogId;
        return (
          <button
            key={id}
            onClick={() => !isActive && switchDog(id)}
            style={{
              padding: "8px 16px",
              borderRadius: 50,
              border: isActive ? `2px solid ${C.acc}` : `1px solid ${C.b1}`,
              background: isActive ? "rgba(34,197,94,0.1)" : C.s1,
              color: isActive ? C.acc : C.t1,
              fontSize: 13,
              fontWeight: 700,
              cursor: isActive ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {dog.profile?.photo ? (
              <PhotoImg key={`${id}-${dog.profile.photo}`} src={dog.profile.photo} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <span style={{ fontSize: 14 }}>{"\uD83D\uDC3E"}</span>
            )}
            {dog.profile?.name || "Dog"}
            {isActive && <span style={{ fontSize: 9, opacity: 0.7 }}>{"\u2713"}</span>}
          </button>
        );
      })}

      {dogCount < 2 && (
        <button
          onClick={() => setShowAddDog(true)}
          style={{
            padding: "8px 16px",
            borderRadius: 50,
            border: `1px dashed ${C.t3}`,
            background: "transparent",
            color: C.t3,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          + {T("addDog")}
        </button>
      )}
    </div>
  );
}
