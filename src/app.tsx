import { createContext } from 'preact';
import { useContext, useEffect, useMemo, useState } from 'preact/hooks';
import { strings, type Lang, type Strings } from './i18n';
import { readStore, useAnnouncements, useProgram, writeStore, type Announcement, type Program } from './data';
import { Home } from './screens/Home';
import { ProgramScreen } from './screens/Program';
import { EventScreen } from './screens/Event';
import { LiveScreen } from './screens/Live';
import { TopicsScreen } from './screens/Topics';
import { SiteFooter } from './components/SiteFooter';
import { BottomNav, TopBar } from './components/BottomNav';
import { useWeather, type WeatherCache } from './weather';

export type Route =
  | { name: 'home' }
  | { name: 'program'; day?: number }
  | { name: 'topics' }
  | { name: 'event'; id: string }
  | { name: 'live' };

function parseHash(hash: string): Route {
  const [, name, arg] = hash.replace(/^#\/?/, '/').split('/');
  if (name === 'program') return { name: 'program', day: arg ? Number(arg) : undefined };
  if (name === 'event' && arg) return { name: 'event', id: decodeURIComponent(arg) };
  if (name === 'live') return { name: 'live' };
  if (name === 'topics') return { name: 'topics' };
  return { name: 'home' };
}

export function href(r: Route): string {
  switch (r.name) {
    case 'home': return '#/';
    case 'program': return r.day == null ? '#/program' : `#/program/${r.day}`;
    case 'event': return `#/event/${encodeURIComponent(r.id)}`;
    case 'live': return '#/live';
    case 'topics': return '#/topics';
  }
}

interface Ctx {
  lang: Lang;
  t: Strings;
  toggleLang: () => void;
  program: Program;
  now: number;
  announcements: Announcement[];
  offline: boolean;
  unread: number;
  notifOn: boolean;
  weather: WeatherCache | null;
  setNotifOn: (on: boolean) => void;
  /** True once the user has navigated inside the app, so history.back() stays in-app. */
  hasHistory: boolean;
}

const AppContext = createContext<Ctx>(null!);
export const useApp = () => useContext(AppContext);

function useNow(intervalMs: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(location.hash));
  const [hasHistory, setHasHistory] = useState(false);
  const [lang, setLang] = useState<Lang>(() => readStore<Lang>('lang', 'es'));
  const [notifOn, setNotifOnState] = useState<boolean>(() => readStore('notif', false));
  const [seen, setSeen] = useState<string[]>(() => readStore('ann.seen', []));
  const now = useNow(30_000);
  const { program, error } = useProgram();
  const { items: announcements, offline } = useAnnouncements(lang, notifOn);
  const weather = useWeather(program?.events);

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash(location.hash));
      setHasHistory(true);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    writeStore('lang', lang);
  }, [lang]);

  // Viewing the announcements screen marks everything on it as read.
  useEffect(() => {
    if (route.name !== 'live' || announcements.length === 0) return;
    const ids = announcements.map((a) => a.id);
    if (ids.some((id) => !seen.includes(id))) {
      setSeen(ids);
      writeStore('ann.seen', ids);
    }
  }, [route.name, announcements]);

  const unread = useMemo(
    () => announcements.filter((a) => !a.pinned && !seen.includes(a.id)).length,
    [announcements, seen]
  );

  const t = strings[lang];

  if (!program) {
    return (
      <div class="app">
        <div class="loading">
          <img src={`${import.meta.env.BASE_URL}img/crest.png`} alt="" width={96} />
          {error && <p>{t.loadError}</p>}
        </div>
      </div>
    );
  }

  const ctx: Ctx = {
    lang, t, program, now, announcements, offline, unread, notifOn, hasHistory, weather,
    toggleLang: () => setLang(lang === 'es' ? 'en' : 'es'),
    setNotifOn: (on) => {
      setNotifOnState(on);
      writeStore('notif', on);
    }
  };

  return (
    <AppContext.Provider value={ctx}>
      <div class="app">
        <TopBar active={route.name === 'event' || route.name === 'topics' ? 'program' : route.name} />
        <main class="screen">
          {route.name === 'home' && <Home />}
          {route.name === 'program' && <ProgramScreen day={route.day} />}
          {route.name === 'event' && <EventScreen id={route.id} />}
          {route.name === 'live' && <LiveScreen />}
          {route.name === 'topics' && <TopicsScreen />}
          <SiteFooter />
        </main>
        <BottomNav active={route.name === 'event' || route.name === 'topics' ? 'program' : route.name} />
      </div>
    </AppContext.Provider>
  );
}
