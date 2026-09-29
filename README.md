# Centenario 2026 — Event App

Progressive web app for the Centenario 2026 celebration (Atlanta, GA · October 2 – 4, 2026).
Bilingual (Español / English), installable, works offline, and adapts from phones to wide desktop screens.

- **Home**: countdown to the next event, latest announcement, and the three-day program
- **Program**: events by day, with parking indicators, plus a **Topics** view of the doctrinal topics and ceremonies
- **Event detail**: weather forecast with preparation tips, address, one-tap directions (Apple Maps, Google Maps, Waze), nearby parking, transit
- **Announcements**: live notices with filters, unread badge, and optional notifications

## Updating content (no code needed)

Event content lives in a JSON file; edit it on GitHub (pencil icon → *Commit changes*) and the
site redeploys automatically in about a minute. Announcements are posted from a Google Sheet, with
no GitHub access needed.

| Where | What it holds |
| --- | --- |
| [`public/data/events.json`](public/data/events.json) | Days, events, topics, addresses, parking, transit |
| Google Sheet **Centenario 2026 — Avisos** | Live announcements |
| [`public/data/announcements.json`](public/data/announcements.json) | Fallback announcements (used before the sheet is connected, or on a first visit while it's unreachable) |

### Posting an announcement

Add a row to the **Avisos** tab of the Google Sheet; it appears in the app within about a minute.
Volunteer instructions (Spanish/English): [`docs/announcements-guide.md`](docs/announcements-guide.md).

One-time setup of the sheet and its Apps Script web app:
[`docs/google-sheet-setup.md`](docs/google-sheet-setup.md). The script is in
[`google-apps-script/Code.gs`](google-apps-script/Code.gs); the app reads its `/exec` URL from the
`ANNOUNCEMENTS_URL` repository variable at build time.

Open apps check for new announcements every 60 seconds and when brought back to the foreground.
People who turned on notifications get a system notification for new entries while the app is
open. (True push to a closed app needs a push server; see *Next steps*.) If the sheet can't be
reached, the app keeps showing the last announcements it loaded.

### Doctrinal topics and ceremonies

Events can list `sessions` (shown on the event page and under **Program → Topics**). Ceremonies are
highlighted. The event's end time, and so its weather window, comes from the last session.

```json
"sessions": [
  {
    "start": "2026-10-03T17:30:00-04:00",
    "end": "2026-10-03T19:00:00-04:00",
    "kind": "topic",
    "title": { "es": "Irrevocables son las dádivas de Dios", "en": "The Gifts of God Are Irrevocable" },
    "subtitle": { "es": "…", "en": "…" }
  },
  { "start": "…", "end": "…", "kind": "ceremony", "title": { "es": "Ceremonia de Bautismos", "en": "Baptism Ceremony" }, "subtitle": null }
]
```

### Event photos

Put the photo in `public/img/venues/` (a JPEG about 1200px wide, under ~150 KB) and point the
event's `image` at it:

```json
"image": {
  "src": "img/venues/my-venue.jpg",
  "credit": "Photographer name",
  "license": "CC BY 4.0",
  "source": "https://link-to-original",
  "position": "50% 60%"
}
```

`credit`, `license` and `source` are optional for your own photos but **required** for Creative
Commons images (shown as a small caption on the event page). `position` adjusts the crop. Set
`"image": null` to show the Centenario crest instead.

### Weather

Each event shows the forecast for the hours it runs, with preparation tips, from
[Open-Meteo](https://open-meteo.com) (free, no API key; refreshed every 30 minutes, last forecast
kept for offline use). Forecasts appear up to 16 days before an event. Per event in `events.json`:

- `coords`: venue latitude/longitude used for the forecast.
- `outdoor`: `true` adds heat, sun, cold and wind tips; `false` (indoor) only gives travel tips such
  as leaving early when rain is likely.
- `durationHours` (optional, default 3): how many hours of forecast to cover, for events without
  `sessions` (events with sessions end when their last session ends).

Tip rules live in `src/weather.ts` (`tipsFor`).

### Directions

Each event's `mapsQuery` is what's sent to the maps apps. The **Directions** button picks the
platform default: on Android it opens the system chooser with every installed maps app, on iOS it
opens Apple Maps, and elsewhere Google Maps. The event page also offers Apple Maps, Google Maps and
Waze explicitly — each opens the app when installed, or the website otherwise.

## Development

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

Stack: [Vite](https://vite.dev) + [Preact](https://preactjs.com) + TypeScript,
[vite-plugin-pwa](https://vite-pwa-org.netlify.app) for the manifest and service worker.

## Deployment

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`
(or run it manually from the Actions tab). The base path is taken from the Pages configuration,
so adding a custom domain later needs no code change.

## Next steps

- **Push notifications to closed apps**: needs a small backend (e.g. Firebase Cloud Messaging or a
  Web Push worker) to send pushes when an announcement is posted.

## Photo credits

Venue photos from Wikimedia Commons:

- Liberty Plaza — [Stevens-Wilkinson](https://commons.wikimedia.org/wiki/File:Liberty_Plaza_2015.jpg), CC BY-SA 4.0
- Historic Fourth Ward Park — [Marc Merlin](https://commons.wikimedia.org/wiki/File:Clear_Creek_Basin_at_Historic_Fourth_Ward_Park_in_Atlanta,_July_2015.jpg), CC BY-SA 4.0
- Mable House Barnes Amphitheatre — [John Phelan](https://commons.wikimedia.org/wiki/File:Entrance_to_the_Mable_House_Barnes_Amphitheatre,_Mableton_GA.jpg), CC BY 4.0

Casa de Oración Marietta photo provided by the organizers.
