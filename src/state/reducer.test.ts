import { describe, it, expect } from 'vitest';
import { weekendReducer } from './reducer';
import { WeekendlyState, Activity, ScheduledItem } from '../types';

const mockActivity: Activity = {
  id: 'activity-1',
  title: 'Test Activity',
  category: 'outdoor',
  durationMinutes: 60,
  mood: 'energetic',
  color: '#3B82F6'
};

const mockScheduledItem: ScheduledItem = {
  id: 'schedule-1',
  activityId: 'activity-1',
  day: 'saturday',
  startISO: '2024-01-06T10:00:00.000Z',
  durationMinutes: 60
};

const initialState: WeekendlyState = {
  activities: {},
  schedule: [],
  ui: {
    theme: 'default',
    weekendType: 'standard',
    customDays: [],
    dismissedHolidaySuggestions: []
  }
};

describe('weekendReducer', () => {
  describe('ADD_ACTIVITY', () => {
    it('should add a new activity to the state', () => {
      const action = { type: 'ADD_ACTIVITY' as const, payload: mockActivity };
      const newState = weekendReducer(initialState, action);
      
      expect(newState.activities).toHaveProperty('activity-1');
      expect(newState.activities['activity-1']).toEqual(mockActivity);
    });

    it('should preserve existing activities when adding new ones', () => {
      const existingActivity = { ...mockActivity, id: 'existing-1', title: 'Existing Activity' };
      const stateWithExisting = {
        ...initialState,
        activities: { 'existing-1': existingActivity }
      };
      
      const action = { type: 'ADD_ACTIVITY' as const, payload: mockActivity };
      const newState = weekendReducer(stateWithExisting, action);
      
      expect(newState.activities).toHaveProperty('existing-1');
      expect(newState.activities).toHaveProperty('activity-1');
    });
  });

  describe('UPDATE_ACTIVITY', () => {
    it('should update an existing activity', () => {
      const stateWithActivity = {
        ...initialState,
        activities: { 'activity-1': mockActivity }
      };
      
      const updatedActivity = { ...mockActivity, title: 'Updated Activity' };
      const action = { type: 'UPDATE_ACTIVITY' as const, payload: updatedActivity };
      const newState = weekendReducer(stateWithActivity, action);
      
      expect(newState.activities['activity-1'].title).toBe('Updated Activity');
    });
  });

  describe('DELETE_ACTIVITY', () => {
    it('should remove an activity and its scheduled items', () => {
      const stateWithActivityAndSchedule = {
        ...initialState,
        activities: { 'activity-1': mockActivity },
        schedule: [mockScheduledItem]
      };
      
      const action = { type: 'DELETE_ACTIVITY' as const, payload: { id: 'activity-1' } };
      const newState = weekendReducer(stateWithActivityAndSchedule, action);
      
      expect(newState.activities).not.toHaveProperty('activity-1');
      expect(newState.schedule).toHaveLength(0);
    });

    it('should preserve other activities and schedules', () => {
      const otherActivity = { ...mockActivity, id: 'activity-2', title: 'Other Activity' };
      const otherSchedule = { ...mockScheduledItem, id: 'schedule-2', activityId: 'activity-2' };
      
      const stateWithMultiple = {
        ...initialState,
        activities: { 'activity-1': mockActivity, 'activity-2': otherActivity },
        schedule: [mockScheduledItem, otherSchedule]
      };
      
      const action = { type: 'DELETE_ACTIVITY' as const, payload: { id: 'activity-1' } };
      const newState = weekendReducer(stateWithMultiple, action);
      
      expect(newState.activities).not.toHaveProperty('activity-1');
      expect(newState.activities).toHaveProperty('activity-2');
      expect(newState.schedule).toHaveLength(1);
      expect(newState.schedule[0].activityId).toBe('activity-2');
    });
  });

  describe('SCHEDULE_ITEM', () => {
    it('should add a new scheduled item', () => {
      const action = { type: 'SCHEDULE_ITEM' as const, payload: mockScheduledItem };
      const newState = weekendReducer(initialState, action);
      
      expect(newState.schedule).toHaveLength(1);
      expect(newState.schedule[0]).toEqual(mockScheduledItem);
    });
  });

  describe('UNSCHEDULE_ITEM', () => {
    it('should remove a scheduled item', () => {
      const stateWithSchedule = {
        ...initialState,
        schedule: [mockScheduledItem]
      };
      
      const action = { type: 'UNSCHEDULE_ITEM' as const, payload: { id: 'schedule-1' } };
      const newState = weekendReducer(stateWithSchedule, action);
      
      expect(newState.schedule).toHaveLength(0);
    });
  });

  describe('MOVE_SCHEDULE_ITEM', () => {
    it('should update a scheduled item position and day', () => {
      const stateWithSchedule = {
        ...initialState,
        schedule: [mockScheduledItem]
      };
      
      const action = {
        type: 'MOVE_SCHEDULE_ITEM' as const,
        payload: {
          id: 'schedule-1',
          startISO: '2024-01-06T14:00:00.000Z',
          day: 'sunday',
          durationMinutes: 90
        }
      };
      
      const newState = weekendReducer(stateWithSchedule, action);
      
      expect(newState.schedule[0].startISO).toBe('2024-01-06T14:00:00.000Z');
      expect(newState.schedule[0].day).toBe('sunday');
      expect(newState.schedule[0].durationMinutes).toBe(90);
    });
  });

  describe('SET_THEME', () => {
    it('should update the theme', () => {
      const action = { type: 'SET_THEME' as const, payload: 'lazy' as const };
      const newState = weekendReducer(initialState, action);
      
      expect(newState.ui.theme).toBe('lazy');
    });
  });

  describe('SET_WEEKEND_TYPE', () => {
    it('should update the weekend type', () => {
      const action = { type: 'SET_WEEKEND_TYPE' as const, payload: 'long-friday' as const };
      const newState = weekendReducer(initialState, action);
      
      expect(newState.ui.weekendType).toBe('long-friday');
    });
  });

  describe('DISMISS_HOLIDAY_SUGGESTION', () => {
    it('should add a dismissed suggestion ID', () => {
      const action = { type: 'DISMISS_HOLIDAY_SUGGESTION' as const, payload: 'suggestion-1' };
      const newState = weekendReducer(initialState, action);
      
      expect(newState.ui.dismissedHolidaySuggestions).toContain('suggestion-1');
    });

    it('should preserve existing dismissed suggestions', () => {
      const stateWithDismissed = {
        ...initialState,
        ui: {
          ...initialState.ui,
          dismissedHolidaySuggestions: ['existing-1']
        }
      };
      
      const action = { type: 'DISMISS_HOLIDAY_SUGGESTION' as const, payload: 'suggestion-2' };
      const newState = weekendReducer(stateWithDismissed, action);
      
      expect(newState.ui.dismissedHolidaySuggestions).toContain('existing-1');
      expect(newState.ui.dismissedHolidaySuggestions).toContain('suggestion-2');
    });
  });

  describe('LOAD_STATE', () => {
    it('should replace the entire state', () => {
      const newState = {
        activities: { 'activity-1': mockActivity },
        schedule: [mockScheduledItem],
        ui: {
          theme: 'adventurous',
          weekendType: 'long-monday',
          customDays: ['friday', 'saturday', 'sunday', 'monday'],
          dismissedHolidaySuggestions: ['suggestion-1']
        }
      };
      
      const action = { type: 'LOAD_STATE' as const, payload: newState };
      const result = weekendReducer(initialState, action);
      
      expect(result).toEqual(newState);
    });
  });
});
