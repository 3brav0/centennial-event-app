import type { JSX } from 'preact';
import { useApp } from '../app';
import type { EventItem } from '../data';
import { formatTime, relativeTime } from '../i18n';
import { daysUntilForecast, eventWeather, type Condition } from '../weather';

const CLOUD = 'M7 16h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 9.6 3.3 3.3 0 0 0 7 16z';

const shapes: Record<Condition, JSX.Element> = {
  clear: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>,
  partly: <><path d="M8 3v1.5M3.5 8H2M4.8 4.8l1 1M13 4.8l-1 1" /><path d="M5.4 10.6A3.5 3.5 0 0 1 11.2 6.7" /><path d="M9 20h8.5a3.5 3.5 0 0 0 .4-6.97A5 5 0 0 0 8.4 13.2 3.4 3.4 0 0 0 9 20z" /></>,
  cloudy: <path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 11.6 3.3 3.3 0 0 0 7 18z" />,
  fog: <path d="M4 9h16M3 13h18M5 17h14" />,
  drizzle: <><path d={CLOUD} /><path d="M9 19.5v.01M12 20.5v.01M15 19.5v.01" /></>,
  rain: <><path d={CLOUD} /><path d="M9 19l-1 2.5M13 19l-1 2.5M17 19l-1 2.5" /></>,
  storm: <><path d={CLOUD} /><path d="m12.5 17-2 3h3l-2 3" /></>,
  snow: <><path d={CLOUD} /><path d="M9 20h.01M12 21h.01M15 20h.01" /></>
};

export function WeatherIcon({ condition, size = 20 }: { condition: Condition; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      {shapes[condition]}
    </svg>
  );
}

/** Compact "☀ 88°" badge for cards; renders nothing until a forecast exists. */
export function WeatherChip({ event, class: cls = '' }: { event: EventItem; class?: string }) {
  const { weather, lang, t } = useApp();
  const w = eventWeather(weather, event, lang);
  if (!w) return null;
  return (
    <span class={`weather-chip ${cls}`} title={t.cond[w.condition]}>
      <WeatherIcon condition={w.condition} size={16} />
      <span>{w.temp}°</span>
      <span class="sr-only">{t.cond[w.condition]}</span>
    </span>
  );
}

export function WeatherCard({ event, class: cls = '' }: { event: EventItem; class?: string }) {
  const { weather, lang, t, now } = useApp();
  const end = new Date(event.start).getTime() + (event.durationHours ?? 3) * 3_600_000;
  if (now > end || !weather) return null;
  const w = eventWeather(weather, event, lang);
  const waitDays = daysUntilForecast(event, now);
  if (!w && waitDays === 0) return null;

  const from = formatTime(event.start);
  const to = formatTime(new Date(end).toISOString());

  return (
    <section class={`stack-10 ${cls}`}>
      <h2 class="eyebrow section">{t.weather}</h2>
      <div class="card pad-16 stack-14">
        {!w ? (
          <div class="t-14 muted">{t.forecastIn(waitDays)}</div>
        ) : (
          <>
            <div class="row center gap-14">
              <div class="icon-tile dark weather-tile"><WeatherIcon condition={w.condition} size={26} /></div>
              <div class="weather-temp">{w.temp}°</div>
              <div class="stack-2 min-0">
                <div class="t-15 bold">{t.cond[w.condition]}</div>
                <div class="t-13 muted">
                  {t.forecastFor} {from.hm} {from.ampm} – {to.hm} {to.ampm}
                </div>
              </div>
            </div>
            <div class="weather-stats">
              <div><span class="t-12 muted">{t.feelsLike}</span><span class="t-15 bold">{w.feelsLike}°</span></div>
              <div><span class="t-12 muted">{t.rain}</span><span class="t-15 bold">{w.rainChance}%</span></div>
              {event.outdoor ? (
                <div><span class="t-12 muted">UV</span><span class="t-15 bold">{w.uv}</span></div>
              ) : (
                <div><span class="t-12 muted">{t.wind}</span><span class="t-15 bold">{w.wind} mph</span></div>
              )}
            </div>
            <ul class="weather-tips">
              {(w.tips.length ? w.tips : [event.outdoor ? t.niceOutdoor : t.niceIndoor]).map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </>
        )}
        <div class="row between wrap gap-8 t-12 faint">
          <span>{t.weatherUpdated} {relativeTime(new Date(weather.fetchedAt).toISOString(), lang, now)}</span>
          <a href="https://open-meteo.com/" target="_blank" rel="noopener" class="weather-credit">{t.weatherSource}</a>
        </div>
      </div>
    </section>
  );
}
