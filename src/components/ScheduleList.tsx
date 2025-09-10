import { useWeekend } from '../state/WeekendContext';
import { ScheduledItem } from '../types';

export default function ScheduleList() {
  const { state, dispatch } = useWeekend();

  const handleRemove = (scheduledItemId: string) => {
    dispatch({ type: 'UNSCHEDULE_ITEM', payload: { id: scheduledItemId } });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  if (state.schedule.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No scheduled activities yet.</p>
        <p className="text-sm mt-1">Add activities from the left panel to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Scheduled Activities</h3>
      <ol className="space-y-3">
        {state.schedule.map((scheduledItem: ScheduledItem) => {
          const activity = state.activities[scheduledItem.activityId];
          
          if (!activity) {
            return null; // Skip if activity was deleted
          }

          return (
            <li key={scheduledItem.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <div className="mt-1 text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">{formatDay(scheduledItem.day)}</span> at {formatTime(scheduledItem.startISO)}
                    </p>
                    <p>{scheduledItem.durationMinutes} minutes</p>
                    {activity.category && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {activity.category}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(scheduledItem.id)}
                  className="ml-3 px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm transition-colors"
                  title="Remove from schedule"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
