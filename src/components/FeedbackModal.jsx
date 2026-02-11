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

const TYPES = [
  { id: "bug", emoji: "🐛", labelKey: "bugReport", subKey: "somethingBroken" },
  { id: "feature", emoji: "💡", labelKey: "featureRequest", subKey: "wishAppCould" },
  { id: "rating", emoji: "⭐", labelKey: "appRating", subKey: "howAmIDoing" },
  { id: "general", emoji: "📝", labelKey: "generalFeedback", subKey: "wantToSay" },
];

const PLACEHOLDERS = {
  bug: "bugPlaceholder",
  feature: "featurePlaceholder",
  rating: "ratingPlaceholder",
  general: "generalPlaceholder",
};

export default function FeedbackModal() {
  const {
    showFeedback, setShowFeedback, submitFeedback, T,
    screen, dogProfile, playerLevel, totalXP, currentStreak, completedExercises, lang,
  } = useApp();

  const [type, setType] = useState(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!showFeedback) return null;

  const handleClose = () => {
    setShowFeedback(false);
    setType(null);
    setRating(0);
    setMessage("");
    setContact("");
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!type || !message.trim()) return;

    const entry = {
      id: Date.now().toString(),
      type,
      rating: type === "rating" ? rating : undefined,
      message: message.trim(),
      contact: contact.trim() || undefined,
      context: {
        screen,
        dogName: dogProfile?.name || "",
        dogBreed: dogProfile?.breed || "",
        playerLevel: playerLevel.level,
        totalXP,
        currentStreak,
        totalExercises: completedExercises.length,
        language: lang,
      },
      timestamp: new Date().toISOString(),
      status: "new",
    };

    submitFeedback(entry);
    setSubmitted(true);
    setTimeout(handleClose, 2000);
  };

  const canSubmit = type && message.trim();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: C.s1,
          borderRadius: "24px 24px 0 0",
          padding: "28px 24px 36px",
          animation: "slideUp 0.3s ease",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {submitted ? (
          <div style={{ textAlign: "center", padding: "48px 20px", animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>
              {T("thankYouFeedback")}
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22,
                  fontWeight: 800,
                  margin: 0,
                  color: C.t1,
                }}
              >
                {T("feedbackTitle")}
              </h3>
              <button
                onClick={handleClose}
                style={{
                  background: C.b1,
                  border: "none",
                  color: C.t3,
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>

            {/* Type Selection */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {TYPES.map(tp => (
                <button
                  key={tp.id}
                  onClick={() => setType(tp.id)}
                  style={{
                    padding: "16px 12px",
                    background: type === tp.id ? "rgba(34,197,94,0.1)" : C.bg,
                    border: `1px solid ${type === tp.id ? "rgba(34,197,94,0.3)" : C.b1}`,
                    borderRadius: C.rL,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{tp.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{T(tp.labelKey)}</div>
                  <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{T(tp.subKey)}</div>
                </button>
              ))}
            </div>

            {/* Rating (only for rating type) */}
            {type === "rating" && (
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.t3,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  {T("appRating")}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        background: rating >= n ? "rgba(34,197,94,0.12)" : C.b1,
                        border: `1px solid ${rating >= n ? "rgba(34,197,94,0.3)" : "transparent"}`,
                        borderRadius: 10,
                        cursor: "pointer",
                        fontSize: 20,
                        transition: "all 0.15s",
                      }}
                    >
                      {n <= rating ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Details textarea */}
            {type && (
              <>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={T(PLACEHOLDERS[type])}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    background: C.bg,
                    border: `1px solid rgba(255,255,255,0.1)`,
                    borderRadius: C.r,
                    color: C.t1,
                    outline: "none",
                    lineHeight: 1.6,
                    resize: "none",
                    boxSizing: "border-box",
                    marginBottom: 16,
                  }}
                />

                {/* Contact field */}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.t3,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {T("contactLabel")}
                </div>
                <input
                  type="text"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  placeholder={T("contactPlaceholder")}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    background: C.bg,
                    border: `1px solid rgba(255,255,255,0.1)`,
                    borderRadius: C.r,
                    color: C.t1,
                    outline: "none",
                    boxSizing: "border-box",
                    marginBottom: 24,
                  }}
                />

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  style={{
                    width: "100%",
                    padding: "18px",
                    fontSize: 16,
                    fontWeight: 800,
                    fontFamily: "'DM Sans', sans-serif",
                    background: canSubmit ? C.acc : "rgba(34,197,94,0.2)",
                    color: canSubmit ? "#000" : "rgba(0,0,0,0.4)",
                    border: "none",
                    borderRadius: 50,
                    cursor: canSubmit ? "pointer" : "default",
                    boxShadow: canSubmit ? "0 8px 32px rgba(34,197,94,0.25)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {T("sendFeedback")}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
