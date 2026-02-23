import { useEffect } from "react";
import { getSmartNotifications, isInQuietHours, canSendNotification, fireNotification } from "../lib/pushNotifications.js";

export function useReminderCheck(reminders, setReminders, dogProfile, currentStreak, activeDog, todayExercises) {
  useEffect(() => {
    if (!reminders.enabled) return;
    const check = () => {
      const now = new Date();
      const hm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      if (isInQuietHours(reminders.quietHours)) return;

      const today = now.toDateString();
      if (reminders.lastNotifDate !== today) {
        setReminders(r => ({ ...r, notifsSentToday: 0, lastNotifDate: today }));
      }
      if (!canSendNotification(reminders)) return;

      if (reminders.times.includes(hm) && now.getSeconds() < 2) {
        const sent = fireNotification(
          "\uD83D\uDC3E PawPath",
          `Time to train${dogProfile ? ` with ${dogProfile.name}` : ""}! Your streak is ${currentStreak} days.`,
          "pawpath-reminder"
        );
        if (sent) {
          setReminders(r => ({ ...r, notifsSentToday: (r.notifsSentToday || 0) + 1, lastNotifDate: today }));
        }
      }

      if (now.getMinutes() % 15 === 0 && now.getSeconds() < 2) {
        const smartNotifs = getSmartNotifications({
          reminders,
          currentStreak,
          lastTrainDate: activeDog?.lastTrainDate || null,
          skillFreshness: activeDog?.skillFreshness || {},
          challengeState: activeDog?.challenges || null,
          dogName: dogProfile?.name,
          todayExercises,
        });
        let sentCount = 0;
        for (const n of smartNotifs) {
          if (!canSendNotification({ ...reminders, notifsSentToday: (reminders.notifsSentToday || 0) + sentCount })) break;
          const sent = fireNotification(n.title, n.body, n.tag);
          if (sent) sentCount++;
        }
        if (sentCount > 0) {
          setReminders(r => ({ ...r, notifsSentToday: (r.notifsSentToday || 0) + sentCount, lastNotifDate: today }));
        }
      }
    };
    const intervalId = setInterval(check, 1000);
    return () => clearInterval(intervalId);
  }, [reminders, dogProfile, currentStreak, activeDog, todayExercises]);
}
