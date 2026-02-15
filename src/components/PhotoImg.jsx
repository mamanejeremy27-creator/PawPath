import { useState, useEffect, useRef } from "react";
import { getPhotoUrl } from "../lib/storage.js";

const cache = new Map();

/** Flush all cached signed URLs (call on dog switch, photo re-upload, etc.) */
export function clearPhotoCache() {
  cache.clear();
}

export default function PhotoImg({ src, alt = "", ...props }) {
  const [url, setUrl] = useState(() => {
    if (!src) return null;
    if (src.startsWith("data:") || src.startsWith("http")) return src;
    return cache.get(src) || null;
  });
  const prevSrc = useRef(src);

  useEffect(() => {
    // When src changes, immediately clear stale URL so old image disappears
    if (src !== prevSrc.current) {
      prevSrc.current = src;
      // If new src is already resolved (inline or cached), set it immediately
      if (!src) { setUrl(null); return; }
      if (src.startsWith("data:") || src.startsWith("http")) { setUrl(src); return; }
      if (cache.has(src)) { setUrl(cache.get(src)); return; }
      // New storage path — clear old image, then fetch
      setUrl(null);
    }

    if (!src) { setUrl(null); return; }
    if (src.startsWith("data:") || src.startsWith("http")) {
      setUrl(src);
      return;
    }
    if (cache.has(src)) {
      setUrl(cache.get(src));
      return;
    }
    let cancelled = false;
    getPhotoUrl(src).then((signedUrl) => {
      if (cancelled) return;
      cache.set(src, signedUrl);
      setUrl(signedUrl);
    }).catch(() => {
      if (!cancelled) setUrl(null);
    });
    return () => { cancelled = true; };
  }, [src]);

  if (!url) return null;
  return <img src={url} alt={alt} {...props} />;
}
