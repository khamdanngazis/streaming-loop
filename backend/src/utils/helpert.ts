export function convertScheduleToUtc(schedule: string): string {
  // If input has timezone info (like +07:00 or Z), new Date() will handle it
  // If input is local time (no offset), it will be treated as server local time, so you may want to add default offset handling
  const date = new Date(schedule);
  // toISOString() always returns UTC
  return date.toISOString();
}