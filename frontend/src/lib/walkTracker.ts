import { api } from "./api.js";

// ══════════════════════════════════════════════════════
//  HAVERSINE DISTANCE
// ══════════════════════════════════════════════════════

const R = 6371; // Earth radius in km

function toRad(deg) { return deg * Math.PI / 180; }

/** Distance between two lat/lng points in km */
export function haversine(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Total distance from an array of {lat, lng} points */
export function calculateDistance(coords) {
  if (!coords || coords.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversine(coords[i - 1].lat, coords[i - 1].lng, coords[i].lat, coords[i].lng);
  }
  return total;
}

/** Format seconds as MM:SS or HH:MM:SS */
export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Pace in min/km */
export function calculatePace(distanceKm, durationSeconds) {
  if (!distanceKm || distanceKm < 0.01) return null;
  const paceSeconds = durationSeconds / distanceKm;
  const mins = Math.floor(paceSeconds / 60);
  const secs = Math.floor(paceSeconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

// ══════════════════════════════════════════════════════
//  GPS TRACKING
// ══════════════════════════════════════════════════════

let watchId = null;

export function startTracking(onPosition, onError) {
  if (!navigator.geolocation) {
    onError?.("Geolocation not supported");
    return null;
  }

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      onPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      });
    },
    (err) => {
      onError?.(err.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000,
    }
  );

  return watchId;
}

export function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

// ══════════════════════════════════════════════════════
//  WALK CRUD (via backend API)
// ══════════════════════════════════════════════════════

export async function saveWalk(dogId, walkData) {
  try {
    const data = await api.saveWalk({ dogId, ...walkData });
    return { data, error: null };
  } catch (e) { return { data: null, error: e.message }; }
}

export async function getWalks(dogId, limit = 50) {
  try {
    const data = await api.getWalks(dogId);
    return { data: data || [], error: null };
  } catch (e) { return { data: null, error: e.message }; }
}

export async function deleteWalk(walkId) {
  try {
    await api.deleteWalk(walkId);
    return { data: true, error: null };
  } catch (e) { return { data: null, error: e.message }; }
}

// ══════════════════════════════════════════════════════
//  TRAINING WALK PROMPTS
// ══════════════════════════════════════════════════════

const WALK_PROMPTS_EN = [
  "Try a recall at the next open area!",
  "Practice loose leash for the next 2 minutes!",
  "Do 3 quick sits at the next intersection!",
  "Work on 'Leave It' with the next distraction!",
  "Practice eye contact for 10 seconds!",
  "Try a 'Stay' for 15 seconds right here!",
  "Do a 'Touch' hand target — 5 reps!",
  "Practice 'Watch me' while passing the next person!",
  "Try a direction change — keep that leash loose!",
  "Stop and do a 30-second 'Place' on any flat surface!",
  "Practice name recognition — say it once, reward the look!",
  "Try heel position for the next 20 steps!",
];

const WALK_PROMPTS_HE = [
  "!נסו החזרה בשטח הפתוח הבא",
  "!תרגלו רצועה רפויה לשתי הדקות הבאות",
  "!עשו 3 ישיבות מהירות בצומת הבא",
  "!עבדו על 'עזוב' עם ההסחה הבאה",
  "!תרגלו קשר עין ל-10 שניות",
  "!נסו 'הישאר' ל-15 שניות כאן",
  "!עשו 'גע' מיקוד יד — 5 חזרות",
  "!תרגלו 'הסתכל עליי' כשעוברים את האדם הבא",
  "!נסו שינוי כיוון — שמרו רצועה רפויה",
  "!עצרו ועשו 'מקום' של 30 שניות על כל משטח",
  "!תרגלו זיהוי שם — אמרו פעם אחת, תגמלו את המבט",
  "!נסו הליכת צד ל-20 צעדים הבאים",
];

export function getRandomWalkPrompt(lang = "en") {
  const prompts = lang === "he" ? WALK_PROMPTS_HE : WALK_PROMPTS_EN;
  return prompts[Math.floor(Math.random() * prompts.length)];
}
