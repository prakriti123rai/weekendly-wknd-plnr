import { render, RenderOptions } from '@testing-library/react';
import { WeekendProvider } from '../state/WeekendContext';
import { WeekendlyState } from '../types';

// Create a custom render function that includes providers
const AllTheProviders = ({ children, initialState }: { children: React.ReactNode; initialState?: WeekendlyState }) => {
  return (
    <WeekendProvider>
      {children}
    </WeekendProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialState?: WeekendlyState }
) => render(ui, { wrapper: (props) => <AllTheProviders {...props} initialState={options?.initialState} />, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Helper function to create mock state
export const createMockState = (overrides: Partial<WeekendlyState> = {}): WeekendlyState => ({
  activities: {},
  schedule: [],
  ui: {
    theme: 'default',
    weekendType: 'standard',
    customDays: [],
    dismissedHolidaySuggestions: []
  },
  ...overrides
});

// Helper function to create mock activity
export const createMockActivity = (overrides: Partial<any> = {}) => ({
  id: 'activity-1',
  title: 'Test Activity',
  category: 'outdoor',
  durationMinutes: 60,
  mood: 'energetic',
  color: '#3B82F6',
  ...overrides
});

// Helper function to create mock scheduled item
export const createMockScheduledItem = (overrides: Partial<any> = {}) => ({
  id: 'schedule-1',
  activityId: 'activity-1',
  day: 'saturday',
  startISO: '2024-01-06T09:00:00.000Z',
  durationMinutes: 60,
  ...overrides
});
