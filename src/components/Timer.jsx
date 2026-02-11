import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../context/AppContext.jsx";

const C = { s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", danger: "#EF4444", r: 16, rL: 24 };

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const sectionLabel = (text) => <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{text}</div>;

export default function Timer({ duration, onStop }) {
  const { T } = useApp();
  const [timerOn, setTimerOn] = useState(false);
  const [timerSec, setTimerSec] = useState(0);
  const [timerTotal, setTimerTotal] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => { setTimerTotal(duration); setTimerSec(duration); setTimerOn(true); };

  useEffect(() => {
    if (timerOn && timerSec > 0) timerRef.current = setTimeout(() => setTimerSec(s => s - 1), 1000);
    else if (timerOn && timerSec <= 0) setTimerOn(false);
    return () => clearTimeout(timerRef.current);
  }, [timerOn, timerSec]);

  const stopTimer = useCallback(() => {
    setTimerOn(false);
    setTimerSec(0);
    clearTimeout(timerRef.current);
    if (onStop) onStop();
  }, [onStop]);

  const tProg = timerTotal > 0 ? ((timerTotal - timerSec) / timerTotal) * 100 : 0;
  const cardStyle = { padding: "18px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` };

  return (
    <div style={{ marginTop: 20, ...cardStyle, border: `1px solid ${timerOn ? "rgba(34,197,94,0.25)" : C.b1}`, textAlign: "center", animation: timerOn ? "timerPulse 2s ease infinite" : "none" }}>
      {sectionLabel(T("sessionTimer"))}
      <div style={{ fontSize: 48, fontWeight: 800, color: timerOn ? C.acc : C.t1, fontVariantNumeric: "tabular-nums", letterSpacing: 2 }}>
        {timerOn ? fmt(timerSec) : fmt(duration)}
      </div>
      {timerOn && <div style={{ height: 4, background: C.b1, borderRadius: 10, overflow: "hidden", margin: "14px 0" }}><div style={{ height: "100%", width: `${tProg}%`, background: "linear-gradient(90deg, #22C55E, #4ADE80)", borderRadius: 10, transition: "width 1s linear" }} /></div>}
      {timerOn && timerSec <= 0 && <p style={{ fontSize: 14, color: C.acc, fontWeight: 700, animation: "breathe 1.5s ease infinite" }}>{T("timesUp")}</p>}
      <div style={{ marginTop: 14 }}>
        {!timerOn ? (
          <button onClick={startTimer} style={{ padding: "12px 36px", fontSize: 14, fontWeight: 700, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer" }}>{T("startSession")}</button>
        ) : (
          <button onClick={stopTimer} style={{ padding: "12px 36px", fontSize: 14, fontWeight: 700, background: "rgba(239,68,68,0.12)", color: C.danger, border: `1px solid rgba(239,68,68,0.25)`, borderRadius: 50, cursor: "pointer" }}>{T("stop")}</button>
        )}
      </div>
    </div>
  );
}
