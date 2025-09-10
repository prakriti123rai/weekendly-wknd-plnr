import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ScheduleView from './ScheduleView';
import { WeekendProvider } from '../state/WeekendContext';
import { WeekendlyState } from '../types';

// Mock the weekend types utility
vi.mock('../utils/weekendTypes', () => ({
  getWeekendDays: vi.fn(() => ['saturday', 'sunday']),
  getDayOrder: vi.fn((day) => {
    const order = { 'friday': 1, 'saturday': 2, 'sunday': 3, 'monday': 4 };
    return order[day] || 0;
  }),
}));

// Mock the DayColumn component
vi.mock('./DayColumn', () => ({
  default: ({ day }: { day: string }) => (
    <div data-testid={`day-column-${day}`}>
      <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
    </div>
  )
}));

const createMockState = (overrides: Partial<WeekendlyState> = {}): WeekendlyState => ({
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

const renderWithProvider = (state: WeekendlyState) => {
  const mockDispatch = vi.fn();
  
  return render(
    <WeekendProvider>
      <ScheduleView />
    </WeekendProvider>
  );
};

describe('ScheduleView', () => {
  it('renders weekend schedule with standard weekend type', () => {
    const state = createMockState({
      ui: {
        theme: 'default',
        weekendType: 'standard',
        customDays: [],
        dismissedHolidaySuggestions: []
      }
    });

    const { container } = renderWithProvider(state);
    
    expect(container).toMatchSnapshot();
  });

  it('renders long weekend schedule with long-friday type', () => {
    const state = createMockState({
      ui: {
        theme: 'default',
        weekendType: 'long-friday',
        customDays: [],
        dismissedHolidaySuggestions: []
      }
    });

    const { container } = renderWithProvider(state);
    
    expect(container).toMatchSnapshot();
  });

  it('renders long weekend schedule with long-monday type', () => {
    const state = createMockState({
      ui: {
        theme: 'default',
        weekendType: 'long-monday',
        customDays: [],
        dismissedHolidaySuggestions: []
      }
    });

    const { container } = renderWithProvider(state);
    
    expect(container).toMatchSnapshot();
  });

  it('renders custom weekend schedule', () => {
    const state = createMockState({
      ui: {
        theme: 'default',
        weekendType: 'custom',
        customDays: ['friday', 'saturday', 'sunday', 'monday'],
        dismissedHolidaySuggestions: []
      }
    });

    const { container } = renderWithProvider(state);
    
    expect(container).toMatchSnapshot();
  });

  it('shows empty state for custom weekend with no days', () => {
    const state = createMockState({
      ui: {
        theme: 'default',
        weekendType: 'custom',
        customDays: [],
        dismissedHolidaySuggestions: []
      }
    });

    const { container } = renderWithProvider(state);
    
    expect(container).toMatchSnapshot();
  });

  it('renders with multiple scheduled activities', () => {
    const state = createMockState({
      activities: {
        'activity-1': {
          id: 'activity-1',
          title: 'Morning Run',
          category: 'outdoor',
          durationMinutes: 60,
          mood: 'energetic',
          color: '#3B82F6'
        },
        'activity-2': {
          id: 'activity-2',
          title: 'Coffee Break',
          category: 'food',
          durationMinutes: 30,
          mood: 'relaxed',
          color: '#10B981'
        }
      },
      schedule: [
        {
          id: 'schedule-1',
          activityId: 'activity-1',
          day: 'saturday',
          startISO: '2024-01-06T09:00:00.000Z',
          durationMinutes: 60
        },
        {
          id: 'schedule-2',
          activityId: 'activity-2',
          day: 'sunday',
          startISO: '2024-01-07T14:00:00.000Z',
          durationMinutes: 30
        }
      ],
      ui: {
        theme: 'default',
        weekendType: 'standard',
        customDays: [],
        dismissedHolidaySuggestions: []
      }
    });

    const { container } = renderWithProvider(state);
    
    expect(container).toMatchSnapshot();
  });
});
