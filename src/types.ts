export type Day = 'saturday' | 'sunday';
export interface Activity {
  id: string;
  title: string;
  category?: 'food'|'outdoor'|'relax'|'entertainment'|'custom';
  durationMinutes?: number;
  start?: string | null;
  mood?: string;
  color?: string;
  imageUrl?: string;
  notes?: string;
}
export interface ScheduledItem {
  id: string;
  activityId: string;
  day: Day;
  startISO: string;
  durationMinutes: number;
}
export interface WeekendlyState {
  activities: Record<string, Activity>;
  schedule: ScheduledItem[];
  ui: { selectedActivityId?: string; theme: string; };
}
