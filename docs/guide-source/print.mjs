import { chromium } from 'playwright-core';
import path from 'node:path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const b = await chromium.launch({ executablePath: process.env.BROWSER || '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge' });
const p = await b.newPage();
await p.goto('file://' + dir + '/guide.html', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: path.join(dir, '..', 'announcements-guide.pdf'), format: 'Letter', printBackground: true, preferCSSPageSize: true });
await b.close();
