import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateFreshness, getNextInterval, getFreshnessLabel, getFreshnessColor } from './freshness.js';

describe('freshness.js', () => {
  describe('calculateFreshness', () => {
    it('returns 0 when lastCompleted is null', () => {
      expect(calculateFreshness(null, 7)).toBe(0);
    });

    it('returns 0 when lastCompleted is undefined', () => {
      expect(calculateFreshness(undefined, 7)).toBe(0);
    });

    it('returns ~1 when just completed (same time)', () => {
      const now = new Date().toISOString();
      const result = calculateFreshness(now, 7);
      // Should be very close to 1 (e^(-0/7) = 1)
      expect(result).toBeGreaterThan(0.99);
      expect(result).toBeLessThanOrEqual(1);
    });

    it('returns ~0.37 after exactly one interval (e^-1)', () => {
      const interval = 7; // 7 days
      const daysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const result = calculateFreshness(daysAgo, interval);
      // e^(-1) ≈ 0.3679
      expect(result).toBeCloseTo(Math.exp(-1), 1);
    });

    it('decays more for longer time passed', () => {
      const interval = 7;
      const oneDayAgo = new Date(Date.now() - 1 * 86400000).toISOString();
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

      const fresh = calculateFreshness(oneDayAgo, interval);
      const fading = calculateFreshness(threeDaysAgo, interval);
      const stale = calculateFreshness(sevenDaysAgo, interval);

      expect(fresh).toBeGreaterThan(fading);
      expect(fading).toBeGreaterThan(stale);
    });

    it('longer interval means slower decay', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();

      const shortInterval = calculateFreshness(threeDaysAgo, 3);  // 3-day interval
      const longInterval = calculateFreshness(threeDaysAgo, 14);   // 14-day interval

      expect(longInterval).toBeGreaterThan(shortInterval);
    });
  });

  describe('getNextInterval', () => {
    it('doubles interval for rating >= 4', () => {
      expect(getNextInterval(7, 4)).toBe(14);
      expect(getNextInterval(7, 5)).toBe(14);
      expect(getNextInterval(3, 4)).toBe(6);
    });

    it('multiplies by 1.2 for rating === 3', () => {
      expect(getNextInterval(10, 3)).toBe(12); // 10 * 1.2 = 12
      expect(getNextInterval(5, 3)).toBe(6);   // 5 * 1.2 = 6
    });

    it('resets to 1 for rating <= 2', () => {
      expect(getNextInterval(7, 2)).toBe(1);
      expect(getNextInterval(7, 1)).toBe(1);
      expect(getNextInterval(100, 0)).toBe(1);
    });

    it('rounds result to nearest integer', () => {
      // 7 * 1.2 = 8.4 → 8
      expect(getNextInterval(7, 3)).toBe(8);
    });
  });

  describe('getFreshnessLabel', () => {
    it('returns "fresh" for score > 0.6', () => {
      expect(getFreshnessLabel(0.7)).toBe('fresh');
      expect(getFreshnessLabel(0.9)).toBe('fresh');
      expect(getFreshnessLabel(1.0)).toBe('fresh');
    });

    it('returns "fading" for score between 0.3 and 0.6', () => {
      expect(getFreshnessLabel(0.3)).toBe('fading');
      expect(getFreshnessLabel(0.5)).toBe('fading');
      expect(getFreshnessLabel(0.6)).toBe('fading');
    });

    it('returns "stale" for score < 0.3', () => {
      expect(getFreshnessLabel(0.29)).toBe('stale');
      expect(getFreshnessLabel(0.1)).toBe('stale');
      expect(getFreshnessLabel(0)).toBe('stale');
    });
  });

  describe('getFreshnessColor', () => {
    it('returns green (#22C55E) for score > 0.6', () => {
      expect(getFreshnessColor(0.7)).toBe('#22C55E');
      expect(getFreshnessColor(1.0)).toBe('#22C55E');
    });

    it('returns amber (#F59E0B) for score between 0.3 and 0.6', () => {
      expect(getFreshnessColor(0.3)).toBe('#F59E0B');
      expect(getFreshnessColor(0.5)).toBe('#F59E0B');
      expect(getFreshnessColor(0.6)).toBe('#F59E0B');
    });

    it('returns red (#EF4444) for score < 0.3', () => {
      expect(getFreshnessColor(0.29)).toBe('#EF4444');
      expect(getFreshnessColor(0)).toBe('#EF4444');
    });
  });
});
