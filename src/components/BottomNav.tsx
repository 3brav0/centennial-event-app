import { href, useApp } from '../app';
import { Bell, Calendar, Home } from '../icons';
import { LangToggle } from './LangToggle';

type Tab = 'home' | 'program' | 'live';

function NavLinks({ active, iconSize }: { active: Tab; iconSize: number }) {
  const { t, unread } = useApp();
  const tab = (key: Tab) => ({ class: `tab${active === key ? ' on' : ''}`, 'aria-current': active === key ? ('page' as const) : undefined });
  return (
    <>
      <a href={href({ name: 'home' })} {...tab('home')}>
        <Home size={iconSize} />
        <span>{t.home}</span>
      </a>
      <a href={href({ name: 'program' })} {...tab('program')}>
        <Calendar size={iconSize} />
        <span>{t.program}</span>
      </a>
      <a href={href({ name: 'live' })} {...tab('live')}>
        <span class="tab-icon">
          <Bell size={iconSize} />
          {unread > 0 && <span class="badge">{unread}</span>}
        </span>
        <span>{t.notices}</span>
      </a>
    </>
  );
}

/** Phone navigation, pinned to the bottom of the screen. Hidden on tablet and desktop. */
export function BottomNav({ active }: { active: Tab }) {
  const { t } = useApp();
  return (
    <nav class="bottom-nav" aria-label={t.navAria}>
      <NavLinks active={active} iconSize={24} />
    </nav>
  );
}

/** Tablet and desktop navigation bar. Hidden on phones. */
export function TopBar({ active }: { active: Tab }) {
  const { t } = useApp();
  return (
    <header class="topbar">
      <div class="container topbar-inner">
        <a href={href({ name: 'home' })} class="brand">
          <img src={`${import.meta.env.BASE_URL}img/crest.png`} alt="" width={34} height={36} />
          <span>CENTENARIO 2026</span>
        </a>
        <nav class="top-nav" aria-label={t.navAria}>
          <NavLinks active={active} iconSize={20} />
        </nav>
        <LangToggle />
      </div>
    </header>
  );
}
