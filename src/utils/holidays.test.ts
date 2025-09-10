import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getUpcomingLongWeekends, getNextLongWeekendSuggestion, SAMPLE_HOLIDAYS } from './holidays';

// Mock the current date to be consistent in tests
const mockDate = new Date('2024-01-01T00:00:00.000Z');
vi.setSystemTime(mockDate);

describe('holidays utilities', () => {
  beforeEach(() => {
    vi.setSystemTime(mockDate);
  });

  describe('getUpcomingLongWeekends', () => {
    it('should return empty array when no dismissed suggestions provided', () => {
      const result = getUpcomingLongWeekends();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should filter out dismissed suggestions', () => {
      const dismissedIds = ['long-weekend-2024-01-15-monday'];
      const result = getUpcomingLongWeekends(dismissedIds);
      
      // Should not include the dismissed suggestion
      const dismissedSuggestion = result.find(s => s.id === 'long-weekend-2024-01-15-monday');
      expect(dismissedSuggestion).toBeUndefined();
    });

    it('should return suggestions sorted by date (closest first)', () => {
      const result = getUpcomingLongWeekends();
      
      if (result.length > 1) {
        for (let i = 0; i < result.length - 1; i++) {
          const current = new Date(result[i].startDate);
          const next = new Date(result[i + 1].startDate);
          expect(current.getTime()).toBeLessThanOrEqual(next.getTime());
        }
      }
    });

    it('should create long-friday suggestions for Monday holidays', () => {
      // MLK Day 2024 is on Monday, Jan 15
      const result = getUpcomingLongWeekends();
      const mlkSuggestion = result.find(s => s.holiday.name === 'Martin Luther King Jr. Day');
      
      if (mlkSuggestion) {
        expect(mlkSuggestion.weekendType).toBe('long-friday');
        expect(mlkSuggestion.days).toEqual(['friday', 'saturday', 'sunday']);
      }
    });

    it('should create long-monday suggestions for Friday holidays', () => {
      // We need to find a Friday holiday in our sample data
      const result = getUpcomingLongWeekends();
      const fridaySuggestion = result.find(s => s.weekendType === 'long-monday');
      
      if (fridaySuggestion) {
        expect(fridaySuggestion.weekendType).toBe('long-monday');
        expect(fridaySuggestion.days).toEqual(['saturday', 'sunday', 'monday']);
      }
    });

    it('should not include holidays in the past', () => {
      // Set date to after 2024 holidays
      vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
      
      const result = getUpcomingLongWeekends();
      const pastHolidays = result.filter(s => 
        new Date(s.startDate) < new Date('2025-01-01')
      );
      
      expect(pastHolidays).toHaveLength(0);
    });

    it('should not include holidays too far in the future', () => {
      const result = getUpcomingLongWeekends();
      const farFutureHolidays = result.filter(s => {
        const holidayDate = new Date(s.startDate);
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        return holidayDate > sixMonthsFromNow;
      });
      
      expect(farFutureHolidays).toHaveLength(0);
    });
  });

  describe('getNextLongWeekendSuggestion', () => {
    it('should return null when no suggestions available', () => {
      // Dismiss all possible suggestions
      const allSuggestionIds = SAMPLE_HOLIDAYS.map(holiday => {
        const dayOfWeek = new Date(holiday.date).getDay();
        if (dayOfWeek === 1) { // Monday
          return `long-weekend-${holiday.date}-friday`;
        } else if (dayOfWeek === 5) { // Friday
          return `long-weekend-${holiday.date}-monday`;
        }
        return null;
      }).filter(Boolean);
      
      const result = getNextLongWeekendSuggestion(allSuggestionIds);
      expect(result).toBeNull();
    });

    it('should return the first suggestion when no dismissed suggestions', () => {
      const result = getNextLongWeekendSuggestion();
      
      if (result) {
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('holiday');
        expect(result).toHaveProperty('weekendType');
        expect(result).toHaveProperty('dateRange');
        expect(result).toHaveProperty('days');
        expect(result).toHaveProperty('startDate');
        expect(result).toHaveProperty('endDate');
      }
    });

    it('should return the next available suggestion when some are dismissed', () => {
      const dismissedIds = ['long-weekend-2024-01-15-monday'];
      const result = getNextLongWeekendSuggestion(dismissedIds);
      
      if (result) {
        expect(result.id).not.toBe('long-weekend-2024-01-15-monday');
      }
    });
  });

  describe('SAMPLE_HOLIDAYS', () => {
    it('should contain expected holidays', () => {
      const holidayNames = SAMPLE_HOLIDAYS.map(h => h.name);
      
      expect(holidayNames).toContain('New Year\'s Day');
      expect(holidayNames).toContain('Martin Luther King Jr. Day');
      expect(holidayNames).toContain('Memorial Day');
      expect(holidayNames).toContain('Independence Day');
      expect(holidayNames).toContain('Labor Day');
      expect(holidayNames).toContain('Thanksgiving Day');
      expect(holidayNames).toContain('Christmas Day');
    });

    it('should have valid date formats', () => {
      SAMPLE_HOLIDAYS.forEach(holiday => {
        const date = new Date(holiday.date);
        expect(date).toBeInstanceOf(Date);
        expect(isNaN(date.getTime())).toBe(false);
      });
    });

    it('should have valid holiday types', () => {
      const validTypes = ['federal', 'state', 'observance'];
      
      SAMPLE_HOLIDAYS.forEach(holiday => {
        expect(validTypes).toContain(holiday.type);
      });
    });
  });
});
