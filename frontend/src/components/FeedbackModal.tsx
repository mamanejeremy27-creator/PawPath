import { useState } from "react";
import { Bug, Star, Lightbulb, FileText, X, PartyPopper } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { submitFeedbackToSheet } from "../utils/feedback.js";
import { cn } from "../lib/cn";

const TYPES = [
  { id: "bug", icon: Bug, labelKey: "bugReport" },
  { id: "rating", icon: Star, labelKey: "rateApp" },
  { id: "feature", icon: Lightbulb, labelKey: "featureRequest" },
  { id: "general", icon: FileText, labelKey: "generalFeedback" },
];

const PLACEHOLDERS = {
  bug: "whatWentWrong",
  feature: "whatToSee",
  rating: "tellUsWhatYouThink",
  general: "tellUsWhatYouThink",
};

export default function FeedbackModal() {
  const {
    showFeedback, setShowFeedback, submitFeedback, T,
    screen, dogProfile, playerLevel, totalXP, currentStreak, completedExercises, lang,
  } = useApp();

  const [type, setType] = useState(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!showFeedback) return null;

  const handleClose = () => {
    setShowFeedback(false);
    setType(null);
    setRating(0);
    setMessage("");
    setSending(false);
    setSubmitted(false);
  };

  const canSubmit = type && !sending && (type === "rating" ? rating > 0 : message.trim());

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSending(true);

    try {
      await submitFeedbackToSheet({
        type,
        rating,
        message: message.trim(),
        dogName: dogProfile?.name || "",
        language: lang,
      });

      submitFeedback({
        id: Date.now().toString(),
        type,
        rating: type === "rating" ? rating : undefined,
        message: message.trim() || (type === "rating" ? `${rating}/5 stars` : ""),
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
      });

      setSubmitted(true);
      setTimeout(handleClose, 2000);
    } catch {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-xl flex items-end justify-center"
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="w-full max-w-[480px] bg-surface rounded-t-3xl px-6 pt-7 pb-9 [animation:slideUp_0.3s_ease] max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="text-center py-12 px-5 [animation:fadeIn_0.4s_ease]">
            <div className="mb-4 flex justify-center"><PartyPopper size={56} color="#22C55E" /></div>
            <div className="text-xl font-extrabold text-text">{T("thanksFeedback")}</div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-[22px] font-extrabold m-0 text-text">{T("feedbackTitle")}</h3>
              <button
                onClick={handleClose}
                className="bg-white/[0.06] border-none text-muted w-9 h-9 rounded-[10px] cursor-pointer flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* Type Selector */}
            <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2.5">{T("feedbackType")}</div>
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {TYPES.map(tp => (
                <button
                  key={tp.id}
                  onClick={() => { setType(tp.id); setRating(0); setMessage(""); }}
                  className={cn(
                    "px-3 py-3.5 rounded-3xl cursor-pointer text-center transition-all border",
                    type === tp.id
                      ? "bg-training/10 border-training/30"
                      : "bg-bg border-border"
                  )}
                >
                  <div className="mb-1 flex justify-center"><tp.icon size={24} className={type === tp.id ? "text-training" : "text-text"} /></div>
                  <div className={cn("text-[13px] font-bold", type === tp.id ? "text-training" : "text-text")}>{T(tp.labelKey)}</div>
                </button>
              ))}
            </div>

            {/* Rating Stars (only for rating type) */}
            {type === "rating" && (
              <div className="mb-5">
                <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-3">{T("rateApp")}</div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      className={cn(
                        "flex-1 py-2.5 rounded-[10px] cursor-pointer text-xl transition-all border",
                        rating >= n ? "bg-training/[0.12] border-training/30" : "bg-white/[0.06] border-transparent"
                      )}
                    >
                      {n <= rating ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Textarea */}
            {type && (
              <>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={T(PLACEHOLDERS[type])}
                  rows={4}
                  className="w-full px-4 py-3.5 text-[14px] bg-bg border border-border-2 rounded-2xl text-text outline-none leading-relaxed resize-none box-border mb-6"
                />

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={cn(
                    "w-full py-[18px] text-base font-extrabold rounded-full border-none transition-all",
                    canSubmit
                      ? "bg-training text-black cursor-pointer shadow-[0_8px_32px_rgba(34,197,94,0.25)]"
                      : "bg-training/20 text-black/40 cursor-default",
                    sending && "opacity-70"
                  )}
                >
                  {sending ? T("sending") : T("sendFeedback")}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
