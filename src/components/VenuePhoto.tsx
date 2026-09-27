import type { EventItem } from '../data';
import { useApp } from '../app';

const BASE = import.meta.env.BASE_URL;

/** Venue photo, or a branded crest panel when the event has no image yet. */
export function VenuePhoto({ event, class: cls = '', credit = false }: { event: EventItem; class?: string; credit?: boolean }) {
  const { lang } = useApp();
  const img = event.image;
  if (!img) {
    return (
      <div class={`venue-photo fallback ${cls}`} aria-hidden="true">
        <img src={`${BASE}img/crest.png`} alt="" />
      </div>
    );
  }
  return (
    <figure class={`venue-photo ${cls}`}>
      <img src={BASE + img.src} alt={event.venue[lang]} loading="lazy" decoding="async" style={img.position ? { objectPosition: img.position } : undefined} />
      {credit && img.credit && (
        <figcaption>
          <a href={img.source} target="_blank" rel="noopener">
            {lang === 'es' ? 'Foto' : 'Photo'}: {img.credit}{img.license ? ` · ${img.license}` : ''}
          </a>
        </figcaption>
      )}
    </figure>
  );
}
