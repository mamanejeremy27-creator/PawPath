import { useApp } from "../context/AppContext.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E" };

export default function StreakBrokenScreen() {
  const { streakBrokenModal, setStreakBrokenModal, startRecovery, T } = useApp();
  if (!streakBrokenModal) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.3s ease",
    }}>
      <div style={{
        background: C.s1, borderRadius: 28, padding: "36px 28px", maxWidth: 340, width: "90%",
        textAlign: "center", border: `1px solid ${C.b1}`,
      }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{"\uD83D\uDE22"}</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.t1, margin: "0 0 8px" }}>{T("streakBroken")}</h2>
        <p style={{ fontSize: 14, color: C.t3, margin: "0 0 8px", lineHeight: 1.5 }}>
          {streakBrokenModal.previous} {T("dayStreak")}
        </p>
        <p style={{ fontSize: 14, color: "#F59E0B", margin: "0 0 24px", lineHeight: 1.6 }}>
          {T("dontWorry")}
        </p>

        {/* Recovery Challenge */}
        <div style={{
          background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)",
          borderRadius: 20, padding: "18px 16px", marginBottom: 20,
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>{"\uD83D\uDD04"}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 4 }}>{T("recoveryChallenge")}</div>
          <div style={{ fontSize: 13, color: C.t3, marginBottom: 14, lineHeight: 1.5 }}>{T("trainToRecover")}</div>
          <button
            onClick={startRecovery}
            style={{
              padding: "12px 28px", fontSize: 14, fontWeight: 700,
              background: C.acc, color: "#000", border: "none", borderRadius: 50,
              cursor: "pointer",
            }}
          >
            {T("startRecovery")} {"\u2192"}
          </button>
        </div>

        <p style={{ fontSize: 12, color: C.t3, lineHeight: 1.5, margin: "0 0 16px" }}>
          {T("rewardsSafe")}
        </p>

        <button
          onClick={() => setStreakBrokenModal(null)}
          style={{
            padding: "10px 24px", fontSize: 13, fontWeight: 600,
            background: "transparent", color: C.t3, border: `1px solid ${C.b1}`,
            borderRadius: 50, cursor: "pointer",
          }}
        >
          {T("back")}
        </button>
      </div>
    </div>
  );
}
