import { useState } from 'preact/hooks';
import { useApp } from '../app';
import { relativeTime } from '../i18n';
import { detectPlatform } from '../maps';
import { isStandalone } from '../install';
import { Bell } from '../icons';
import { ScreenHeader } from '../components/Header';

type Filter = 'all' | 'important' | 'logistics';

function NotifToggle() {
  const { t, notifOn, setNotifOn } = useApp();
  const [msg, setMsg] = useState<string | null>(null);
  const supported = 'Notification' in window;

  const toggle = async () => {
    if (notifOn) return setNotifOn(false);
    if (!supported) {
      // iOS only exposes notifications to web apps added to the Home Screen.
      setMsg(detectPlatform() === 'ios' && !isStandalone() ? t.notifIos : t.notifDenied);
      return;
    }
    const perm = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission;
    if (perm === 'granted') {
      setMsg(null);
      setNotifOn(true);
    } else {
      setMsg(t.notifDenied);
    }
  };

  return (
    <div class="notif-box">
      <div class="row center gap-12">
        <Bell size={22} stroke="#E8C872" style={{ flexShrink: 0 }} />
        <div class="grow t-13 lh-135 mint-light">{msg ?? t.notifBody}</div>
        <button type="button" class={`notif-btn${notifOn ? ' on' : ''}`} onClick={toggle} aria-pressed={notifOn}>
          {notifOn ? t.notifOn : t.notifOff}
        </button>
      </div>
    </div>
  );
}

export function LiveScreen() {
  const { t, lang, now, announcements, offline } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const shown = announcements.filter((a) => filter === 'all' || a.type === filter);
  const filters: [Filter, string][] = [['all', t.all], ['important', t.important], ['logistics', t.logistics]];

  return (
    <div class="stack">
      <ScreenHeader title={t.notices}>
        <div class="row center gap-8 t-13 mint" role="status">
          <span class={`live-dot light${offline ? ' off' : ''}`} />
          <span>{offline ? t.offline : t.liveUpdated}</span>
        </div>
        <NotifToggle />
      </ScreenHeader>

      <div class="live-body">
        <div class="row gap-8" role="group">
          {filters.map(([k, label]) => (
            <button type="button" key={k} class={`filter${filter === k ? ' on' : ''}`} aria-pressed={filter === k} onClick={() => setFilter(k)}>
              {label}
            </button>
          ))}
        </div>

        <div aria-live="polite" class="stack-12">
          {shown.length > 0 ? (
            shown.map((a) => (
              <article class={`notice${a.pinned ? ' pinned' : ''}`} key={a.id}>
                <div class="row center gap-8 wrap">
                  {a.pinned && <span class="pill pinned-pill">{t.pinned}</span>}
                  <span class={`pill ${a.type === 'important' ? 'orange-pill' : 'green-pill'}`}>
                    {a.type === 'important' ? t.important : t.logistics}
                  </span>
                  <time class="t-12 faint ml-auto" dateTime={a.postedAt}>{relativeTime(a.postedAt, lang, now)}</time>
                </div>
                <h2 class="t-16 bold lh-13">{a.title[lang]}</h2>
                <p class="t-14 muted lh-15">{a.body[lang]}</p>
              </article>
            ))
          ) : (
            <div class="empty">
              <img src={`${import.meta.env.BASE_URL}img/crest.png`} alt="" width={72} height={72} />
              <div class="t-15 bold">{t.emptyTitle}</div>
              <div class="t-13 muted">{t.emptyBody}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
