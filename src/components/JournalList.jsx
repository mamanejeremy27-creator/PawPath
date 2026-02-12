import { useApp } from "../context/AppContext.jsx";
import BottomNav from "./BottomNav.jsx";
import Timeline from "./Timeline.jsx";
import GrowthView from "./GrowthView.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", rL: 24 };
const cardStyle = { padding: "18px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` };

export default function JournalList() {
  const { journal, nav, T, rtl, lang, programs, journalTab, setJournalTab } = useApp();
  const sorted = [...journal].reverse();
  const grouped = {};
  sorted.forEach(j => {
    const d = new Date(j.date).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { weekday: "long", month: "long", day: "numeric" });
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(j);
  });

  const tabs = [
    { id: "entries", label: T("journal"), icon: "📝" },
    { id: "timeline", label: T("timeline"), icon: "📅" },
    { id: "growth", label: T("growth"), icon: "📸" },
  ];

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>{rtl ? "→" : "←"}</span> {T("home")}
        </button>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: 0, color: C.t1 }}>{T("trainingJournal")}</h2>
        <p style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>{journal.length} {T("entriesLogged")}</p>
      </div>

      {/* Tab navigation */}
      <div style={{ display: "flex", gap: 6, padding: "0 20px", marginBottom: 20 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setJournalTab(tab.id)}
            style={{
              flex: 1, padding: "10px 8px", borderRadius: 12, border: "none", cursor: "pointer",
              background: journalTab === tab.id ? "rgba(34,197,94,0.12)" : C.s1,
              color: journalTab === tab.id ? C.acc : C.t3,
              fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              transition: "all 0.15s",
            }}>
            <span style={{ fontSize: 14 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {journalTab === "entries" && (
        journal.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 40px", color: C.t3 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
            <p style={{ fontSize: 15, lineHeight: 1.6 }}>{T("noEntries")}</p>
          </div>
        ) : (
          <div style={{ padding: "0 20px" }}>
            {Object.entries(grouped).map(([date, entries]) => (
              <div key={date} style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.t3, marginBottom: 10, letterSpacing: 0.5 }}>{date}</div>
                {entries.map(j => (
                  <div key={j.id} style={{ ...cardStyle, marginBottom: 8, borderLeft: `3px solid ${programs.find(p => p.name === j.programName)?.color || C.acc}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <span style={{ fontSize: 14, marginInlineEnd: 8 }}>{j.programEmoji}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{j.exerciseName}</span>
                      </div>
                      <div style={{ display: "flex", gap: 2 }}>
                        {[1, 2, 3, 4, 5].map(n => <span key={n} style={{ fontSize: 12 }}>{n <= j.rating ? "⭐" : "☆"}</span>)}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: C.t3, marginBottom: 6 }}>{j.programName} · {["😟","😐","🙂","😊","🤩"][(["struggling","okay","happy","great","amazing"].indexOf(j.mood))] || "🙂"} {j.mood}</div>
                    {j.photos && j.photos.length > 0 && (
                      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                        {j.photos.map((src, pi) => (
                          <img key={pi} src={src} alt="" style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover" }} />
                        ))}
                      </div>
                    )}
                    {j.note && <p style={{ fontSize: 13, color: C.t2, margin: 0, lineHeight: 1.6 }}>{j.note}</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      )}

      {journalTab === "timeline" && <Timeline />}
      {journalTab === "growth" && <GrowthView />}

      <BottomNav active="journal" />
    </div>
  );
}
