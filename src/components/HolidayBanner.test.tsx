import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HolidayBanner from './HolidayBanner';
import { LongWeekendSuggestion } from '../utils/holidays';
import { WeekendProvider } from '../state/WeekendContext';

// Mock the weekend types utility
vi.mock('../utils/weekendTypes', () => ({
  getWeekendTypeLabel: vi.fn((type) => {
    const labels = {
      'long-friday': 'Long Friday Weekend',
      'long-monday': 'Long Monday Weekend'
    };
    return labels[type] || type;
  }),
}));

const mockSuggestion: LongWeekendSuggestion = {
  id: 'long-weekend-2024-01-15-monday',
  holiday: {
    name: 'Martin Luther King Jr. Day',
    date: '2024-01-15',
    type: 'federal'
  },
  weekendType: 'long-friday',
  dateRange: 'Jan 12–14, 2024',
  days: ['friday', 'saturday', 'sunday'],
  startDate: '2024-01-12',
  endDate: '2024-01-14'
};

const mockOnDismiss = vi.fn();
const mockOnApply = vi.fn();

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <WeekendProvider>
      {component}
    </WeekendProvider>
  );
};

describe('HolidayBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders holiday suggestion details correctly', () => {
    renderWithProvider(
      <HolidayBanner
        suggestion={mockSuggestion}
        onDismiss={mockOnDismiss}
        onApply={mockOnApply}
      />
    );

    expect(screen.getByText('Upcoming Long Weekend!')).toBeInTheDocument();
    expect(screen.getByText('Martin Luther King Jr. Day')).toBeInTheDocument();
    expect(screen.getByText('Jan 12–14, 2024')).toBeInTheDocument();
    expect(screen.getByText(/falls on a Monday/)).toBeInTheDocument();
  });

  it('shows apply and dismiss buttons', () => {
    renderWithProvider(
      <HolidayBanner
        suggestion={mockSuggestion}
        onDismiss={mockOnDismiss}
        onApply={mockOnApply}
      />
    );

    expect(screen.getByText('✨ Plan Long Weekend')).toBeInTheDocument();
    expect(screen.getByText('Maybe later')).toBeInTheDocument();
  });

  it('calls onApply when apply button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <HolidayBanner
        suggestion={mockSuggestion}
        onDismiss={mockOnDismiss}
        onApply={mockOnApply}
      />
    );

    const applyButton = screen.getByText('✨ Plan Long Weekend');
    await user.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith(mockSuggestion);
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <HolidayBanner
        suggestion={mockSuggestion}
        onDismiss={mockOnDismiss}
        onApply={mockOnApply}
      />
    );

    const dismissButton = screen.getByText('Maybe later');
    await user.click(dismissButton);

    expect(mockOnDismiss).toHaveBeenCalledWith(mockSuggestion.id);
  });

  it('calls onDismiss when close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <HolidayBanner
        suggestion={mockSuggestion}
        onDismiss={mockOnDismiss}
        onApply={mockOnApply}
      />
    );

    const closeButton = screen.getByLabelText('Dismiss suggestion');
    await user.click(closeButton);

    expect(mockOnDismiss).toHaveBeenCalledWith(mockSuggestion.id);
  });

  it('shows loading state when applying', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <HolidayBanner
        suggestion={mockSuggestion}
        onDismiss={mockOnDismiss}
        onApply={mockOnApply}
      />
    );

    const applyButton = screen.getByText('✨ Plan Long Weekend');
    await user.click(applyButton);

    // Should show loading state
    expect(screen.getByText('Applying...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /applying/i })).toBeDisabled();
  });

  it('shows correct message for Friday holiday (long-monday weekend)', () => {
    const fridaySuggestion = {
      ...mockSuggestion,
      weekendType: 'long-monday' as const,
      holiday: {
        ...mockSuggestion.holiday,
        name: 'Independence Day'
      }
    };

    renderWithProvider(
      <HolidayBanner
        suggestion={fridaySuggestion}
        onDismiss={mockOnDismiss}
        onApply={mockOnApply}
      />
    );

    expect(screen.getByText(/falls on a Friday/)).toBeInTheDocument();
  });

  it('shows correct message for Monday holiday (long-friday weekend)', () => {
    renderWithProvider(
      <HolidayBanner
        suggestion={mockSuggestion}
        onDismiss={mockOnDismiss}
        onApply={mockOnApply}
      />
    );

    expect(screen.getByText(/falls on a Monday/)).toBeInTheDocument();
  });

  it('shows weekend type information', () => {
    renderWithProvider(
      <HolidayBanner
        suggestion={mockSuggestion}
        onDismiss={mockOnDismiss}
        onApply={mockOnApply}
      />
    );

    expect(screen.getByText(/This will switch your planner to Long Friday Weekend mode/)).toBeInTheDocument();
  });

  it('does not render when user already has the same weekend type', () => {
    // Mock the context to return a state with the same weekend type
    const mockContextValue = {
      state: {
        activities: {},
        schedule: [],
        ui: {
          theme: 'default',
          weekendType: 'long-friday',
          customDays: [],
          dismissedHolidaySuggestions: []
        }
      },
      dispatch: vi.fn()
    };

    // We need to mock the useWeekend hook
    vi.doMock('../state/WeekendContext', () => ({
      useWeekend: () => mockContextValue
    }));

    const { container } = renderWithProvider(
      <HolidayBanner
        suggestion={mockSuggestion}
        onDismiss={mockOnDismiss}
        onApply={mockOnApply}
      />
    );

    // Should not render anything
    expect(container.firstChild).toBeNull();
  });
});
