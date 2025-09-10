import { WeekendlyState, Activity, ScheduledItem, WeekendType, Day } from '../types';
type Action =
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'UPDATE_ACTIVITY'; payload: Activity }
  | { type: 'DELETE_ACTIVITY'; payload: { id: string } }
  | { type: 'SCHEDULE_ITEM'; payload: ScheduledItem }
  | { type: 'UNSCHEDULE_ITEM'; payload: { id: string } }
  | { type: 'MOVE_SCHEDULE_ITEM'; payload: { id: string; startISO: string; day: string; durationMinutes: number } }
  | { type: 'SET_THEME'; payload: 'default' | 'lazy' | 'adventurous' }
  | { type: 'SET_WEEKEND_TYPE'; payload: WeekendType }
  | { type: 'SET_CUSTOM_DAYS'; payload: Day[] }
  | { type: 'DISMISS_HOLIDAY_SUGGESTION'; payload: string }
  | { type: 'LOAD_STATE'; payload: WeekendlyState };

export function weekendReducer(state: WeekendlyState, action: Action): WeekendlyState {
  switch(action.type) {
    case 'ADD_ACTIVITY':
      return { ...state, activities: { ...state.activities, [action.payload.id]: action.payload }};
    case 'UPDATE_ACTIVITY':
      return { ...state, activities: { ...state.activities, [action.payload.id]: action.payload }};
    case 'DELETE_ACTIVITY': {
      const activities = { ...state.activities }; delete activities[action.payload.id];
      return { ...state, activities, schedule: state.schedule.filter(s => s.activityId !== action.payload.id) };
    }
    case 'SCHEDULE_ITEM':
      return { ...state, schedule: [...state.schedule, action.payload] };
    case 'UNSCHEDULE_ITEM':
      return { ...state, schedule: state.schedule.filter(s => s.id !== action.payload.id) };
    case 'MOVE_SCHEDULE_ITEM':
      return { ...state, schedule: state.schedule.map(s => s.id === action.payload.id ? { ...s, startISO: action.payload.startISO, day: action.payload.day as any, durationMinutes: action.payload.durationMinutes } : s) };
    case 'SET_THEME':
      return { ...state, ui: { ...state.ui, theme: action.payload } };
    case 'SET_WEEKEND_TYPE':
      return { ...state, ui: { ...state.ui, weekendType: action.payload } };
    case 'SET_CUSTOM_DAYS':
      return { ...state, ui: { ...state.ui, customDays: action.payload } };
    case 'DISMISS_HOLIDAY_SUGGESTION':
      return { 
        ...state, 
        ui: { 
          ...state.ui, 
          dismissedHolidaySuggestions: [...(state.ui.dismissedHolidaySuggestions || []), action.payload]
        } 
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}
