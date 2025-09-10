import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityCard from './ActivityCard';
import { Activity } from '../types';
import { WeekendProvider } from '../state/WeekendContext';

// Mock the drag and drop functionality
vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    isDragging: false,
  }),
}));

// Mock the utility functions
vi.mock('../utils/categoryColors', () => ({
  getCategoryColor: vi.fn(() => '#3B82F6'),
}));

vi.mock('../utils/activityIcons', () => ({
  getActivityIconWithFallback: vi.fn(() => '🏃'),
  getCategoryInfo: vi.fn(() => ({ name: 'Outdoor', icon: '🌲' })),
}));

vi.mock('../utils/weekendTypes', () => ({
  getWeekendDays: vi.fn(() => ['saturday', 'sunday']),
  getDayLabel: vi.fn((day) => day.charAt(0).toUpperCase() + day.slice(1)),
}));

const mockActivity: Activity = {
  id: 'activity-1',
  title: 'Morning Run',
  category: 'outdoor',
  durationMinutes: 60,
  mood: 'energetic',
  color: '#3B82F6'
};

const mockOnScheduleItem = vi.fn();

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <WeekendProvider>
      {component}
    </WeekendProvider>
  );
};

describe('ActivityCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders activity details correctly', () => {
    renderWithProvider(
      <ActivityCard activity={mockActivity} onScheduleItem={mockOnScheduleItem} />
    );

    expect(screen.getByText('Morning Run')).toBeInTheDocument();
    expect(screen.getByText('60 min')).toBeInTheDocument();
    expect(screen.getByText('energetic')).toBeInTheDocument();
  });

  it('shows schedule form when schedule button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <ActivityCard activity={mockActivity} onScheduleItem={mockOnScheduleItem} />
    );

    const scheduleButton = screen.getByText('Schedule');
    await user.click(scheduleButton);

    expect(screen.getByText('Schedule Activity')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Saturday')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('60')).toBeInTheDocument();
  });

  it('calls onScheduleItem when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <ActivityCard activity={mockActivity} onScheduleItem={mockOnScheduleItem} />
    );

    // Open schedule form
    const scheduleButton = screen.getByText('Schedule');
    await user.click(scheduleButton);

    // Submit form
    const submitButton = screen.getByText('Add to Schedule');
    await user.click(submitButton);

    expect(mockOnScheduleItem).toHaveBeenCalledWith(
      expect.objectContaining({
        activityId: 'activity-1',
        day: 'saturday',
        durationMinutes: 60,
        startISO: expect.any(String),
        id: expect.any(String)
      })
    );
  });

  it('updates form fields when user interacts with them', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <ActivityCard activity={mockActivity} onScheduleItem={mockOnScheduleItem} />
    );

    // Open schedule form
    const scheduleButton = screen.getByText('Schedule');
    await user.click(scheduleButton);

    // Change day
    const daySelect = screen.getByDisplayValue('Saturday');
    await user.selectOptions(daySelect, 'sunday');

    // Change time
    const timeInput = screen.getByDisplayValue('10:00');
    await user.clear(timeInput);
    await user.type(timeInput, '14:30');

    // Change duration
    const durationInput = screen.getByDisplayValue('60');
    await user.clear(durationInput);
    await user.type(durationInput, '90');

    expect(daySelect).toHaveValue('sunday');
    expect(timeInput).toHaveValue('14:30');
    expect(durationInput).toHaveValue(90);
  });

  it('closes schedule form when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <ActivityCard activity={mockActivity} onScheduleItem={mockOnScheduleItem} />
    );

    // Open schedule form
    const scheduleButton = screen.getByText('Schedule');
    await user.click(scheduleButton);

    expect(screen.getByText('Schedule Activity')).toBeInTheDocument();

    // Close form
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(screen.queryByText('Schedule Activity')).not.toBeInTheDocument();
  });

  it('handles activities without duration', () => {
    const activityWithoutDuration = {
      ...mockActivity,
      durationMinutes: undefined
    };

    renderWithProvider(
      <ActivityCard activity={activityWithoutDuration} onScheduleItem={mockOnScheduleItem} />
    );

    expect(screen.getByText('Morning Run')).toBeInTheDocument();
    // Should not show duration if not specified
    expect(screen.queryByText('60 min')).not.toBeInTheDocument();
  });

  it('handles activities without mood', () => {
    const activityWithoutMood = {
      ...mockActivity,
      mood: undefined
    };

    renderWithProvider(
      <ActivityCard activity={activityWithoutMood} onScheduleItem={mockOnScheduleItem} />
    );

    expect(screen.getByText('Morning Run')).toBeInTheDocument();
    // Should not show mood if not specified
    expect(screen.queryByText('energetic')).not.toBeInTheDocument();
  });

  it('shows correct default values in schedule form', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <ActivityCard activity={mockActivity} onScheduleItem={mockOnScheduleItem} />
    );

    // Open schedule form
    const scheduleButton = screen.getByText('Schedule');
    await user.click(scheduleButton);

    // Check default values
    expect(screen.getByDisplayValue('Saturday')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('60')).toBeInTheDocument();
  });
});
