import { useEffect } from "react";
import { DEFAULT_STREAKS } from "../data/streakRewards.js";

export function useStreakBreakDetection(loaded, activeDogId, dogs, updateDogFields, streakCheckRef, setStreakFreezeNotif, setStreakBrokenModal) {
  useEffect(() => {
    if (!loaded || !activeDogId || !dogs[activeDogId]) return;
    if (streakCheckRef.current === activeDogId) return;
    streakCheckRef.current = activeDogId;

    const dog = dogs[activeDogId];
    const streaks = dog.streaks || { ...DEFAULT_STREAKS };
    if (!streaks.lastTrainingDate || streaks.current === 0) return;

    const last = new Date(streaks.lastTrainingDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
    const daysSince = Math.floor((today.getTime() - lastDay.getTime()) / 86400000);

    if (daysSince <= 1) return;

    if (daysSince === 2 && streaks.freezes && streaks.freezes.available > 0) {
      const updatedStreaks = {
        ...streaks,
        freezes: {
          ...streaks.freezes,
          available: streaks.freezes.available - 1,
          totalUsed: streaks.freezes.totalUsed + 1,
          lastUsedDate: now.toISOString(),
        },
      };
      updateDogFields({ streaks: updatedStreaks });
      setStreakFreezeNotif(true);
      setTimeout(() => setStreakFreezeNotif(null), 4000);
    } else {
      const bestStreak = Math.max(streaks.best || 0, streaks.current || 0);
      const brokenStreaks = {
        ...streaks,
        current: 0,
        best: bestStreak,
        startDate: null,
        recovery: { active: false, daysCompleted: 0, startDate: null },
        history: [...(streaks.history || []), {
          streak: streaks.current,
          startDate: streaks.startDate,
          endDate: streaks.lastTrainingDate,
          brokenDate: now.toISOString(),
        }],
      };
      updateDogFields({ streaks: brokenStreaks, currentStreak: 0 });
      setStreakBrokenModal({ previous: streaks.current, best: bestStreak });
    }
  }, [loaded, activeDogId]);
}
