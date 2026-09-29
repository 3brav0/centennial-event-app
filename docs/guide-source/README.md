# Volunteer guide PDF source

`build.py` writes `guide.html` (Spanish page, then English, in the app's colors and fonts);
`print.mjs` prints it to `../announcements-guide.pdf` using an installed Chromium-based browser
(Microsoft Edge by default; set `BROWSER` to a Chrome/Edge executable path otherwise).

```sh
npm run guide:pdf
```
