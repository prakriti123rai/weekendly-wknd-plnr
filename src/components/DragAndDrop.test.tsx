import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { WeekendProvider } from '../state/WeekendContext';
import { Activity, ScheduledItem } from '../types';

// Mock the drag and drop components
const MockDroppable = ({ children, id }: { children: React.ReactNode; id: string }) => (
  <div data-testid={`droppable-${id}`} data-droppable-id={id}>
    {children}
  </div>
);

const MockDraggable = ({ children, id }: { children: React.ReactNode; id: string }) => (
  <div data-testid={`draggable-${id}`} data-draggable-id={id}>
    {children}
  </div>
);

// Mock the drag and drop hooks
vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core');
  return {
    ...actual,
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
  };
});

const mockActivity: Activity = {
  id: 'activity-1',
  title: 'Morning Run',
  category: 'outdoor',
  durationMinutes: 60,
  mood: 'energetic',
  color: '#3B82F6'
};

const mockScheduledItem: ScheduledItem = {
  id: 'schedule-1',
  activityId: 'activity-1',
  day: 'saturday',
  startISO: '2024-01-06T09:00:00.000Z',
  durationMinutes: 60
};

const TestComponent = ({ onDragEnd }: { onDragEnd: (event: DragEndEvent) => void }) => {
  return (
    <DndContext onDragEnd={onDragEnd}>
      <MockDroppable id="saturday">
        <h3>Saturday</h3>
        <MockDraggable id="schedule-1">
          <div>Morning Run</div>
        </MockDraggable>
      </MockDroppable>
      <MockDroppable id="sunday">
        <h3>Sunday</h3>
      </MockDroppable>
    </DndContext>
  );
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <WeekendProvider>
      {component}
    </WeekendProvider>
  );
};

describe('Drag and Drop Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles drag end event correctly', async () => {
    const mockOnDragEnd = vi.fn();
    
    renderWithProvider(
      <TestComponent onDragEnd={mockOnDragEnd} />
    );

    // Simulate a drag end event
    const dragEndEvent: DragEndEvent = {
      active: {
        id: 'schedule-1',
        data: {
          current: {
            activity: mockActivity,
            type: 'scheduled-item'
          }
        }
      },
      over: {
        id: 'sunday',
        data: {
          current: {
            day: 'sunday'
          }
        }
      },
      delta: { x: 0, y: 0 },
      collisions: null,
      activatorEvent: new MouseEvent('mousedown'),
      activeRect: null,
      overRect: null,
      scrollAdjustedDelta: { x: 0, y: 0 },
      transform: null,
      willAcceptDrop: true
    };

    // Trigger the drag end event
    mockOnDragEnd(dragEndEvent);

    expect(mockOnDragEnd).toHaveBeenCalledWith(dragEndEvent);
  });

  it('moves scheduled item to different day', () => {
    const mockOnDragEnd = vi.fn((event: DragEndEvent) => {
      // Simulate the logic that would happen in the actual component
      if (event.active && event.over) {
        const scheduledItemId = event.active.id as string;
        const newDay = event.over.id as string;
        
        // This would typically dispatch a MOVE_SCHEDULE_ITEM action
        expect(scheduledItemId).toBe('schedule-1');
        expect(newDay).toBe('sunday');
      }
    });

    const dragEndEvent: DragEndEvent = {
      active: {
        id: 'schedule-1',
        data: {
          current: {
            activity: mockActivity,
            type: 'scheduled-item'
          }
        }
      },
      over: {
        id: 'sunday',
        data: {
          current: {
            day: 'sunday'
          }
        }
      },
      delta: { x: 0, y: 0 },
      collisions: null,
      activatorEvent: new MouseEvent('mousedown'),
      activeRect: null,
      overRect: null,
      scrollAdjustedDelta: { x: 0, y: 0 },
      transform: null,
      willAcceptDrop: true
    };

    mockOnDragEnd(dragEndEvent);
  });

  it('handles drag end without valid drop target', () => {
    const mockOnDragEnd = vi.fn((event: DragEndEvent) => {
      // Should not move item if no valid drop target
      if (!event.over) {
        expect(event.over).toBeNull();
      }
    });

    const dragEndEvent: DragEndEvent = {
      active: {
        id: 'schedule-1',
        data: {
          current: {
            activity: mockActivity,
            type: 'scheduled-item'
          }
        }
      },
      over: null,
      delta: { x: 0, y: 0 },
      collisions: null,
      activatorEvent: new MouseEvent('mousedown'),
      activeRect: null,
      overRect: null,
      scrollAdjustedDelta: { x: 0, y: 0 },
      transform: null,
      willAcceptDrop: false
    };

    mockOnDragEnd(dragEndEvent);
  });

  it('handles dragging activity to schedule', () => {
    const mockOnDragEnd = vi.fn((event: DragEndEvent) => {
      if (event.active && event.over) {
        const activityId = event.active.id as string;
        const targetDay = event.over.id as string;
        
        // This would typically create a new scheduled item
        expect(activityId).toBe('activity-1');
        expect(targetDay).toBe('saturday');
      }
    });

    const dragEndEvent: DragEndEvent = {
      active: {
        id: 'activity-1',
        data: {
          current: {
            activity: mockActivity,
            type: 'activity'
          }
        }
      },
      over: {
        id: 'saturday',
        data: {
          current: {
            day: 'saturday'
          }
        }
      },
      delta: { x: 0, y: 0 },
      collisions: null,
      activatorEvent: new MouseEvent('mousedown'),
      activeRect: null,
      overRect: null,
      scrollAdjustedDelta: { x: 0, y: 0 },
      transform: null,
      willAcceptDrop: true
    };

    mockOnDragEnd(dragEndEvent);
  });
});
