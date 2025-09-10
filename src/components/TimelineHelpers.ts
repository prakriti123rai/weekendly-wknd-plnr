export const BASE_HOUR = 0; // Start from midnight (0:00)
export const PIXELS_PER_HOUR = 60;

export function isoToTop(iso: string) {
  const d = new Date(iso);
  const minutes = d.getHours() * 60 + d.getMinutes();
  return ((minutes - BASE_HOUR * 60) / 60) * PIXELS_PER_HOUR;
}

export function minutesToHeight(mins: number) {
  return (mins / 60) * PIXELS_PER_HOUR;
}

export function yToTime(y: number) {
  const minutesSinceBase = (y / PIXELS_PER_HOUR) * 60 + BASE_HOUR * 60;
  const hours = Math.floor(minutesSinceBase / 60);
  const minutes = Math.floor(minutesSinceBase % 60);
  
  // Clamp to valid time range (0-23 hours, 0-59 minutes)
  const clampedHours = Math.max(0, Math.min(23, hours));
  const clampedMinutes = Math.max(0, Math.min(59, minutes));
  
  return { hours: clampedHours, minutes: clampedMinutes };
}
