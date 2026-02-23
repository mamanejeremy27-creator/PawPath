import { useState } from "react";
import { Bug, Lightbulb, Star, FileText, X, Inbox, Dog, Flame } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { cn } from "../lib/cn";

const TYPE_META = {
  bug: { icon: Bug, colorClass: "text-danger", bgClass: "bg-danger/10", borderClass: "border-danger/20" },
  feature: { icon: Lightbulb, colorClass: "text-xp", bgClass: "bg-xp/10", borderClass: "border-xp/20" },
  rating: { icon: Star, colorClass: "text-achieve", bgClass: "bg-achieve/10", borderClass: "border-achieve/20" },
  general: { icon: FileText, colorClass: "text-health", bgClass: "bg-health/10", borderClass: "border-health/20" },
};

const FILTERS = [
  { id: "all", labelKey: "allFeedback" },
  { id: "bug", labelKey: "bugs" },
  { id: "feature", labelKey: "features" },
  { id: "rating", labelKey: "ratings" },
  { id: "general", labelKey: "general" },
];

export default function FeedbackAdmin() {
  const { showFeedbackAdmin, setShowFeedbackAdmin, feedback, T } = useApp();
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState(false);

  if (!showFeedbackAdmin) return null;

  const filtered = filter === "all" ? feedback : feedback.filter(f => f.type === filter);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(feedback, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = JSON.stringify(feedback, null, 2);
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed inset-0 z-[300] bg-bg overflow-y-auto [animation:slideUp_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex justify-between items-center">
        <div>
          <h2 className="font-display text-2xl font-extrabold m-0 text-text">{T("feedbackAdmin")}</h2>
          <p className="text-[13px] text-muted mt-1">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={cn(
              "bg-surface border border-border px-4 py-2 rounded-[10px] cursor-pointer text-[13px] font-semibold transition-all",
              copied ? "text-training" : "text-text-2"
            )}
          >
            {copied ? T("copied") : T("copyJson")}
          </button>
          <button
            onClick={() => setShowFeedbackAdmin(false)}
            className="bg-surface border border-border text-text w-[38px] h-[38px] rounded-[10px] cursor-pointer flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-5 pb-3.5 overflow-x-auto">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-4 py-[7px] text-[13px] font-semibold rounded-full cursor-pointer whitespace-nowrap transition-all border",
              filter === f.id
                ? "bg-training text-black border-training"
                : "bg-surface text-text-2 border-border"
            )}
          >
            {T(f.labelKey)}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="px-5 pb-10">
        {filtered.length === 0 ? (
          <div className="text-center py-[60px] px-5 text-muted">
            <div className="mb-3 flex justify-center"><Inbox size={40} className="text-muted" /></div>
            <div className="text-[15px] font-semibold">{T("noFeedback")}</div>
          </div>
        ) : (
          filtered.map((entry, i) => {
            const meta = TYPE_META[entry.type] || TYPE_META.general;
            return (
              <div
                key={entry.id}
                className="px-5 py-[18px] bg-surface rounded-3xl border border-border mb-2"
                style={{ animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}
              >
                {/* Top row: type badge + timestamp */}
                <div className="flex justify-between items-center mb-2.5">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[12px] font-bold border",
                    meta.bgClass, meta.borderClass, meta.colorClass
                  )}>
                    <meta.icon size={12} />
                    <span>{entry.type}</span>
                  </div>
                  <span className="text-[12px] text-muted">{formatDate(entry.timestamp)}</span>
                </div>

                {/* Rating if applicable */}
                {entry.type === "rating" && entry.rating && (
                  <div className="mb-2 text-base">
                    {"⭐".repeat(entry.rating)}{"☆".repeat(5 - entry.rating)}
                  </div>
                )}

                {/* Message */}
                <p className="text-[14px] text-text m-0 leading-relaxed">{entry.message}</p>

                {/* Contact */}
                {entry.contact && (
                  <div className="mt-2 text-[12px] text-text-2">
                    {T("contactLabel")}: {entry.contact}
                  </div>
                )}

                {/* Context */}
                {entry.context && (
                  <div className="mt-3 px-3 py-2.5 bg-bg rounded-[10px] flex flex-wrap gap-x-3 gap-y-1">
                    {entry.context.dogName && (
                      <span className="text-[11px] text-muted inline-flex items-center gap-0.5"><Dog size={11} /> {entry.context.dogName}</span>
                    )}
                    {entry.context.dogBreed && (
                      <span className="text-[11px] text-muted">{entry.context.dogBreed}</span>
                    )}
                    <span className="text-[11px] text-muted">Lv.{entry.context.playerLevel}</span>
                    <span className="text-[11px] text-muted">{entry.context.totalXP} XP</span>
                    <span className="text-[11px] text-muted inline-flex items-center gap-0.5"><Flame size={11} /> {entry.context.currentStreak}</span>
                    <span className="text-[11px] text-muted">{entry.context.totalExercises} ex.</span>
                    <span className="text-[11px] text-muted">{entry.context.language}</span>
                    <span className="text-[11px] text-muted">@{entry.context.screen}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
