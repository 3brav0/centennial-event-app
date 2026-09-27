// A web page can't see which apps are installed, so we lean on what each
// platform does with a link:
//  - Android: a `geo:` URI opens the system chooser listing every installed
//    maps app (Google Maps, Waze, etc.).
//  - iOS: maps.apple.com opens Apple Maps; Google Maps and Waze https links
//    are universal links that open their apps when installed, else the web.
//  - Desktop: Google Maps in the browser.

export type Platform = 'ios' | 'android' | 'other';

export function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'android';
  // iPadOS reports itself as a Mac; touch support gives it away.
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  return 'other';
}

const enc = encodeURIComponent;

export const mapLinks = {
  apple: (q: string) => `https://maps.apple.com/?daddr=${enc(q)}`,
  google: (q: string) => `https://www.google.com/maps/dir/?api=1&destination=${enc(q)}`,
  waze: (q: string) => `https://waze.com/ul?q=${enc(q)}&navigate=yes`,
  geo: (q: string) => `geo:0,0?q=${enc(q)}`
};

/** Link for the platform's default maps experience. */
export function directionsLink(q: string, platform: Platform = detectPlatform()): string {
  if (platform === 'android') return mapLinks.geo(q);
  if (platform === 'ios') return mapLinks.apple(q);
  return mapLinks.google(q);
}
