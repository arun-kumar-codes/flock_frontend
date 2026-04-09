/** Minimum lead before publish; keep in sync with Scheduler UI copy and backend rules. */
export const SCHEDULE_MIN_LEAD_MS = 5 * 60 * 1000;

/**
 * Ensures the scheduled instant is at least {@link SCHEDULE_MIN_LEAD_MS} ahead of "now"
 * at submit time. The picker can store a time that was valid when chosen but is slightly
 * too soon by the time the user submits (stale clock in Scheduler, upload delay, etc.).
 */
export function resolveScheduledAt(at: Date): Date {
  const min = Date.now() + SCHEDULE_MIN_LEAD_MS;
  return new Date(Math.max(at.getTime(), min));
}
