import { useCallback } from "react";
import { DIFFICULTY_CONFIG } from "../context/AppContext.jsx";

export function useDifficultyTracking(totalSessions, difficultyTracking, updateDogFields, setMoodCheck) {
  const isExerciseStruggling = useCallback((exId) => {
    if (totalSessions < DIFFICULTY_CONFIG.minTotalSessions) return false;
    const data = difficultyTracking.exercises?.[exId];
    if (!data) return false;
    if (data.dismissed && data.lastSuggestionDate) {
      const daysSince = Math.floor((Date.now() - new Date(data.lastSuggestionDate).getTime()) / 86400000);
      if (daysSince < DIFFICULTY_CONFIG.suggestionCooldownDays) return false;
    }
    return (
      (data.incompleteCount || 0) >= DIFFICULTY_CONFIG.incompleteThreshold ||
      (data.lowRatingCount || 0) >= DIFFICULTY_CONFIG.lowRatingThreshold ||
      (data.shortSessionCount || 0) >= DIFFICULTY_CONFIG.shortDurationThreshold
    );
  }, [totalSessions, difficultyTracking]);

  const updateDifficultyTracking = useCallback((exId, field, value) => {
    updateDogFields({
      difficultyTracking: prev => {
        const exercises = { ...(prev?.exercises || {}) };
        exercises[exId] = { ...(exercises[exId] || { incompleteCount: 0, lowRatingCount: 0, shortSessionCount: 0, lastSuggestionDate: null, dismissed: false, totalAttempts: 0 }), [field]: value };
        return { exercises };
      },
    });
  }, [updateDogFields]);

  const incrementDifficultyField = useCallback((exId, field) => {
    updateDogFields({
      difficultyTracking: prev => {
        const exercises = { ...(prev?.exercises || {}) };
        const current = exercises[exId] || { incompleteCount: 0, lowRatingCount: 0, shortSessionCount: 0, lastSuggestionDate: null, dismissed: false, totalAttempts: 0 };
        exercises[exId] = { ...current, [field]: (current[field] || 0) + 1 };
        return { exercises };
      },
    });
  }, [updateDogFields]);

  const dismissDifficultySuggestion = useCallback((exId) => {
    updateDogFields({
      difficultyTracking: prev => {
        const exercises = { ...(prev?.exercises || {}) };
        const current = exercises[exId] || {};
        exercises[exId] = { ...current, dismissed: true, lastSuggestionDate: new Date().toISOString() };
        return { exercises };
      },
    });
  }, [updateDogFields]);

  const recordMoodCheck = useCallback((exId, mood) => {
    if (mood === "tricky") {
      incrementDifficultyField(exId, "lowRatingCount");
    }
    if (mood === "nailed") {
      updateDogFields({
        difficultyTracking: prev => {
          const exercises = { ...(prev?.exercises || {}) };
          const current = exercises[exId] || {};
          const streak = (current.successStreak || 0) + 1;
          if (streak >= 3) {
            exercises[exId] = { ...current, incompleteCount: 0, lowRatingCount: 0, shortSessionCount: 0, dismissed: false, successStreak: 0 };
          } else {
            exercises[exId] = { ...current, successStreak: streak };
          }
          return { exercises };
        },
      });
    } else {
      updateDogFields({
        difficultyTracking: prev => {
          const exercises = { ...(prev?.exercises || {}) };
          const current = exercises[exId] || {};
          exercises[exId] = { ...current, successStreak: 0 };
          return { exercises };
        },
      });
    }
    setMoodCheck(null);
  }, [incrementDifficultyField, updateDogFields, setMoodCheck]);

  return { isExerciseStruggling, updateDifficultyTracking, incrementDifficultyField, dismissDifficultySuggestion, recordMoodCheck };
}
