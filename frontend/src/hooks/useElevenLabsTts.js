import { useState, useCallback, useRef } from "react";
import { getAuthHeaders } from "../lib/auth.js";

export function useElevenLabsTts() {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);
  const abortRef = useRef(null);

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setSpeaking(false);
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) audioRef.current.play();
  }, []);

  const speak = useCallback(
    (text, lang = "en") => {
      // Stop any current playback
      stop();

      const controller = new AbortController();
      abortRef.current = controller;

      return new Promise(async (resolve) => {
        try {
          const res = await fetch("/api/tts/speak", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
            body: JSON.stringify({ text, lang }),
            signal: controller.signal,
          });

          if (!res.ok) {
            // 503 = ElevenLabs unavailable, signal fallback
            resolve({ fallback: true });
            return;
          }

          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;

          setSpeaking(true);

          audio.onended = () => {
            URL.revokeObjectURL(url);
            audioRef.current = null;
            setSpeaking(false);
            resolve({});
          };

          audio.onerror = () => {
            URL.revokeObjectURL(url);
            audioRef.current = null;
            setSpeaking(false);
            resolve({ fallback: true });
          };

          await audio.play();
        } catch (err) {
          if (err.name === "AbortError") {
            resolve({});
            return;
          }
          setSpeaking(false);
          resolve({ fallback: true });
        }
      });
    },
    [stop]
  );

  return { speak, stop, pause, resume, speaking };
}
