import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useWeekend } from '../state/WeekendContext';
import { ScheduledItem, Day } from '../types';
import { isoToTop, minutesToHeight } from './TimelineHelpers';
import { getCategoryColor } from '../utils/categoryColors';
import { getActivityIconWithFallback, getCategoryInfo } from '../utils/activityIcons';

interface ScheduleCardProps {
  scheduledItem: ScheduledItem;
}

export default function ScheduleCard({ scheduledItem }: ScheduleCardProps) {
  const { state, dispatch } = useWeekend();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    startTime: '',
    durationMinutes: scheduledItem.durationMinutes,
    day: scheduledItem.day
  });

  const activity = state.activities[scheduledItem.activityId];
  
  if (!activity) {
    return null; // Skip if activity was deleted
  }

  const categoryColor = getCategoryColor(activity.category);
  const categoryInfo = getCategoryInfo(activity.category);
  const activityIcon = getActivityIconWithFallback(activity);
  const top = isoToTop(scheduledItem.startISO);
  const calculatedHeight = minutesToHeight(scheduledItem.durationMinutes);
  const height = Math.max(calculatedHeight, 70); // Ensure minimum height for content
  
  // Ensure the card doesn't extend beyond the timeline bounds
  const maxHeight = 24 * 60 - top; // 24 hours * 60 pixels per hour - current position
  const finalHeight = Math.min(height, maxHeight);

  // Make ScheduleCard draggable
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: `schedule-${scheduledItem.id}`,
    data: {
      scheduledItem,
      type: 'scheduled-item'
    },
  });

  // Note: We don't apply the transform to keep the original card visible during drag

  // Initialize form with current values when editing starts
  const handleEditClick = () => {
    const currentDate = new Date(scheduledItem.startISO);
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    
    setEditForm({
      startTime: `${hours}:${minutes}`,
      durationMinutes: scheduledItem.durationMinutes,
      day: scheduledItem.day
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new ISO string for the updated time
    const today = new Date();
    const [hours, minutes] = editForm.startTime.split(':').map(Number);
    const newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    
    dispatch({
      type: 'MOVE_SCHEDULE_ITEM',
      payload: {
        id: scheduledItem.id,
        startISO: newDate.toISOString(),
        day: editForm.day,
        durationMinutes: editForm.durationMinutes
      }
    });
    
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch({
      type: 'UNSCHEDULE_ITEM',
      payload: { id: scheduledItem.id }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <>
        {/* Show original card position as a placeholder */}
        <div
          className="absolute left-2 right-2 bg-blue-50 border border-blue-200 rounded-md p-2 opacity-50"
          style={{
            top: `${top}px`,
            height: `${height}px`,
            minHeight: '40px'
          }}
        >
          <div className="flex flex-col h-full">
            <h4 className="font-medium text-sm text-gray-900 truncate">
              {activity.title}
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {scheduledItem.durationMinutes} min
            </p>
          </div>
        </div>
        
        {/* Edit form positioned above the original card */}
        <div
          className="absolute left-2 right-2 bg-white border-2 border-blue-300 rounded-md shadow-lg p-3 z-20"
          style={{
            top: `${Math.max(0, top - 180)}px`, // Position above the original card
            height: '180px',
            minHeight: '180px'
          }}
        >
          <form onSubmit={handleSave} className="space-y-1 h-full flex flex-col">
            <h4 className="font-medium text-sm text-gray-900">{activity.title}</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor={`edit-time-${scheduledItem.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id={`edit-time-${scheduledItem.id}`}
                  value={editForm.startTime}
                  onChange={(e) => setEditForm(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor={`edit-day-${scheduledItem.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                  Day
                </label>
                <select
                  id={`edit-day-${scheduledItem.id}`}
                  value={editForm.day}
                  onChange={(e) => setEditForm(prev => ({ ...prev, day: e.target.value as Day }))}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor={`edit-duration-${scheduledItem.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                id={`edit-duration-${scheduledItem.id}`}
                value={editForm.durationMinutes}
                onChange={(e) => setEditForm(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) || 60 }))}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
            
            <div className="flex space-x-2 mt-auto pt-1">
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
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
                Save
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        top: `${top}px`,
        height: `${finalHeight}px`,
        minHeight: '70px'
      }}
      className={`absolute left-2 right-2 bg-white border-2 rounded-md shadow-sm p-2 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 ${isDragging ? 'opacity-30' : ''} ${categoryColor.border}`}
      title="Click to edit or drag to move"
    >
      {/* Drag Handle */}
      <div 
        {...listeners}
        {...attributes}
        className="absolute top-0 left-0 right-0 h-2 cursor-grab active:cursor-grabbing"
        title="Drag to move"
      />
      
      {/* Clickable content */}
      <div 
        className="flex flex-col h-full pt-1 pb-1"
        onClick={handleEditClick}
      >
        {/* Title with icon */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg flex-shrink-0" role="img" aria-label={`Activity: ${activity.title}`}>
            {activityIcon}
          </span>
          <h4 className="font-medium text-sm text-gray-900 leading-tight flex-1 min-w-0">
            {activity.title}
          </h4>
        </div>
        
        {/* Bottom row: Duration (left) and Category (right) */}
        <div className="flex items-center justify-between mt-auto">
          <p className="text-xs text-gray-600 flex-shrink-0">
            {scheduledItem.durationMinutes || activity.durationMinutes || 60} min
          </p>
          {activity.category && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-xs" role="img" aria-label={`Category: ${categoryInfo.label}`}>
                {categoryInfo.icon}
              </span>
              <span className={`inline-block px-1 py-0.5 text-xs rounded ${categoryInfo.bg} ${categoryInfo.text}`}>
                {categoryInfo.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
