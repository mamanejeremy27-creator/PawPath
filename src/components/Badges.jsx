import { useApp } from "../context/AppContext.jsx";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", rL: 24 };

const CATEGORY_ORDER = ["streaks", "training", "programs", "journal", "skills", "special"];
const CATEGORY_KEYS = {
  streaks: "badgeCatStreaks",
  training: "badgeCatTraining",
  programs: "badgeCatPrograms",
  journal: "badgeCatJournal",
  skills: "badgeCatSkills",
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
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "24px 20px 14px" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: 0, color: C.t1 }}>{T("achievements")}</h2>
        <p style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>{earnedBadges.length} {T("of")} {badges.length} {T("unlocked")}</p>
      </div>
      <div style={{ padding: "0 20px" }}>
        {CATEGORY_ORDER.map(cat => {
          const items = grouped[cat];
          if (!items || items.length === 0) return null;
          return (
            <div key={cat} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{T(CATEGORY_KEYS[cat])}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {items.map((b) => {
                  const got = earnedBadges.includes(b.id);
                  return (
                    <div key={b.id} style={{ textAlign: "center", padding: "20px 8px", background: got ? "rgba(34,197,94,0.05)" : C.s1, borderRadius: C.rL, border: `1px solid ${got ? "rgba(34,197,94,0.15)" : C.b1}`, ...(got && { boxShadow: "0 0 12px rgba(34,197,94,0.15)" }) }}>
                      <div style={{ fontSize: 30, marginBottom: 6, position: "relative", display: "inline-block" }}>
                        <span style={{ ...(!got && { filter: "grayscale(1) opacity(0.4)" }) }}>{b.emoji}</span>
                        {!got && <span style={{ position: "absolute", bottom: -2, right: -6, fontSize: 14 }}>{"\uD83D\uDD12"}</span>}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: got ? C.t1 : C.t3 }}>{b.name}</div>
                      <div style={{ fontSize: 10, color: C.t3, marginTop: 3, lineHeight: 1.4 }}>{b.desc}</div>
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
