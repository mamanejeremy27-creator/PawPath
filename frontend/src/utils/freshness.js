/**
 * Spaced repetition engine for PawPath skill freshness.
 * Pure utility — no React dependencies.
 */

const MS_PER_DAY = 86400000;

export function calculateFreshness(lastCompleted, interval) {
  if (!lastCompleted) return 0;
  const daysSince = (Date.now() - new Date(lastCompleted).getTime()) / MS_PER_DAY;
  return Math.exp(-daysSince / interval);
}

export function getNextInterval(currentInterval, rating) {
  if (rating >= 4) return Math.round(currentInterval * 2.0);
  if (rating === 3) return Math.round(currentInterval * 1.2);
  return 1; // rating 1-2: reset
}

export function getFreshnessLabel(score) {
  if (score > 0.6) return "fresh";
  if (score >= 0.3) return "fading";
  return "stale";
}

export function getFreshnessColor(score) {
  if (score > 0.6) return "#22C55E"; // green
  if (score >= 0.3) return "#F59E0B"; // amber
  return "#EF4444"; // red
}
