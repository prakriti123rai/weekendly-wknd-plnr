import { useDroppable } from '@dnd-kit/core';
import { useWeekend } from '../state/WeekendContext';
import { Day } from '../types';
import { PIXELS_PER_HOUR } from './TimelineHelpers';
import { getDayLabel } from '../utils/weekendTypes';
import ScheduleCard from './ScheduleCard';

interface DayColumnProps {
  day: Day;
}

export default function DayColumn({ day }: DayColumnProps) {
  const { state } = useWeekend();

  // Filter scheduled items for this day
  const daySchedule = state.schedule.filter(item => item.day === day);

  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day}`,
    data: {
      day,
    },
  });

  console.log('DayColumn render:', day, 'isOver:', isOver);

  // Generate hour markers for full 24-hour day (0-23)
  const hours = [];
  for (let hour = 0; hour < 24; hour++) {
    hours.push(hour);
  }

  const dayName = getDayLabel(day);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{dayName}</h3>
      
      {/* Scrollable timeline container with fixed height */}
      <div 
        ref={setNodeRef}
        data-day={day}
        className={`h-96 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto ${isOver ? 'bg-blue-50 border-blue-300' : ''}`}
      >
        <div className="relative" style={{ height: `${24 * PIXELS_PER_HOUR}px` }}>
          {/* Hour markers */}
          <div className="absolute inset-0">
            {hours.map((hour) => {
              const top = hour * PIXELS_PER_HOUR;
              const timeLabel = hour === 0 ? '12:00 AM' :
                               hour === 12 ? '12:00 PM' : 
                               hour < 12 ? `${hour}:00 AM` : 
                               `${hour - 12}:00 PM`;
              
              return (
                <div
                  key={hour}
                  className="absolute left-0 right-0 border-t border-gray-200"
                  style={{ top: `${top}px` }}
                >
                  <div className="absolute left-2 top-0 transform -translate-y-1/2 bg-gray-50 px-1 text-xs text-gray-500">
                    {timeLabel}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scheduled items */}
          {daySchedule.map((scheduledItem) => (
            <ScheduleCard
              key={scheduledItem.id}
              scheduledItem={scheduledItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
