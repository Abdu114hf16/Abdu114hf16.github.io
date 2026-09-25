import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, baseUrl } from './qa-tools.mjs';
const require = process.env.QA_TOOL_ROOT ? createRequire(resolve(process.env.QA_TOOL_ROOT, 'package.json')) : createRequire(import.meta.url);
const { default: lighthouse } = await import(pathToFileURL(require.resolve('lighthouse')).href);
const output = resolve(process.env.QA_OUTPUT ?? '.qa/lighthouse');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ args: ['--remote-debugging-port=9225'] });
const paths = process.argv.includes('--home-only') ? ['/'] : ['/', '/experience/', '/cv/', '/projects/', '/contact/', '/projects/olist-data-warehouse/'];
const results = [];
for (const path of paths) {
  const result = await lighthouse(`${baseUrl}${path}`, { port: 9225, output: ['json', 'html'], logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
  if (result.lhr.runtimeError) throw new Error(JSON.stringify(result.lhr.runtimeError));
  const name = path === '/' ? 'home' : path.split('/').filter(Boolean).join('-');
  await writeFile(`${output}/${name}.json`, result.report[0]);
  await writeFile(`${output}/${name}.html`, result.report[1]);
  const scores = Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round(category.score * 100)]));
  const cls = result.lhr.audits['cumulative-layout-shift'].numericValue;
  const lcp = result.lhr.audits['largest-contentful-paint'].numericValue;
  const failedAudits = Object.values(result.lhr.audits).filter(a => a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'informative').map(a => ({ id: a.id, title: a.title, score: a.score, displayValue: a.displayValue }));
  results.push({ path, scores, cls, lcp, failedAudits });
  console.log(JSON.stringify({ path, scores, cls, lcp }));
}
await writeFile(`${output}/summary.json`, JSON.stringify(results, null, 2));
await browser.close();
if (results.some(r => r.scores.performance < 90 || r.scores.accessibility < 95 || r.scores['best-practices'] < 95 || r.scores.seo < 95 || r.cls >= .1)) process.exitCode = 1;
