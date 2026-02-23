import { useState, useEffect, useRef, useCallback } from "react";
import { useVoiceMode } from "../hooks/useVoiceMode.js";
import { useElevenLabsTts } from "../hooks/useElevenLabsTts.js";
import { VOICE_SCRIPTS, detectTimer } from "../data/voiceScripts.js";
import { X, Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Volume, Volume2, PartyPopper } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { cn } from "../lib/cn";

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
      if (result && (result as any).fallback) {
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
    <div
      className="fixed inset-0 z-[600] bg-bg flex flex-col"
      style={{ direction: dir, textAlign: rtl ? "right" : "left" }}
    >
      {/* Keyframes injected globally — keep inline since they're dynamic animations */}
      <style>{`
        @keyframes breathe { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 8px rgba(34,197,94,0.3); } 50% { box-shadow: 0 0 24px rgba(34,197,94,0.6); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── Top Bar ── */}
      <div className="flex justify-between items-center px-5 pt-5 pb-3 flex-shrink-0">
        <button
          onClick={handleClose}
          className="w-11 h-11 rounded-xl bg-surface border border-border text-muted cursor-pointer flex items-center justify-center"
        >
          <X size={20} className="text-muted" />
        </button>
        <div className="text-center flex-1">
          <span className="text-[14px] text-muted inline-flex items-center gap-1">
            <Icon name={programIcon} size={14} color="#71717A" /> {programName}
          </span>
        </div>
        {/* Voice quality badge */}
        <div className="w-11 flex items-center justify-center">
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-[3px] rounded-[6px]",
              usingHq ? "text-training bg-training/15" : "text-muted bg-white/[0.06]"
            )}
          >
            {usingHq ? T("voiceHqVoice") : T("voiceFallbackVoice")}
          </span>
        </div>
      </div>

      {/* ── Progress Dots ── */}
      {phase !== "done" && phase !== "ready" && (
        <div className="flex justify-center gap-1.5 px-6 pb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 20 : 8,
                background: i <= step ? "#22C55E" : "rgba(255,255,255,0.1)",
                opacity: i > step ? 0.4 : 1,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col justify-center px-6 overflow-auto">

        {phase === "ready" ? (
          /* ── Tap to Begin ── */
          <div className="text-center">
            <div className="text-[48px] mb-4"><Icon name={programIcon} size={48} color="#22C55E" /></div>
            <h2 className="font-display text-2xl font-black text-text mb-2">{exercise.name}</h2>
            <p className="text-[15px] text-muted mb-2">{programName}</p>
            <p className="text-[13px] text-muted mb-8">{totalSteps} {T("voiceSteps")}</p>
            <button
              onClick={startIntro}
              className="px-12 py-[18px] text-base font-extrabold bg-training text-black border-none rounded-full cursor-pointer shadow-[0_8px_32px_rgba(34,197,94,0.25)] [animation:pulseGlow_2s_ease_infinite]"
            >
              {T("voiceStart")} ▶
            </button>
          </div>
        ) : phase === "done" ? (
          /* ── Completion ── */
          <div className="text-center">
            <div className="mb-5"><PartyPopper size={72} color="#22C55E" /></div>
            <h2 className="font-display text-[28px] font-black text-text mb-2">{T("voiceComplete")}</h2>
            <p className="text-[15px] text-muted mb-8">{exercise.name}</p>
            <button
              onClick={handleClose}
              className="px-12 py-[18px] text-base font-extrabold bg-training text-black border-none rounded-full cursor-pointer shadow-[0_8px_32px_rgba(34,197,94,0.25)]"
            >
              {T("voiceDone")}
            </button>
          </div>
        ) : (
          <>
            {/* Step counter */}
            <div className="text-center mb-5">
              <span className="text-[13px] font-bold text-training tracking-[2px] uppercase">
                {T("voiceStep")} {step + 1} {T("voiceOf")} {totalSteps}
              </span>
            </div>

            {/* Step text card with fade animation */}
            <div
              key={fadeKey}
              className={cn(
                "bg-surface rounded-3xl border px-6 py-8 min-h-[160px] flex items-center justify-center transition-colors [animation:fadeSlideIn_0.35s_ease]",
                isSpeaking ? "border-training/20" : "border-border"
              )}
            >
              <p className="text-xl font-semibold text-text leading-[1.7] m-0 text-center">
                {steps[step]}
              </p>
            </div>

            {/* Countdown section */}
            {phase === "countdown" && countdown !== null && (
              <div className="mt-6 text-center">
                <div className="text-[56px] font-black text-training [font-variant-numeric:tabular-nums] mb-3">
                  {fmt(countdown)}
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mx-5">
                  <div
                    className="h-full rounded-full transition-[width] duration-1000 linear"
                    style={{ width: `${countdownPct}%`, background: "linear-gradient(90deg, #22C55E, #4ADE80)" }}
                  />
                </div>
                {isAlmostDone && (
                  <p className="text-[14px] font-semibold text-training mt-3 [animation:breathe_1.2s_ease_infinite]">
                    {T("voiceAlmostThere")}
                  </p>
                )}
              </div>
            )}

            {/* Speaking indicator */}
            {isSpeaking && (
              <div className="text-center mt-6 flex justify-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-training"
                    style={{ animation: `breathe 1.2s ease ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Bottom Controls ── */}
      {phase !== "done" && phase !== "ready" && (
        <div className="flex-shrink-0 px-6 pt-4 pb-8">

          {/* Volume slider */}
          <div className="flex items-center gap-3 mb-5 px-3">
            <Volume size={16} className="text-muted flex-shrink-0" />
            <input
              type="range" min="0" max="1" step="0.05" value={vol}
              onChange={(e) => setVol(parseFloat(e.target.value))}
              className="flex-1 accent-training h-1 cursor-pointer"
            />
            <Volume2 size={16} className="text-muted flex-shrink-0" />
          </div>

          {/* Main controls row */}
          <div className="flex justify-center items-center gap-4">
            {/* Prev */}
            <button
              onClick={() => step > 0 && goToStep(step - 1)}
              disabled={step === 0}
              className={cn(
                "w-12 h-12 rounded-[14px] bg-transparent flex items-center justify-center transition-all",
                step === 0
                  ? "border border-white/[0.06] text-muted opacity-30 cursor-default"
                  : "border-[1.5px] border-white/10 text-text-2 cursor-pointer"
              )}
            >
              {rtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Pause / Play */}
            <button
              onClick={togglePause}
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all",
                paused
                  ? "bg-training text-black border-none shadow-[0_8px_32px_rgba(34,197,94,0.3)]"
                  : "bg-surface-2 text-training border-2 border-training"
              )}
            >
              {paused ? <Play size={24} color="#000" /> : <Pause size={24} color="#22C55E" />}
            </button>

            {/* Next — large, green, with label */}
            <button
              onClick={goNext}
              className={cn(
                "h-12 rounded-[14px] px-6 border-none text-[15px] font-extrabold flex items-center gap-1.5 cursor-pointer transition-all",
                isWaiting
                  ? "bg-training text-black [animation:pulseGlow_2s_ease_infinite]"
                  : "bg-training/15 text-training",
                isSpeaking ? "opacity-50" : "opacity-100"
              )}
            >
              {rtl ? <ChevronLeft size={18} /> : null} {T("voiceNextStep")} {rtl ? null : <ChevronRight size={18} />}
            </button>
          </div>

          {/* Repeat button */}
          <div className="text-center mt-4">
            <button
              onClick={repeatStep}
              className="bg-transparent border-none text-muted text-[13px] font-bold cursor-pointer px-4 py-2 inline-flex items-center gap-1.5"
            >
              <RotateCcw size={14} className="text-muted" /> {T("voiceRepeat")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
