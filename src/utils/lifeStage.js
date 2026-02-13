import { getBreedSize } from "../data/breedSizes.js";

// Life stage thresholds in months, by size
const STAGE_THRESHOLDS = {
  small:  { puppy: 0, adolescent: 6,  adult: 12, mature: 84,  senior: 132 },
  medium: { puppy: 0, adolescent: 6,  adult: 12, mature: 72,  senior: 108 },
  large:  { puppy: 0, adolescent: 6,  adult: 15, mature: 60,  senior: 96 },
  giant:  { puppy: 0, adolescent: 6,  adult: 18, mature: 48,  senior: 72 },
};

const STAGES = ["puppy", "adolescent", "adult", "mature", "senior"];

const STAGE_META = {
  puppy:      { emoji: "\uD83D\uDC36", color: "#22C55E" },
  adolescent: { emoji: "\uD83D\uDC15", color: "#F59E0B" },
  adult:      { emoji: "\uD83D\uDC15", color: "#3B82F6" },
  mature:     { emoji: "\uD83D\uDC15\u200D\uD83E\uDDBA", color: "#8B5CF6" },
  senior:     { emoji: "\uD83D\uDC15\u200D\uD83E\uDDBA", color: "#EC4899" },
};

export function getAgeMonths(birthday) {
  if (!birthday) return null;
  const birth = new Date(birthday);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
}

export function calculateLifeStage(birthday, breed) {
  const months = getAgeMonths(birthday);
  if (months === null) return null;

  const size = getBreedSize(breed);
  const thresholds = STAGE_THRESHOLDS[size];

  let currentStage = "puppy";
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (months >= thresholds[STAGES[i]]) {
      currentStage = STAGES[i];
      break;
    }
  }

  const meta = STAGE_META[currentStage];
  return {
    stage: currentStage,
    ageMonths: months,
    size,
    emoji: meta.emoji,
    color: meta.color,
  };
}

export function getNextStageInfo(birthday, breed) {
  const months = getAgeMonths(birthday);
  if (months === null) return null;

  const size = getBreedSize(breed);
  const thresholds = STAGE_THRESHOLDS[size];
  const current = calculateLifeStage(birthday, breed);
  const idx = STAGES.indexOf(current.stage);

  if (idx >= STAGES.length - 1) return null; // Already senior

  const nextStage = STAGES[idx + 1];
  const nextMonth = thresholds[nextStage];
  const monthsUntil = nextMonth - months;
  const nextMeta = STAGE_META[nextStage];

  return {
    stage: nextStage,
    monthsUntil: Math.max(0, monthsUntil),
    emoji: nextMeta.emoji,
    color: nextMeta.color,
  };
}

export function getAllStages(breed) {
  const size = getBreedSize(breed);
  const thresholds = STAGE_THRESHOLDS[size];
  return STAGES.map(s => ({
    stage: s,
    startsAtMonth: thresholds[s],
    ...STAGE_META[s],
  }));
}

export { STAGES, STAGE_META };
