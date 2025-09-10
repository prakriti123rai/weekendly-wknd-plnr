import { useState, useEffect } from 'react';
import { useWeekend } from '../state/WeekendContext';
import { WeekendType, Day } from '../types';
import { getWeekendDays, getWeekendTypeLabel, getDayLabel } from '../utils/weekendTypes';

interface WeekendTypeSelectorProps {
  className?: string;
}

export default function WeekendTypeSelector({ className = '' }: WeekendTypeSelectorProps) {
  const { state, dispatch } = useWeekend();
  const [showCustomDays, setShowCustomDays] = useState(false);
  const [newCustomDay, setNewCustomDay] = useState('');

  const weekendTypes: WeekendType[] = ['standard', 'long-friday', 'long-monday', 'custom'];

  const handleWeekendTypeChange = (weekendType: WeekendType) => {
    dispatch({ type: 'SET_WEEKEND_TYPE', payload: weekendType });
    
    // If switching to custom, ensure we have some days
    if (weekendType === 'custom' && (!state.ui?.customDays || state.ui.customDays.length === 0)) {
      dispatch({ type: 'SET_CUSTOM_DAYS', payload: ['saturday', 'sunday'] });
    }
    
    setShowCustomDays(weekendType === 'custom');
  };

  const handleAddCustomDay = () => {
    if (newCustomDay.trim() && state.ui?.customDays && !state.ui.customDays.includes(newCustomDay.trim())) {
      const updatedDays = [...state.ui.customDays, newCustomDay.trim()];
      dispatch({ type: 'SET_CUSTOM_DAYS', payload: updatedDays });
      setNewCustomDay('');
    }
  };

  const handleRemoveCustomDay = (dayToRemove: Day) => {
    if (state.ui?.customDays) {
      const updatedDays = state.ui.customDays.filter(day => day !== dayToRemove);
      dispatch({ type: 'SET_CUSTOM_DAYS', payload: updatedDays });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomDay();
    }
  };

  // Ensure custom days are initialized when component mounts
  useEffect(() => {
    if (state.ui?.weekendType === 'custom' && (!state.ui?.customDays || state.ui.customDays.length === 0)) {
      dispatch({ type: 'SET_CUSTOM_DAYS', payload: ['saturday', 'sunday'] });
    }
  }, [state.ui?.weekendType, state.ui?.customDays?.length, dispatch]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Weekend Type Selector */}
      <div className="flex items-center space-x-2">
        <label htmlFor="weekend-type" className="text-sm font-medium text-gray-700">
          Weekend Type:
        </label>
        <select
          id="weekend-type"
          value={state.ui?.weekendType || 'standard'}
          onChange={(e) => handleWeekendTypeChange(e.target.value as WeekendType)}
          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          aria-label="Select weekend type"
        >
          {weekendTypes.map((type) => (
            <option key={type} value={type}>
              {getWeekendTypeLabel(type)}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Days Management */}
      {state.ui?.weekendType === 'custom' && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Custom Days:</div>
          
          {/* Current custom days */}
          <div className="flex flex-wrap gap-2">
            {(state.ui?.customDays || []).map((day) => (
              <div
                key={day}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
              >
                <span>{getDayLabel(day)}</span>
                <button
                  onClick={() => handleRemoveCustomDay(day)}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                  aria-label={`Remove ${getDayLabel(day)}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Add new custom day */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newCustomDay}
              onChange={(e) => setNewCustomDay(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add custom day (e.g., Tuesday)"
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Add custom day"
            />
            <button
              onClick={handleAddCustomDay}
              disabled={!newCustomDay.trim()}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label="Add custom day"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Preview of current days */}
      <div className="text-xs text-gray-500">
        Current days: {getWeekendDays(state.ui.weekendType, state.ui.customDays).map(getDayLabel).join(', ')}
      </div>
    </div>
  );
}
