import assert from 'node:assert/strict';
import { chromium } from './qa-tools.mjs';
import { routeMetadata, canonicalUrl } from '../src/data/site.ts';
const base = process.env.DEV_URL ?? 'http://localhost:5175';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
let images = 0;
for (const path of Object.keys(routeMetadata)) {
  await page.goto(`${base}${path}`);
  await page.locator('h1').waitFor();
  if (path.endsWith('/dashboard')) await page.getByRole('heading', { name: 'Net Sentiment', exact: true }).waitFor();
  for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 600) {
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(200);
  const unloaded = await page.evaluate(() => [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src));
  assert.deepEqual(unloaded, [], path);
  images += await page.locator('img').count();
}
await page.goto(`${base}/`);
await page.getByRole('link', { name: 'CV', exact: true }).click();
await page.getByRole('heading', { name: 'CV', exact: true }).waitFor();
assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), canonicalUrl('/cv'));
await page.getByRole('link', { name: 'Projects', exact: true }).click();
await page.getByRole('heading', { name: 'Projects', exact: true }).waitFor();
assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), routeMetadata['/projects'].title);
await page.locator('main a[href="/projects/medical-cost-prediction"]').click();
await page.locator('article').waitFor();
assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), canonicalUrl('/projects/medical-cost-prediction'));
assert.ok((await page.locator('#page-schema').textContent()).includes('TechArticle'));
await page.emulateMedia({ media: 'print' });
assert.equal(await page.locator('article').evaluate(e => getComputedStyle(e).color), 'rgb(0, 0, 0)');
await page.goto(`${base}/cv`);
await page.getByRole('heading', { name: 'CV', exact: true }).waitFor();
assert.equal(await page.locator('#education').evaluate(e => getComputedStyle(e.parentElement).opacity), '1');
console.log(`Development real-scroll checks passed on ${Object.keys(routeMetadata).length} routes (${images} images), plus client metadata and print visibility.`);
await browser.close();
