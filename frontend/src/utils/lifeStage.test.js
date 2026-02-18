import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAgeMonths, calculateLifeStage, getNextStageInfo, getAllStages, STAGES, STAGE_META } from './lifeStage.js';

describe('lifeStage.js', () => {
  describe('getAgeMonths', () => {
    it('returns null for null birthday', () => {
      expect(getAgeMonths(null)).toBeNull();
    });

    it('returns null for undefined birthday', () => {
      expect(getAgeMonths(undefined)).toBeNull();
    });

    it('returns 0 for a birthday this month', () => {
      const now = new Date();
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-15`;
      expect(getAgeMonths(thisMonth)).toBe(0);
    });

    it('returns correct months for a past date', () => {
      const now = new Date();
      // 24 months ago
      const past = new Date(now.getFullYear() - 2, now.getMonth(), 15);
      const birthday = past.toISOString().split('T')[0];
      expect(getAgeMonths(birthday)).toBe(24);
    });

    it('handles string date format', () => {
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 15);
      const birthday = oneYearAgo.toISOString().split('T')[0];
      expect(getAgeMonths(birthday)).toBe(12);
    });
  });

  describe('STAGES and STAGE_META constants', () => {
    it('exports the five life stages in order', () => {
      expect(STAGES).toEqual(['puppy', 'adolescent', 'adult', 'mature', 'senior']);
    });

    it('exports metadata for every stage', () => {
      for (const stage of STAGES) {
        expect(STAGE_META[stage]).toBeDefined();
        expect(STAGE_META[stage]).toHaveProperty('emoji');
        expect(STAGE_META[stage]).toHaveProperty('color');
      }
    });
  });

  describe('calculateLifeStage', () => {
    it('returns null for null birthday', () => {
      expect(calculateLifeStage(null, 'Labrador')).toBeNull();
    });

    it('identifies a puppy (small breed, 3 months old)', () => {
      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 15);
      const birthday = threeMonthsAgo.toISOString().split('T')[0];

      const result = calculateLifeStage(birthday, 'Chihuahua');
      expect(result.stage).toBe('puppy');
      expect(result.size).toBe('small');
      expect(result.ageMonths).toBe(3);
    });

    it('identifies adolescent stage (medium breed, 8 months old)', () => {
      const now = new Date();
      const eightMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 8, 15);
      const birthday = eightMonthsAgo.toISOString().split('T')[0];

      const result = calculateLifeStage(birthday, 'Beagle');
      expect(result.stage).toBe('adolescent');
      expect(result.size).toBe('medium');
    });

    it('identifies adult stage (large breed, 24 months old)', () => {
      const now = new Date();
      const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), 15);
      const birthday = twoYearsAgo.toISOString().split('T')[0];

      const result = calculateLifeStage(birthday, 'Labrador Retriever');
      expect(result.stage).toBe('adult');
      expect(result.size).toBe('large');
    });

    it('identifies senior stage (giant breed, 84 months / 7 years old)', () => {
      const now = new Date();
      const sevenYearsAgo = new Date(now.getFullYear() - 7, now.getMonth(), 15);
      const birthday = sevenYearsAgo.toISOString().split('T')[0];

      const result = calculateLifeStage(birthday, 'Great Dane');
      expect(result.stage).toBe('senior');
      expect(result.size).toBe('giant');
    });

    it('defaults unknown breeds to medium size', () => {
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 15);
      const birthday = oneYearAgo.toISOString().split('T')[0];

      const result = calculateLifeStage(birthday, 'Unknown Breed');
      expect(result.size).toBe('medium');
    });

    it('returns emoji and color from stage metadata', () => {
      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 15);
      const birthday = threeMonthsAgo.toISOString().split('T')[0];

      const result = calculateLifeStage(birthday, 'Pug');
      expect(result.emoji).toBe(STAGE_META.puppy.emoji);
      expect(result.color).toBe(STAGE_META.puppy.color);
    });
  });

  describe('getNextStageInfo', () => {
    it('returns null for null birthday', () => {
      expect(getNextStageInfo(null, 'Labrador')).toBeNull();
    });

    it('returns null for a senior dog (no next stage)', () => {
      const now = new Date();
      // 15 years for medium = 180 months, well past senior at 108
      const fifteenYearsAgo = new Date(now.getFullYear() - 15, now.getMonth(), 15);
      const birthday = fifteenYearsAgo.toISOString().split('T')[0];

      expect(getNextStageInfo(birthday, 'Beagle')).toBeNull();
    });

    it('returns next stage info for a puppy', () => {
      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 15);
      const birthday = threeMonthsAgo.toISOString().split('T')[0];

      const result = getNextStageInfo(birthday, 'Beagle');
      expect(result).not.toBeNull();
      expect(result.stage).toBe('adolescent');
      expect(result.monthsUntil).toBe(3); // adolescent at 6, currently 3 → 3 months
    });

    it('monthsUntil is never negative', () => {
      const now = new Date();
      // Exactly at the threshold
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 15);
      const birthday = sixMonthsAgo.toISOString().split('T')[0];

      const result = getNextStageInfo(birthday, 'Beagle');
      // At 6 months, should be adolescent; next is adult at 12
      expect(result.monthsUntil).toBeGreaterThanOrEqual(0);
    });

    it('includes emoji and color for the next stage', () => {
      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 15);
      const birthday = threeMonthsAgo.toISOString().split('T')[0];

      const result = getNextStageInfo(birthday, 'Labrador');
      expect(result).toHaveProperty('emoji');
      expect(result).toHaveProperty('color');
    });
  });

  describe('getAllStages', () => {
    it('returns all 5 stages', () => {
      const stages = getAllStages('Labrador');
      expect(stages).toHaveLength(5);
    });

    it('returns stages with startsAtMonth based on breed size', () => {
      // Labrador is large: puppy=0, adolescent=6, adult=15, mature=60, senior=96
      const stages = getAllStages('Labrador');
      const stageMap = Object.fromEntries(stages.map(s => [s.stage, s.startsAtMonth]));

      expect(stageMap.puppy).toBe(0);
      expect(stageMap.adolescent).toBe(6);
      expect(stageMap.adult).toBe(15);
      expect(stageMap.mature).toBe(60);
      expect(stageMap.senior).toBe(96);
    });

    it('returns different thresholds for giant breeds', () => {
      // Great Dane is giant: senior=72
      const stages = getAllStages('Great Dane');
      const senior = stages.find(s => s.stage === 'senior');
      expect(senior.startsAtMonth).toBe(72);
    });

    it('each stage has emoji and color', () => {
      const stages = getAllStages('Beagle');
      for (const stage of stages) {
        expect(stage).toHaveProperty('emoji');
        expect(stage).toHaveProperty('color');
        expect(stage).toHaveProperty('stage');
        expect(stage).toHaveProperty('startsAtMonth');
      }
    });
  });
});
