import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, AxeBuilder, baseUrl } from './qa-tools.mjs';
import { DOMAIN_LABEL, filterProjects, publishedProjects } from '../src/data/projects.ts';

const out = resolve(process.env.QA_OUTPUT ?? '.qa/interactions');
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const checks = [];
await page.goto(`${baseUrl}/#experience`);
await page.getByRole('heading', { name: 'Experience', exact: true }).waitFor();
assert.equal(new URL(page.url()).pathname.replace(/\/$/, ''), '/experience');
await page.getByRole('link', { name: 'CV', exact: true }).click();
await page.getByRole('link', { name: 'Experience', exact: true }).click();
await page.getByRole('heading', { name: 'Experience', exact: true }).waitFor();
await page.getByRole('link', { name: 'Home', exact: true }).click();
await page.getByRole('link', { name: 'Explore Projects', exact: true }).click();
await page.waitForFunction(() => document.activeElement?.id === 'selected-work');
for (const path of ['/cv/#education', '/cv#education', '/cv.html#education']) {
  await page.goto(`${baseUrl}${path}`);
  await page.waitForFunction(() => document.activeElement?.id === 'education');
}
await page.goto(`${baseUrl}/cv#credentials`);
await page.waitForFunction(() => document.activeElement?.id === 'credentials');
await page.locator('a.skip').focus();
await page.keyboard.press('Enter');
await page.waitForFunction(() => document.activeElement?.id === 'main');
checks.push('Dedicated Experience route, legacy anchor, selected-project/CV anchors and skip focus');

await page.goto(`${baseUrl}/projects/`);
for (const domain of ['data-science', 'business-intelligence']) await page.getByRole('group', { name: 'Filter by domain' }).getByRole('button', { name: DOMAIN_LABEL[domain], exact: true }).click();
assert.equal(await page.getByRole('group', { name: 'Filter by context' }).count(), 0);
assert.equal(await page.locator('main a[href^="/projects/"]').count(), filterProjects(publishedProjects, ['data-science', 'business-intelligence']).length);
await page.getByRole('group', { name: 'Filter by domain' }).getByRole('button', { name: 'All', exact: true }).click();
assert.equal(await page.locator('main a[href^="/projects/"]').count(), publishedProjects.length);
await page.getByRole('group', { name: 'Filter by domain' }).getByRole('button', { name: 'Software Development', exact: true }).click();
assert.equal(await page.locator('main a[href^="/projects/"]').count(), filterProjects(publishedProjects, ['supporting-software']).length);
checks.push('Domain-only filters, union semantics, reset and software selection');

await page.goto(`${baseUrl}/`);
await page.getByRole('heading', { name: 'Abdullah Alshammari', exact: true }).waitFor();
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(100);
await page.evaluate(() => scrollTo({ top: 500, behavior: 'instant' }));
await page.waitForFunction(() => scrollY === 500);
await page.getByRole('link', { name: 'Projects', exact: true }).click();
await page.getByRole('heading', { name: 'Projects', exact: true }).waitFor();
await page.waitForFunction(() => scrollY === 0);
for (let i = 0; i < 3; i++) {
  await page.goBack();
  await page.waitForFunction(() => Math.abs(scrollY - 500) < 10);
  await page.goForward();
  await page.waitForFunction(() => scrollY === 0);
}
checks.push('Back/Forward scroll restoration through lazy routes');

const themeBefore = await page.locator('html').getAttribute('data-theme');
await page.getByRole('button', { name: /Switch to .* theme/ }).click();
assert.notEqual(await page.locator('html').getAttribute('data-theme'), themeBefore);
await page.reload();
await page.locator('h1').waitFor();
assert.notEqual(await page.locator('html').getAttribute('data-theme'), themeBefore);
checks.push('Theme control and persistence');

await page.goto(`${baseUrl}/projects/optimizing-donor-outreach/`);
const thumbnail = page.getByRole('button', { name: /Open full-size figure/ }).first();
await thumbnail.click();
const dialog = page.getByRole('dialog', { name: 'Project figures' });
await dialog.waitFor();
assert.ok(await page.evaluate(() => !!document.activeElement?.closest('dialog')));
for (let i = 0; i < 5; i++) { await page.keyboard.press('Tab'); assert.ok(await page.evaluate(() => !!document.activeElement?.closest('dialog'))); }
await dialog.getByRole('button', { name: 'Next figure', exact: true }).click();
assert.ok((await dialog.locator('img').getAttribute('alt')).includes('after logarithmic'));
await page.keyboard.press('Escape');
await dialog.waitFor({ state: 'hidden' });
assert.equal(await thumbnail.evaluate(e => e === document.activeElement), true);
checks.push('Gallery focus containment, next figure, Escape and focus restoration');

