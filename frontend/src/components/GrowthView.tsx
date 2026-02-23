import { useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import PhotoImg from "./PhotoImg.jsx";
import { Camera, ArrowRight } from "lucide-react";
import Icon from "./ui/Icon.jsx";

export default function GrowthView() {
  const { journal, lang, T } = useApp();

  const monthlyPhotos = useMemo(() => {
    const byMonth: Record<string, any> = {};
    // Walk journal in order to get first photo per month
    for (const entry of journal) {
      if (!entry.photos || entry.photos.length === 0) continue;
      const d = new Date(entry.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!byMonth[key]) {
        byMonth[key] = {
          key,
          photo: entry.photos[0],
          label: d.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", year: "numeric" }),
          exerciseName: entry.exerciseName,
          programEmoji: entry.programEmoji,
        };
      }
    }
    return Object.values(byMonth).sort((a, b) => a.key.localeCompare(b.key));
  }, [journal, lang]);

  if (monthlyPhotos.length === 0) {
    return (
      <div className="text-center px-10 py-16 text-muted">
        <div className="mb-4"><Camera size={48} className="text-muted mx-auto" /></div>
        <p className="text-[15px] leading-relaxed">{T("noEntries")}</p>
      </div>
    );
  }

  // Then vs Now comparison
  const first = monthlyPhotos[0];
  const last = monthlyPhotos[monthlyPhotos.length - 1];
  const showComparison = monthlyPhotos.length >= 2;

  return (
    <div className="px-5">
      {/* Then vs Now */}
      {showComparison && (
        <div className="mb-6 p-[18px] bg-surface rounded-3xl border border-border">
          <div className="text-[11px] font-bold text-training tracking-[2px] uppercase mb-3.5 text-center">
            {T("thenVsNow")}
          </div>
          <div className="flex gap-3">
            <div className="flex-1 text-center">
              <PhotoImg src={first.photo} style={{ width: "100%", aspectRatio: "1", borderRadius: 14, objectFit: "cover" }} />
              <div className="text-[11px] text-muted mt-1.5 font-semibold">{first.label}</div>
            </div>
            <div className="flex items-center">
              <ArrowRight size={20} className="text-muted" />
            </div>
            <div className="flex-1 text-center">
              <PhotoImg src={last.photo} style={{ width: "100%", aspectRatio: "1", borderRadius: 14, objectFit: "cover" }} />
              <div className="text-[11px] text-muted mt-1.5 font-semibold">{last.label}</div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {monthlyPhotos.map(m => (
          <div key={m.key} className="bg-surface rounded-2xl border border-border overflow-hidden">
            <PhotoImg src={m.photo} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
            <div className="px-2.5 py-2">
              <div className="text-[10px] text-muted font-semibold">{m.label}</div>
              <div className="text-[11px] text-text-2 mt-0.5 flex items-center gap-[3px]">
                {m.programIcon ? <Icon name={m.programIcon} size={11} /> : <span>{m.programEmoji}</span>}
                {m.exerciseName}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
