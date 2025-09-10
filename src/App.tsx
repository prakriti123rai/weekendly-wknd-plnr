import { useWeekend } from './state/WeekendContext';

export default function App() {
  const { state } = useWeekend();
  
  // Test that we can access state.activities
  console.log('Activities:', state.activities);
  
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-semibold">Weekendly — Loading...</h1>
      <p className="text-sm text-gray-600 mt-2">
        State management ready! Check console for activities: {Object.keys(state.activities).length} items
      </p>
    </main>
  );
}
