import { href, useApp } from '../app';
import { Bell, Calendar, Home } from '../icons';

export function BottomNav({ active }: { active: 'home' | 'program' | 'live' }) {
  const { t, unread } = useApp();
  const tab = (key: typeof active) => ({ class: `tab${active === key ? ' on' : ''}`, 'aria-current': active === key ? ('page' as const) : undefined });
  return (
    <nav class="bottom-nav" aria-label={t.navAria}>
      <a href={href({ name: 'home' })} {...tab('home')}>
        <Home size={24} />
        <span>{t.home}</span>
      </a>
      <a href={href({ name: 'program' })} {...tab('program')}>
        <Calendar size={24} />
        <span>{t.program}</span>
      </a>
      <a href={href({ name: 'live' })} {...tab('live')}>
        <span class="tab-icon">
          <Bell size={24} />
          {unread > 0 && <span class="badge">{unread}</span>}
        </span>
        <span>{t.notices}</span>
      </a>
    </nav>
  );
}
