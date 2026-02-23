import { useState, useEffect, useRef, useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { computeRecap, generateRecapCard } from "../utils/recapData.js";
import { Calendar } from "lucide-react";
import { cn } from "../lib/cn";

const SLIDE_DURATION = 5000;
const MOOD_EMOJI = { happy: "😊", struggling: "😣", okay: "😐", good: "🙂", great: "😄", amazing: "🤩" };

function SlideContent({ slide, recap, T }) {
  const { id, value, emoji, color } = slide;

  const containerCls = "flex flex-col items-center justify-center min-h-[60vh] px-8 text-center animate-[fadeIn_0.5s_ease]";
  const emojiCls = "text-[80px] mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]";
  const labelCls = "text-xl font-bold text-text mb-2";
  const subCls = "text-[15px] text-muted leading-relaxed";

  switch (id) {
    case "sessions":
      return (
        <div className={containerCls}>
          <div className={emojiCls}>{emoji}</div>
          <div className="text-[72px] font-black mb-2" style={{ color }}>{value}</div>
          <div className={labelCls}>{T("recapSessions")}</div>
          <div className={subCls}>{T("recapSessionsSub")}</div>
        </div>
      );
    case "xp":
      return (
        <div className={containerCls}>
          <div className={emojiCls}>{emoji}</div>
          <div className="text-[72px] font-black mb-2" style={{ color }}>{value.toLocaleString()}</div>
          <div className={labelCls}>{T("recapXP")}</div>
          <div className={subCls}>{T("recapXPSub")}</div>
        </div>
      );
    case "badges":
      return (
        <div className={containerCls}>
          <div className={emojiCls}>{emoji}</div>
          <div className="text-[72px] font-black mb-2" style={{ color }}>{value}</div>
          <div className={labelCls}>{T("recapBadges")}</div>
          <div className={subCls}>{T("recapBadgesSub")}</div>
        </div>
      );
    case "streak":
      return (
        <div className={containerCls}>
          <div className={emojiCls}>{emoji}</div>
          <div className="text-[72px] font-black mb-2" style={{ color }}>{value}</div>
          <div className={labelCls}>{T("recapStreak")}</div>
          <div className={subCls}>{T("recapStreakSub")}</div>
        </div>
      );
    case "topProgram":
      return (
        <div className={containerCls}>
          <div className={emojiCls}>{value?.emoji || emoji}</div>
          <div className="text-[36px] font-black mb-2" style={{ color }}>{value?.name || "—"}</div>
          <div className={labelCls}>{T("recapTopProgram")}</div>
          <div className={subCls}>{value ? `${value.sessions} ${T("sessions")}` : ""}</div>
        </div>
      );
    case "exercises":
      return (
        <div className={containerCls}>
          <div className={emojiCls}>{emoji}</div>
          <div className="text-[72px] font-black mb-2" style={{ color }}>{value}</div>
          <div className={labelCls}>{T("recapExercises")}</div>
          <div className={subCls}>{T("recapExercisesSub")}</div>
        </div>
      );
    case "reviews":
      return (
        <div className={containerCls}>
          <div className={emojiCls}>{emoji}</div>
          <div className="text-[72px] font-black mb-2" style={{ color }}>{value}</div>
          <div className={labelCls}>{T("recapReviews")}</div>
          <div className={subCls}>{T("recapReviewsSub")}</div>
        </div>
      );
    case "summary":
      return (
        <div className={containerCls}>
          <div className={emojiCls}>{emoji}</div>
          <div className="text-[36px] font-black text-training mb-5 font-display">
            {T("recapSummaryTitle")}
          </div>
          <div className="flex gap-4 flex-wrap justify-center mb-4">
            <div className="px-5 py-3 bg-surface rounded-2xl border border-border">
              <div className="text-[11px] text-muted uppercase tracking-[1px]">{T("recapActiveMonths")}</div>
              <div className="text-[28px] font-black text-text mt-1">{value.activeMonths}</div>
            </div>
            <div className="px-5 py-3 bg-surface rounded-2xl border border-border">
              <div className="text-[11px] text-muted uppercase tracking-[1px]">{T("recapAvgRating")}</div>
              <div className="text-[28px] font-black text-text mt-1">{value.avgRating} ⭐</div>
            </div>
            {value.topMood && (
              <div className="px-5 py-3 bg-surface rounded-2xl border border-border">
                <div className="text-[11px] text-muted uppercase tracking-[1px]">{T("recapTopMood")}</div>
                <div className="text-[28px] mt-1">{MOOD_EMOJI[value.topMood] || "🙂"}</div>
              </div>
            )}
          </div>
          <div className={subCls}>{T("recapSummarySub")}</div>
        </div>
      );
    default:
      return null;
  }
}

export default function AnnualRecap() {
  const { journal, completedExercises, completedLevels, earnedBadges, totalXP, totalSessions, currentStreak, totalReviews, dogProfile, programs, nav, T } = useApp();

  const recap = useMemo(() => computeRecap({
    journal, completedExercises, completedLevels, earnedBadges,
    totalXP, totalSessions, currentStreak, totalReviews, dogProfile, programs,
  }), [journal, completedExercises, completedLevels, earnedBadges, totalXP, totalSessions, currentStreak, totalReviews, dogProfile, programs]);

  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cardUrl, setCardUrl] = useState(null);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);

  const totalSlides = recap?.slides?.length || 0;

  // Auto-advance
  useEffect(() => {
    if (paused || !recap || slide >= totalSlides - 1) return;
    timerRef.current = setTimeout(() => setSlide(s => s + 1), SLIDE_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [slide, paused, recap, totalSlides]);

  if (!recap) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-10">
        <div className="mb-4 flex justify-center"><Calendar size={56} className="text-muted" /></div>
        <p className="text-base text-muted text-center">{T("noRecapData")}</p>
        <button
          onClick={() => nav("profile")}
          className="mt-6 px-8 py-3 bg-border border-0 rounded-full text-text text-sm font-semibold cursor-pointer"
        >
          {T("back")}
        </button>
      </div>
    );
  }

  const handleTap = () => {
    setPaused(p => !p);
  };

  const handleSwipeStart = (x) => {
    touchStartX.current = x;
    setPaused(true);
    clearTimeout(timerRef.current);
  };

  const handleSwipeEnd = (x) => {
    const diff = touchStartX.current - x;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && slide < totalSlides - 1) setSlide(s => s + 1);
      else if (diff < 0 && slide > 0) setSlide(s => s - 1);
    }
    setPaused(false);
  };

  const handleShare = () => {
    const canvas = generateRecapCard(recap);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `pawpath-${recap.year}-recap.png`, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: `PawPath ${recap.year} Recap` }); } catch { /* cancelled */ }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pawpath-${recap.year}-recap.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }, "image/png");
  };

  const handleGenerateCard = () => {
    const canvas = generateRecapCard(recap);
    setCardUrl(canvas.toDataURL("image/png"));
  };

  const currentSlide = recap.slides[slide];

  return (
    <div
      className="min-h-screen bg-bg relative overflow-hidden select-none"
      onClick={handleTap}
      onTouchStart={e => handleSwipeStart(e.touches[0].clientX)}
      onTouchEnd={e => handleSwipeEnd(e.changedTouches[0].clientX)}
    >
      {/* Colored glow behind slide */}
      <div
        className="absolute top-[20%] left-1/2 w-[300px] h-[300px] -translate-x-1/2 rounded-full pointer-events-none transition-[background] duration-500"
        style={{ background: `radial-gradient(circle, ${currentSlide.color}15 0%, transparent 70%)` }}
      />

      {/* Progress bars */}
      <div className="flex gap-[3px] px-4 pt-3 relative z-10">
        {recap.slides.map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-[3px] bg-white/15 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-[3px]",
                i < slide ? "bg-text" : i === slide ? "bg-training" : "bg-transparent"
              )}
              style={{
                width: i < slide ? "100%" : i === slide ? (paused ? "50%" : "100%") : "0%",
                transition: i === slide ? `width ${SLIDE_DURATION}ms linear` : "none",
              }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={e => { e.stopPropagation(); nav("profile"); }}
        className="absolute top-6 end-4 z-20 bg-white/10 border-0 text-text w-9 h-9 rounded-full cursor-pointer text-base"
      >
        ✕
      </button>

      {/* Year label */}
      <div className="text-center pt-5 relative z-[5]">
        <div className="text-[13px] font-bold text-training uppercase tracking-[3px]">
          {recap.year} {T("yearInReview")}
        </div>
        <div className="text-[15px] text-muted mt-1">{recap.dogName}</div>
      </div>

      {/* Slide content */}
      <div className="relative z-[5]">
        <SlideContent slide={currentSlide} recap={recap} T={T} />
      </div>

      {/* Bottom actions (only on last slide) */}
      {slide === totalSlides - 1 && (
        <div
          className="relative z-10 px-5 pb-10 animate-[fadeIn_0.5s_ease]"
          onClick={e => e.stopPropagation()}
        >
          {!cardUrl ? (
            <div className="flex gap-2.5">
              <button
                onClick={handleShare}
                className="flex-1 py-4 text-[15px] font-bold bg-training text-black border-0 rounded-full cursor-pointer"
              >
                {T("shareCard")}
              </button>
              <button
                onClick={handleGenerateCard}
                className="flex-1 py-4 text-[15px] font-bold bg-surface text-text border border-border rounded-full cursor-pointer"
              >
                {T("downloadCard")}
              </button>
            </div>
          ) : (
            <div>
              <div className="rounded-[20px] overflow-hidden mb-3 border border-border">
                <img src={cardUrl} alt="Recap card" className="w-full block" />
              </div>
              <button
                onClick={handleShare}
                className="w-full py-4 text-[15px] font-bold bg-training text-black border-0 rounded-full cursor-pointer"
              >
                {T("shareCard")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Nav dots */}
      <div className="flex justify-center gap-1.5 py-4 relative z-[5]">
        {recap.slides.map((_, i) => (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); setSlide(i); setPaused(true); }}
            className="h-1.5 rounded-[3px] border-0 cursor-pointer transition-all duration-200 p-0"
            style={{
              width: i === slide ? 20 : 6,
              background: i === slide ? "#22C55E" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
