import QRCode from 'qrcode';
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const URL_ = 'https://event.atl.cotlgfb.org';
const dir = path.dirname(new URL(import.meta.url).pathname);
const crest = 'data:image/png;base64,' + fs.readFileSync(path.join(dir, '../../public/img/crest.png')).toString('base64');
const qr = QRCode.create(URL_, { errorCorrectionLevel: 'H' });
const n = qr.modules.size;
const dark = (r, c) => qr.modules.get(r, c);
const QUIET = 4;
const total = n + QUIET * 2;

// Keep the centre clear for the crest (well inside what level-H error correction can recover).
const hole = Math.round(n * 0.26) | 1;
const h0 = (n - hole) / 2;
const inHole = (r, c) => r >= h0 - 0.5 && r < h0 + hole - 0.5 && c >= h0 - 0.5 && c < h0 + hole - 0.5;
const inFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);

function qrSvg({ ink = '#0F3D2E', bg = '#FFFFFF', size = 1000 } = {}) {
  let dots = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (!dark(r, c) || inFinder(r, c) || inHole(r, c)) continue;
    dots += `<rect x="${c + QUIET + 0.08}" y="${r + QUIET + 0.08}" width="0.84" height="0.84" rx="0.3"/>`;
  }
  const finder = (r, c) => `
    <rect x="${c + QUIET + 0.5}" y="${r + QUIET + 0.5}" width="6" height="6" rx="1.6" fill="none" stroke="${ink}" stroke-width="1"/>
    <rect x="${c + QUIET + 2}" y="${r + QUIET + 2}" width="3" height="3" rx="0.9" fill="${ink}"/>`;
  const lc = QUIET + h0 + hole / 2;
  const lr = hole / 2 - 0.2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${size}" height="${size}" shape-rendering="geometricPrecision">
  <rect width="${total}" height="${total}" fill="${bg}"/>
  <g fill="${ink}">${dots}</g>
  ${finder(0, 0)}${finder(0, n - 7)}${finder(n - 7, 0)}
  <circle cx="${lc}" cy="${lc}" r="${lr}" fill="${bg}"/>
  <image href="${crest}" x="${lc - lr * 0.86}" y="${lc - lr * 0.92}" width="${lr * 1.72}" height="${lr * 1.84}" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
}

const fonts = `<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Cormorant+Garamond:wght@700&family=Manrope:wght@500;700&display=swap" rel="stylesheet">`;

const card = `<!doctype html><html><head><meta charset="utf-8">${fonts}<style>
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 1600px; background: #0F3D2E; font-family: 'Manrope', sans-serif; color: #FBF6EA;
  display: flex; flex-direction: column; align-items: center; padding: 96px 110px 84px; position: relative; overflow: hidden; }
.ring { position: absolute; z-index: 0; border: 2px solid rgba(232,200,114,.18); border-radius: 50%; }
.eyebrow { font-family: 'Cinzel', serif; font-weight: 600; font-size: 26px; letter-spacing: .28em; color: #E8C872; text-align: center; }
h1 { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 84px; line-height: 1; margin-top: 26px; text-align: center; }
.en { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 46px; color: #CFDCD3; margin-top: 12px; text-align: center; }
.panel { position: relative; z-index: 1; margin-top: 60px; background: #fff; border-radius: 48px; padding: 30px; box-shadow: 0 0 0 10px rgba(232,200,114,.9); }
.panel svg { display: block; width: 760px; height: 760px; }
.what { margin-top: 64px; font-size: 30px; font-weight: 500; color: #E6EEE9; text-align: center; line-height: 1.45; }
.what b { color: #E8C872; font-weight: 700; }
.url { margin-top: auto; font-size: 34px; font-weight: 700; letter-spacing: .02em; color: #FBF6EA; display: flex; align-items: center; gap: 18px; }
.url::before, .url::after { content: ''; width: 60px; height: 2px; background: #E8C872; opacity: .7; }
</style></head><body>
<div class="ring" style="width:1500px;height:1500px;left:-150px;top:520px"></div>
<div class="ring" style="width:1900px;height:1900px;left:-350px;top:320px"></div>
<div class="eyebrow">CENTENARIO 2026 · ATLANTA, GA</div>
<h1>Escanea para ver el programa</h1>
<div class="en">Scan to see the program</div>
<div class="panel">${qrSvg({ size: 760 })}</div>
<div class="what"><b>Programa · Ubicaciones · Avisos en vivo</b><br>Program · Directions · Live announcements</div>
<div class="url">event.atl.cotlgfb.org</div>
</body></html>`;

const plain = `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0}body{width:1200px;height:1200px}svg{display:block}</style></head>
<body>${qrSvg({ size: 1200 })}</body></html>`;

fs.writeFileSync(path.join(dir, 'centenario-qr.svg'), qrSvg({ size: 1200 }));
const b = await chromium.launch({ executablePath: process.env.BROWSER || '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge' });
for (const [name, html, w, h] of [['centenario-qr-card.png', card, 1200, 1600], ['centenario-qr.png', plain, 1200, 1200]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1.5 });
  await p.setContent(html, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(dir, name) });
  await p.close();
}
await b.close();
console.log('version', qr.version, 'modules', n, 'logo hole', hole, `(${Math.round(hole * hole / (n * n) * 100)}% of area)`);
