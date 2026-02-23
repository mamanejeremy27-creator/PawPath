import { useMemo } from "react";
import { calculateFreshness, getFreshnessLabel, getFreshnessColor } from "../utils/freshness.js";

export function useSkillHealth(skillFreshness, programs) {
  const skillHealthData = useMemo(() => {
    const entries = Object.entries(skillFreshness);
    if (entries.length === 0) return [];
    const result = [];
    for (const [exId, data] of entries) {
      const d = data as any;
      const score = calculateFreshness(d.lastCompleted, d.interval);
      let exercise = null, program = null, level = null;
      for (const p of programs) {
        for (const l of p.levels) {
          const ex = l.exercises.find(e => e.id === exId);
          if (ex) { exercise = ex; program = p; level = l; break; }
        }
        if (exercise) break;
      }
      if (!exercise) continue;
      result.push({ exerciseId: exId, freshness: score, label: getFreshnessLabel(score), color: getFreshnessColor(score), exercise, program, level });
    }
    result.sort((a, b) => a.freshness - b.freshness);
    return result;
  }, [skillFreshness, programs]);

  const allSkillsFresh = useMemo(() => {
    return skillHealthData.length > 0 && skillHealthData.every(s => s.label === "fresh");
  }, [skillHealthData]);

  return { skillHealthData, allSkillsFresh };
}
