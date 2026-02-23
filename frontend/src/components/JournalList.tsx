import { useApp } from "../context/AppContext.jsx";
import BottomNav from "./BottomNav.jsx";
import Timeline from "./Timeline.jsx";
import GrowthView from "./GrowthView.jsx";
import PhotoImg from "./PhotoImg.jsx";
import { PenLine, Calendar, Camera, ArrowLeft, ArrowRight } from "lucide-react";
import Icon from "./ui/Icon.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", rL: 24 };
const cardStyle = { padding: "18px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` };

export default function JournalList() {
  const { journal, nav, T, rtl, lang, programs, journalTab, setJournalTab } = useApp();
  const sorted = [...journal].reverse();
  const grouped: Record<string, any[]> = {};
  sorted.forEach(j => {
    const d = new Date(j.date).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { weekday: "long", month: "long", day: "numeric" });
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(j);
  });

  const tabIcons = { entries: PenLine, timeline: Calendar, growth: Camera };
  const tabs = [
    { id: "entries", label: T("journal") },
    { id: "timeline", label: T("timeline") },
    { id: "growth", label: T("growth") },
  ];

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {T("home")}
        </button>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: 0, color: C.t1 }}>{T("trainingJournal")}</h2>
        <p style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>{journal.length} {T("entriesLogged")}</p>
      </div>

      {/* Tab navigation */}
      <div style={{ display: "flex", gap: 6, padding: "0 20px", marginBottom: 20 }}>
        {tabs.map(tab => {
          const TabIcon = tabIcons[tab.id];
          return (
            <button key={tab.id} onClick={() => setJournalTab(tab.id)}
              style={{
                flex: 1, padding: "10px 8px", borderRadius: 12, border: "none", cursor: "pointer",
                background: journalTab === tab.id ? "rgba(34,197,94,0.12)" : C.s1,
                color: journalTab === tab.id ? C.acc : C.t3,
                fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                transition: "all 0.15s",
              }}>
              <TabIcon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {journalTab === "entries" && (
        journal.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 40px", color: C.t3 }}>
            <div style={{ marginBottom: 16 }}><PenLine size={48} color={C.t3} /></div>
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
                        <span style={{ fontSize: 14, marginInlineEnd: 8 }}>{j.programIcon ? <Icon name={j.programIcon} size={14} /> : j.programEmoji}</span>
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
                          <PhotoImg key={pi} src={src} style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover" }} />
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
