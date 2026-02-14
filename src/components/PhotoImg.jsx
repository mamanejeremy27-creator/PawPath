import { useState, useEffect } from "react";
import { getPhotoUrl } from "../lib/storage.js";

const cache = new Map();

export default function PhotoImg({ src, alt = "", ...props }) {
  const [url, setUrl] = useState(() => {
    if (!src) return null;
    if (src.startsWith("data:") || src.startsWith("http")) return src;
    return cache.get(src) || null;
  });

  useEffect(() => {
    if (!src || src.startsWith("data:") || src.startsWith("http")) {
      setUrl(src || null);
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