await page.goto(`${baseUrl}/projects/playstation-disc-sentiment/dashboard/`);
await page.getByRole('heading', { name: 'Net Sentiment', exact: true }).waitFor();
await page.getByRole('button', { name: '△ Positive', exact: true }).click();
await page.getByText('View chart data and definitions', { exact: true }).click();
assert.ok((await page.locator('details').innerText()).includes('5,780'));
await page.getByLabel('Filter by language').selectOption('qam');
await page.getByRole('button', { name: 'Jul 2', exact: true }).click();
assert.ok((await page.getByRole('status').innerText()).startsWith('0 reactions'));
await page.getByRole('button', { name: 'Reset filters', exact: true }).click();
assert.ok((await page.getByRole('status').innerText()).startsWith('56,677'));
const remote = page.getByRole('button', { name: /REMOTE/ });
const dashboardAudits = [];
async function audit(label) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  dashboardAudits.push({ label, violations: result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, failureSummary: n.failureSummary })) })) });
}
for (const theme of ['PS Blue', 'Midnight', 'Carbon', 'Retro', 'PS5 Light']) {
  await remote.click();
  await page.getByRole('button', { name: `${theme} theme`, exact: true }).click();
  await audit(`${theme}: controls open`);
  await page.keyboard.press('Escape');
  assert.equal(await remote.evaluate(e => e === document.activeElement), true);
  await audit(`${theme}: charts`);
}
for (const accent of ['Blue', 'Cyan', 'Violet', 'Magenta']) {
  await remote.click();
  await page.getByRole('button', { name: `${accent} accent`, exact: true }).click();
  await page.getByRole('button', { name: 'Bar', exact: true }).click();
  await audit(`PS5 Light: ${accent} controls`);
  await page.keyboard.press('Escape');
  await audit(`PS5 Light: ${accent} bar`);
}
for (const color of ['Yellow', 'Green', 'Cyan']) {
  await remote.click();
  await page.getByRole('button', { name: `${color} positive color`, exact: true }).click();
  await page.keyboard.press('Escape');
  await audit(`PS5 Light: ${color} positive`);
}
checks.push('Dashboard filters, zero results, accessible tables, all themes, accent variants and remote Escape');

let mode = 'success', posts = 0;
await page.route('https://formsubmit.co/**', async route => {
  posts++;
  await new Promise(resolve => setTimeout(resolve, 350));
  if (mode === 'network') return route.abort('failed');
  await route.fulfill({ status: mode === 'rejected' ? 503 : 200, contentType: 'application/json', body: JSON.stringify({ success: mode === 'success' }) });
});
await page.clock.install();
async function fillForm() {
  await page.goto(`${baseUrl}/contact/?sent=1`);
  await page.locator('form').waitFor();
  assert.ok(!(await page.locator('main').innerText()).includes('accepted your message'));
  await page.getByLabel('Name', { exact: true }).fill('Preview test');
  await page.getByLabel('Email', { exact: true }).fill('test@example.com');
  await page.getByLabel('Message', { exact: true }).fill('Mock request only.');
}
await fillForm();
await page.getByRole('button', { name: 'Send message', exact: true }).click();
assert.ok((await page.getByRole('alert').innerText()).includes('spam guard'));
assert.equal(posts, 0);
await page.clock.fastForward(3500);
await page.getByRole('button', { name: 'Send message', exact: true }).click();
assert.equal(await page.getByRole('button', { name: 'Sending…', exact: true }).isDisabled(), true);
await page.getByText('The form service accepted your message.', { exact: false }).waitFor();
for (mode of ['rejected', 'network', 'unconfirmed']) {
  await fillForm();
  await page.clock.fastForward(3500);
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await page.getByRole('alert').waitFor();
  assert.equal(await page.getByLabel('Message', { exact: true }).inputValue(), 'Mock request only.');
}
await fillForm();
await page.clock.fastForward(3500);
await page.locator('[name="_honey"]').evaluate(e => e.value = 'bot');
const before = posts;
await page.getByRole('button', { name: 'Send message', exact: true }).click();
assert.equal(posts, before);
checks.push('Mocked contact pending/acceptance/rejection/network/unconfirmed; timing/honeypot; forged sent URL');

const normal = await browser.newPage({ reducedMotion: 'no-preference' });
await normal.goto(`${baseUrl}/`);
await normal.getByRole('heading', { name: 'Abdullah Alshammari', exact: true }).waitFor();
await normal.locator('#selected-work').scrollIntoViewIfNeeded();
await normal.waitForTimeout(4200);
assert.equal(await normal.locator('#selected-work a[href^="/projects/"]').count(), 4);
assert.equal(await normal.locator('main #experience').count(), 0);
assert.ok((await normal.locator('#practice li').first().innerText()).startsWith('Data Engineering & Databases'));
assert.equal(await normal.locator('#about').evaluate(e => e.getBoundingClientRect().bottom < document.getElementById('practice').getBoundingClientRect().top), true);
await normal.goto(`${baseUrl}/cv/`);
const certificate = normal.locator('a[href="https://www.datacamp.com/certificate/DEA0016972420970"]');
await certificate.scrollIntoViewIfNeeded();
await certificate.locator('img').waitFor();
assert.ok((await certificate.innerText()).includes('Data Engineer Associate'));
assert.equal(await certificate.locator('img').evaluate(e => e.complete && e.naturalWidth > 0), true);
checks.push('Four compact projects, separated profile/practice, Data Engineering priority and verified credential badge');
await writeFile(`${out}/results.json`, JSON.stringify({ checks, dashboardAudits, mockedPosts: posts }, null, 2));
console.log(`${checks.length} interaction groups passed. ${dashboardAudits.length} dashboard accessibility states audited.`);
const failures = dashboardAudits.filter(a => a.violations.length);
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exitCode = 1; }
await browser.close();
