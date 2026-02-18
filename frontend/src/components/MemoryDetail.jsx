import { useState, useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { generateMemoryCard, shareMemoryCard } from "../utils/memories.js";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", s2: "#1A1A1F", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };

const MOOD_EMOJI = { happy: "\uD83D\uDE0A", struggling: "\uD83D\uDE23", okay: "\uD83D\uDE10", good: "\uD83D\uDE42", great: "\uD83D\uDE04", amazing: "\uD83E\uDD29" };

export default function MemoryDetail() {
  const { selProgram, nav, dogProfile, T } = useApp();
  const [cardUrl, setCardUrl] = useState(null);
  const canvasRef = useRef(null);

  const memory = selProgram?.memory || null;

  if (!memory || !memory.type) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, padding: 20 }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.t3, fontSize: 14, cursor: "pointer", padding: "8px 0" }}>
          {"\u2190"} {T("back")}
        </button>
        <div style={{ textAlign: "center", padding: "80px 20px", color: C.t3 }}>{T("noMemories")}</div>
        <BottomNav active="home" />
      </div>
    );
  }

  const typeLabel = memory.type === "onThisDay" ? T("onThisDay")
    : memory.type === "anniversary" ? T("trainingAnniversary")
    : T("throwback");

  const handleGenerateCard = () => {
    const canvas = generateMemoryCard(memory, dogProfile?.name || "");
    canvasRef.current = canvas;
    setCardUrl(canvas.toDataURL("image/png"));
  };

  const handleShare = () => {
    if (canvasRef.current) {
      shareMemoryCard(canvasRef.current, memory);
    }
  };

  const handleDownload = () => {
    if (!cardUrl) return;
    const a = document.createElement("a");
    a.href = cardUrl;
    a.download = "pawpath-memory.png";
    a.click();
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => nav("home")} style={{ background: C.b1, border: "none", color: C.t3, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 16 }}>
          {"\u2190"}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.acc, textTransform: "uppercase", letterSpacing: 2 }}>{typeLabel}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, margin: "4px 0 0", color: C.t1 }}>{T("memoryTitle")}</h2>
        </div>
      </div>

      {/* Memory content */}
      <div style={{ padding: "24px 20px" }}>
        {/* Big emoji + title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>{memory.emoji}</div>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: C.t1, margin: "0 0 6px" }}>{memory.title}</h3>
          {memory.subtitle && <p style={{ fontSize: 15, color: C.t3, margin: 0 }}>{memory.subtitle}</p>}
        </div>

        {/* Date + time ago */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          {memory.date && (
            <div style={{ textAlign: "center", padding: "12px 20px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
              <div style={{ fontSize: 12, color: C.t3, marginBottom: 4 }}>{T("date")}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>
                {new Date(memory.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          )}
          {memory.timeAgo && (
            <div style={{ textAlign: "center", padding: "12px 20px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
              <div style={{ fontSize: 12, color: C.t3, marginBottom: 4 }}>{T("timeAgo")}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{memory.timeAgo} {T("daysAgo")}</div>
            </div>
          )}
        </div>

        {/* Note */}
        {memory.note && (
          <div style={{ padding: "20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`, marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{T("sessionNotes")}</div>
            <p style={{ fontSize: 15, color: C.t2, margin: 0, lineHeight: 1.7 }}>{"\u201C"}{memory.note}{"\u201D"}</p>
          </div>
        )}

        {/* Rating + Mood */}
        {(memory.rating || memory.mood) && (
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {memory.rating && (
              <div style={{ flex: 1, textAlign: "center", padding: "16px 12px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
                <div style={{ fontSize: 12, color: C.t3, marginBottom: 6 }}>{T("howDidItGo")}</div>
                <div style={{ fontSize: 22 }}>
                  {[1, 2, 3, 4, 5].map(n => <span key={n} style={{ opacity: n <= memory.rating ? 1 : 0.2 }}>{"\u2B50"}</span>)}
                </div>
              </div>
            )}
            {memory.mood && (
              <div style={{ flex: 1, textAlign: "center", padding: "16px 12px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
                <div style={{ fontSize: 12, color: C.t3, marginBottom: 6 }}>{T("dogMood")}</div>
                <div style={{ fontSize: 28 }}>{MOOD_EMOJI[memory.mood] || "\uD83D\uDE42"}</div>
              </div>
            )}
          </div>
        )}

        {/* Generate & Share Card */}
        {!cardUrl ? (
          <button
            onClick={handleGenerateCard}
            style={{
              width: "100%", padding: "16px", fontSize: 15, fontWeight: 700,
              background: "rgba(34,197,94,0.1)", color: C.acc,
              border: `1px solid rgba(34,197,94,0.2)`, borderRadius: 50,
              cursor: "pointer", marginBottom: 12,
            }}
          >
            {"\uD83D\uDDBC\uFE0F"} {T("createMemoryCard")}
          </button>
        ) : (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {/* Card preview */}
            <div style={{ borderRadius: C.rL, overflow: "hidden", marginBottom: 16, border: `1px solid ${C.b1}` }}>
              <img src={cardUrl} alt="Memory card" style={{ width: "100%", display: "block" }} />
            </div>

            {/* Share/Download buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleShare} style={{ flex: 1, padding: "14px", fontSize: 14, fontWeight: 700, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer" }}>
                {T("shareCard")}
              </button>
              <button onClick={handleDownload} style={{ flex: 1, padding: "14px", fontSize: 14, fontWeight: 700, background: C.s1, color: C.t1, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>
                {T("downloadCard")}
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
}
