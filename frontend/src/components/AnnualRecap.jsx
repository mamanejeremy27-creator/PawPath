import { useState, useEffect, useRef, useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { computeRecap, generateRecapCard } from "../utils/recapData.js";
import { Calendar } from "lucide-react";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E" };

const SLIDE_DURATION = 5000;
const MOOD_EMOJI = { happy: "\uD83D\uDE0A", struggling: "\uD83D\uDE23", okay: "\uD83D\uDE10", good: "\uD83D\uDE42", great: "\uD83D\uDE04", amazing: "\uD83E\uDD29" };

function SlideContent({ slide, recap, T }) {
  const { id, value, emoji, color } = slide;

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    padding: "0 32px",
    textAlign: "center",
    animation: "fadeIn 0.5s ease",
  };

  const emojiStyle = { fontSize: 80, marginBottom: 24, filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))" };
  const valueStyle = { fontSize: 72, fontWeight: 800, color, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" };
  const labelStyle = { fontSize: 20, fontWeight: 700, color: C.t1, marginBottom: 8 };
  const subStyle = { fontSize: 15, color: C.t3, lineHeight: 1.6 };

  switch (id) {
    case "sessions":
      return (
        <div style={containerStyle}>
          <div style={emojiStyle}>{emoji}</div>
          <div style={valueStyle}>{value}</div>
          <div style={labelStyle}>{T("recapSessions")}</div>
          <div style={subStyle}>{T("recapSessionsSub")}</div>
        </div>
      );
    case "xp":
      return (
        <div style={containerStyle}>
          <div style={emojiStyle}>{emoji}</div>
          <div style={valueStyle}>{value.toLocaleString()}</div>
          <div style={labelStyle}>{T("recapXP")}</div>
          <div style={subStyle}>{T("recapXPSub")}</div>
        </div>
      );
    case "badges":
      return (
        <div style={containerStyle}>
          <div style={emojiStyle}>{emoji}</div>
          <div style={valueStyle}>{value}</div>
          <div style={labelStyle}>{T("recapBadges")}</div>
          <div style={subStyle}>{T("recapBadgesSub")}</div>
        </div>
      );
    case "streak":
      return (
        <div style={containerStyle}>
          <div style={emojiStyle}>{emoji}</div>
          <div style={valueStyle}>{value}</div>
          <div style={labelStyle}>{T("recapStreak")}</div>
          <div style={subStyle}>{T("recapStreakSub")}</div>
        </div>
      );
    case "topProgram":
      return (
        <div style={containerStyle}>
          <div style={emojiStyle}>{value?.emoji || emoji}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color, marginBottom: 8 }}>{value?.name || "—"}</div>
          <div style={labelStyle}>{T("recapTopProgram")}</div>
          <div style={subStyle}>{value ? `${value.sessions} ${T("sessions")}` : ""}</div>
        </div>
      );
    case "exercises":
      return (
        <div style={containerStyle}>
          <div style={emojiStyle}>{emoji}</div>
          <div style={valueStyle}>{value}</div>
          <div style={labelStyle}>{T("recapExercises")}</div>
          <div style={subStyle}>{T("recapExercisesSub")}</div>
        </div>
      );
    case "reviews":
      return (
        <div style={containerStyle}>
          <div style={emojiStyle}>{emoji}</div>
          <div style={valueStyle}>{value}</div>
          <div style={labelStyle}>{T("recapReviews")}</div>
          <div style={subStyle}>{T("recapReviewsSub")}</div>
        </div>
      );
    case "summary":
      return (
        <div style={containerStyle}>
          <div style={emojiStyle}>{emoji}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.acc, marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>
            {T("recapSummaryTitle")}
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
            <div style={{ padding: "12px 20px", background: C.s1, borderRadius: 16, border: `1px solid ${C.b1}` }}>
              <div style={{ fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: 1 }}>{T("recapActiveMonths")}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.t1, marginTop: 4 }}>{value.activeMonths}</div>
            </div>
            <div style={{ padding: "12px 20px", background: C.s1, borderRadius: 16, border: `1px solid ${C.b1}` }}>
              <div style={{ fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: 1 }}>{T("recapAvgRating")}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.t1, marginTop: 4 }}>{value.avgRating} {"\u2B50"}</div>
            </div>
            {value.topMood && (
              <div style={{ padding: "12px 20px", background: C.s1, borderRadius: 16, border: `1px solid ${C.b1}` }}>
                <div style={{ fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: 1 }}>{T("recapTopMood")}</div>
                <div style={{ fontSize: 28, marginTop: 4 }}>{MOOD_EMOJI[value.topMood] || "\uD83D\uDE42"}</div>
              </div>
            )}
          </div>
          <div style={subStyle}>{T("recapSummarySub")}</div>
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
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><Calendar size={56} color={C.t3} /></div>
        <p style={{ fontSize: 16, color: C.t3, textAlign: "center" }}>{T("noRecapData")}</p>
        <button onClick={() => nav("profile")} style={{ marginTop: 24, padding: "12px 32px", background: C.b1, border: "none", borderRadius: 50, color: C.t1, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
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
      style={{ minHeight: "100vh", background: C.bg, position: "relative", overflow: "hidden", userSelect: "none" }}
      onClick={handleTap}
      onTouchStart={e => handleSwipeStart(e.touches[0].clientX)}
      onTouchEnd={e => handleSwipeEnd(e.changedTouches[0].clientX)}
    >
      {/* Colored glow behind slide */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", width: 300, height: 300,
        transform: "translateX(-50%)", borderRadius: "50%",
        background: `radial-gradient(circle, ${currentSlide.color}15 0%, transparent 70%)`,
        transition: "background 0.5s ease",
      }} />

      {/* Progress bars */}
      <div style={{ display: "flex", gap: 3, padding: "12px 16px 0", position: "relative", zIndex: 10 }}>
        {recap.slides.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 3,
              background: i < slide ? C.t1 : i === slide ? C.acc : "transparent",
              width: i < slide ? "100%" : i === slide ? (paused ? "50%" : "100%") : "0%",
              transition: i === slide ? `width ${SLIDE_DURATION}ms linear` : "none",
            }} />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={e => { e.stopPropagation(); nav("profile"); }}
        style={{ position: "absolute", top: 24, right: 16, zIndex: 20, background: "rgba(255,255,255,0.1)", border: "none", color: C.t1, width: 36, height: 36, borderRadius: 50, cursor: "pointer", fontSize: 16 }}
      >
        {"\u2715"}
      </button>

      {/* Year label */}
      <div style={{ textAlign: "center", padding: "20px 0 0", position: "relative", zIndex: 5 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.acc, textTransform: "uppercase", letterSpacing: 3 }}>{recap.year} {T("yearInReview")}</div>
        <div style={{ fontSize: 15, color: C.t3, marginTop: 4 }}>{recap.dogName}</div>
      </div>

      {/* Slide content */}
      <div style={{ position: "relative", zIndex: 5 }}>
        <SlideContent slide={currentSlide} recap={recap} T={T} />
      </div>

      {/* Bottom actions (only on last slide) */}
      {slide === totalSlides - 1 && (
        <div style={{ position: "relative", zIndex: 10, padding: "0 20px 40px", animation: "fadeIn 0.5s ease" }} onClick={e => e.stopPropagation()}>
          {!cardUrl ? (
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleShare} style={{ flex: 1, padding: "16px", fontSize: 15, fontWeight: 700, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer" }}>
                {T("shareCard")}
              </button>
              <button onClick={handleGenerateCard} style={{ flex: 1, padding: "16px", fontSize: 15, fontWeight: 700, background: C.s1, color: C.t1, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>
                {T("downloadCard")}
              </button>
            </div>
          ) : (
            <div>
              <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 12, border: `1px solid ${C.b1}` }}>
                <img src={cardUrl} alt="Recap card" style={{ width: "100%", display: "block" }} />
              </div>
              <button onClick={handleShare} style={{ width: "100%", padding: "16px", fontSize: 15, fontWeight: 700, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer" }}>
                {T("shareCard")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Nav dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "16px 0", position: "relative", zIndex: 5 }}>
        {recap.slides.map((_, i) => (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); setSlide(i); setPaused(true); }}
            style={{ width: i === slide ? 20 : 6, height: 6, borderRadius: 3, background: i === slide ? C.acc : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", transition: "all 0.2s ease", padding: 0 }}
          />
        ))}
      </div>
    </div>
  );
}
