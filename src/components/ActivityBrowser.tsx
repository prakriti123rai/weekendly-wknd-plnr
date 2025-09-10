import { useState } from 'react';
import { useWeekend } from '../state/WeekendContext';
import { Activity } from '../types';
import ActivityCard from './ActivityCard';
import ActivityFormModal from './ActivityFormModal';

export default function ActivityBrowser() {
  const { state, dispatch } = useWeekend();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activities = Object.values(state.activities);
  
  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (activity.category && activity.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (activity.mood && activity.mood.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddActivity = (activity: Activity) => {
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });
  };

  const handleAddToSchedule = (activity: Activity) => {
    // For now, just update the activity to mark it as selected
    // Later this will be replaced with proper scheduling logic
    dispatch({ 
      type: 'UPDATE_ACTIVITY', 
      payload: { ...activity, start: new Date().toISOString() } 
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Activities</h2>
        
        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Add Activity Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Add Activity
        </button>
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {searchTerm ? (
              <p>No activities match your search.</p>
            ) : (
              <div>
                <p className="mb-2">No activities yet.</p>
                <p className="text-sm">Click "Add Activity" to get started!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onAddToSchedule={handleAddToSchedule}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ActivityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddActivity}
      />
    </div>
  );
}
