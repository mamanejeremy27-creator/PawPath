import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../context/AppContext.jsx";
import { startTracking, stopTracking, calculateDistance, formatDuration, calculatePace, saveWalk, getRandomWalkPrompt } from "../lib/walkTracker.js";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", danger: "#EF4444", r: 16, rL: 24 };

const PROMPT_INTERVAL_MIN = 5;
const PROMPT_INTERVAL_MAX = 10;

export default function WalkTracker() {
  const { nav, T, lang, dogProfile, activeDogId, isAuthenticated } = useApp();

  // Walk state
  const [status, setStatus] = useState("idle"); // idle | tracking | paused | done
  const [coords, setCoords] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [gpsError, setGpsError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  // Training walk prompt
  const [prompt, setPrompt] = useState(null);
  const [promptVisible, setPromptVisible] = useState(false);

  // Refs for interval/timer
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedElapsedRef = useRef(0);
  const promptTimerRef = useRef(null);
  const coordsRef = useRef([]);

  // Derived stats
  const distance = calculateDistance(coordsRef.current);
  const pace = calculatePace(distance, elapsed);

  // Sync coords ref
  useEffect(() => { coordsRef.current = coords; }, [coords]);

  // Timer tick
  useEffect(() => {
    if (status === "tracking") {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(pausedElapsedRef.current + Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  // Schedule training prompts
  const schedulePrompt = useCallback(() => {
    const delay = (PROMPT_INTERVAL_MIN + Math.random() * (PROMPT_INTERVAL_MAX - PROMPT_INTERVAL_MIN)) * 60 * 1000;
    promptTimerRef.current = setTimeout(() => {
      setPrompt(getRandomWalkPrompt(lang));
      setPromptVisible(true);
      // Auto-hide after 15 seconds
      setTimeout(() => setPromptVisible(false), 15000);
      // Schedule next
      if (status === "tracking") schedulePrompt();
    }, delay);
  }, [lang, status]);

  const handleGpsPosition = useCallback((pos) => {
    setGpsError(null);
    // Filter out inaccurate readings
    if (pos.accuracy > 50) return;
    setCoords(prev => {
      // Deduplicate very close points (< 3m)
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        const dx = Math.abs(pos.lat - last.lat);
        const dy = Math.abs(pos.lng - last.lng);
        if (dx < 0.00003 && dy < 0.00003) return prev;
      }
      return [...prev, { lat: pos.lat, lng: pos.lng, ts: pos.timestamp }];
    });
  }, []);

  const handleStart = () => {
    setStatus("tracking");
    setCoords([]);
    setElapsed(0);
    pausedElapsedRef.current = 0;
    setGpsError(null);
    setNotes("");
    startTracking(handleGpsPosition, (err) => setGpsError(err));
    schedulePrompt();
  };

  const handlePause = () => {
    pausedElapsedRef.current = elapsed;
    setStatus("paused");
    stopTracking();
    clearTimeout(promptTimerRef.current);
  };

  const handleResume = () => {
    setStatus("tracking");
    startTracking(handleGpsPosition, (err) => setGpsError(err));
    schedulePrompt();
  };

  const handleStop = () => {
    pausedElapsedRef.current = elapsed;
    setStatus("done");
    stopTracking();
    clearTimeout(promptTimerRef.current);
  };

  const handleSave = async () => {
    setSaving(true);
    const walkData = {
      startTime: new Date(Date.now() - elapsed * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: elapsed,
      distanceKm: Math.round(distance * 1000) / 1000,
      routeCoords: coordsRef.current,
      averagePace: pace,
      notes: notes.trim() || null,
    };

    if (isAuthenticated) {
      await saveWalk(activeDogId, walkData);
    }

    // Also save to localStorage for offline access
    try {
      const key = "pawpath_walks";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.unshift({ ...walkData, id: Date.now(), dogId: activeDogId, dogName: dogProfile?.name });
      if (existing.length > 50) existing.length = 50;
      localStorage.setItem(key, JSON.stringify(existing));
    } catch { /* silent */ }

    setSaving(false);
    // Navigate to history with success toast flag
    nav("walkHistory", { walkSavedToast: true });
  };

  const handleDiscard = () => {
    setStatus("idle");
    setCoords([]);
    setElapsed(0);
    pausedElapsedRef.current = 0;
    setNotes("");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
      clearTimeout(promptTimerRef.current);
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, animation: "fadeIn 0.3s ease", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => { if (status === "idle" || status === "done") { stopTracking(); nav("home"); } }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.t3, padding: 4, opacity: (status === "idle" || status === "done") ? 1 : 0.3 }}>
            {"\u2190"}
          </button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 2px", color: C.t1 }}>{T("walkTracker")}</h1>
            <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{dogProfile?.name}</p>
          </div>
        </div>
        {/* Walk History button — always visible */}
        <button onClick={() => nav("walkHistory")} style={{
          padding: "10px 16px", borderRadius: 50,
          background: C.s1, color: C.t1, border: `1px solid ${C.b1}`,
          fontWeight: 700, fontSize: 13, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          {"\uD83D\uDCCB"} {T("walkViewHistory")}
        </button>
      </div>

      {/* Training Prompt Banner */}
      {promptVisible && prompt && status === "tracking" && (
        <div onClick={() => setPromptVisible(false)} style={{
          margin: "16px 20px 0", padding: "14px 18px",
          background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(59,130,246,0.08))",
          border: "1px solid rgba(34,197,94,0.25)", borderRadius: C.rL,
          cursor: "pointer", animation: "fadeIn 0.4s ease",
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: C.acc, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>{T("walkTrainingTip")}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, lineHeight: 1.5 }}>{prompt}</div>
        </div>
      )}

      {/* Main Stats Display */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", gap: 8 }}>
        {/* Timer */}
        <div style={{ fontSize: 64, fontWeight: 800, color: C.t1, fontFamily: "'DM Sans', sans-serif", letterSpacing: -2 }}>
          {formatDuration(elapsed)}
        </div>

        {/* Distance + Pace */}
        <div style={{ display: "flex", gap: 32, marginTop: 8 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.acc }}>{distance.toFixed(2)}</div>
            <div style={{ fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>{T("walkKm")}</div>
          </div>
          <div style={{ width: 1, background: C.b1 }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.t1 }}>{pace || "--:--"}</div>
            <div style={{ fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>{T("walkPace")}</div>
          </div>
        </div>

        {/* GPS status */}
        {status === "tracking" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: gpsError ? C.danger : C.acc, animation: gpsError ? "none" : "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: gpsError ? C.danger : C.acc, fontWeight: 600 }}>
              {gpsError ? T("walkGpsError") : `${T("walkGpsActive")} · ${coords.length} ${T("walkPoints")}`}
            </span>
          </div>
        )}

        {/* Paused indicator */}
        {status === "paused" && (
          <div style={{ marginTop: 16, padding: "8px 20px", borderRadius: 20, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B" }}>{T("walkPaused")}</span>
          </div>
        )}
      </div>

      {/* Done Summary */}
      {status === "done" && (
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ padding: "20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: "0 0 16px" }}>{T("walkSummary")}</h3>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {[
                { v: formatDuration(elapsed), l: T("walkDuration") },
                { v: `${distance.toFixed(2)} km`, l: T("walkDistance") },
                { v: pace || "--:--", l: T("walkPace") },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", padding: "12px 6px", background: C.bg, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.acc }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={T("walkNotesPlaceholder")}
              rows={2}
              style={{
                width: "100%", boxSizing: "border-box", padding: "12px 14px",
                background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r,
                color: C.t1, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                outline: "none", resize: "none",
              }}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ padding: "0 20px 40px" }}>
        {status === "idle" && (
          <button onClick={handleStart} style={{
            width: "100%", padding: "18px", borderRadius: 50, border: "none",
            background: C.acc, color: "#000", fontSize: 18, fontWeight: 800,
            cursor: "pointer", boxShadow: "0 4px 24px rgba(34,197,94,0.3)",
          }}>
            {T("walkStart")}
          </button>
        )}

        {status === "tracking" && (
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handlePause} style={{
              flex: 1, padding: "16px", borderRadius: 50, border: `2px solid ${C.acc}`,
              background: "transparent", color: C.acc, fontSize: 16, fontWeight: 700,
              cursor: "pointer",
            }}>
              {T("walkPause")}
            </button>
            <button onClick={handleStop} style={{
              flex: 1, padding: "16px", borderRadius: 50, border: "none",
              background: C.danger, color: "#fff", fontSize: 16, fontWeight: 700,
              cursor: "pointer",
            }}>
              {T("walkStop")}
            </button>
          </div>
        )}

        {status === "paused" && (
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleResume} style={{
              flex: 1, padding: "16px", borderRadius: 50, border: "none",
              background: C.acc, color: "#000", fontSize: 16, fontWeight: 700,
              cursor: "pointer",
            }}>
              {T("walkResume")}
            </button>
            <button onClick={handleStop} style={{
              flex: 1, padding: "16px", borderRadius: 50, border: "none",
              background: C.danger, color: "#fff", fontSize: 16, fontWeight: 700,
              cursor: "pointer",
            }}>
              {T("walkStop")}
            </button>
          </div>
        )}

        {status === "done" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={handleSave} disabled={saving} style={{
              width: "100%", padding: "16px", borderRadius: 50, border: "none",
              background: C.acc, color: "#000", fontSize: 16, fontWeight: 700,
              cursor: "pointer", opacity: saving ? 0.6 : 1,
            }}>
              {saving ? T("saving") : T("walkSave")}
            </button>
            <button onClick={handleDiscard} style={{
              width: "100%", padding: "14px", borderRadius: 50,
              border: `1px solid ${C.b1}`, background: "transparent",
              color: C.t3, fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>
              {T("walkDiscard")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
