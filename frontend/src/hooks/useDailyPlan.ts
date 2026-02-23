import { useMemo } from "react";

export function useDailyPlan(completedExercises, playerLevel, programs, skillHealthData, lifeStageData) {
  return useMemo(() => {
    const plan = [];
    const currentStage = lifeStageData?.stage;
    const matchesStage = (ex) => !currentStage || !ex.lifeStages || ex.lifeStages.includes(currentStage);

    const stale = skillHealthData.filter(s => s.label === "stale" && matchesStage(s.exercise));
    for (const s of stale) {
      if (plan.length >= 2) break;
      plan.push({ exercise: s.exercise, level: s.level, program: s.program, reason: "needsReview", freshness: s.freshness });
    }

    if (plan.length < 3) {
      for (const prog of programs) {
        if (playerLevel.level < prog.unlockLevel) continue;
        for (const level of prog.levels) {
          const prevIdx = prog.levels.indexOf(level);
          if (prevIdx > 0 && !prog.levels[prevIdx - 1].exercises.every(e => completedExercises.includes(e.id))) continue;
          for (const ex of level.exercises) {
            if (!completedExercises.includes(ex.id) && matchesStage(ex) && plan.length < 3) {
              plan.push({ exercise: ex, level, program: prog, reason: "continueProgress" });
            }
          }
          if (plan.length >= 3) break;
        }
        if (plan.length >= 3) break;
      }
    }

    if (plan.length < 3) {
      const fading = skillHealthData.filter(s => s.label === "fading" && matchesStage(s.exercise) && !plan.some(p => p.exercise.id === s.exerciseId));
      for (const s of fading) {
        if (plan.length >= 3) break;
        plan.push({ exercise: s.exercise, level: s.level, program: s.program, reason: "reviewReinforce", freshness: s.freshness });
      }
    }

    if (plan.length === 0) {
      const doneExercises = [];
      programs.forEach(p => p.levels.forEach(l => l.exercises.forEach(e => {
        if (completedExercises.includes(e.id)) doneExercises.push({ exercise: e, level: l, program: p, reason: "reviewReinforce" });
      })));
      const shuffled = doneExercises.sort(() => 0.5 - Math.random());
      plan.push(...shuffled.slice(0, 3));
    }
    return plan;
  }, [completedExercises, playerLevel.level, programs, skillHealthData, lifeStageData]);
}
