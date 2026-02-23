import { useState, useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { generateMemoryCard, shareMemoryCard } from "../utils/memories.js";
import BottomNav from "./BottomNav.jsx";
import { Card } from "./ui/Card";

const MOOD_EMOJI = { happy: "😊", struggling: "😣", okay: "😐", good: "🙂", great: "😄", amazing: "🤩" };

export default function MemoryDetail() {
  const { selProgram, nav, dogProfile, T } = useApp();
  const [cardUrl, setCardUrl] = useState(null);
  const canvasRef = useRef(null);

  const memory = selProgram?.memory || null;

  if (!memory || !memory.type) {
    return (
      <div className="min-h-screen bg-bg p-5">
        <button onClick={() => nav("home")} className="bg-transparent border-none text-muted text-sm cursor-pointer py-2 px-0">
          ← {T("back")}
        </button>
        <div className="text-center py-20 text-muted">{T("noMemories")}</div>
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
    if (canvasRef.current) shareMemoryCard(canvasRef.current, memory);
  };

  const handleDownload = () => {
    if (!cardUrl) return;
    const a = document.createElement("a");
    a.href = cardUrl;
    a.download = "pawpath-memory.png";
    a.click();
  };

  return (
    <div className="min-h-screen pb-24 bg-bg [animation:fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5">
        <button
          onClick={() => nav("home")}
          className="w-9 h-9 rounded-[10px] bg-border flex items-center justify-center border-none text-muted cursor-pointer text-base"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="text-[10px] font-bold text-training uppercase tracking-[2px]">{typeLabel}</div>
          <h2 className="font-display text-[22px] font-extrabold mt-1 m-0 text-text">{T("memoryTitle")}</h2>
        </div>
      </div>

      <div className="px-5 pt-6">
        {/* Emoji + title */}
        <div className="text-center mb-8">
          <div className="text-[72px] mb-4">{memory.emoji}</div>
          <h3 className="text-2xl font-extrabold text-text m-0 mb-1.5">{memory.title}</h3>
          {memory.subtitle && <p className="text-[15px] text-muted m-0">{memory.subtitle}</p>}
        </div>

        {/* Date + time ago */}
        <div className="flex justify-center gap-4 mb-6">
          {memory.date && (
            <Card className="text-center px-5 py-3">
              <div className="text-xs text-muted mb-1">{T("date")}</div>
              <div className="text-sm font-bold text-text">
                {new Date(memory.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </Card>
          )}
          {memory.timeAgo && (
            <Card className="text-center px-5 py-3">
              <div className="text-xs text-muted mb-1">{T("timeAgo")}</div>
              <div className="text-sm font-bold text-text">{memory.timeAgo} {T("daysAgo")}</div>
            </Card>
          )}
        </div>

        {/* Note */}
        {memory.note && (
          <Card className="mb-5">
            <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-2">{T("sessionNotes")}</div>
            <p className="text-[15px] text-text-2 m-0 leading-[1.7]">"{memory.note}"</p>
          </Card>
        )}

        {/* Rating + Mood */}
        {(memory.rating || memory.mood) && (
          <div className="flex gap-3 mb-6">
            {memory.rating && (
              <Card className="flex-1 text-center py-4 px-3">
                <div className="text-xs text-muted mb-1.5">{T("howDidItGo")}</div>
                <div className="text-[22px]">
                  {[1, 2, 3, 4, 5].map(n => (
                    <span key={n} style={{ opacity: n <= memory.rating ? 1 : 0.2 }}>⭐</span>
                  ))}
                </div>
              </Card>
            )}
            {memory.mood && (
              <Card className="flex-1 text-center py-4 px-3">
                <div className="text-xs text-muted mb-1.5">{T("dogMood")}</div>
                <div className="text-[28px]">{MOOD_EMOJI[memory.mood] || "🙂"}</div>
              </Card>
            )}
          </div>
        )}

        {/* Generate & Share Card */}
        {!cardUrl ? (
          <button
            onClick={handleGenerateCard}
            className="w-full py-4 text-[15px] font-bold bg-training/10 text-training border border-training/20 rounded-full cursor-pointer mb-3"
          >
            🖼️ {T("createMemoryCard")}
          </button>
        ) : (
          <div className="[animation:fadeIn_0.3s_ease]">
            <div className="rounded-3xl overflow-hidden mb-4 border border-border">
              <img src={cardUrl} alt="Memory card" className="w-full block" />
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={handleShare}
                className="flex-1 py-3.5 text-sm font-bold bg-training text-black border-none rounded-full cursor-pointer"
              >
                {T("shareCard")}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 py-3.5 text-sm font-bold bg-surface text-text border border-border rounded-full cursor-pointer"
              >
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
