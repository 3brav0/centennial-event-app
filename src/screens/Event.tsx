import { useState } from 'preact/hooks';
import { href, useApp } from '../app';
import { eventView } from '../events';
import { detectPlatform, mapLinks } from '../maps';
import { Back, Bus, Calendar, Clock, Copy, Info, Nav, Pin } from '../icons';
import { LangToggle } from '../components/LangToggle';
import { MapLink } from '../components/MapLink';

const BASE = import.meta.env.BASE_URL;

export function EventScreen({ id }: { id: string }) {
  const { t, lang, program, hasHistory } = useApp();
  const [copied, setCopied] = useState(false);
  const raw = program.events.find((e) => e.id === id);
  if (!raw) {
    location.replace(href({ name: 'program' }));
    return null;
  }
  const ev = eventView(raw, program, lang);
  const android = detectPlatform() === 'android';

  const back = () => {
    if (hasHistory) history.back();
    else location.hash = href({ name: 'program', day: ev.day });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${ev.venue[lang]}, ${ev.address[lang]}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked — leave the address visible for manual copy */
    }
  };

  return (
    <div class="stack">
      <header class="event-header">
        <img class="event-crest" src={`${BASE}img/crest.png`} alt="" />
        <div class="row between center rel">
          <button type="button" class="back-btn" onClick={back}>
            <Back size={20} />
            <span>{t.program}</span>
          </button>
          <LangToggle />
        </div>
        <div class="stack-8 rel pr-60">
          <div class="eyebrow gold tiny">{ev.category[lang]}</div>
          <h1 class="display-34">{ev.venue[lang]}</h1>
        </div>
        <div class="grid-2 rel">
          <div class="fact">
            <div class="row center gap-6 t-12 mint"><Calendar size={15} /><span>{t.date}</span></div>
            <div class="t-15 bold">{ev.dayLong}</div>
          </div>
          <div class="fact">
            <div class="row center gap-6 t-12 mint"><Clock size={15} /><span>{t.time}</span></div>
            <div class="t-15 bold">{ev.time}</div>
          </div>
        </div>
      </header>

      <div class="event-body">
        <section class="stack-10">
          <h2 class="eyebrow section">{t.location}</h2>
          <div class="card pad-16 stack-14">
            <div class="row start gap-12">
              <div class="icon-tile dark"><Pin size={20} /></div>
              <div class="grow stack-2">
                <div class="t-16 bold">{ev.venue[lang]}</div>
                <div class="t-14 muted lh-14">{ev.address[lang]}</div>
              </div>
              <button type="button" class="icon-btn" onClick={copy} aria-label={t.copy}>
                <Copy size={18} />
              </button>
            </div>
            {copied && <div class="t-13 bold green" role="status">{t.copied}</div>}
            {android && (
              <MapLink url={mapLinks.geo(ev.mapsQuery)} class="btn-map wide">
                <Nav size={18} stroke="#E8C872" />
                <span>{t.myMapsApp}</span>
              </MapLink>
            )}
            <div class="t-13 bold">{t.openIn}</div>
            <div class="grid-3 gap-8">
              <MapLink url={mapLinks.apple(ev.mapsQuery)} class="btn-map">
                <Nav size={18} stroke="#E8C872" />
                <span>Apple Maps</span>
              </MapLink>
              <MapLink url={mapLinks.google(ev.mapsQuery)} class="btn-map">
                <Nav size={18} stroke="#E8C872" />
                <span>Google Maps</span>
              </MapLink>
              <MapLink url={mapLinks.waze(ev.mapsQuery)} class="btn-map">
                <Nav size={18} stroke="#E8C872" />
                <span>Waze</span>
              </MapLink>
            </div>
          </div>
        </section>

        {ev.info.length > 0 && (
          <section class="stack-10">
            <h2 class="eyebrow section">{t.info}</h2>
            <div class="card pad-16 stack-10">
              {ev.info.map((line, i) => (
                <div class="row start gap-10 t-14 lh-145" key={i}>
                  <Info size={18} stroke="#7A5712" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span>{line[lang]}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {ev.parking.length > 0 && (
          <section class="stack-10">
            <div class="row between baseline px-4">
              <h2 class="eyebrow section">{t.parking}</h2>
              <div class="t-12 muted">{ev.parking.length} {ev.parking.length === 1 ? t.place : t.places}</div>
            </div>
            {ev.parkingNote && <div class="note">{ev.parkingNote[lang]}</div>}
            <div class="card list">
              {ev.parking.map((p) => {
                const name = p.name[lang];
                return (
                  <div class="parking-row" key={name}>
                    <div class="icon-tile dark p-big">P</div>
                    <div class="grow stack-3 min-0">
                      <div class="t-15 bold">{name}</div>
                      <div class="t-13 muted lh-135">{p.address}</div>
                      <div class="row gap-6 wrap pt-3">
                        <span class="pill green-pill">{t.kind[p.kind] ?? p.kind}</span>
                        <span class="pill gold-pill">{t.cost[p.cost] ?? p.cost}</span>
                      </div>
                    </div>
                    <MapLink url={mapLinks.google(p.mapsQuery ?? `${name}, ${p.address}`)} class="btn-outline" label={`${t.go} · ${name}`}>
                      <Nav size={16} />
                      <span>{t.go}</span>
                    </MapLink>
                  </div>
                );
              })}
            </div>
            <p class="t-12 muted lh-145 px-4">{t.parkingDisclaimer}</p>
          </section>
        )}

        {ev.transit && (
          <section class="stack-10">
            <h2 class="eyebrow section">{t.transit}</h2>
            <div class="card pad-16 row start gap-12">
              <div class="icon-tile cream"><Bus size={20} /></div>
              <div class="stack-4">
                <div class="t-15 bold">{ev.transit.title[lang]}</div>
                <div class="t-14 muted lh-145">{ev.transit.body[lang]}</div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
