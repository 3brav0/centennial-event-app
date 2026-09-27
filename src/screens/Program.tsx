import { href, useApp } from '../app';
import { eventView, todayIndex } from '../events';
import { Chevron, Pin } from '../icons';
import { ScreenHeader } from '../components/Header';

export function ProgramScreen({ day }: { day?: number }) {
  const { t, lang, program, now } = useApp();
  const selected = day != null && program.days[day] ? day : todayIndex(program, now);
  const events = program.events.map((e) => eventView(e, program, lang));
  const dayEvents = events.filter((e) => e.day === selected);

  return (
    <div class="stack">
      <ScreenHeader title={t.program}>
        <div class="grid-3" role="tablist">
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
      </ScreenHeader>

      <div class="program-body">
        <h2 class="display-24 px-4">{program.days[selected].long[lang]}</h2>
        {dayEvents.map((e) => (
          <div class="timeline-row" key={e.id}>
            <div class="timeline-time">
              <div class="time-hm">{e.hm}</div>
              <div class="time-ampm">{e.ampm}</div>
            </div>
            <a href={href({ name: 'event', id: e.id })} class="card event-card">
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
            </a>
          </div>
        ))}
        <p class="t-13 muted tc lh-145 px-4">{t.subjectToChange}</p>
      </div>
    </div>
  );
}
