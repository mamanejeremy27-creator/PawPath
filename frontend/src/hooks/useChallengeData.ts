import { useMemo } from "react";
import { CHALLENGES, getActiveChallenge, getChallengeDay, getWeekNumber } from "../data/challenges.js";

export function useChallengeData(challengeState) {
  return useMemo(() => {
    const now = new Date();
    const challenge = getActiveChallenge(now);
    const todayDay = getChallengeDay(now);
    const active = challengeState.active;
    const completedDays = active?.completedDays || [];
    const todayCompleted = completedDays.includes(todayDay);
    const todayTask = challenge.days.find(d => d.day === todayDay);
    const daysRemaining = 7 - todayDay;
    const nextWeekChallenge = CHALLENGES[(getWeekNumber(now) + 1) % CHALLENGES.length];

    return {
      challenge,
      todayDay,
      todayTask,
      completedDays,
      todayCompleted,
      daysRemaining,
      progress: completedDays.length,
      nextWeekChallenge,
    };
  }, [challengeState]);
}
