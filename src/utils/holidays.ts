export interface Holiday {
  name: string;
  date: string; // ISO date string (YYYY-MM-DD)
  type: 'federal' | 'state' | 'observance';
}

// Sample holidays for 2024-2025 (hardcoded for now)
export const SAMPLE_HOLIDAYS: Holiday[] = [
  // 2024
  { name: 'New Year\'s Day', date: '2024-01-01', type: 'federal' },
  { name: 'Martin Luther King Jr. Day', date: '2024-01-15', type: 'federal' },
  { name: 'Presidents\' Day', date: '2024-02-19', type: 'federal' },
  { name: 'Memorial Day', date: '2024-05-27', type: 'federal' },
  { name: 'Independence Day', date: '2024-07-04', type: 'federal' },
  { name: 'Labor Day', date: '2024-09-02', type: 'federal' },
  { name: 'Columbus Day', date: '2024-10-14', type: 'federal' },
  { name: 'Veterans Day', date: '2024-11-11', type: 'federal' },
  { name: 'Thanksgiving Day', date: '2024-11-28', type: 'federal' },
  { name: 'Christmas Day', date: '2024-12-25', type: 'federal' },
  
  // 2025
  { name: 'New Year\'s Day', date: '2025-01-01', type: 'federal' },
  { name: 'Martin Luther King Jr. Day', date: '2025-01-20', type: 'federal' },
  { name: 'Presidents\' Day', date: '2025-02-17', type: 'federal' },
  { name: 'Memorial Day', date: '2025-05-26', type: 'federal' },
  { name: 'Independence Day', date: '2025-07-04', type: 'federal' },
  { name: 'Labor Day', date: '2025-09-01', type: 'federal' },
  { name: 'Columbus Day', date: '2025-10-13', type: 'federal' },
  { name: 'Veterans Day', date: '2025-11-11', type: 'federal' },
  { name: 'Thanksgiving Day', date: '2025-11-27', type: 'federal' },
  { name: 'Christmas Day', date: '2025-12-25', type: 'federal' },
];

export interface LongWeekendSuggestion {
  id: string;
  holiday: Holiday;
  weekendType: 'long-friday' | 'long-monday';
  dateRange: string;
  days: string[];
  startDate: string;
  endDate: string;
}

// Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
const getDayOfWeek = (date: string): number => {
  return new Date(date).getDay();
};

// Format date for display
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Get date range string
const getDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    // Same month and year
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.getDate()}, ${start.getFullYear()}`;
  } else if (start.getFullYear() === end.getFullYear()) {
    // Same year, different months
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
  } else {
    // Different years
    return `${formatDate(startDate)}–${formatDate(endDate)}`;
  }
};

// Get upcoming long weekend suggestions
export const getUpcomingLongWeekends = (dismissedIds: string[] = []): LongWeekendSuggestion[] => {
  const today = new Date();
  const suggestions: LongWeekendSuggestion[] = [];
  
  // Look ahead 6 months for holidays
  const sixMonthsFromNow = new Date(today);
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  
  for (const holiday of SAMPLE_HOLIDAYS) {
    const holidayDate = new Date(holiday.date);
    
    // Skip if holiday is in the past or too far in the future
    if (holidayDate < today || holidayDate > sixMonthsFromNow) {
      continue;
    }
    
    const dayOfWeek = getDayOfWeek(holiday.date);
    let suggestion: LongWeekendSuggestion | null = null;
    
    // Check for Friday holiday (creates Sat-Mon long weekend)
    if (dayOfWeek === 5) { // Friday
      const saturday = new Date(holidayDate);
      saturday.setDate(saturday.getDate() + 1);
      const monday = new Date(holidayDate);
      monday.setDate(monday.getDate() + 3);
      
      suggestion = {
        id: `long-weekend-${holiday.date}-monday`,
        holiday,
        weekendType: 'long-monday',
        dateRange: getDateRange(saturday.toISOString().split('T')[0], monday.toISOString().split('T')[0]),
        days: ['saturday', 'sunday', 'monday'],
        startDate: saturday.toISOString().split('T')[0],
        endDate: monday.toISOString().split('T')[0]
      };
    }
    
    // Check for Monday holiday (creates Fri-Sun long weekend)
    if (dayOfWeek === 1) { // Monday
      const friday = new Date(holidayDate);
      friday.setDate(friday.getDate() - 3);
      const sunday = new Date(holidayDate);
      sunday.setDate(sunday.getDate() - 1);
      
      suggestion = {
        id: `long-weekend-${holiday.date}-friday`,
        holiday,
        weekendType: 'long-friday',
        dateRange: getDateRange(friday.toISOString().split('T')[0], sunday.toISOString().split('T')[0]),
        days: ['friday', 'saturday', 'sunday'],
        startDate: friday.toISOString().split('T')[0],
        endDate: sunday.toISOString().split('T')[0]
      };
    }
    
    if (suggestion && !dismissedIds.includes(suggestion.id)) {
      suggestions.push(suggestion);
    }
  }
  
  // Sort by date (closest first)
  return suggestions.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
};

// Get the next upcoming long weekend suggestion
export const getNextLongWeekendSuggestion = (dismissedIds: string[] = []): LongWeekendSuggestion | null => {
  const suggestions = getUpcomingLongWeekends(dismissedIds);
  return suggestions.length > 0 ? suggestions[0] : null;
};
