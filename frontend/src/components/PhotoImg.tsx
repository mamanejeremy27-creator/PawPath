export function clearPhotoCache() {
  // No-op — kept for API compatibility
}

export default function PhotoImg({ src, alt = "", fallback = null, ...props }) {
  if (!src) return fallback;
  return <img src={src} alt={alt} {...props} />;
}
