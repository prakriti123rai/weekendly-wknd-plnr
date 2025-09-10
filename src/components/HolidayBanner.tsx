import { useState } from 'react';
import { useWeekend } from '../state/WeekendContext';
import { LongWeekendSuggestion } from '../utils/holidays';
import { getWeekendTypeLabel } from '../utils/weekendTypes';

interface HolidayBannerProps {
  suggestion: LongWeekendSuggestion;
  onDismiss: (suggestionId: string) => void;
  onApply: (suggestion: LongWeekendSuggestion) => void;
}

export default function HolidayBanner({ suggestion, onDismiss, onApply }: HolidayBannerProps) {
  const [isApplying, setIsApplying] = useState(false);
  const { state } = useWeekend();

  const handleApply = async () => {
    setIsApplying(true);
    
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onApply(suggestion);
    setIsApplying(false);
  };

  const handleDismiss = () => {
    onDismiss(suggestion.id);
  };

  // Don't show if user already has the same weekend type
  if (state.ui?.weekendType === suggestion.weekendType) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-2xl">🎉</div>
            <h3 className="text-lg font-semibold text-gray-900">
              Upcoming Long Weekend!
            </h3>
          </div>
          
          <p className="text-gray-700 mb-3">
            <strong>{suggestion.holiday.name}</strong> falls on a {suggestion.weekendType === 'long-friday' ? 'Monday' : 'Friday'}, 
            creating a perfect 3-day weekend from <strong>{suggestion.dateRange}</strong>.
          </p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
            >
              {isApplying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Applying...
                </>
              ) : (
                <>
                  ✨ Plan Long Weekend
                </>
              )}
            </button>
            
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              Maybe later
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
          aria-label="Dismiss suggestion"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        This will switch your planner to {getWeekendTypeLabel(suggestion.weekendType)} mode.
      </div>
    </div>
  );
}
