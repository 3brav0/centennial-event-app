import { useEffect, useRef, useState } from 'preact/hooks';
import type { Lang, Localized } from './i18n';

export interface Day {
  date: string;
  short: Localized;
  num: string;
  long: Localized;
}

export interface Parking {
  name: Localized;
  address: string;
  kind: string;
  cost: string;
  mapsQuery?: string;
}

export interface VenueImage {
  /** Path relative to the site root, e.g. img/venues/liberty-plaza.jpg */
  src: string;
  credit?: string;
  license?: string;
  source?: string;
  /** CSS object-position, to keep the subject in frame when cropped. */
  position?: string;
}

export interface EventItem {
  id: string;
  day: number;
  start: string;
  category: Localized;
  title: Localized;
  venue: Localized;
  address: Localized;
  mapsQuery: string;
  /** Venue location, used for the weather forecast. */
  coords: { lat: number; lng: number };
  /** Outdoor events get sun/heat/cold tips; indoor ones only travel tips. */
  outdoor: boolean;
  /** How long the event runs; the forecast covers these hours. Defaults to 3. */
  durationHours?: number;
  image: VenueImage | null;
  info: Localized[];
  parkingNote: Localized | null;
  parking: Parking[];
  transit: { title: Localized; body: Localized } | null;
}

export interface Program {
  days: Day[];
  events: EventItem[];
}

export interface Announcement {
  id: string;
  pinned: boolean;
  type: 'important' | 'logistics';
  postedAt: string;
  title: Localized;
  body: Localized;
}

const BASE = import.meta.env.BASE_URL;
// Announcements can be served from anywhere (e.g. a CMS or a raw GitHub URL)
// by setting VITE_ANNOUNCEMENTS_URL at build time.
const ANNOUNCEMENTS_URL = import.meta.env.VITE_ANNOUNCEMENTS_URL || `${BASE}data/announcements.json`;
const POLL_MS = 60_000;

async function getJson<T>(url: string): Promise<T> {
  const sep = url.includes('?') ? '&' : '?';
  const res = await fetch(`${url}${sep}t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

export function useProgram() {
  const [program, setProgram] = useState<Program | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    getJson<Program>(`${BASE}data/events.json`)
      .then((p) => {
        p.events.sort((a, b) => a.start.localeCompare(b.start));
        setProgram(p);
      })
      .catch(() => setError(true));
  }, []);
  return { program, error };
}

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStore(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) — state just won't persist */
  }
}

async function notify(a: Announcement, lang: Lang) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const reg = await navigator.serviceWorker?.getRegistration();
  const opts = { body: a.body[lang], icon: `${BASE}icons/icon-192.png`, badge: `${BASE}icons/favicon-64.png`, tag: a.id };
  if (reg) reg.showNotification(a.title[lang], opts);
  else new Notification(a.title[lang], opts);
}

export function useAnnouncements(lang: Lang, notifyEnabled: boolean) {
  const [items, setItems] = useState<Announcement[]>(() => readStore('ann.cache', []));
  const [offline, setOffline] = useState(false);
  const known = useRef<Set<string> | null>(null);
  const langRef = useRef(lang);
  const notifyRef = useRef(notifyEnabled);
  langRef.current = lang;
  notifyRef.current = notifyEnabled;

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await getJson<{ announcements: Announcement[] }>(ANNOUNCEMENTS_URL);
        if (!alive) return;
        const list = [...data.announcements].sort(
          (a, b) => Number(b.pinned) - Number(a.pinned) || b.postedAt.localeCompare(a.postedAt)
        );
        // First load only establishes the baseline; later polls notify for new ids.
        if (known.current && notifyRef.current) {
          list.filter((a) => !known.current!.has(a.id)).forEach((a) => notify(a, langRef.current));
        }
        known.current = new Set(list.map((a) => a.id));
        setItems(list);
        setOffline(false);
        writeStore('ann.cache', list);
      } catch {
        if (alive) setOffline(true);
      }
    };
    load();
    const timer = setInterval(load, POLL_MS);
    const onVisible = () => document.visibilityState === 'visible' && load();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', load);
    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', load);
    };
  }, []);

  return { items, offline };
}
