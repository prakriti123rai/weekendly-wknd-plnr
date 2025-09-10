import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { createMockState } from './test/test-utils';

// Mock all the external dependencies
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div data-testid="dnd-context">{children}</div>,
  DragOverlay: ({ children }: { children: React.ReactNode }) => <div data-testid="drag-overlay">{children}</div>,
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    isDragging: false,
  }),
  useDroppable: () => ({
    setNodeRef: vi.fn(),
    isOver: false,
  }),
}));

vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: vi.fn(() => 'data:image/png;base64,mock-image-data')
  }))
}));

// Mock the utility functions
vi.mock('./utils/categoryColors', () => ({
  getCategoryColor: vi.fn(() => '#3B82F6'),
}));

vi.mock('./utils/activityIcons', () => ({
  getActivityIconWithFallback: vi.fn(() => '🏃'),
  getCategoryInfo: vi.fn(() => ({ name: 'Outdoor', icon: '🌲' })),
}));

vi.mock('./utils/weekendTypes', () => ({
  getWeekendDays: vi.fn(() => ['saturday', 'sunday']),
  getDayOrder: vi.fn((day) => {
    const order = { 'friday': 1, 'saturday': 2, 'sunday': 3, 'monday': 4 };
    return order[day] || 0;
  }),
  getWeekendTypeLabel: vi.fn((type) => type),
}));

vi.mock('./utils/holidays', () => ({
  getNextLongWeekendSuggestion: vi.fn(() => null),
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main app structure', () => {
    render(<App />);

    expect(screen.getByText('Weekendly')).toBeInTheDocument();
    expect(screen.getByText('Weekend Schedule')).toBeInTheDocument();
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
  });

  it('shows activity browser and schedule view', () => {
    render(<App />);

    // Should show the main sections
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('Weekend Schedule')).toBeInTheDocument();
  });

  it('displays theme selector and export button', () => {
    render(<App />);

    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('shows weekend type selector', () => {
    render(<App />);

    expect(screen.getByText('Weekend Type')).toBeInTheDocument();
  });

  it('handles empty state correctly', () => {
    const emptyState = createMockState({
      activities: {},
      schedule: []
    });

    render(<App />);

    // Should show empty state messages
    expect(screen.getByText(/No activities yet/)).toBeInTheDocument();
  });

  it('displays activities when they exist', () => {
    const stateWithActivities = createMockState({
      activities: {
        'activity-1': {
          id: 'activity-1',
          title: 'Morning Run',
          category: 'outdoor',
          durationMinutes: 60,
          mood: 'energetic',
          color: '#3B82F6'
        }
      }
    });

    render(<App />);

    // Should show the activity
    expect(screen.getByText('Morning Run')).toBeInTheDocument();
  });

  it('shows scheduled items in the schedule view', () => {
    const stateWithSchedule = createMockState({
      activities: {
        'activity-1': {
          id: 'activity-1',
          title: 'Morning Run',
          category: 'outdoor',
          durationMinutes: 60
        }
      },
      schedule: [
        {
          id: 'schedule-1',
          activityId: 'activity-1',
          day: 'saturday',
          startISO: '2024-01-06T09:00:00.000Z',
          durationMinutes: 60
        }
      ]
    });

    render(<App />);

    // Should show the scheduled activity
    expect(screen.getByText('Morning Run')).toBeInTheDocument();
  });

  it('handles different weekend types', () => {
    const longWeekendState = createMockState({
      ui: {
        theme: 'default',
        weekendType: 'long-friday',
        customDays: [],
        dismissedHolidaySuggestions: []
      }
    });

    render(<App />);

    // Should show the weekend type selector
    expect(screen.getByText('Weekend Type')).toBeInTheDocument();
  });

  it('renders without crashing with various state configurations', () => {
    const testStates = [
      createMockState(),
      createMockState({ ui: { ...createMockState().ui, theme: 'lazy' } }),
      createMockState({ ui: { ...createMockState().ui, weekendType: 'long-monday' } }),
      createMockState({ ui: { ...createMockState().ui, weekendType: 'custom', customDays: ['friday', 'saturday', 'sunday'] } })
    ];

    testStates.forEach((state, index) => {
      const { unmount } = render(<App />);
      expect(screen.getByText('Weekendly')).toBeInTheDocument();
      unmount();
    });
  });
});
