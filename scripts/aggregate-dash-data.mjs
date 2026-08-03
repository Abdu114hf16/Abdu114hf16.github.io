/**
 * Pre-aggregates the PlayStation sentiment dataset for the dashboard route.
 *
 *   node scripts/aggregate-dash-data.mjs
 *
 *   in:  data/ps-dash.raw.json        (56,677 rows: source of truth, not deployed)
 *   out: public/data/ps-dash.json     (contingency cube + trimmed samples, deployed)
 *
 * Why: every visual on the dashboard is a marginal sum over a
 * (day x language x sentiment) contingency table. That table has 77 non-empty
 * cells, so shipping 56,677 individual rows to the browser sends ~10,000x more
 * data than the computation needs. This is an exact restatement, not a sample:
 * the counts the dashboard renders are identical either way.
 *
 * Samples are trimmed to SAMPLES_PER_CELL per cell, in their original order.
 * The UI renders `.slice(0, 3)` of the rows matching the current filter, and any
 * filter is a union of cells, so if a sample would place in the first 3 of a
 * union, it must also be in the first 3 of its own cell. Keeping the first 3 per
 * cell therefore preserves the rendered output exactly.
 */
import { readFileSync, writeFileSync } from 'node:fs';

/** Must be >= the `.slice(0, N)` the dashboard applies to samples. */
const SAMPLES_PER_CELL = 3;

const src = new URL('../data/ps-dash.raw.json', import.meta.url).pathname;
const out = new URL('../public/data/ps-dash.json', import.meta.url).pathname;

const raw = JSON.parse(readFileSync(src, 'utf8'));

/* ── contingency cube: "day|lang|sentiment" -> count ───────────────────────── */
const cube = {};
for (const [day, lang, sent] of raw.rows) {
  const key = `${day}|${lang}|${sent}`;
  cube[key] = (cube[key] ?? 0) + 1;
}

/* ── samples: keep the first N per cell, preserving virality order ─────────── */
const seen = {};
const samples = [];
for (const smp of raw.samples) {
  const key = `${smp.d}|${smp.l}|${smp.s}`;
  seen[key] = (seen[key] ?? 0) + 1;
  if (seen[key] <= SAMPLES_PER_CELL) samples.push(smp);
}

const next = {
  dayLabels: raw.dayLabels,
  langNames: raw.langNames,
  total: raw.rows.length,
  cube,
  samples,
};

writeFileSync(out, JSON.stringify(next));

/* ── verify the cube reproduces the raw totals before reporting success ───── */
const cubeTotal = Object.values(cube).reduce((a, b) => a + b, 0);
if (cubeTotal !== raw.rows.length) {
  throw new Error(`cube total ${cubeTotal} != ${raw.rows.length} rows, aborting`);
}

const before = Buffer.byteLength(JSON.stringify(raw));
const after = Buffer.byteLength(JSON.stringify(next));
console.log(
  [
    `rows          ${raw.rows.length.toLocaleString()} -> cube ${Object.keys(cube).length} cells`,
    `samples       ${raw.samples.length} -> ${samples.length}`,
    `payload       ${(before / 1024).toFixed(1)} kB -> ${(after / 1024).toFixed(1)} kB  (-${(100 - (after / before) * 100).toFixed(1)}%)`,
    `row total     ${cubeTotal.toLocaleString()} (matches source)`,
  ].join('\n'),
);
