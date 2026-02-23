import { useState, useCallback, useRef } from "react";
import { getAuthHeaders } from "../lib/auth.js";

export function useElevenLabsTts() {
  const [speaking, setSpeaking] = useState(false);
  const abortRef = useRef(null);
  const audioRef = useRef(null);
  const resolveRef = useRef(null);
  const volumeRef = useRef(0.8);

  const setVolume = useCallback((v) => {
    volumeRef.current = v;
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const stop = useCallback(() => {
    // Abort any in-flight fetch
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    // Stop any playing audio
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      if (audio._blobUrl) {
        URL.revokeObjectURL(audio._blobUrl);
      }
      audioRef.current = null;
    }
    // Resolve any pending promise
    if (resolveRef.current) {
      resolveRef.current({});
      resolveRef.current = null;
    }
    setSpeaking(false);
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) audioRef.current.play().catch(() => {});
  }, []);

  const speak = useCallback(
    async (text, lang = "en") => {
      // Clean up previous without aborting — let the new request take over
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
        if (audio._blobUrl) URL.revokeObjectURL(audio._blobUrl);
        audioRef.current = null;
      }
      if (resolveRef.current) {
        resolveRef.current({});
        resolveRef.current = null;
      }
      // Abort previous fetch
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      return new Promise(async (resolve) => {
        resolveRef.current = resolve;

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

          // Check if we were superseded while fetching
          if (abortRef.current !== controller) {
            resolve({});
            return;
          }

          if (!res.ok) {
            resolveRef.current = null;
            resolve({ fallback: true });
            return;
          }

          const blob = await res.blob();

          // Check again after blob download
          if (abortRef.current !== controller) {
            resolve({});
            return;
          }

          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio._blobUrl = url;
          audio.volume = volumeRef.current;
          audioRef.current = audio;

          setSpeaking(true);

          audio.onended = () => {
            URL.revokeObjectURL(url);
            audioRef.current = null;
            resolveRef.current = null;
            setSpeaking(false);
            resolve({});
          };

          audio.onerror = () => {
            URL.revokeObjectURL(url);
            audioRef.current = null;
            resolveRef.current = null;
            setSpeaking(false);
            resolve({ fallback: true });
          };

          try {
            await audio.play();
          } catch {
            URL.revokeObjectURL(url);
            audioRef.current = null;
            resolveRef.current = null;
            setSpeaking(false);
            resolve({ fallback: true });
          }
        } catch (err) {
          if (err.name === "AbortError") {
            resolve({});
            return;
          }
          resolveRef.current = null;
          setSpeaking(false);
          resolve({ fallback: true });
        }
      });
    },
    []
  );

  return { speak, stop, pause, resume, speaking, setVolume };
}
