import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ClipboardList, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { startTracking, stopTracking, calculateDistance, formatDuration, calculatePace, saveWalk, getRandomWalkPrompt } from "../lib/walkTracker.js";
import { cn } from "../lib/cn";

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
    <div className="min-h-screen bg-bg animate-[fadeIn_0.3s_ease] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { if (status === "idle" || status === "done") { stopTracking(); nav("home"); } }}
            className={cn(
              "bg-transparent border-none cursor-pointer text-muted p-1 flex items-center",
              (status === "idle" || status === "done") ? "opacity-100" : "opacity-30"
            )}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-2xl font-black m-0 mb-0.5 text-text">{T("walkTracker")}</h1>
            <p className="text-[13px] text-muted m-0">{dogProfile?.name}</p>
          </div>
        </div>
        {/* Walk History button — always visible */}
        <button
          onClick={() => nav("walkHistory")}
          className="px-4 py-2.5 rounded-full bg-surface text-text border border-border font-bold text-[13px] cursor-pointer flex items-center gap-1.5"
        >
          <ClipboardList size={14} /> {T("walkViewHistory")}
        </button>
      </div>

      {/* Training Prompt Banner */}
      {promptVisible && prompt && status === "tracking" && (
        <div
          onClick={() => setPromptVisible(false)}
          className="mx-5 mt-4 px-[18px] py-3.5 rounded-3xl cursor-pointer animate-[fadeIn_0.4s_ease] border border-training/25"
          style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(59,130,246,0.08))" }}
        >
          <div className="text-[10px] font-black text-training uppercase tracking-[2px] mb-1">{T("walkTrainingTip")}</div>
          <div className="text-sm font-semibold text-text leading-relaxed">{prompt}</div>
        </div>
      )}

      {/* Main Stats Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 gap-2">
        {/* Timer */}
        <div className="text-[64px] font-black text-text font-sans" style={{ letterSpacing: -2 }}>
          {formatDuration(elapsed)}
        </div>

        {/* Distance + Pace */}
        <div className="flex gap-8 mt-2">
          <div className="text-center">
            <div className="text-[32px] font-black text-training">{distance.toFixed(2)}</div>
            <div className="text-[11px] text-muted uppercase tracking-[1.5px] font-bold">{T("walkKm")}</div>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <div className="text-[32px] font-black text-text">{pace || "--:--"}</div>
            <div className="text-[11px] text-muted uppercase tracking-[1.5px] font-bold">{T("walkPace")}</div>
          </div>
        </div>

        {/* GPS status */}
        {status === "tracking" && (
          <div className="flex items-center gap-1.5 mt-4">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                gpsError ? "bg-danger" : "bg-training animate-[pulse_2s_infinite]"
              )}
            />
            <span className={cn("text-xs font-semibold", gpsError ? "text-danger" : "text-training")}>
              {gpsError ? T("walkGpsError") : `${T("walkGpsActive")} · ${coords.length} ${T("walkPoints")}`}
            </span>
          </div>
        )}

        {/* Paused indicator */}
        {status === "paused" && (
          <div className="mt-4 px-5 py-2 rounded-[20px] bg-xp/10 border border-xp/20">
            <span className="text-[13px] font-bold text-xp">{T("walkPaused")}</span>
          </div>
        )}
      </div>

      {/* Done Summary */}
      {status === "done" && (
        <div className="px-5 pb-4">
          <div className="p-5 bg-surface rounded-3xl border border-border">
            <h3 className="text-base font-bold text-text m-0 mb-4">{T("walkSummary")}</h3>
            <div className="flex gap-2.5 mb-4">
              {[
                { v: formatDuration(elapsed), l: T("walkDuration") },
                { v: `${distance.toFixed(2)} km`, l: T("walkDistance") },
                { v: pace || "--:--", l: T("walkPace") },
              ].map((s, i) => (
                <div key={i} className="flex-1 text-center py-3 px-1.5 bg-bg rounded-2xl border border-border">
                  <div className="text-base font-black text-training">{s.v}</div>
                  <div className="text-[10px] text-muted uppercase tracking-[1px] font-semibold mt-1">{s.l}</div>
                </div>
              ))}
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={T("walkNotesPlaceholder")}
              rows={2}
              className="w-full px-3.5 py-3 bg-bg border border-border rounded-2xl text-text text-sm font-sans outline-none resize-none"
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="px-5 pb-10">
        {status === "idle" && (
          <button
            onClick={handleStart}
            className="w-full py-[18px] rounded-full border-none bg-training text-black text-lg font-black cursor-pointer"
            style={{ boxShadow: "0 4px 24px rgba(34,197,94,0.3)" }}
          >
            {T("walkStart")}
          </button>
        )}

        {status === "tracking" && (
          <div className="flex gap-3">
            <button
              onClick={handlePause}
              className="flex-1 py-4 rounded-full border-2 border-training bg-transparent text-training text-base font-bold cursor-pointer"
            >
              {T("walkPause")}
            </button>
            <button
              onClick={handleStop}
              className="flex-1 py-4 rounded-full border-none bg-danger text-white text-base font-bold cursor-pointer"
            >
              {T("walkStop")}
            </button>
          </div>
        )}

        {status === "paused" && (
          <div className="flex gap-3">
            <button
              onClick={handleResume}
              className="flex-1 py-4 rounded-full border-none bg-training text-black text-base font-bold cursor-pointer"
            >
              {T("walkResume")}
            </button>
            <button
              onClick={handleStop}
              className="flex-1 py-4 rounded-full border-none bg-danger text-white text-base font-bold cursor-pointer"
            >
              {T("walkStop")}
            </button>
          </div>
        )}

        {status === "done" && (
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleSave} disabled={saving}
              className={cn(
                "w-full py-4 rounded-full border-none bg-training text-black text-base font-bold cursor-pointer transition-opacity",
                saving ? "opacity-60" : "opacity-100"
              )}
            >
              {saving ? T("saving") : T("walkSave")}
            </button>
            <button
              onClick={handleDiscard}
              className="w-full py-3.5 rounded-full border border-border bg-transparent text-muted text-sm font-semibold cursor-pointer"
            >
              {T("walkDiscard")}
            </button>
          </div>
        )}

        {/* Emergency Lost Dog button — visible during active walk */}
        {(status === "tracking" || status === "paused") && (
          <button
            onClick={() => { stopTracking(); nav("reportLostDog"); }}
            className="w-full mt-4 py-3 rounded-full border border-danger/25 bg-danger/[0.06] text-danger text-[13px] font-bold cursor-pointer flex items-center justify-center gap-1.5"
          >
            <AlertTriangle size={14} /> {T("lostEmergency")}
          </button>
        )}
      </div>
    </div>
  );
}
