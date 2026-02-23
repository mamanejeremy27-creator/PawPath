import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import PhotoImg from "./PhotoImg.jsx";
import { Calendar } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { cn } from "../lib/cn";

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

  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
      <div className="text-center px-10 py-16 text-muted">
        <div className="mb-4"><Calendar size={48} className="text-muted mx-auto" /></div>
        <p className="text-[15px] leading-relaxed">{T("noEntries")}</p>
      </div>
    );
  }

  return (
    <div className="px-5 relative">
      {/* Vertical line */}
      <div className="absolute start-[30px] top-0 bottom-0 w-0.5 bg-border" />

      {months.map((group, gi) => (
        <div key={gi} className="mb-6">
          {/* Month header */}
          <div className="relative z-[1] flex items-center gap-3 mb-4">
            <div className="w-[22px] h-[22px] rounded-full bg-training flex-shrink-0 -ms-px" />
            <span className="text-sm font-black text-text tracking-[0.5px]">{(group as any).label}</span>
          </div>

          {(group as any).items.map((item) => {
            const j = item.data;
            const isExpanded = expanded === j.id;
            const dayLabel = new Date(j.date).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { weekday: "short", day: "numeric" });
            const prog = programs.find(p => p.name === j.programName);

            return (
              <div key={j.id} className="relative ps-8 mb-2.5">
                {/* Dot on timeline */}
                <div
                  className="absolute start-[5px] top-2 w-3 h-3 rounded-full bg-surface border-2"
                  style={{ borderColor: prog?.color || "#71717A" }}
                />

                <button
                  onClick={() => setExpanded(isExpanded ? null : j.id)}
                  className="w-full text-start px-4 py-3.5 bg-surface rounded-2xl border border-border cursor-pointer text-text"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {j.programIcon ? <Icon name={j.programIcon} size={14} /> : j.programEmoji}
                      </span>
                      <span className="text-[13px] font-bold">{j.exerciseName}</span>
                    </div>
                    <span className="text-[11px] text-muted">{dayLabel}</span>
                  </div>

                  {/* Photo thumbnails inline */}
                  {j.photos && j.photos.length > 0 && (
                    <div className="flex gap-1.5 mt-2.5">
                      {j.photos.map((src, pi) => (
                        <PhotoImg key={pi} src={src} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                      ))}
                    </div>
                  )}

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="text-xs text-muted mb-1.5">
                        {j.programName} · {["😟","😐","🙂","😊","🤩"][(["struggling","okay","happy","great","amazing"].indexOf(j.mood))] || "🙂"} · {"⭐".repeat(j.rating)}{"☆".repeat(5 - j.rating)}
                      </div>
                      {j.note && <p className="text-[13px] text-text-2 m-0 leading-relaxed">{j.note}</p>}
                      {j.photos && j.photos.length > 0 && (
                        <div className="flex gap-2 mt-2.5">
                          {j.photos.map((src, pi) => (
                            <PhotoImg key={pi} src={src} style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover" }} />
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
