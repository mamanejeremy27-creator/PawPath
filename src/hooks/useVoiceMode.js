import { useState, useEffect, useCallback, useRef } from "react";

// ── Voice selection preferences ──────────────────────────────
const EN_PREFERRED = /samantha|karen|daniel|google uk english female/i;
const EN_QUALITY = /natural|enhanced/i;
const EN_AVOID = /compact/i;
const HE_PREFERRED = /carmit|google.*hebrew/i;

function selectVoice(voices, lang) {
  const isHebrew = lang === "he";
  const code = isHebrew ? "he" : "en";
  const pool = voices.filter(v => v.lang.startsWith(code));
  if (pool.length === 0) return null;

  if (isHebrew) {
    return pool.find(v => HE_PREFERRED.test(v.name)) || pool[0];
  }

  // English — try preferred named voices first
  const named = pool.find(v => EN_PREFERRED.test(v.name));
  if (named) return named;

  // Then high-quality voices (Natural/Enhanced but not Compact)
  const quality = pool.find(v => EN_QUALITY.test(v.name) && !EN_AVOID.test(v.name));
  if (quality) return quality;

  // Avoid compact voices
  const nonCompact = pool.filter(v => !EN_AVOID.test(v.name));
  return nonCompact[0] || pool[0];
}

// ── Split text into sentences for natural pacing ─────────────
function splitSentences(text) {
  // Split on sentence-ending punctuation, keeping the punctuation
  const parts = text.match(/[^.!?]+[.!?]+/g);
  if (!parts) return [text];
  return parts.map(s => s.trim()).filter(Boolean);
}

// ── The hook ─────────────────────────────────────────────────
export function useVoiceMode() {
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window
  );
  const [voices, setVoices] = useState([]);
  const volumeRef = useRef(1);
  const cancelRef = useRef(false);

  // Load voices (may arrive async on some browsers)
  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;

    const load = () => {
      const v = synth.getVoices();
      if (v.length > 0) setVoices(v);
    };

    load();
    synth.addEventListener("voiceschanged", load);
    return () => synth.removeEventListener("voiceschanged", load);
  }, [supported]);

  const getVoice = useCallback(
    (lang) => selectVoice(voices, lang),
    [voices]
  );

  // Speak a single utterance, returns a Promise
  const speakOne = useCallback(
    (text, lang) => {
      return new Promise((resolve) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(text);
        const voice = getVoice(lang);
        if (voice) utter.voice = voice;
        utter.lang = lang === "he" ? "he-IL" : "en-US";
        utter.rate = 0.85;
        utter.pitch = 1.05;
        utter.volume = volumeRef.current;
        utter.onend = () => resolve();
        utter.onerror = () => resolve(); // don't block on error
        synth.speak(utter);
      });
    },
    [getVoice]
  );

  // Speak text with 500ms pauses between sentences
  const speak = useCallback(
    async (text, lang = "en") => {
      if (!supported || !text) return;
      cancelRef.current = false;
      window.speechSynthesis.cancel();
      setSpeaking(true);

      const sentences = splitSentences(text);
      for (let i = 0; i < sentences.length; i++) {
        if (cancelRef.current) break;
        await speakOne(sentences[i], lang);
        // 500ms pause between sentences (not after the last one)
        if (!cancelRef.current && i < sentences.length - 1) {
          await new Promise((r) => setTimeout(r, 500));
        }
      }

      if (!cancelRef.current) setSpeaking(false);
    },
    [supported, speakOne]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    cancelRef.current = true;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const pause = useCallback(() => {
    if (supported) window.speechSynthesis.pause();
  }, [supported]);

  const resume = useCallback(() => {
    if (supported) window.speechSynthesis.resume();
  }, [supported]);

  const setVolume = useCallback((v) => {
    volumeRef.current = Math.max(0, Math.min(1, v));
  }, []);

  return { speak, stop, pause, resume, speaking, supported, setVolume, volume: volumeRef };
}
