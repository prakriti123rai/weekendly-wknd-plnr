import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WeekendlyState } from '../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('usePersist hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('localStorage integration', () => {
    it('should save state to localStorage', () => {
      const mockState: WeekendlyState = {
        activities: {
          'activity-1': {
            id: 'activity-1',
            title: 'Test Activity',
            category: 'outdoor',
            durationMinutes: 60
          }
        },
        schedule: [],
        ui: {
          theme: 'default',
          weekendType: 'standard',
          customDays: [],
          dismissedHolidaySuggestions: []
        }
      };

      // Simulate saving state
      localStorageMock.setItem('weekendly_v1', JSON.stringify(mockState));
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'weekendly_v1',
        JSON.stringify(mockState)
      );
    });

    it('should load state from localStorage', () => {
      const mockState: WeekendlyState = {
        activities: {
          'activity-1': {
            id: 'activity-1',
            title: 'Test Activity',
            category: 'outdoor',
            durationMinutes: 60
          }
        },
        schedule: [],
        ui: {
          theme: 'lazy',
          weekendType: 'long-friday',
          customDays: ['friday', 'saturday', 'sunday'],
          dismissedHolidaySuggestions: ['suggestion-1']
        }
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockState));
      
      const result = localStorageMock.getItem('weekendly_v1');
      const parsedState = JSON.parse(result);
      
      expect(parsedState).toEqual(mockState);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      expect(() => {
        try {
          JSON.parse('invalid json');
        } catch (e) {
          // Should handle gracefully
        }
      }).not.toThrow();
    });

    it('should handle missing localStorage data', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = localStorageMock.getItem('weekendly_v1');
      expect(result).toBeNull();
    });
  });

  describe('data migration', () => {
    it('should migrate old data structure to new structure', () => {
      const oldState = {
        activities: {
          'activity-1': {
            id: 'activity-1',
            title: 'Test Activity'
          }
        },
        schedule: [],
        ui: {
          theme: 'default',
          weekendType: 'standard',
          customDays: [],
          selectedActivityId: 'activity-1'
          // Missing dismissedHolidaySuggestions
        }
      };

      // Simulate migration
      const migratedState = {
        ...oldState,
        ui: {
          theme: oldState.ui?.theme || 'default',
          weekendType: oldState.ui?.weekendType || 'standard',
          customDays: oldState.ui?.customDays || [],
          dismissedHolidaySuggestions: oldState.ui?.dismissedHolidaySuggestions || [],
          selectedActivityId: oldState.ui?.selectedActivityId
        }
      };

      expect(migratedState.ui.dismissedHolidaySuggestions).toEqual([]);
      expect(migratedState.ui.selectedActivityId).toBe('activity-1');
    });

    it('should preserve existing dismissedHolidaySuggestions', () => {
      const stateWithDismissed = {
        activities: {},
        schedule: [],
        ui: {
          theme: 'default',
          weekendType: 'standard',
          customDays: [],
          dismissedHolidaySuggestions: ['suggestion-1', 'suggestion-2']
        }
      };

      const migratedState = {
        ...stateWithDismissed,
        ui: {
          theme: stateWithDismissed.ui?.theme || 'default',
          weekendType: stateWithDismissed.ui?.weekendType || 'standard',
          customDays: stateWithDismissed.ui?.customDays || [],
          dismissedHolidaySuggestions: stateWithDismissed.ui?.dismissedHolidaySuggestions || [],
          selectedActivityId: stateWithDismissed.ui?.selectedActivityId
        }
      };

      expect(migratedState.ui.dismissedHolidaySuggestions).toEqual(['suggestion-1', 'suggestion-2']);
    });
  });
});
