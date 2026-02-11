import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";

const C = {
  bg: "#0A0A0C",
  s1: "#131316",
  b1: "rgba(255,255,255,0.06)",
  t1: "#F5F5F7",
  t2: "#A1A1AA",
  t3: "#71717A",
  acc: "#22C55E",
  rL: 24,
  r: 16,
};

const TYPE_META = {
  bug: { emoji: "🐛", color: "#EF4444" },
  feature: { emoji: "💡", color: "#F59E0B" },
  rating: { emoji: "⭐", color: "#8B5CF6" },
  general: { emoji: "📝", color: "#3B82F6" },
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
      // fallback
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
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: C.bg,
        overflowY: "auto",
        animation: "slideUp 0.3s ease",
      }}
    >
      {/* Header */}
      <div style={{ padding: "24px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 24,
              fontWeight: 800,
              margin: 0,
              color: C.t1,
            }}
          >
            {T("feedbackAdmin")}
          </h2>
          <p style={{ fontSize: 13, color: C.t3, marginTop: 4 }}>
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleCopy}
            style={{
              background: C.s1,
              border: `1px solid ${C.b1}`,
              color: copied ? C.acc : C.t2,
              padding: "8px 16px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.15s",
            }}
          >
            {copied ? T("copied") : T("copyJson")}
          </button>
          <button
            onClick={() => setShowFeedbackAdmin(false)}
            style={{
              background: C.s1,
              border: `1px solid ${C.b1}`,
              color: C.t1,
              width: 38,
              height: 38,
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, padding: "0 20px 14px", overflowX: "auto" }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              background: filter === f.id ? C.acc : C.s1,
              color: filter === f.id ? "#000" : C.t2,
              border: `1px solid ${filter === f.id ? C.acc : C.b1}`,
              borderRadius: 20,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {T(f.labelKey)}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div style={{ padding: "0 20px 40px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: C.t3 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{T("noFeedback")}</div>
          </div>
        ) : (
          filtered.map((entry, i) => {
            const meta = TYPE_META[entry.type] || TYPE_META.general;
            return (
              <div
                key={entry.id}
                style={{
                  padding: "18px 20px",
                  background: C.s1,
                  borderRadius: C.rL,
                  border: `1px solid ${C.b1}`,
                  marginBottom: 8,
                  animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
                }}
              >
                {/* Top row: type badge + timestamp */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 12px",
                      background: `${meta.color}15`,
                      border: `1px solid ${meta.color}30`,
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 700,
                      color: meta.color,
                    }}
                  >
                    <span>{meta.emoji}</span>
                    <span>{entry.type}</span>
                  </div>
                  <span style={{ fontSize: 12, color: C.t3 }}>{formatDate(entry.timestamp)}</span>
                </div>

                {/* Rating if applicable */}
                {entry.type === "rating" && entry.rating && (
                  <div style={{ marginBottom: 8, fontSize: 16 }}>
                    {"⭐".repeat(entry.rating)}{"☆".repeat(5 - entry.rating)}
                  </div>
                )}

                {/* Message */}
                <p style={{ fontSize: 14, color: C.t1, margin: 0, lineHeight: 1.6 }}>
                  {entry.message}
                </p>

                {/* Contact */}
                {entry.contact && (
                  <div style={{ marginTop: 8, fontSize: 12, color: C.t2 }}>
                    {T("contactLabel")}: {entry.contact}
                  </div>
                )}

                {/* Context */}
                {entry.context && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: "10px 12px",
                      background: C.bg,
                      borderRadius: 10,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "4px 12px",
                    }}
                  >
                    {entry.context.dogName && (
                      <span style={{ fontSize: 11, color: C.t3 }}>🐕 {entry.context.dogName}</span>
                    )}
                    {entry.context.dogBreed && (
                      <span style={{ fontSize: 11, color: C.t3 }}>{entry.context.dogBreed}</span>
                    )}
                    <span style={{ fontSize: 11, color: C.t3 }}>Lv.{entry.context.playerLevel}</span>
                    <span style={{ fontSize: 11, color: C.t3 }}>{entry.context.totalXP} XP</span>
                    <span style={{ fontSize: 11, color: C.t3 }}>🔥 {entry.context.currentStreak}</span>
                    <span style={{ fontSize: 11, color: C.t3 }}>{entry.context.totalExercises} ex.</span>
                    <span style={{ fontSize: 11, color: C.t3 }}>{entry.context.language}</span>
                    <span style={{ fontSize: 11, color: C.t3 }}>@{entry.context.screen}</span>
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
