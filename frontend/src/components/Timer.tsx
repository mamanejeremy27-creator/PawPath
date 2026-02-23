import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../context/AppContext.jsx";
import { cn } from "../lib/cn";

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const SectionLabel = ({ text }: { text: string }) => (
  <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-3">{text}</div>
);

export default function Timer({ duration, onStop }: { duration: number; onStop?: () => void }) {
  const { T } = useApp();
  const [timerOn, setTimerOn] = useState(false);
  const [timerSec, setTimerSec] = useState(0);
  const [timerTotal, setTimerTotal] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimer = () => { setTimerTotal(duration); setTimerSec(duration); setTimerOn(true); };

  useEffect(() => {
    if (timerOn && timerSec > 0) timerRef.current = setTimeout(() => setTimerSec(s => s - 1), 1000);
    else if (timerOn && timerSec <= 0) setTimerOn(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timerOn, timerSec]);

  const stopTimer = useCallback(() => {
    setTimerOn(false);
    setTimerSec(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (onStop) onStop();
  }, [onStop]);

  const tProg = timerTotal > 0 ? ((timerTotal - timerSec) / timerTotal) * 100 : 0;

  return (
    <div
      className={cn(
        "mt-5 p-5 bg-surface rounded-3xl text-center border",
        timerOn
          ? "border-training/25 animate-[timerPulse_2s_ease_infinite]"
          : "border-border",
      )}
    >
      <SectionLabel text={T("sessionTimer")} />

      {/* Countdown display */}
      <div
        className={cn(
          "text-[48px] font-extrabold tabular-nums tracking-[2px]",
          timerOn ? "text-training" : "text-text",
        )}
      >
        {timerOn ? fmt(timerSec) : fmt(duration)}
      </div>

      {/* Progress bar — width is dynamic, keep style */}
      {timerOn && (
        <div className="h-1 bg-border rounded-[10px] overflow-hidden my-3.5">
          <div
            className="h-full rounded-[10px] transition-[width] duration-1000 linear"
            style={{ width: `${tProg}%`, background: "linear-gradient(90deg, #22C55E, #4ADE80)" }}
          />
        </div>
      )}

      {timerOn && timerSec <= 0 && (
        <p className="text-sm text-training font-bold animate-[breathe_1.5s_ease_infinite]">
          {T("timesUp")}
        </p>
      )}

      <div className="mt-3.5">
        {!timerOn ? (
          <button
            onClick={startTimer}
            className="px-9 py-3 text-sm font-bold bg-training text-black border-0 rounded-full cursor-pointer"
          >
            {T("startSession")}
          </button>
        ) : (
          <button
            onClick={stopTimer}
            className="px-9 py-3 text-sm font-bold bg-danger/[0.12] text-danger border border-danger/25 rounded-full cursor-pointer"
          >
            {T("stop")}
          </button>
        )}
      </div>
    </div>
  );
}
