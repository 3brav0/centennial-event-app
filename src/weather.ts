import { useEffect, useRef, useState } from 'preact/hooks';
import type { EventItem } from './data';
import { readStore, writeStore } from './data';
import type { Lang } from './i18n';

// Forecasts come from Open-Meteo (https://open-meteo.com): free, no API key,
// callable from the browser. One request covers every venue.

const REFRESH_MS = 30 * 60_000;
/** Forecast window when an event doesn't set durationHours. */
const DEFAULT_HOURS = 3;
/** Open-Meteo forecasts this many days ahead. */
export const FORECAST_DAYS = 16;

const HOURLY = ['temperature_2m', 'apparent_temperature', 'precipitation_probability', 'weather_code', 'uv_index', 'wind_speed_10m'] as const;
type Hourly = Record<(typeof HOURLY)[number], number[]> & { time: string[] };

interface Cache {
  fetchedAt: number;
  /** Keyed by "lat,lng". */
  byPlace: Record<string, Hourly>;
}

export type Condition = 'clear' | 'partly' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'storm' | 'snow';

export interface EventWeather {
  condition: Condition;
  temp: number;
  tempMin: number;
  feelsLike: number;
  rainChance: number;
  uv: number;
  wind: number;
  tips: string[];
}

const placeKey = (e: EventItem) => `${e.coords.lat},${e.coords.lng}`;

// Worst condition wins, so a stormy hour in the window isn't hidden by sunny ones.
const SEVERITY: Condition[] = ['clear', 'partly', 'cloudy', 'fog', 'drizzle', 'snow', 'rain', 'storm'];

function conditionFor(code: number): Condition {
  if (code === 0) return 'clear';
  if (code <= 2) return 'partly';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'cloudy';
}

async function fetchForecast(events: EventItem[]): Promise<Cache> {
  const places = [...new Map(events.map((e) => [placeKey(e), e.coords])).entries()];
  const params = new URLSearchParams({
    latitude: places.map(([, c]) => c.lat).join(','),
    longitude: places.map(([, c]) => c.lng).join(','),
    hourly: HOURLY.join(','),
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timezone: 'America/New_York',
    forecast_days: String(FORECAST_DAYS)
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`weather ${res.status}`);
  const json = await res.json();
  // A single location comes back as an object, several as an array.
  const list: { hourly: Hourly }[] = Array.isArray(json) ? json : [json];
  const byPlace: Record<string, Hourly> = {};
  places.forEach(([key], i) => (byPlace[key] = list[i].hourly));
  return { fetchedAt: Date.now(), byPlace };
}

/** "2026-10-02T14:00:00-04:00" → "2026-10-02T14:00", Open-Meteo's local-time key. */
function localHourKey(ms: number): string {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23'
    }).formatToParts(ms).map((x) => [x.type, x.value])
  );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:00`;
}

function tipsFor(w: Omit<EventWeather, 'tips'>, outdoor: boolean, lang: Lang): string[] {
  const L = (es: string, en: string) => (lang === 'en' ? en : es);
  const tips: string[] = [];
  if (w.condition === 'storm') {
    tips.push(L('Posibles tormentas: revisa la sección de Avisos antes de salir.', 'Storms possible: check Announcements before you head out.'));
  }
  if (w.rainChance >= 40) {
    tips.push(outdoor
      ? L('Trae paraguas o impermeable y calzado que se pueda mojar.', 'Bring an umbrella or poncho and shoes that can get wet.')
      : L('Sal con tiempo: la lluvia hace más lento el tráfico.', 'Leave early: rain slows down traffic.'));
  }
  if (!outdoor) return tips;
  if (w.temp >= 85 || w.feelsLike >= 90) {
    tips.push(L('Hará calor: trae agua, gorra y ropa ligera.', "It'll be hot: bring water, a hat and light clothing."));
  }
  if (w.uv >= 6) tips.push(L('Sol intenso: usa protector solar y lentes de sol.', 'Strong sun: wear sunscreen and sunglasses.'));
  if (w.tempMin <= 60) tips.push(L('Refrescará: trae un suéter o chaqueta.', "It'll get cool: bring a sweater or jacket."));
  if (w.wind >= 20) tips.push(L('Viento fuerte: asegura gorras y objetos sueltos.', 'Windy: hold on to hats and loose items.'));
  return tips;
}

/** Forecast for the hours an event runs, or null when that's outside the forecast range. */
export function eventWeather(cache: Cache | null, e: EventItem, lang: Lang): EventWeather | null {
  const hourly = cache?.byPlace[placeKey(e)];
  if (!hourly) return null;
  const start = new Date(e.start).getTime();
  const hours = e.durationHours ?? DEFAULT_HOURS;
  const idx: number[] = [];
  for (let h = 0; h < hours; h++) {
    const i = hourly.time.indexOf(localHourKey(start + h * 3_600_000));
    if (i >= 0) idx.push(i);
  }
  if (idx.length === 0) return null;
  const pick = (k: (typeof HOURLY)[number]) => idx.map((i) => hourly[k][i]).filter((v) => v != null);
  const max = (k: (typeof HOURLY)[number]) => Math.round(Math.max(...pick(k)));
  const base = {
    condition: pick('weather_code').map(conditionFor).reduce((a, b) => (SEVERITY.indexOf(b) > SEVERITY.indexOf(a) ? b : a), 'clear' as Condition),
    temp: max('temperature_2m'),
    tempMin: Math.round(Math.min(...pick('temperature_2m'))),
    feelsLike: max('apparent_temperature'),
    rainChance: max('precipitation_probability'),
    uv: max('uv_index'),
    wind: max('wind_speed_10m')
  };
  return { ...base, tips: tipsFor(base, e.outdoor, lang) };
}

/** Days until an event's forecast becomes available (0 once it's in range). */
export function daysUntilForecast(e: EventItem, now: number): number {
  const days = (new Date(e.start).getTime() - now) / 86_400_000;
  return Math.max(0, Math.ceil(days - (FORECAST_DAYS - 1)));
}

export function useWeather(events: EventItem[] | undefined) {
  const [cache, setCache] = useState<Cache | null>(() => readStore<Cache | null>('weather', null));
  const fetchedAt = useRef(cache?.fetchedAt ?? 0);
  useEffect(() => {
    if (!events?.length) return;
    let alive = true;
    const load = async () => {
      try {
        const next = await fetchForecast(events);
        if (!alive) return;
        fetchedAt.current = next.fetchedAt;
        setCache(next);
        writeStore('weather', next);
      } catch {
        /* offline or API down: keep showing the last forecast */
      }
    };
    const stale = () => Date.now() - fetchedAt.current > REFRESH_MS;
    if (stale()) load();
    const timer = setInterval(load, REFRESH_MS);
    const onVisible = () => document.visibilityState === 'visible' && stale() && load();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [events]);
  return cache;
}

export type WeatherCache = Cache;
