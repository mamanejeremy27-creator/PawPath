import { useApp } from "../context/AppContext.jsx";
import BottomNav from "./BottomNav.jsx";
import Timeline from "./Timeline.jsx";
import GrowthView from "./GrowthView.jsx";
import PhotoImg from "./PhotoImg.jsx";
import { PenLine, Calendar, Camera, ArrowLeft, ArrowRight } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { Card } from "./ui/Card";
import { cn } from "../lib/cn";

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
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      <div className="px-5 pt-6 pb-4">
        <button
          onClick={() => nav("home")}
          className="bg-transparent border-none text-training text-sm font-semibold cursor-pointer p-0 mb-4 flex items-center gap-1.5"
        >
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {T("home")}
        </button>
        <h2 className="font-display text-[28px] font-extrabold m-0 text-text">{T("trainingJournal")}</h2>
        <p className="text-sm text-muted mt-1">{journal.length} {T("entriesLogged")}</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1.5 px-5 mb-5">
        {tabs.map(tab => {
          const TabIcon = tabIcons[tab.id];
          const isActive = journalTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setJournalTab(tab.id)}
              className={cn(
                "flex-1 py-2.5 px-2 rounded-xl border-none cursor-pointer font-bold text-xs flex items-center justify-center gap-1 transition-all duration-150",
                isActive ? "bg-training/[0.12] text-training" : "bg-surface text-muted"
              )}
            >
              <TabIcon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {journalTab === "entries" && (
        journal.length === 0 ? (
          <div className="text-center py-16 px-10 text-muted">
            <div className="mb-4"><PenLine size={48} className="text-muted mx-auto" /></div>
            <p className="text-[15px] leading-relaxed">{T("noEntries")}</p>
          </div>
        ) : (
          <div className="px-5">
            {Object.entries(grouped).map(([date, entries]) => (
              <div key={date} className="mb-6">
                <div className="text-[13px] font-bold text-muted mb-2.5 tracking-[0.5px]">{date}</div>
                {entries.map(j => {
                  const accentColor = programs.find(p => p.name === j.programName)?.color || "#22C55E";
                  return (
                    <div
                      key={j.id}
                      className="mb-2 bg-surface rounded-3xl p-5 border border-border"
                      // Dynamic left-border accent color — runtime value
                      style={{ borderInlineStartWidth: 3, borderInlineStartColor: accentColor }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-sm me-2">{j.programIcon ? <Icon name={j.programIcon} size={14} /> : j.programEmoji}</span>
                          <span className="text-sm font-bold text-text">{j.exerciseName}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(n => <span key={n} className="text-xs">{n <= j.rating ? "⭐" : "☆"}</span>)}
                        </div>
                      </div>
                      <div className="text-xs text-muted mb-1.5">{j.programName} · {["😟","😐","🙂","😊","🤩"][(["struggling","okay","happy","great","amazing"].indexOf(j.mood))] || "🙂"} {j.mood}</div>
                      {j.photos && j.photos.length > 0 && (
                        <div className="flex gap-1.5 mb-2">
                          {j.photos.map((src, pi) => (
                            <PhotoImg key={pi} src={src} className="w-16 h-16 rounded-xl object-cover" />
                          ))}
                        </div>
                      )}
                      {j.note && <p className="text-[13px] text-text-2 m-0 leading-relaxed">{j.note}</p>}
                    </div>
                  );
                })}
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
