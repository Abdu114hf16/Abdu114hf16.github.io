import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, baseUrl } from './qa-tools.mjs';
import { routeMetadata, ORIGIN } from '../src/data/site.ts';

const output = resolve(process.env.QA_OUTPUT ?? '.qa/links');
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ reducedMotion: 'reduce' });
const urls = new Set();
const anchors = [];
for (const path of Object.keys(routeMetadata)) {
  await page.goto(`${baseUrl}${path === '/' ? '/' : `${path}/`}`);
  await page.locator('h1').waitFor();
  if (path.endsWith('/dashboard')) await page.getByRole('heading', { name: 'Net Sentiment', exact: true }).waitFor();
  const links = await page.locator('a[href]').evaluateAll(elements => elements.map(e => e.href));
  const images = await page.locator('img[src]').evaluateAll(elements => elements.map(e => e.src));
  for (const value of [...links, ...images]) {
    const url = new URL(value);
    if (url.protocol === 'mailto:') continue;
    if (url.origin === ORIGIN) { url.host = new URL(baseUrl).host; url.protocol = new URL(baseUrl).protocol; }
    if (url.origin === new URL(baseUrl).origin && url.hash) anchors.push(url.href);
    url.hash = '';
    urls.add(url.href);
  }
}
const results = [];
for (const href of urls) {
  try {
    let response = await fetch(href, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) });
    if (response.status === 405 || response.status === 403 || response.status >= 500) response = await fetch(href, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
    const internal = new URL(href).origin === new URL(baseUrl).origin;
    results.push({ href, internal, status: response.status, finalUrl: response.url, state: response.ok ? 'pass' : [401, 403, 429, 999].includes(response.status) ? 'blocked' : 'failed' });
  } catch (error) { results.push({ href, internal: new URL(href).origin === new URL(baseUrl).origin, state: 'unverified', error: error.message }); }
}
for (const href of new Set(anchors)) {
  await page.goto(href);
  const id = decodeURIComponent(new URL(href).hash.slice(1));
  await page.locator('main').waitFor();
  const exists = await page.evaluate(id => !!document.getElementById(id), id);
  results.push({ href, internal: true, state: exists ? 'pass' : 'failed', anchor: id });
}
await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
const issues = results.filter(result => result.state !== 'pass');
console.log(`${results.length} rendered links/assets/anchors checked; ${results.length - issues.length} passed.`);
if (issues.length) console.log(JSON.stringify(issues, null, 2));
await browser.close();
if (issues.some(result => result.state === 'failed' || result.internal)) process.exitCode = 1;
