import { useApp } from "../context/AppContext.jsx";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", rL: 24 };

export default function Badges() {
  const { earnedBadges, T, badges } = useApp();

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "24px 20px 14px" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: 0, color: C.t1 }}>{T("achievements")}</h2>
        <p style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>{earnedBadges.length} {T("of")} {badges.length} {T("unlocked")}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: "0 20px" }}>
        {badges.map((b, i) => {
          const got = earnedBadges.includes(b.id);
          return (
            <div key={b.id} style={{ textAlign: "center", padding: "20px 8px", background: got ? "rgba(34,197,94,0.05)" : C.s1, borderRadius: C.rL, border: `1px solid ${got ? "rgba(34,197,94,0.15)" : C.b1}`, opacity: got ? 1 : 0.3, animation: `fadeIn 0.3s ease ${i * 0.03}s both` }}>
              <div style={{ fontSize: 30, marginBottom: 6 }}>{got ? b.emoji : "🔒"}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.t1 }}>{b.name}</div>
              <div style={{ fontSize: 10, color: C.t3, marginTop: 3, lineHeight: 1.4 }}>{b.desc}</div>
            </div>
          );
        })}
      </div>
      <BottomNav active="badges" />
    </div>
  );
}
