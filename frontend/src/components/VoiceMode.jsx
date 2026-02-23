import { useState, useEffect, useRef, useCallback } from "react";
import { useVoiceMode } from "../hooks/useVoiceMode.js";
import { useElevenLabsTts } from "../hooks/useElevenLabsTts.js";
import { VOICE_SCRIPTS, detectTimer } from "../data/voiceScripts.js";
import { X, Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Volume, Volume2, PartyPopper } from "lucide-react";
import Icon from "./ui/Icon.jsx";

const C = {
  bg: "#0A0A0C", s1: "#131316", s2: "#1A1A1F",
  b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)",
  t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A",
  acc: "#22C55E", accDim: "rgba(34,197,94,0.15)", danger: "#EF4444",
};

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function VoiceMode({ exercise, programName, programIcon, lang, rtl, T, onClose }) {
  const fallbackVoice = useVoiceMode();
  const elevenLabs = useElevenLabsTts();
  const steps = exercise.steps || [];
  const totalSteps = steps.length;

  // ── State ──
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [countdownTotal, setCountdownTotal] = useState(null);
  const [phase, setPhase] = useState("ready"); // ready | intro | speaking | countdown | waiting | done
  const [vol, setVol] = useState(0.8);
  const [usingHq, setUsingHq] = useState(true); // true = ElevenLabs, false = Web Speech
  const [fadeKey, setFadeKey] = useState(0); // increment to trigger fade animation

  // Refs to avoid stale closures in async flows
  const flowIdRef = useRef(0);
  const pausedRef = useRef(false);
  const wakeLockRef = useRef(null);
  const usingHqRef = useRef(true);

  // Keep refs in sync
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { usingHqRef.current = usingHq; }, [usingHq]);

  // Keep voice volume in sync
  useEffect(() => { fallbackVoice.setVolume(vol); }, [vol, fallbackVoice.setVolume]);
  useEffect(() => { elevenLabs.setVolume(vol); }, [vol, elevenLabs.setVolume]);

  // Keep stable refs for hook functions to avoid re-render issues
  const elRef = useRef(elevenLabs);
  const fbRef = useRef(fallbackVoice);
  useEffect(() => { elRef.current = elevenLabs; }, [elevenLabs]);
  useEffect(() => { fbRef.current = fallbackVoice; }, [fallbackVoice]);

  // ── Unified speak function — tries ElevenLabs, falls back to Web Speech ──
  const speak = useCallback(async (text, l) => {
    if (usingHqRef.current) {
      const result = await elRef.current.speak(text, l);
      if (result && result.fallback) {
        setUsingHq(false);
        usingHqRef.current = false;
        await fbRef.current.speak(text, l);
        return;
      }
      return;
    }
    await fbRef.current.speak(text, l);
  }, []);

  const stopAll = useCallback(() => {
    elRef.current.stop();
    fbRef.current.stop();
  }, []);

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

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => { stopAll(); };
  }, [stopAll]);

  // ── Step flow ──
  const runStepFlow = useCallback(
    async (stepIdx, id) => {
      if (stepIdx >= totalSteps) {
        setPhase("done");
        const scripts = VOICE_SCRIPTS[lang] || VOICE_SCRIPTS.en;
        await speak(scripts.exerciseComplete, lang);
        return;
      }

      setStep(stepIdx);
      setCountdown(null);
      setCountdownTotal(null);
      setPhase("speaking");
      setFadeKey(k => k + 1);

      const scripts = VOICE_SCRIPTS[lang] || VOICE_SCRIPTS.en;

      // Announce step number
      await speak(scripts.nextStep(stepIdx + 1, totalSteps), lang);
      if (flowIdRef.current !== id) return;

      // Read the step text
      await speak(steps[stepIdx], lang);
      if (flowIdRef.current !== id) return;

      // Check for embedded timer
      const timerSec = detectTimer(steps[stepIdx]);
      if (timerSec && timerSec > 0) {
        await speak(scripts.holdFor(timerSec), lang);
        if (flowIdRef.current !== id) return;
        setCountdown(timerSec);
        setCountdownTotal(timerSec);
        setPhase("countdown");
      } else {
        setPhase("waiting");
        // Occasional encouragement (30% chance, not on first step)
        if (stepIdx > 0 && Math.random() < 0.3) {
          const enc = scripts.encouragement;
          await speak(enc[Math.floor(Math.random() * enc.length)], lang);
        }
      }
    },
    [totalSteps, steps, lang, speak]
  );

  // ── Intro flow — triggered by user tap to satisfy autoplay policy ──
  const startIntro = useCallback(() => {
    const id = ++flowIdRef.current;
    const scripts = VOICE_SCRIPTS[lang] || VOICE_SCRIPTS.en;

    async function intro() {
      setPhase("intro");
      await speak(scripts.startExercise(exercise.name, totalSteps), lang);
      if (flowIdRef.current !== id) return;
      runStepFlow(0, id);
    }

    intro();
  }, [speak, lang, exercise.name, totalSteps, runStepFlow]);

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
      await speak(scripts.release, lang);
      if (flowIdRef.current !== id) return;
      await new Promise((r) => setTimeout(r, 800));
      if (flowIdRef.current !== id) return;
      if (step < totalSteps - 1) {
        runStepFlow(step + 1, id);
      } else {
        setPhase("done");
        await speak(scripts.exerciseComplete, lang);
      }
    }

    finish();
  }, [countdown, phase, step, totalSteps, lang, speak, runStepFlow]);

  // ── Controls ──
  const goToStep = useCallback(
    (idx) => {
      stopAll();
      const clamped = Math.max(0, Math.min(totalSteps - 1, idx));
      const id = ++flowIdRef.current;
      setPaused(false);
      runStepFlow(clamped, id);
    },
    [stopAll, totalSteps, runStepFlow]
  );

  const goNext = useCallback(() => {
    if (step < totalSteps - 1) {
      goToStep(step + 1);
    } else {
      stopAll();
      const id = ++flowIdRef.current;
      setPaused(false);
      runStepFlow(totalSteps, id);
    }
  }, [step, totalSteps, goToStep, stopAll, runStepFlow]);

  const togglePause = useCallback(() => {
    setPaused((p) => {
      const next = !p;
      if (next) {
        elevenLabs.pause();
        fallbackVoice.pause();
      } else {
        elevenLabs.resume();
        fallbackVoice.resume();
      }
      return next;
    });
  }, [elevenLabs, fallbackVoice]);

  const repeatStep = useCallback(() => {
    stopAll();
    const id = ++flowIdRef.current;
    const scripts = VOICE_SCRIPTS[lang] || VOICE_SCRIPTS.en;
    setPaused(false);

    async function repeat() {
      await speak(scripts.repeatStep, lang);
      if (flowIdRef.current !== id) return;
      runStepFlow(step, id);
    }
    repeat();
  }, [stopAll, speak, lang, step, runStepFlow]);

  const handleClose = useCallback(() => {
    stopAll();
    onClose();
  }, [stopAll, onClose]);

  // ── Countdown progress ──
  const countdownPct = countdownTotal ? ((countdownTotal - (countdown || 0)) / countdownTotal) * 100 : 0;
  const isAlmostDone = phase === "countdown" && countdown !== null && countdown <= 3 && countdown > 0;

  // ── Render ──
  const dir = rtl ? "rtl" : "ltr";
  const isWaiting = phase === "waiting";
  const isSpeaking = phase === "speaking" || phase === "intro";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 600, background: C.bg, display: "flex", flexDirection: "column", direction: dir, textAlign: rtl ? "right" : "left" }}>

      {/* Keyframes */}
      <style>{`
        @keyframes breathe { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 8px rgba(34,197,94,0.3); } 50% { box-shadow: 0 0 24px rgba(34,197,94,0.6); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── Top Bar ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 20px 12px", flexShrink: 0 }}>
        <button onClick={handleClose} style={{ width: 44, height: 44, borderRadius: 12, background: C.s1, border: `1px solid ${C.b1}`, color: C.t3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={20} color={C.t3} />
        </button>
        <div style={{ textAlign: "center", flex: 1 }}>
          <span style={{ fontSize: 14, color: C.t3, display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name={programIcon} size={14} color={C.t3} /> {programName}</span>
        </div>
        {/* Voice quality badge */}
        <div style={{ width: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: usingHq ? C.acc : C.t3, background: usingHq ? C.accDim : C.b1, padding: "3px 8px", borderRadius: 6 }}>
            {usingHq ? T("voiceHqVoice") : T("voiceFallbackVoice")}
          </span>
        </div>
      </div>

      {/* ── Progress Dots ── */}
      {phase !== "done" && phase !== "ready" && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "0 24px 16px" }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 8,
              height: 8,
              borderRadius: 4,
              background: i < step ? C.acc : i === step ? C.acc : C.b2,
              opacity: i > step ? 0.4 : 1,
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      )}

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px", overflow: "auto" }}>

        {phase === "ready" ? (
          /* ── Tap to Begin ── */
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}><Icon name={programIcon} size={48} color={C.acc} /></div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: C.t1, margin: "0 0 8px" }}>{exercise.name}</h2>
            <p style={{ fontSize: 15, color: C.t3, margin: "0 0 8px" }}>{programName}</p>
            <p style={{ fontSize: 13, color: C.t3, margin: "0 0 32px" }}>{totalSteps} {T("voiceStep").toLowerCase()}{lang === "he" ? "ים" : "s"}</p>
            <button onClick={startIntro} style={{ padding: "18px 48px", fontSize: 16, fontWeight: 800, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer", boxShadow: "0 8px 32px rgba(34,197,94,0.25)", animation: "pulseGlow 2s ease infinite" }}>
              {T("voiceStart")} ▶
            </button>
          </div>
        ) : phase === "done" ? (
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

            {/* Step text card with fade animation */}
            <div key={fadeKey} style={{ background: C.s1, borderRadius: 24, border: `1px solid ${isSpeaking ? "rgba(34,197,94,0.2)" : C.b1}`, padding: "32px 24px", minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.3s", animation: "fadeSlideIn 0.35s ease" }}>
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
                {isAlmostDone && (
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.acc, marginTop: 12, animation: "breathe 1.2s ease infinite" }}>
                    {T("voiceAlmostThere")}
                  </p>
                )}
              </div>
            )}

            {/* Speaking indicator */}
            {isSpeaking && (
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
      {phase !== "done" && phase !== "ready" && (
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
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
            {/* Prev */}
            <button
              onClick={() => step > 0 && goToStep(step - 1)}
              disabled={step === 0}
              style={{
                width: 48, height: 48, borderRadius: 14,
                background: "transparent",
                border: `1.5px solid ${step === 0 ? C.b1 : C.b2}`,
                color: step === 0 ? C.t3 : C.t2,
                cursor: step === 0 ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: step === 0 ? 0.3 : 1, transition: "all 0.2s",
              }}
            >
              {rtl ? <ChevronRight size={20} color={step === 0 ? C.t3 : C.t2} /> : <ChevronLeft size={20} color={step === 0 ? C.t3 : C.t2} />}
            </button>

            {/* Pause / Play */}
            <button
              onClick={togglePause}
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: paused ? C.acc : C.s2,
                border: paused ? "none" : `2px solid ${C.acc}`,
                color: paused ? "#000" : C.acc,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: paused ? "0 8px 32px rgba(34,197,94,0.3)" : "none",
                transition: "all 0.2s",
              }}
            >
              {paused ? <Play size={24} color="#000" /> : <Pause size={24} color={C.acc} />}
            </button>

            {/* Next — large, green, with label */}
            <button
              onClick={goNext}
              style={{
                height: 48, borderRadius: 14,
                padding: "0 24px",
                background: isWaiting ? C.acc : C.accDim,
                border: "none",
                color: isWaiting ? "#000" : C.acc,
                fontSize: 15, fontWeight: 800,
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                animation: isWaiting ? "pulseGlow 2s ease infinite" : "none",
                transition: "all 0.2s",
                opacity: isSpeaking ? 0.5 : 1,
              }}
            >
              {rtl ? <ChevronLeft size={18} /> : null} {T("voiceNextStep")} {rtl ? null : <ChevronRight size={18} />}
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
