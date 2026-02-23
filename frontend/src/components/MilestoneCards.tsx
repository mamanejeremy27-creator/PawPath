import { useState, useMemo, useCallback } from "react";
import { useApp } from "../context/AppContext.jsx";
import { gatherMonthlyStats } from "../utils/monthlyStats.js";
import { generateMilestoneCard, shareCard, downloadCard } from "../utils/milestoneCardGenerator.js";
import BottomNav from "./BottomNav.jsx";
import { ChevronRight, RefreshCw, Download, ArrowDown, Calendar } from "lucide-react";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", rL: 24 };

export default function MilestoneCards() {
  const { journal, completedExercises, totalXP, currentStreak, totalSessions, totalReviews, dogProfile, nav, T, rtl, lang } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [cardImage, setCardImage] = useState(null);
  const [sharing, setSharing] = useState(false);

  const monthlyData = useMemo(() =>
    gatherMonthlyStats({ journal, completedExercises, totalXP, currentStreak, totalSessions, totalReviews, lang }),
    [journal, completedExercises, totalXP, currentStreak, totalSessions, totalReviews, lang]
  );

  const labels = useMemo(() => ({
    sessionsThisMonth: T("sessionsThisMonth"),
    xpEarned: T("xpEarned"),
    exercisesLearned: T("exercisesLearned"),
    bestStreak: T("bestStreak"),
    reviewsDone: T("reviewsDone"),
    avgRating: "Avg",
    trainingReport: T("trainingReport"),
    monthlyProgress: T("monthlyProgress"),
  }), [T]);

  const handleSelectMonth = useCallback((month) => {
    setSelectedMonth(month);
    const image = generateMilestoneCard({
      monthLabel: month.label,
      dogName: dogProfile?.name,
      stats: {
        sessions: month.sessions,
        xp: month.xp,
        newExercises: month.newExercises.length,
        bestStreak: month.bestStreak,
        reviews: month.reviews,
        avgRating: month.avgRating,
      },
      labels,
    });
    setCardImage(image);
  }, [dogProfile, labels]);

  const handleShare = useCallback(async () => {
    if (!cardImage || !selectedMonth) return;
    setSharing(true);
    await shareCard(cardImage, selectedMonth.label);
    setSharing(false);
  }, [cardImage, selectedMonth]);

  const handleDownload = useCallback(() => {
    if (!cardImage || !selectedMonth) return;
    downloadCard(cardImage, selectedMonth.label);
  }, [cardImage, selectedMonth]);

  // Full card view
  if (selectedMonth && cardImage) {
    return (
      <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
        <div style={{ padding: "24px 20px 16px" }}>
          <button onClick={() => { setSelectedMonth(null); setCardImage(null); }} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>{rtl ? "\u2192" : "\u2190"}</span> {T("milestoneCards")}
          </button>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: 0, color: C.t1 }}>{selectedMonth.label}</h2>
        </div>

        {/* Card preview */}
        <div style={{ padding: "0 20px", marginBottom: 20 }}>
          <div style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${C.b1}`, boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}>
            <img src={cardImage} alt="Milestone card" style={{ width: "100%", display: "block" }} />
          </div>
        </div>

        {/* Stats summary */}
        <div style={{ padding: "0 20px", marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { v: selectedMonth.sessions, l: T("sessionsThisMonth"), i: "\uD83C\uDFAF" },
              { v: selectedMonth.xp, l: T("xpEarned"), i: "\u26A1" },
              { v: selectedMonth.newExercises.length, l: T("exercisesLearned"), i: "\uD83C\uDF1F" },
              { v: selectedMonth.bestStreak, l: T("bestStreak"), i: "\uD83D\uDD25" },
              { v: selectedMonth.reviews, l: T("reviewsDone"), i: "\uD83D\uDD04" },
              { v: selectedMonth.avgRating, l: "Avg \u2B50", i: "\u2B50" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "14px 6px", background: C.s1, borderRadius: 16, border: `1px solid ${C.b1}` }}>
                <div style={{ fontSize: 16, marginBottom: 2 }}>{s.i}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>{s.v}</div>
                <div style={{ fontSize: 10, color: C.t3, fontWeight: 600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Share/Download buttons */}
        <div style={{ display: "flex", gap: 10, padding: "0 20px" }}>
          <button onClick={handleShare} disabled={sharing} style={{
            flex: 1, padding: "16px", fontSize: 15, fontWeight: 700,
            background: C.acc, color: "#000", border: "none", borderRadius: 50,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {sharing ? "..." : <><Download size={18} style={{ transform: "rotate(180deg)" }} /> {T("shareCard")}</>}
          </button>
          <button onClick={handleDownload} style={{
            flex: 1, padding: "16px", fontSize: 15, fontWeight: 700,
            background: C.s1, color: C.t1, border: `1px solid ${C.b1}`, borderRadius: 50,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <ArrowDown size={18} /> {T("downloadCard")}
          </button>
        </div>

        <BottomNav active="profile" />
      </div>
    );
  }

  // Gallery view
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>{rtl ? "\u2192" : "\u2190"}</span> {T("home")}
        </button>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: 0, color: C.t1 }}>{T("milestoneCards")}</h2>
        <p style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>{T("monthlyProgress")}</p>
      </div>

      {monthlyData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 40px", color: C.t3 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{"\uD83C\uDFC6"}</div>
          <p style={{ fontSize: 15, lineHeight: 1.6 }}>{T("noReportsYet")}</p>
        </div>
      ) : (
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {monthlyData.map((month: any) => (
            <button
              key={month.key}
              onClick={() => handleSelectMonth(month)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "18px 20px", background: C.s1, borderRadius: C.rL,
                border: `1px solid ${C.b1}`, cursor: "pointer",
                color: C.t1, textAlign: "start", width: "100%",
              }}
            >
              {/* Month icon */}
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "rgba(34,197,94,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, flexShrink: 0,
              }}>
                <Calendar size={24} color={C.acc} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{month.label}</div>
                <div style={{ fontSize: 13, color: C.t3, marginTop: 4, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span>{"\uD83C\uDFAF"} {month.sessions} {T("sessionsThisMonth").toLowerCase()}</span>
                  <span>{"\u26A1"} {month.xp} {T("xp")}</span>
                  <span>{"\uD83C\uDF1F"} {month.newExercises.length}</span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight size={18} color={C.t3} />
            </button>
          ))}
        </div>
      )}

      <BottomNav active="profile" />
    </div>
  );
}
