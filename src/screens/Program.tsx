import { href, useApp } from '../app';
import { eventView, todayIndex } from '../events';
import { Chevron, Clock, Pin } from '../icons';
import { ScreenHeader } from '../components/Header';
import { ProgramTabs } from '../components/ProgramTabs';
import { VenuePhoto } from '../components/VenuePhoto';
import { WeatherChip } from '../components/Weather';

export function ProgramScreen({ day }: { day?: number }) {
  const { t, lang, program, now } = useApp();
  const selected = day != null && program.days[day] ? day : todayIndex(program, now);
  const events = program.events.map((e) => eventView(e, program, lang));

  return (
    <div class="stack">
      <ScreenHeader title={t.program}>
        <ProgramTabs active="events" />
        <div class="day-chips" role="tablist">
          {program.days.map((d, i) => {
            const count = events.filter((e) => e.day === i).length;
            return (
              <a
                key={d.date}
                href={href({ name: 'program', day: i })}
                role="tab"
                aria-selected={i === selected}
                class={`day-chip${i === selected ? ' on' : ''}`}
                // Switching days shouldn't pile up history entries.
                onClick={(ev) => {
                  ev.preventDefault();
                  history.replaceState(null, '', href({ name: 'program', day: i }));
                  dispatchEvent(new HashChangeEvent('hashchange'));
                }}
              >
                <span class="t-12 bold ls-10">{d.short[lang]}</span>
                <span class="chip-num">{d.num}</span>
                <span class="t-12">{count} {count === 1 ? t.eventsOne : t.eventsMany}</span>
              </a>
            );
          })}
        </div>
        <div class="t-14 mint header-dates">{t.dates}</div>
      </ScreenHeader>

      {/* Phones and tablets show the selected day; desktops show every day side by side. */}
      <div class="container program-body">
        {program.days.map((d, i) => (
          <section class={`day-section${i === selected ? ' selected' : ''}`} key={d.date} aria-label={d.long[lang]}>
            <h2 class="display-24 px-4">{d.long[lang]}</h2>
            <div class="day-events">
              {events.filter((e) => e.day === i).map((e) => (
                <div class="timeline-row" key={e.id}>
                  <div class="timeline-time">
                    <div class="time-hm">{e.hm}</div>
                    <div class="time-ampm">{e.ampm}</div>
                  </div>
                  <a href={href({ name: 'event', id: e.id })} class="card event-card">
                    <VenuePhoto event={e} class="event-card-photo" />
                    <WeatherChip event={e} class="on-photo" />
                    <div class="event-card-content">
                      <div class="row center gap-6 t-13 bold green card-time">
                        <Clock size={15} />
                        <span>{e.time}</span>
                      </div>
                      <div class="eyebrow tiny">{e.category[lang]}</div>
                      <div class="display-23">{e.venue[lang]}</div>
                      <div class="row start gap-6 t-13 muted lh-14">
                        <Pin size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                        <span>{e.address[lang]}</span>
                      </div>
                      <div class="event-card-foot">
                        {e.parking.length > 0 && (
                          <div class="row center gap-6 t-12 bold green">
                            <span class="p-chip">P</span>
                            <span>{t.parkingNearby}</span>
                          </div>
                        )}
                        <div class="row center gap-2 t-13 bold green ml-auto">
                          <span>{t.howToGet}</span>
                          <Chevron size={16} />
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </section>
        ))}
        <p class="t-13 muted tc lh-145 px-4 program-note">{t.subjectToChange}</p>
      </div>
    </div>
  );
}
