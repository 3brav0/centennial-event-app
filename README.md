# Centenario 2026 — Event App

Progressive web app for the Centenario 2026 celebration (Atlanta, GA · October 2 – 4, 2026).
Bilingual (Español / English), installable, and works offline.

- **Home**: countdown to the next event, latest announcement, and the three-day program
- **Program**: events by day, with parking indicators
- **Event detail**: address, one-tap directions (Apple Maps, Google Maps, Waze), nearby parking, transit
- **Announcements**: live notices with filters, unread badge, and optional notifications

## Updating content (no code needed)

All content lives in two JSON files. Edit them on GitHub (pencil icon → *Commit changes*) and the
site redeploys automatically in about a minute.

| File | What it holds |
| --- | --- |
| [`public/data/events.json`](public/data/events.json) | Days, events, addresses, parking, transit |
| [`public/data/announcements.json`](public/data/announcements.json) | Live announcements |

### Posting an announcement

Add an entry to the top of `announcements` in `public/data/announcements.json`:

```json
{
  "id": "gates-open-sat",
  "pinned": false,
  "type": "important",
  "postedAt": "2026-10-03T11:15:00-04:00",
  "title": { "es": "Las puertas ya están abiertas", "en": "Gates are now open" },
  "body":  { "es": "Entrada por Willoughby Way.", "en": "Enter from Willoughby Way." }
}
```

- `id` must be unique; it's how the app tracks what each person has already read.
- `type` is `important` or `logistics` (the two filters on the Announcements screen).
- `pinned: true` keeps it at the top and out of the unread count.

Open apps check for new announcements every 60 seconds and when brought back to the foreground.
People who turned on notifications get a system notification for new entries while the app is
open. (True push to a closed app needs a push server; see *Next steps*.)

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
- **Faster announcements**: point `VITE_ANNOUNCEMENTS_URL` at a hosted JSON/CMS endpoint so posts
  don't wait for a redeploy.

## Known placeholders

- The Baptism Ceremony address (`[DIRECCIÓN]` / `[ADDRESS]`) in `events.json`.
