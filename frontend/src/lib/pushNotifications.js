// Smart push notification utilities for PawPath

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  }
}

export async function requestPermission() {
  if (typeof Notification === "undefined") return "denied";
  return Notification.requestPermission();
}

export function isInQuietHours(quietHours) {
  if (!quietHours?.enabled) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startH, startM] = quietHours.start.split(":").map(Number);
  const [endH, endM] = quietHours.end.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    // Same-day range (e.g., 09:00 - 17:00)
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
  // Overnight wraparound (e.g., 22:00 - 07:00)
  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}

export function canSendNotification(reminders) {
  const today = new Date().toDateString();
  if (reminders.lastNotifDate !== today) return true;
  return (reminders.notifsSentToday || 0) < (reminders.maxPerDay || 5);
}

export function fireNotification(title, body, tag) {
  if (typeof Notification === "undefined") return false;
  if (Notification.permission !== "granted") return false;
  try {
    new Notification(title, { body, tag, icon: "/paw-192.png" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Pure function that returns an array of smart notifications to fire.
 * Each item: { type, title, body, tag }
 */
export function getSmartNotifications({
  reminders,
  currentStreak,
  lastTrainDate,
  skillFreshness,
  challengeState,
  dogName,
  todayExercises,
}) {
  const notifications = [];
  const smart = reminders?.smart;
  if (!smart) return notifications;
  const now = new Date();
  const hour = now.getHours();
  const today = now.toDateString();
  const name = dogName || "your dog";

  // Streak risk: after 18:00, streak > 0, no training today
  if (smart.streakReminder && hour >= 18 && currentStreak > 0 && lastTrainDate !== today && todayExercises === 0) {
    notifications.push({
      type: "streak",
      title: `${currentStreak}-day streak at risk!`,
      body: `Train with ${name} before midnight to keep your streak alive.`,
      tag: "pawpath-streak",
    });
  }

  // Spaced rep due: any skill with freshness < 0.3
  if (smart.spacedRepDue && skillFreshness) {
    let staleCount = 0;
    for (const [, data] of Object.entries(skillFreshness)) {
      if (!data.lastCompleted) continue;
      const daysSince = (now - new Date(data.lastCompleted)) / 86400000;
      const freshness = Math.exp(-daysSince / (data.interval || 3));
      if (freshness < 0.3) staleCount++;
    }
    if (staleCount > 0) {
      notifications.push({
        type: "spacedRep",
        title: `${staleCount} skill${staleCount > 1 ? "s" : ""} need${staleCount === 1 ? "s" : ""} a refresh`,
        body: `${name}'s skills are fading. A quick review keeps them sharp!`,
        tag: "pawpath-spacedrep",
      });
    }
  }

  // Challenge incomplete: after 17:00, active challenge day not completed
  if (smart.challengeIncomplete && hour >= 17 && challengeState?.active) {
    const dayOfWeek = now.getDay();
    const todayDay = dayOfWeek === 0 ? 7 : dayOfWeek;
    const completedDays = challengeState.active.completedDays || [];
    if (!completedDays.includes(todayDay)) {
      notifications.push({
        type: "challenge",
        title: "Today's challenge is waiting!",
        body: `Don't miss day ${todayDay} of this week's challenge.`,
        tag: "pawpath-challenge",
      });
    }
  }

  return notifications;
}
