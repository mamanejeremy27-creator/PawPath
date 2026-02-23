import { useEffect } from "react";
import { CHALLENGES, getActiveChallenge, getWeekNumber, getWeekStartDate } from "../data/challenges.js";

export function useChallengeSync(activeDogId, dogs, updateDogFields) {
  useEffect(() => {
    if (!activeDogId || !dogs[activeDogId]) return;
    const now = new Date();
    const weekNum = getWeekNumber(now);
    const challenge = getActiveChallenge(now);
    const cs = dogs[activeDogId].challenges || { active: null, history: [], stats: { totalCompleted: 0, currentStreak: 0, bestStreak: 0 } };

    if (cs.active && cs.active.weekNumber !== weekNum) {
      const old = cs.active;
      const daysCompleted = old.completedDays.length;
      const fullComplete = daysCompleted === 7;
      const partial = daysCompleted >= 5;
      const chDef = CHALLENGES.find(c => c.id === old.challengeId);
      let xpEarned = 0;
      if (fullComplete) xpEarned = chDef?.bonusXP || 200;
      else if (partial) xpEarned = Math.round((chDef?.bonusXP || 200) * 0.75);
      else xpEarned = daysCompleted * 25;

      const entry = {
        challengeId: old.challengeId,
        weekNumber: old.weekNumber,
        completedDays: old.completedDays,
        completedAt: now.toISOString(),
        badgeEarned: (fullComplete && chDef) ? chDef.badgeId : null,
        xpEarned,
        fullComplete,
      };

      const newHistory = [...cs.history, entry];
      const newTotal = cs.stats.totalCompleted + (partial || fullComplete ? 1 : 0);
      const newCurrentStreak = (partial || fullComplete) ? cs.stats.currentStreak + 1 : 0;
      const newBestStreak = Math.max(cs.stats.bestStreak, newCurrentStreak);

      const newChallenges = {
        active: { challengeId: challenge.id, weekNumber: weekNum, startDate: getWeekStartDate(now), completedDays: [] },
        history: newHistory,
        stats: { totalCompleted: newTotal, currentStreak: newCurrentStreak, bestStreak: newBestStreak },
      };
      updateDogFields({ challenges: newChallenges, totalXP: prev => prev + xpEarned });
    } else if (!cs.active) {
      const newChallenges = { ...cs, active: { challengeId: challenge.id, weekNumber: weekNum, startDate: getWeekStartDate(now), completedDays: [] } };
      updateDogFields({ challenges: newChallenges });
    }
  }, [activeDogId, dogs, updateDogFields]);
}
