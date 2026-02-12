import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", rL: 24 };

function buildTimelineItems(journal, earnedBadges, completedLevels, badges, programs, lang) {
  const items = [];

  // Journal entries
  journal.forEach(j => {
    items.push({ type: "journal", date: j.date, data: j });
  });

  // Badge milestones (approximate date from journal proximity)
  // We don't store badge earn dates, so we skip date-based badge items
  // and instead show them inline if they match a journal entry's session

  // Level completions — also no stored date, skip for now

  items.sort((a, b) => new Date(b.date) - new Date(a.date));
  return items;
}

function groupByMonth(items, lang) {
  const groups = {};
  items.forEach(item => {
    const d = new Date(item.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "long", year: "numeric" });
    if (!groups[key]) groups[key] = { label, items: [] };
    groups[key].items.push(item);
  });
  return Object.values(groups);
}

export default function Timeline() {
  const { journal, earnedBadges, completedLevels, badges, programs, lang, T } = useApp();
  const [expanded, setExpanded] = useState(null);

  const items = buildTimelineItems(journal, earnedBadges, completedLevels, badges, programs, lang);
  const months = groupByMonth(items, lang);

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 40px", color: C.t3 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
        <p style={{ fontSize: 15, lineHeight: 1.6 }}>{T("noEntries")}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 20px", position: "relative" }}>
      {/* Vertical line */}
      <div style={{ position: "absolute", left: 30, top: 0, bottom: 0, width: 2, background: C.b1 }} />

      {months.map((group, gi) => (
        <div key={gi} style={{ marginBottom: 24 }}>
          {/* Month header */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.acc, flexShrink: 0, marginLeft: -1 }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: C.t1, letterSpacing: 0.5 }}>{group.label}</span>
          </div>

          {group.items.map((item) => {
            const j = item.data;
            const isExpanded = expanded === j.id;
            const dayLabel = new Date(j.date).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { weekday: "short", day: "numeric" });
            const prog = programs.find(p => p.name === j.programName);

            return (
              <div key={j.id} style={{ position: "relative", paddingLeft: 32, marginBottom: 10 }}>
                {/* Dot on timeline */}
                <div style={{ position: "absolute", left: 5, top: 8, width: 12, height: 12, borderRadius: "50%", background: C.s1, border: `2px solid ${prog?.color || C.t3}` }} />

                <button onClick={() => setExpanded(isExpanded ? null : j.id)}
                  style={{ width: "100%", textAlign: "start", padding: "14px 16px", background: C.s1, borderRadius: 16, border: `1px solid ${C.b1}`, cursor: "pointer", color: C.t1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{j.programEmoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{j.exerciseName}</span>
                    </div>
                    <span style={{ fontSize: 11, color: C.t3 }}>{dayLabel}</span>
                  </div>

                  {/* Photo thumbnails inline */}
                  {j.photos && j.photos.length > 0 && (
                    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                      {j.photos.map((src, pi) => (
                        <img key={pi} src={src} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                      ))}
                    </div>
                  )}

                  {/* Expanded details */}
                  {isExpanded && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.b1}` }}>
                      <div style={{ fontSize: 12, color: C.t3, marginBottom: 6 }}>
                        {j.programName} · {["😟","😐","🙂","😊","🤩"][(["struggling","okay","happy","great","amazing"].indexOf(j.mood))] || "🙂"} · {"⭐".repeat(j.rating)}{"☆".repeat(5 - j.rating)}
                      </div>
                      {j.note && <p style={{ fontSize: 13, color: C.t2, margin: 0, lineHeight: 1.6 }}>{j.note}</p>}
                      {j.photos && j.photos.length > 0 && (
                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                          {j.photos.map((src, pi) => (
                            <img key={pi} src={src} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover" }} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
