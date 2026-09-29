import { useApp } from '../app';
import type { Session } from '../data';
import { formatTime } from '../i18n';

/** Timeline of an event's doctrinal topics and ceremonies. */
export function SessionList({ sessions }: { sessions: Session[] }) {
  const { t, lang } = useApp();
  return (
    <ol class="session-list">
      {sessions.map((s) => {
        const from = formatTime(s.start);
        const to = formatTime(s.end);
        return (
          <li class={`session ${s.kind}`} key={s.start}>
            <div class="session-time">
              <span class="time-hm">{from.hm}</span>
              <span class="time-ampm">{from.ampm}</span>
              <span class="session-until">– {to.hm} {to.ampm}</span>
            </div>
            <div class="session-card">
              <div class="eyebrow tiny">{s.kind === 'topic' ? t.topicLabel : t.ceremony}</div>
              <h3 class="session-title">{s.title[lang]}</h3>
              {s.subtitle && <p class="session-sub">{s.subtitle[lang]}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
