import { useWeekend } from '../state/WeekendContext';
import { getWeekendDays, getDayOrder } from '../utils/weekendTypes';
import DayColumn from './DayColumn';

export default function ScheduleView() {
  const { state } = useWeekend();
  const weekendDays = getWeekendDays(state.ui?.weekendType || 'standard', state.ui?.customDays || []);
  
  // Sort days by their natural order
  const sortedDays = [...weekendDays].sort((a, b) => getDayOrder(a) - getDayOrder(b));

  // Calculate column width based on number of days
  const getColumnWidth = (dayCount: number) => {
    if (dayCount <= 2) return 'w-1/2'; // 50% each for 2 days
    if (dayCount === 3) return 'w-1/3'; // 33.33% each for 3 days
    if (dayCount === 4) return 'w-1/4'; // 25% each for 4 days
    return 'w-48'; // Fixed width for 5+ days with horizontal scroll
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        {state.ui?.weekendType === 'custom' ? 'Custom Schedule' : 'Weekend Schedule'}
      </h2>
      
      {sortedDays.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No days selected for custom weekend.</p>
          <p className="text-sm mt-2">Add some days using the Weekend Type selector above.</p>
        </div>
      ) : (
        <div className={`flex ${sortedDays.length > 4 ? 'space-x-4 overflow-x-auto pb-4' : 'space-x-6'}`}>
          {sortedDays.map((day) => (
            <div key={day} className={`${sortedDays.length > 4 ? 'flex-shrink-0' : getColumnWidth(sortedDays.length)}`}>
              <DayColumn day={day} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
