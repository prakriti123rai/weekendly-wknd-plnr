import { useWeekend } from './state/WeekendContext';
import ActivityBrowser from './components/ActivityBrowser';

export default function App() {
  const { state } = useWeekend();
  
  // Test that we can access state.activities
  console.log('Activities:', state.activities);
  
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Column - Activity Browser */}
      <ActivityBrowser />
      
      {/* Right Column - Schedule Placeholder */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Weekendly</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Schedule will go here</h2>
          <p className="text-gray-600">
            Your weekend schedule will be displayed in this area.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Current activities: {Object.keys(state.activities).length}
          </p>
        </div>
      </div>
    </div>
  );
}
