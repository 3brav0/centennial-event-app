import { href, useApp } from '../app';
import { eventView, nextEvent } from '../events';
import { relativeTime } from '../i18n';
import { directionsLink } from '../maps';
import { Chevron, Nav, Pin } from '../icons';
import { LangToggle } from '../components/LangToggle';
import { InstallCard } from '../components/InstallCard';
import { MapLink } from '../components/MapLink';

const BASE = import.meta.env.BASE_URL;

function Countdown({ ms }: { ms: number }) {
  const { t } = useApp();
  const cells = [
    [Math.floor(ms / 86_400_000), t.days],
    [Math.floor((ms % 86_400_000) / 3_600_000), t.hours],
    [Math.floor((ms % 3_600_000) / 60_000), t.mins]
  ] as const;
  return (
    <div class="countdown" role="timer">
      {cells.map(([n, label], i) => (
        <div class="cd-cell" key={label}>
          <div class="cd-num">{i === 0 ? String(n) : String(n).padStart(2, '0')}</div>
          <div class="cd-label">{label}</div>
        </div>
      ))}
    </div>
  );
}

export function Home() {
  const { t, lang, program, now, announcements } = useApp();
  const events = program.events.map((e) => eventView(e, program, lang));
  const { event: next, status } = nextEvent(events, now);
  const latest = announcements.find((a) => !a.pinned) ?? announcements[0];
  const label = status === 'running' ? t.happeningNow : status === 'finished' ? t.finished : t.nextUp;

  return (
    <div class="stack">
      <div class="hero">
        <img src={`${BASE}img/hero.jpg`} alt="Centenario 2026" />
        <div class="hero-top">
          <LangToggle variant="on-image" />
        </div>
      </div>

      <div class="intro">
        <div class="eyebrow">CENTENARIO 2026</div>
        <h1 class="display-34">{t.tagline}</h1>
        <div class="t-14 muted">{t.dates}</div>
      </div>

      <div class="home-body">
        <section class="next-card" aria-label={label}>
          <div class="row between center">
            <div class="eyebrow gold small">{label}</div>
            <div class="t-12 mint">{next.dayShort} · {next.time}</div>
          </div>
          {status === 'upcoming' && <Countdown ms={next.startMs - now} />}
          <div class="stack-6">
            <div class="display-25">{next.title[lang]}</div>
            <div class="row center gap-6 t-14 mint">
              <Pin size={16} />
              <span>{next.venue[lang]}</span>
            </div>
          </div>
          <div class="grid-2">
            <MapLink url={directionsLink(next.mapsQuery)} class="btn-gold">
              <Nav size={18} />
              <span>{t.directions}</span>
            </MapLink>
            <a href={href({ name: 'event', id: next.id })} class="btn-ghost-light">{t.details}</a>
          </div>
        </section>

        {latest && (
          <a href={href({ name: 'live' })} class="card live-teaser">
            <div class="row center gap-8">
              <span class="live-dot" />
              <span class="live-label">{t.liveNow}</span>
              <span class="t-12 faint">· {relativeTime(latest.postedAt, lang, now)}</span>
            </div>
            <div class="t-16 bold lh-13">{latest.title[lang]}</div>
            <div class="t-14 muted lh-145">{latest.body[lang]}</div>
            <div class="row center gap-4 t-14 bold green">
              <span>{t.allNotices}</span>
              <Chevron size={16} />
            </div>
          </a>
        )}

        <section class="stack-10 pt-6">
          <h2 class="eyebrow section">{t.theProgram}</h2>
          <div class="card list">
            {program.days.map((d, i) => {
              const evs = events.filter((e) => e.day === i);
              return (
                <a href={href({ name: 'program', day: i })} class="day-row" key={d.date}>
                  <div class="day-badge">
                    <div class="day-badge-short">{d.short[lang]}</div>
                    <div class="day-badge-num">{d.num}</div>
                  </div>
                  <div class="grow stack-2 min-0">
                    <div class="t-15 bold">{d.long[lang]}</div>
                    <div class="t-13 muted ellipsis">{evs.map((e) => `${e.time} · ${e.venue[lang]}`).join('  ·  ')}</div>
                  </div>
                  <Chevron size={18} stroke="#7A5712" />
                </a>
              );
            })}
          </div>
        </section>

        <InstallCard />
      </div>
    </div>
  );
}
