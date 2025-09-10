import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  onAddToSchedule: (activity: Activity) => void;
}

export default function ActivityCard({ activity, onAddToSchedule }: ActivityCardProps) {
  const categoryColors = {
    food: 'bg-orange-100 text-orange-800',
    outdoor: 'bg-green-100 text-green-800',
    relax: 'bg-blue-100 text-blue-800',
    entertainment: 'bg-purple-100 text-purple-800',
    custom: 'bg-gray-100 text-gray-800'
  };

  const categoryColor = activity.category ? categoryColors[activity.category] : categoryColors.custom;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{activity.title}</h3>
          {activity.category && (
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
              {activity.category}
            </span>
          )}
        </div>
        {activity.color && (
          <div 
            className="w-6 h-6 rounded-full border border-gray-300 ml-2"
            style={{ backgroundColor: activity.color }}
            title={`Color: ${activity.color}`}
          />
        )}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        {activity.durationMinutes && (
          <span>{activity.durationMinutes} min</span>
        )}
        <button
          onClick={() => onAddToSchedule(activity)}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
        >
          Add to schedule
        </button>
      </div>
    </div>
  );
}
