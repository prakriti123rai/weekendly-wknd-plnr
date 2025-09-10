import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Activity, ScheduledItem, Day } from '../types';
import { useWeekend } from '../state/WeekendContext';
import { getCategoryColor } from '../utils/categoryColors';
import { getActivityIconWithFallback, getCategoryInfo } from '../utils/activityIcons';
import { getWeekendDays, getDayLabel } from '../utils/weekendTypes';

interface ActivityCardProps {
  activity: Activity;
  onScheduleItem: (scheduledItem: ScheduledItem) => void;
}

export default function ActivityCard({ activity, onScheduleItem }: ActivityCardProps) {
  const { state } = useWeekend();
  const weekendDays = getWeekendDays(state.ui?.weekendType || 'standard', state.ui?.customDays || []);
  
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    day: weekendDays[0] as Day,
    startTime: '10:00',
    durationMinutes: activity.durationMinutes || 60
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: `activity-${activity.id}`,
    data: {
      activity,
      type: 'activity'
    },
  });

  console.log('ActivityCard render:', activity.title, 'isDragging:', isDragging);
  console.log('Drag listeners:', listeners);
  console.log('Drag attributes:', attributes);

  // Note: We don't apply the transform to keep the original card visible during drag

  const categoryColor = getCategoryColor(activity.category);
  const categoryInfo = getCategoryInfo(activity.category);
  const activityIcon = getActivityIconWithFallback(activity);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create ISO string for the scheduled time (using today's date for simplicity)
    const today = new Date();
    const [hours, minutes] = scheduleForm.startTime.split(':').map(Number);
    const scheduledDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    
    const scheduledItem: ScheduledItem = {
      id: Date.now().toString(),
      activityId: activity.id,
      day: scheduleForm.day,
      startISO: scheduledDate.toISOString(),
      durationMinutes: scheduleForm.durationMinutes
    };

    onScheduleItem(scheduledItem);
    setShowScheduleForm(false);
  };

  const handleCancel = () => {
    setShowScheduleForm(false);
    setScheduleForm({
      day: 'saturday',
      startTime: '10:00',
      durationMinutes: activity.durationMinutes || 60
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setShowScheduleForm(true);
    }
  };

  return (
    <article 
      ref={setNodeRef}
      className={`bg-white rounded-lg border-2 p-4 hover:shadow-md transition-all duration-200 ${isDragging ? 'opacity-30' : ''} ${categoryColor.border}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`Activity: ${activity.title}. Press Enter to schedule.`}
    >
      {/* Activity Header with Icon and Title */}
      <div className="flex items-start gap-3 mb-3">
        <div className="text-2xl" role="img" aria-label={`Activity type: ${activity.title}`}>
          {activityIcon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-2">{activity.title}</h3>
          {activity.category && (
            <div className="flex items-center gap-2">
              <span className="text-sm" role="img" aria-label={`Category: ${categoryInfo.label}`}>
                {categoryInfo.icon}
              </span>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.bg} ${categoryInfo.text}`}>
                {categoryInfo.label}
              </span>
            </div>
          )}
        </div>
        <div 
          className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0"
          style={{ backgroundColor: activity.color || categoryColor.color }}
          title={`Color: ${activity.color || categoryColor.color}`}
          aria-label={`Activity color: ${activity.color || categoryColor.color}`}
        />
      </div>
      
      {/* Explicit Drag Handle */}
      <div 
        {...listeners}
        {...attributes}
        className="w-full h-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-grab active:cursor-grabbing mb-3"
        role="button"
        aria-label="Drag handle to move activity to schedule"
        tabIndex={-1}
      >
        <span className="text-gray-500 text-sm">Drag to schedule</span>
      </div>
      
      {!showScheduleForm ? (
        <div className="flex items-center justify-between text-sm text-gray-600">
          {activity.durationMinutes && (
            <span>{activity.durationMinutes} min</span>
          )}
          <button
            onClick={() => setShowScheduleForm(true)}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
            aria-label={`Add ${activity.title} to schedule`}
          >
            Add to schedule
          </button>
        </div>
      ) : (
        <form onSubmit={handleScheduleSubmit} className="space-y-3 pt-2 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`day-${activity.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                Day
              </label>
              <select
                id={`day-${activity.id}`}
                value={scheduleForm.day}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, day: e.target.value as Day }))}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {weekendDays.map((day) => (
                  <option key={day} value={day}>
                    {getDayLabel(day)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`time-${activity.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                id={`time-${activity.id}`}
                value={scheduleForm.startTime}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor={`duration-${activity.id}`} className="block text-xs font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              id={`duration-${activity.id}`}
              value={scheduleForm.durationMinutes}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) || 60 }))}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="1"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Schedule
            </button>
          </div>
        </form>
      )}
    </article>
  );
}
