import { useState, useEffect, useRef, useCallback } from "react";
import { useVoiceMode } from "../hooks/useVoiceMode.js";
import { VOICE_SCRIPTS, detectTimer } from "../data/voiceScripts.js";
import { X, Play, Pause, SkipBack, SkipForward, RotateCcw, Volume, Volume2, PartyPopper } from "lucide-react";
import Icon from "./ui/Icon.jsx";

const C = {
  bg: "#0A0A0C", s1: "#131316", s2: "#1A1A1F",
  b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)",
  t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A",
  acc: "#22C55E", danger: "#EF4444",
};

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function VoiceMode({ exercise, programName, programIcon, lang, rtl, T, onClose }) {
  const voice = useVoiceMode();
  const steps = exercise.steps || [];
  const totalSteps = steps.length;

  // ── State ──
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [countdownTotal, setCountdownTotal] = useState(null);
  const [phase, setPhase] = useState("intro"); // intro | speaking | countdown | waiting | done
  const [vol, setVol] = useState(0.8);

  // Refs to avoid stale closures in async flows
  const flowIdRef = useRef(0);
  const pausedRef = useRef(false);
  const wakeLockRef = useRef(null);

  // Keep pausedRef in sync
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  // Keep voice volume in sync
  useEffect(() => { voice.setVolume(vol); }, [vol, voice.setVolume]);

  // ── Wake Lock ──
  useEffect(() => {
    async function acquire() {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch { /* ignore */ }
    }
    acquire();
    const onVisible = () => {
      if (document.visibilityState === "visible") acquire();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      wakeLockRef.current?.release();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // ── Cleanup speech on unmount ──
  useEffect(() => {
    return () => { voice.stop(); };
  }, [voice.stop]);

  // ── Intro flow (runs once on mount) ──
  useEffect(() => {
    const id = ++flowIdRef.current;
    const scripts = VOICE_SCRIPTS[lang] || VOICE_SCRIPTS.en;

    async function intro() {
      setPhase("intro");
      await voice.speak(scripts.startExercise(exercise.name, totalSteps), lang);
      if (flowIdRef.current !== id) return;
      // Transition to step 0
      runStepFlow(0, id);
    }

    intro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Step flow ──
  const runStepFlow = useCallback(
    async (stepIdx, id) => {
      if (stepIdx >= totalSteps) {
        setPhase("done");
        const scripts = VOICE_SCRIPTS[lang] || VOICE_SCRIPTS.en;
        await voice.speak(scripts.exerciseComplete, lang);
        return;
      }

      setStep(stepIdx);
      setCountdown(null);
      setCountdownTotal(null);
      setPhase("speaking");

      const scripts = VOICE_SCRIPTS[lang] || VOICE_SCRIPTS.en;

      // Announce step number
      await voice.speak(scripts.nextStep(stepIdx + 1, totalSteps), lang);
      if (flowIdRef.current !== id) return;

      // Read the step text
      await voice.speak(steps[stepIdx], lang);
      if (flowIdRef.current !== id) return;

      // Check for embedded timer
      const timerSec = detectTimer(steps[stepIdx]);
      if (timerSec && timerSec > 0) {
        await voice.speak(scripts.holdFor(timerSec), lang);
        if (flowIdRef.current !== id) return;
        setCountdown(timerSec);
        setCountdownTotal(timerSec);
        setPhase("countdown");
        // Countdown effect handles the rest
      } else {
        setPhase("waiting");
        // Occasional encouragement (30% chance, not on first step)
        if (stepIdx > 0 && Math.random() < 0.3) {
          const enc = scripts.encouragement;
          await voice.speak(enc[Math.floor(Math.random() * enc.length)], lang);
        }
      }
    },
    [totalSteps, steps, lang, voice]
  );

  // ── Countdown ticker ──
  useEffect(() => {
    if (phase !== "countdown" || countdown === null || countdown <= 0 || paused) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, phase, paused]);

  // ── Countdown completion ──
  useEffect(() => {
    if (phase !== "countdown" || countdown !== 0) return;
    const id = flowIdRef.current;
    const scripts = VOICE_SCRIPTS[lang] || VOICE_SCRIPTS.en;

    async function finish() {
      await voice.speak(scripts.release, lang);
      if (flowIdRef.current !== id) return;
      // Auto-advance after short pause
      await new Promise((r) => setTimeout(r, 800));
      if (flowIdRef.current !== id) return;
      if (step < totalSteps - 1) {
        runStepFlow(step + 1, id);
      } else {
        setPhase("done");
        await voice.speak(scripts.exerciseComplete, lang);
      }
    }

    finish();
  }, [countdown, phase, step, totalSteps, lang, voice, runStepFlow]);

  // ── Controls ──
  const goToStep = useCallback(
    (idx) => {
      voice.stop();
      const clamped = Math.max(0, Math.min(totalSteps - 1, idx));
      const id = ++flowIdRef.current;
      setPaused(false);
      runStepFlow(clamped, id);
    },
    [voice, totalSteps, runStepFlow]
  );

  const togglePause = useCallback(() => {
    setPaused((p) => {
      const next = !p;
      if (next) {
        voice.pause();
        const scripts = VOICE_SCRIPTS[lang] || VOICE_SCRIPTS.en;
        // Don't speak "paused" — just pause
      } else {
        voice.resume();
      }
      return next;
    });
  }, [voice, lang]);

  const repeatStep = useCallback(() => {
    voice.stop();
    const id = ++flowIdRef.current;
    const scripts = VOICE_SCRIPTS[lang] || VOICE_SCRIPTS.en;
    setPaused(false);

    async function repeat() {
      await voice.speak(scripts.repeatStep, lang);
      if (flowIdRef.current !== id) return;
      runStepFlow(step, id);
    }
    repeat();
  }, [voice, lang, step, runStepFlow]);

  const handleClose = useCallback(() => {
    voice.stop();
    onClose();
  }, [voice, onClose]);

  // ── Countdown progress ──
  const countdownPct = countdownTotal ? ((countdownTotal - (countdown || 0)) / countdownTotal) * 100 : 0;

  // ── Render ──
  const dir = rtl ? "rtl" : "ltr";
  const btnSize = 64;
  const navBtnSize = 52;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 600, background: C.bg, display: "flex", flexDirection: "column", direction: dir, textAlign: rtl ? "right" : "left", animation: "fadeIn 0.3s ease" }}>

      {/* ── Top Bar ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 20px 12px", flexShrink: 0 }}>
        <button onClick={handleClose} style={{ width: 44, height: 44, borderRadius: 12, background: C.s1, border: `1px solid ${C.b1}`, color: C.t3, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={20} color={C.t3} />
        </button>
        <div style={{ textAlign: "center", flex: 1 }}>
          <span style={{ fontSize: 14, color: C.t3, display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name={programIcon} size={14} color={C.t3} /> {programName}</span>
        </div>
        <div style={{ width: 44 }} /> {/* spacer */}
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px", overflow: "auto" }}>

        {phase === "done" ? (
          /* ── Completion ── */
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 20 }}><PartyPopper size={72} color={C.acc} /></div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: C.t1, margin: "0 0 8px" }}>{T("voiceComplete")}</h2>
            <p style={{ fontSize: 15, color: C.t3, margin: "0 0 32px" }}>{exercise.name}</p>
            <button onClick={handleClose} style={{ padding: "18px 48px", fontSize: 16, fontWeight: 800, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer", boxShadow: "0 8px 32px rgba(34,197,94,0.25)" }}>
              {T("voiceDone")}
            </button>
          </div>
        ) : (
          <>
            {/* Step counter */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.acc, letterSpacing: 2, textTransform: "uppercase" }}>
                {T("voiceStep")} {step + 1} {T("voiceOf")} {totalSteps}
              </span>
            </div>

            {/* Step text card */}
            <div style={{ background: C.s1, borderRadius: 24, border: `1px solid ${phase === "speaking" ? "rgba(34,197,94,0.2)" : C.b1}`, padding: "32px 24px", minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.3s" }}>
              <p style={{ fontSize: 20, fontWeight: 600, color: C.t1, lineHeight: 1.7, margin: 0, textAlign: "center" }}>
                {steps[step]}
              </p>
            </div>

            {/* Countdown section */}
            {phase === "countdown" && countdown !== null && (
              <div style={{ marginTop: 24, textAlign: "center" }}>
                <div style={{ fontSize: 56, fontWeight: 900, color: C.acc, fontVariantNumeric: "tabular-nums", marginBottom: 12 }}>
                  {fmt(countdown)}
                </div>
                <div style={{ height: 6, background: C.b1, borderRadius: 10, overflow: "hidden", margin: "0 20px" }}>
                  <div style={{ height: "100%", width: `${countdownPct}%`, background: "linear-gradient(90deg, #22C55E, #4ADE80)", borderRadius: 10, transition: "width 1s linear" }} />
                </div>
              </div>
            )}

            {/* Waiting indicator */}
            {phase === "waiting" && (
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <span style={{ fontSize: 13, color: C.t3, fontWeight: 600 }}>{T("voiceTapNext")}</span>
              </div>
            )}

            {/* Speaking indicator */}
            {phase === "speaking" && (
              <div style={{ textAlign: "center", marginTop: 24, display: "flex", justifyContent: "center", gap: 6 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.acc, animation: `breathe 1.2s ease ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Bottom Controls ── */}
      {phase !== "done" && (
        <div style={{ flexShrink: 0, padding: "16px 24px 32px" }}>

          {/* Volume slider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: "0 12px" }}>
            <Volume size={16} color={C.t3} style={{ flexShrink: 0 }} />
            <input
              type="range" min="0" max="1" step="0.05" value={vol}
              onChange={(e) => setVol(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: C.acc, height: 4, cursor: "pointer" }}
            />
            <Volume2 size={16} color={C.t3} style={{ flexShrink: 0 }} />
          </div>

          {/* Main controls row */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
            {/* Prev */}
            <button
              onClick={() => step > 0 && goToStep(step - 1)}
              disabled={step === 0}
              style={{ width: navBtnSize, height: navBtnSize, borderRadius: "50%", background: C.s1, border: `1px solid ${step === 0 ? C.b1 : C.b2}`, color: step === 0 ? C.t3 : C.t1, fontSize: 22, cursor: step === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: step === 0 ? 0.4 : 1, transition: "opacity 0.2s" }}
            >
              <SkipBack size={22} color={step === 0 ? C.t3 : C.t1} />
            </button>

            {/* Pause / Play */}
            <button
              onClick={togglePause}
              style={{ width: btnSize, height: btnSize, borderRadius: "50%", background: paused ? C.acc : C.s2, border: paused ? "none" : `2px solid ${C.acc}`, color: paused ? "#000" : C.acc, fontSize: 28, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: paused ? "0 8px 32px rgba(34,197,94,0.3)" : "none", transition: "all 0.2s" }}
            >
              {paused ? <Play size={28} color="#000" /> : <Pause size={28} color={C.acc} />}
            </button>

            {/* Next */}
            <button
              onClick={() => step < totalSteps - 1 ? goToStep(step + 1) : goToStep(totalSteps)}
              style={{ width: navBtnSize, height: navBtnSize, borderRadius: "50%", background: C.s1, border: `1px solid ${C.b2}`, color: C.t1, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <SkipForward size={22} color={C.t1} />
            </button>
          </div>

          {/* Repeat button */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button onClick={repeatStep} style={{ background: "none", border: "none", color: C.t3, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <RotateCcw size={14} color={C.t3} /> {T("voiceRepeat")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
