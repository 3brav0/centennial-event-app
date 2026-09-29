import { href, useApp } from '../app';

/** Switch between the event schedule and the doctrinal topics, both under the Program tab. */
export function ProgramTabs({ active }: { active: 'events' | 'topics' }) {
  const { t } = useApp();
  return (
    <nav class="segmented" aria-label={t.programViews}>
      <a href={href({ name: 'program' })} class={active === 'events' ? 'on' : ''} aria-current={active === 'events' ? 'page' : undefined}>
        {t.events}
      </a>
      <a href={href({ name: 'topics' })} class={active === 'topics' ? 'on' : ''} aria-current={active === 'topics' ? 'page' : undefined}>
        {t.topics}
      </a>
    </nav>
  );
}
