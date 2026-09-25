import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { publishedProjects } from '../src/data/projects.ts';

// Topic-level rules only: never copy withdrawn figures into a test fixture.
const forbidden = [
  /real[-\s]estate/i,
  /liquidity|rent coverage|salary contribution|financing.scenario/i,
  /\bSAR\s*[\d,]/,
];
const roots = ['src/', 'public/', 'dist/', 'docs/'];
let checked = 0;
async function inspect(url) {
  const content = await readFile(url, 'utf8');
  for (const rule of forbidden) assert.ok(!rule.test(content), `Restricted content detected in ${url.pathname}`);
  checked++;
}
async function walk(url) {
  for (const entry of await readdir(url, { withFileTypes: true })) {
    const child = new URL(entry.name + (entry.isDirectory() ? '/' : ''), url);
    if (entry.isDirectory()) await walk(child);
    else if (/\.(?:tsx?|m?js|json|html|md|txt|css)$/i.test(entry.name)) await inspect(child);
  }
}
for (const dir of roots) await walk(new URL(`../${dir}`, import.meta.url));
await inspect(new URL('../PORTFOLIO_UPGRADE_PLAN.md', import.meta.url));
assert.ok(publishedProjects.every(project => project.confidentiality === 'public'));
console.log(`Privacy checks passed across ${checked} source, public, built, and documentation files; only public projects are cataloged.`);
