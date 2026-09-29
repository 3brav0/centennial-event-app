import { href, useApp } from '../app';
import { eventView } from '../events';
import { Chevron, Pin } from '../icons';
import { ScreenHeader } from '../components/Header';
import { ProgramTabs } from '../components/ProgramTabs';
import { SessionList } from '../components/SessionList';

export function TopicsScreen() {
  const { t, lang, program } = useApp();
  const events = program.events.filter((e) => e.sessions?.length).map((e) => eventView(e, program, lang));

  return (
    <div class="stack">
      <ScreenHeader title={t.program}>
        <ProgramTabs active="topics" />
      </ScreenHeader>

      <div class="container topics-body">
        <div class="topics-intro">
          <h2 class="display-30">{t.doctrinalTopics}</h2>
          <div class="t-14 muted">{t.topicsSede}</div>
        </div>
        <div class="topic-groups">
          {events.map((e) => (
            <section class="topic-group" key={e.id} aria-label={e.dayLong}>
              <div class="topic-group-head">
                <h3 class="display-24">{e.dayLong}</h3>
                <a href={href({ name: 'event', id: e.id })} class="topic-venue">
                  <Pin size={16} />
                  <span class="grow">{e.venue[lang]}</span>
                  <span class="t-13 bold green row center gap-2">{t.viewEvent}<Chevron size={16} /></span>
                </a>
              </div>
              <SessionList sessions={e.sessions!} />
            </section>
          ))}
        </div>
        <p class="t-13 muted tc lh-145 px-4">{t.subjectToChange}</p>
      </div>
    </div>
  );
}
