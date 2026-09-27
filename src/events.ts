import type { EventItem, Program } from './data';
import { formatTime, type Lang } from './i18n';

export function eventView(e: EventItem, program: Program, lang: Lang) {
  const d = program.days[e.day];
  const { hm, ampm } = formatTime(e.start);
  return {
    ...e,
    hm, ampm,
    time: `${hm} ${ampm}`,
    dayShort: `${d.short[lang]} ${d.num}`,
    dayLong: d.long[lang],
    startMs: new Date(e.start).getTime()
  };
}

export type EventView = ReturnType<typeof eventView>;

/** Assume an event is "happening now" for this long after it starts. */
const RUNNING_MS = 2 * 60 * 60 * 1000;

export function nextEvent(events: EventView[], now: number) {
  const running = events.find((e) => now >= e.startMs && now < e.startMs + RUNNING_MS);
  if (running) return { event: running, status: 'running' as const };
  const upcoming = events.find((e) => e.startMs > now);
  if (upcoming) return { event: upcoming, status: 'upcoming' as const };
  return { event: events[events.length - 1], status: 'finished' as const };
}

/** Index of today's day in the program, or 0 outside the event dates. */
export function todayIndex(program: Program, now: number): number {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(now);
  const i = program.days.findIndex((d) => d.date === today);
  return i < 0 ? 0 : i;
}
