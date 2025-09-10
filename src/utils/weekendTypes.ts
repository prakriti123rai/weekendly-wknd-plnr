import { WeekendType, Day } from '../types';

export const getWeekendDays = (weekendType: WeekendType, customDays: Day[] = []): Day[] => {
  switch (weekendType) {
    case 'standard':
      return ['saturday', 'sunday'];
    case 'long-friday':
      return ['friday', 'saturday', 'sunday'];
    case 'long-monday':
      return ['saturday', 'sunday', 'monday'];
    case 'custom':
      return customDays.length > 0 ? customDays : ['saturday', 'sunday'];
    default:
      return ['saturday', 'sunday'];
  }
};

export const getWeekendTypeLabel = (weekendType: WeekendType): string => {
  switch (weekendType) {
    case 'standard':
      return 'Standard Weekend (Sat–Sun)';
    case 'long-friday':
      return 'Long Weekend (Fri–Sun)';
    case 'long-monday':
      return 'Long Weekend (Sat–Mon)';
    case 'custom':
      return 'Custom Days';
    default:
      return 'Standard Weekend';
  }
};

export const getDayLabel = (day: Day): string => {
  const dayLabels: Record<string, string> = {
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    monday: 'Monday',
  };
  
  return dayLabels[day] || day.charAt(0).toUpperCase() + day.slice(1);
};

export const getDayOrder = (day: Day): number => {
  const dayOrder: Record<string, number> = {
    friday: 0,
    saturday: 1,
    sunday: 2,
    monday: 3,
  };
  
  return dayOrder[day] || 999; // Custom days go to the end
};
