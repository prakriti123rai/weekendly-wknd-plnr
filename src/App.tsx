import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { useWeekend } from './state/WeekendContext';
import { ScheduledItem } from './types';
import { yToTime } from './components/TimelineHelpers';
import { getCategoryColor } from './utils/categoryColors';
import { getActivityIconWithFallback, getCategoryInfo } from './utils/activityIcons';
import ActivityBrowser from './components/ActivityBrowser';
import ScheduleView from './components/ScheduleView';
import ExportButton from './components/ExportButton';
import ThemeSelector from './components/ThemeSelector';
import WeekendTypeSelector from './components/WeekendTypeSelector';
import HolidaySuggestionManager from './components/HolidaySuggestionManager';

export default function App() {
  const { state, dispatch } = useWeekend();
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Test that we can access state.activities
  console.log('Activities:', state.activities);

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event);
    console.log('Active:', event.active);
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag ended:', event);
    const { active, over } = event;
    
    console.log('Active:', active);
    console.log('Over:', over);
    
    if (!over) {
      console.log('No drop target');
      return;
    }
    
    console.log('Over ID:', over.id);
    
    // Check if we're dropping on a day column
    if (over.id.toString().startsWith('day-')) {
      console.log('Dropping on day column');
      const day = over.id.toString().replace('day-', '') as 'saturday' | 'sunday';
      
      // Get the drop position relative to the day column
      // Use the activator event to get the mouse position
      const activatorEvent = event.activatorEvent as PointerEvent;
      if (!activatorEvent) {
        console.log('No activator event');
        return;
      }
      
      // Get the day column element to calculate relative position
      const dayColumnElement = document.querySelector(`[data-day="${day}"]`);
      if (!dayColumnElement) {
        console.log('Day column element not found');
        return;
      }
      
      const columnRect = dayColumnElement.getBoundingClientRect();
      // Account for scroll position in the timeline
      const scrollTop = dayColumnElement.scrollTop;
      const dropY = activatorEvent.clientY - columnRect.top + scrollTop;
      console.log('Drop Y position:', dropY);
      console.log('Scroll position:', scrollTop);
      
      // Convert Y position to time
      const { hours, minutes } = yToTime(dropY);
      console.log('Calculated time:', hours, ':', minutes);
      console.log('Timeline height:', dayColumnElement.scrollHeight);
      console.log('Visible height:', dayColumnElement.clientHeight);
      
      // Check if we're dragging an activity or a scheduled item
      if (active.data.current?.type === 'scheduled-item') {
        // Moving an existing scheduled item
        const scheduledItem = active.data.current?.scheduledItem;
        console.log('Moving scheduled item:', scheduledItem);
        
        if (!scheduledItem) {
          console.log('No scheduled item data');
          return;
        }
        
        // Create new date with calculated time
        const today = new Date();
        const newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
        
        const updatedScheduledItem: ScheduledItem = {
          ...scheduledItem,
          day,
          startISO: newDate.toISOString()
        };
        
        console.log('Moving scheduled item to:', updatedScheduledItem);
        dispatch({ type: 'MOVE_SCHEDULE_ITEM', payload: { 
          id: scheduledItem.id, 
          startISO: updatedScheduledItem.startISO, 
          day: updatedScheduledItem.day 
        }});
      } else {
        // Scheduling a new activity
        const activity = active.data.current?.activity;
        console.log('Scheduling new activity:', activity);
        
        if (!activity) {
          console.log('No activity data');
          return;
        }
        
        // Create new date with calculated time
        const today = new Date();
        const scheduledDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
        
        const scheduledItem: ScheduledItem = {
          id: Date.now().toString(),
          activityId: activity.id,
          day,
          startISO: scheduledDate.toISOString(),
          durationMinutes: activity.durationMinutes || 60
        };
        
        console.log('Scheduling item:', scheduledItem);
        dispatch({ type: 'SCHEDULE_ITEM', payload: scheduledItem });
      }
    } else {
      console.log('Not dropping on day column');
    }
    
    setActiveId(null);
  };

  // Create drag preview components
  const renderDragOverlay = () => {
    if (!activeId) return null;

    // Check if it's an activity or scheduled item
    if (activeId.startsWith('activity-')) {
      const activityId = activeId.replace('activity-', '');
      const activity = state.activities[activityId];
      if (!activity) return null;

      const categoryColor = getCategoryColor(activity.category);
      const categoryInfo = getCategoryInfo(activity.category);
      const activityIcon = getActivityIconWithFallback(activity);

      return (
        <div className={`bg-white rounded-lg border-2 p-4 shadow-lg opacity-90 ${categoryColor.border}`}>
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
            />
          </div>
          <div className="w-full h-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
            <span className="text-gray-500 text-sm">Drag to schedule</span>
          </div>
        </div>
      );
    }

    if (activeId.startsWith('schedule-')) {
      const scheduleId = activeId.replace('schedule-', '');
      const scheduledItem = state.schedule.find(item => item.id === scheduleId);
      if (!scheduledItem) return null;

      const activity = state.activities[scheduledItem.activityId];
      if (!activity) return null;

      const categoryColor = getCategoryColor(activity.category);
      const categoryInfo = getCategoryInfo(activity.category);
      const activityIcon = getActivityIconWithFallback(activity);

      return (
        <div className={`bg-white border-2 rounded-md shadow-lg p-2 opacity-90 min-w-32 min-h-16 ${categoryColor.border}`}>
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
      );
    }

    return null;
  };

  // Apply theme to body
  useEffect(() => {
    const body = document.body;
    // Remove existing theme classes
    body.classList.remove('theme-default', 'theme-lazy', 'theme-adventurous');
    // Add current theme class
    body.classList.add(`theme-${state.ui.theme}`);
  }, [state.ui.theme]);
  
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Left Column - Activity Browser */}
        <ActivityBrowser />
        
        {/* Right Column - Schedule */}
        <main className="flex-1 p-6">
          <header className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Weekendly</h1>
            <div className="flex items-center space-x-4">
              <ThemeSelector />
              <ExportButton />
            </div>
          </header>
          
          {/* Holiday Suggestion Banner */}
          <HolidaySuggestionManager />
          
          {/* Weekend Type Selector */}
          <div className="mb-6">
            <WeekendTypeSelector />
          </div>
          
          <div id="export-area" className="bg-white rounded-lg border border-gray-200 p-6">
            <ScheduleView />
          </div>
        </main>
      </div>
      
      <DragOverlay>
        {renderDragOverlay()}
      </DragOverlay>
    </DndContext>
  );
}
