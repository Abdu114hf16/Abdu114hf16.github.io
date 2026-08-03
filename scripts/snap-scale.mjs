/**
 * One-shot migration: rewrites raw font-size / padding / margin / gap values
 * onto the type and space scales in tokens.css.
 *
 *   node scripts/snap-scale.mjs           report only, changes nothing
 *   node scripts/snap-scale.mjs --write    apply
 *   node scripts/snap-scale.mjs --check    fail if anything is off the scale
 *
 * --check runs as part of `npm run build`. Without it a scale decays: the next
 * hand-written 0.62rem looks harmless in isolation and is how the codebase got
 * to 31 type sizes and 53 spacing values in the first place.
 *
 * Everything it would do is printed with the percentage each value moves, so
 * the diff is reviewable as a table rather than as 200 scattered edits. Any
 * value that would move more than MAX_DRIFT is left alone and listed, because
 * a snap that large is a design decision, not a mechanical one.
 *
 * Out of scope on purpose:
 *   src/pages/dashboard/  the PlayStation dashboard is a separate artifact with
 *                         its own theme variables and its own visual language
 *   PipelineHero SVG      .label and .chip text are user units inside a 920-wide
 *                         viewBox, so a rem token there would be meaningless.
 *                         Its HTML step list is on the scale like anything else.
 *   .sr-only margin       the -1px is the clip idiom, not a spacing decision
 *   clamp() and em        fluid and relative by intent
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const WRITE = process.argv.includes('--write');
const CHECK = process.argv.includes('--check');
const MAX_DRIFT = 0.25;

const TYPE = {
  '--fs-1': 0.7, '--fs-2': 0.8, '--fs-3': 0.9, '--fs-4': 1,
  '--fs-5': 1.1, '--fs-6': 1.45, '--fs-7': 1.9,
};
const SPACE = {
  '--sp-0': 0.125, '--sp-1': 0.25, '--sp-2': 0.375, '--sp-3': 0.5, '--sp-4': 0.75,
  '--sp-5': 1, '--sp-6': 1.5, '--sp-7': 2, '--sp-8': 3, '--sp-9': 4,
};

const SPACE_PROPS = /^(padding|margin|gap|row-gap|column-gap)(-top|-right|-bottom|-left)?$/;

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) { if (!p.includes('dashboard')) walk(p); }
    else if (p.endsWith('.css')) files.push(p);
  }
})('src');

/** Nearest token, or null when nothing is close enough to be a safe snap. */
function nearest(rem, scale) {
  let best = null;
  for (const [name, v] of Object.entries(scale)) {
    const drift = Math.abs(v - rem) / rem;
    if (!best || drift < best.drift) best = { name, v, drift };
  }
  return best && best.drift <= MAX_DRIFT ? best : null;
}

const rows = [];
const skipped = [];

const ALLOWED = new Set(['13px', '12.5px', '-1px']);

function snapValue(raw, scale, file, prop) {
  if (ALLOWED.has(raw)) return raw;
  const m = /^(-?)([0-9]*\.?[0-9]+)(rem|px)$/.exec(raw);
  if (!m) return raw;
  const [, sign, num, unit] = m;
  const rem = (unit === 'px' ? Number(num) / 16 : Number(num)) || 0;
  if (rem === 0) return raw;
  const hit = nearest(rem, scale);
  if (!hit) { skipped.push({ file, prop, raw, rem }); return raw; }
  rows.push({ file, prop, raw, to: hit.name, drift: (hit.v - rem) / rem });
  // Negative margins cannot use a token directly; wrap in calc.
  return sign ? `calc(-1 * var(${hit.name}))` : `var(${hit.name})`;
}

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const out = src.replace(/(^|[;{\s])([a-z-]+)\s*:\s*([^;{}]+);/g, (whole, lead, prop, value) => {
    const isType = prop === 'font-size';
    const isSpace = SPACE_PROPS.test(prop);
    if (!isType && !isSpace) return whole;
    // No `em\b` here: it also matches the tail of `rem`. Non-rem units simply
    // fail snapValue's pattern and pass through untouched.
    if (/clamp\(|calc\(|var\(|%|auto/.test(value)) return whole;
    const parts = value.trim().split(/\s+/);
    const next = parts.map((p) => snapValue(p, isType ? TYPE : SPACE, file, prop));
    return `${lead}${prop}: ${next.join(' ')};`;
  });
  if (WRITE && out !== src) writeFileSync(file, out);
}

const pct = (d) => `${d >= 0 ? '+' : ''}${(d * 100).toFixed(0)}%`;
const byDrift = [...rows].sort((a, b) => Math.abs(b.drift) - Math.abs(a.drift));

console.log(`${rows.length} values snapped across ${files.length} files\n`);
console.log('largest moves:');
for (const r of byDrift.slice(0, 14)) {
  console.log(`  ${r.file.replace('src/', '').padEnd(38)} ${r.prop.padEnd(14)} ${r.raw.padStart(8)} -> ${r.to.padEnd(8)} ${pct(r.drift)}`);
}
const dist = {};
for (const r of rows) dist[r.to] = (dist[r.to] ?? 0) + 1;
console.log('\nuses per token:');
for (const [k, v] of Object.entries(dist).sort()) console.log(`  ${k.padEnd(9)} ${v}`);
if (skipped.length) {
  console.log(`\n${skipped.length} left alone, no token within ${MAX_DRIFT * 100}%:`);
  for (const s of skipped) console.log(`  ${s.file.replace('src/', '').padEnd(38)} ${s.prop.padEnd(14)} ${s.raw}`);
}
if (CHECK) {
  if (rows.length || skipped.length) {
    const all = [...rows.map((r) => `${r.file} ${r.prop}: ${r.raw}`), ...skipped.map((s) => `${s.file} ${s.prop}: ${s.raw}`)];
    console.error(`\n${all.length} value(s) off the type/space scale:\n  ${all.join('\n  ')}\n\nUse a --fs-* or --sp-* token from tokens.css, or add a deliberate exception to ALLOWED.`);
    process.exit(1);
  }
  console.log('\nall type and space values sit on the scale');
} else {
  console.log(WRITE ? '\nWRITTEN' : '\nreport only, nothing changed');
}
