import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, AxeBuilder, baseUrl } from './qa-tools.mjs';
import { routeMetadata, canonicalUrl, legacyRoutes } from '../src/data/site.ts';
import { publishedProjects } from '../src/data/projects.ts';

const output = resolve(process.env.QA_OUTPUT ?? '.qa/browser');
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
const failures = [];
const quick = process.argv.includes('--quick');
const require = (condition, message) => { if (!condition) failures.push(message); };
for (const theme of ['dark', 'light']) {
  for (const width of (quick ? [390] : [1440, 390, 320])) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.addInitScript(t => localStorage.setItem('theme', t), theme);
    for (const [path, meta] of Object.entries(routeMetadata)) {
      const label = `${theme} ${width} ${path}`;
      const errors = [];
      const onError = error => errors.push(error.message ?? error.text());
      page.on('pageerror', onError);
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      const response = await page.goto(`${baseUrl}${path}`);
      await page.locator('h1').waitFor();
      if (path.endsWith('/dashboard')) await page.getByRole('heading', { name: 'Net Sentiment', exact: true }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      require(response.status() === 200, `${label}: status ${response.status()}`);
      require(await page.locator('h1').count() === 1, `${label}: h1 count`);
      require(await page.title() === meta.title, `${label}: title`);
      require(await page.locator('link[rel="canonical"]').getAttribute('href') === canonicalUrl(path), `${label}: canonical`);
      require(await page.locator('meta[property="og:title"]').getAttribute('content') === meta.title, `${label}: OG title`);
      require(await page.locator('meta[name="description"]').getAttribute('content') === meta.description, `${label}: description`);
      require(await page.locator('#page-schema').count() === 1, `${label}: unique schema`);
      require(await page.locator('a[href^="tel:"], a[download]').count() === 0, `${label}: phone/download action`);
      for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 650) {
        await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y);
        await page.waitForTimeout(80);
      }
      await page.waitForTimeout(150);
      const view = await page.evaluate(() => ({
        height: document.body.scrollHeight,
        overflow: document.documentElement.scrollWidth > innerWidth,
        missingImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
        imageDimensions: [...document.images].filter(image => !image.hasAttribute('width') || !image.hasAttribute('height')).map(image => image.src),
        imageCount: document.querySelectorAll('main img').length,
      }));
      require(!view.overflow, `${label}: horizontal overflow`);
      require(view.missingImages.length === 0, `${label}: missing images ${view.missingImages.join(', ')}`);
      require(view.imageDimensions.length === 0, `${label}: missing image dimensions`);
      require(errors.length === 0, `${label}: console/page errors ${errors.join('; ')}`);
      const accessibility = width === 390 ? await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze() : null;
      const violations = accessibility?.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(node => ({ target: node.target, failureSummary: node.failureSummary })) })) ?? [];
      require(violations.length === 0, `${label}: accessibility ${violations.map(v => v.id).join(', ')}`);
      if (!quick && width !== 320) {
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: `${output}/${theme}-${width}-${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}.png`, fullPage: true, animations: 'disabled' });
      }
      results.push({ path, theme, width, status: response.status(), ...view, errors, violations });
      page.removeAllListeners('pageerror');
      page.removeAllListeners('console');
    }
    await context.close();
  }
}
const page = await browser.newPage({ reducedMotion: 'reduce' });
for (const project of publishedProjects) {
  await page.goto(`${baseUrl}/projects/${project.slug}`);
  await page.locator('article').waitFor();
  for (const name of ['Executive Summary', 'Business Question', 'Data and Quality', 'Approach', 'Evaluation', 'Findings', 'Practical Use', 'Limitations and Responsible Use', 'Tech Stack', 'Resources', 'My Contribution and Takeaway']) require(await page.getByRole('heading', { name, exact: true }).count() === 1, `${project.slug}: missing ${name}`);
}
for (const [from, to] of Object.entries(legacyRoutes)) {
  await page.goto(`${baseUrl}${from}`);
  await page.waitForURL(url => (url.pathname.replace(/\/$/, '') || '/') === to);
  await page.locator('h1').waitFor();
}
for (const slug of ['melbourne-housing-segmentation', 'constructor', '__proto__']) {
  await page.goto(`${baseUrl}/projects/${slug}`);
  await page.getByRole('heading', { name: 'Row not found' }).waitFor();
  require((await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'), `${slug}: missing noindex`);
}
await writeFile(`${output}/results.json`, JSON.stringify({ results, failures }, null, 2));
console.log(`${results.length} route/theme/viewport checks; ${results.filter(r => r.width === 390).length} accessibility audits; ${publishedProjects.length} complete reports.`);
if (failures.length) console.error(failures.join('\n'));
await browser.close();
if (failures.length) process.exitCode = 1;
