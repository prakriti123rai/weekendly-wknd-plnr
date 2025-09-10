import { useEffect, useState } from 'react';
import { useWeekend } from '../state/WeekendContext';
import { getNextLongWeekendSuggestion, LongWeekendSuggestion } from '../utils/holidays';
import HolidayBanner from './HolidayBanner';

export default function HolidaySuggestionManager() {
  const { state, dispatch } = useWeekend();
  const [suggestion, setSuggestion] = useState<LongWeekendSuggestion | null>(null);

  useEffect(() => {
    // Get the next holiday suggestion, excluding dismissed ones
    const nextSuggestion = getNextLongWeekendSuggestion(state.ui?.dismissedHolidaySuggestions || []);
    setSuggestion(nextSuggestion);
  }, [state.ui?.dismissedHolidaySuggestions]);

  const handleDismiss = (suggestionId: string) => {
    dispatch({ type: 'DISMISS_HOLIDAY_SUGGESTION', payload: suggestionId });
  };

  const handleApply = (suggestion: LongWeekendSuggestion) => {
    // Apply the suggested weekend type
    dispatch({ type: 'SET_WEEKEND_TYPE', payload: suggestion.weekendType });
    
    // Dismiss the suggestion so it doesn't show again
    dispatch({ type: 'DISMISS_HOLIDAY_SUGGESTION', payload: suggestion.id });
  };

  if (!suggestion) {
    return null;
  }

  return (
    <HolidayBanner
      suggestion={suggestion}
      onDismiss={handleDismiss}
      onApply={handleApply}
    />
  );
}
