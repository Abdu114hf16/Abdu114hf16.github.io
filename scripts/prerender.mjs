/**
 * Emits a real HTML file per route, so GitHub Pages serves deep links with a
 * genuine HTTP 200 and social crawlers see per-page metadata.
 *
 *   node scripts/prerender.mjs      (runs automatically as part of `npm run build`)
 *
 * The problem this solves: Pages has no route rewriting, so a request for
 * /cv missed every file, Pages answered 404.html with a real 404 status, and an
 * inline script redirected to /?/cv. Humans never noticed. Machines did: all
 * eight deep links in public/sitemap.txt answered 404, and because useSeo runs
 * client-side, every share of any page rendered the homepage title and card.
 *
 * Deliberately NOT server-rendering the React tree. Writing per-route <head>
 * metadata around the same empty #root fixes the status codes and the share
 * cards with zero hydration risk. Full SSR would additionally serve content to
 * non-JS crawlers, and can be layered on later without redoing this.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';

const ORIGIN = 'https://alshammari.dev';
const BASE = 'Abdullah Alshammari';
const dist = new URL('../dist/', import.meta.url);
const root = new URL('../', import.meta.url);

/** Titles here must match what useSeo sets, or the tab title changes on hydrate. */
const ROUTES = {
  '/': {
    title: `${BASE} · Data Science & AI`,
    description:
      'Portfolio of Abdullah Alshammari: machine learning, analytics dashboards, and decision-ready insights.',
  },
  '/cv': {
    title: `CV - ${BASE}`,
    description: 'CV of Abdullah Alshammari: education, technical skills, certifications, and languages.',
  },
  '/projects': {
    title: `Projects - ${BASE}`,
    description: 'Hands-on work across machine learning, business analytics and web development.',
  },
  '/contact': {
    title: `Contact - ${BASE}`,
    description:
      'Get in touch with Abdullah Alshammari for collaborations, opportunities, or just to connect.',
  },
  '/projects/playstation-disc-sentiment': {
    title: `Sentiment Analysis for People About PlayStation's Disc Decision - ${BASE}`,
    description:
      'The mood clearly leans negative, but exactly how negative, and how does it stack up against the positive and neutral voices? Let the data answer instead of the gut.',
  },
  '/projects/medical-cost-prediction': {
    title: `Medical Insurance Cost Prediction - ${BASE}`,
    description: 'What shapes an annual insurance bill, and why two customers can be priced so differently.',
  },
  '/projects/eventia': {
    title: `Eventia - ${BASE}`,
    description:
      'A centralized platform that runs the full event lifecycle, from official licensing to live analytics, for organizers, vendors, attendees and authorities.',
  },
  '/projects/commercial-flights-delays': {
    title: `Commercial Flight Delays Analysis - ${BASE}`,
    description:
      "A Power BI investigation into flight delays and passenger satisfaction across New York's airports, with forecasts and recommendations for the National Aviation Administration.",
  },
  '/projects/playstation-disc-sentiment/dashboard': {
    title: `PlayStation Disc Sentiment - Interactive Dashboard - ${BASE}`,
    description:
      'Explore 56,677 public reactions to the end of PlayStation discs, filterable by sentiment, day and language.',
  },
};

/* ── drift guards: fail the build rather than ship a silently stale route ──── */

const sitemapPaths = readFileSync(new URL('public/sitemap.txt', root), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean)
  .map((u) => new URL(u).pathname.replace(/(.)\/$/, '$1'));

const missing = sitemapPaths.filter((p) => !(p in ROUTES));
const extra = Object.keys(ROUTES).filter((p) => !sitemapPaths.includes(p));
if (missing.length || extra.length) {
  throw new Error(
    `prerender routes and sitemap.txt disagree.\n  in sitemap, no metadata: ${missing.join(', ') || 'none'}\n  has metadata, not in sitemap: ${extra.join(', ') || 'none'}`,
  );
}

// Every live project must have a page; a new one added to projects.ts without a
// sitemap entry would otherwise ship unprerendered and keep answering 404.
const projectsSrc = readFileSync(new URL('src/data/projects.ts', root), 'utf8');
const liveSlugs = [...projectsSrc.matchAll(/slug:\s*'([^']+)'[\s\S]*?status:\s*'(\w+)'/g)]
  .filter((m) => m[2] === 'live')
  .map((m) => m[1]);
const unlisted = liveSlugs.filter((s) => !sitemapPaths.includes(`/projects/${s}`));
if (unlisted.length) {
  throw new Error(`live projects missing from sitemap.txt: ${unlisted.join(', ')}`);
}

const assets = readdirSync(new URL('assets/', dist));

/* src/styles/fonts.css loads the latin subset only. That is safe exactly as
   long as nothing on the site needs a glyph outside it, and the failure mode is
   silent: the character still paints, just in whatever system face the stack
   falls through to. So check the built bundles, not the sources, because copy
   written as an HTML entity (&ge;, &#9651;) is only a real character after
   bundling. dist/data is out of scope on purpose: the dashboard sets its own
   'Segoe UI' stack, so its multilingual sample text never uses these faces. */
const LATIN_RANGE = [
  [0x0000, 0x00ff], [0x0131, 0x0131], [0x0152, 0x0153], [0x02bb, 0x02bc], [0x02c6, 0x02c6],
  [0x02da, 0x02da], [0x02dc, 0x02dc], [0x0304, 0x0304], [0x0308, 0x0308], [0x0329, 0x0329],
  [0x2000, 0x206f], [0x2074, 0x2074], [0x20ac, 0x20ac], [0x2122, 0x2122], [0x2191, 0x2191],
  [0x2193, 0x2193], [0x2212, 0x2212], [0x2215, 0x2215], [0xfeff, 0xfeff], [0xfffd, 0xfffd],
];

// Deliberate fallbacks: no subset of these three families carries any of them,
// so they rendered from a system font before the trim as well as after.
const FALLBACK_OK = new Set(['→', '≥', '◯', '◻', '△', '✕', '●']);

const inLatin = (cp) => LATIN_RANGE.some(([a, b]) => cp >= a && cp <= b);
const scanned = [
  ...assets.filter((f) => /\.(js|css)$/.test(f)).map((f) => new URL(`assets/${f}`, dist)),
  new URL('index.html', dist),
];

const strays = new Map();
for (const file of scanned) {
  for (const ch of readFileSync(file, 'utf8')) {
    const cp = ch.codePointAt(0);
    if (cp < 128 || inLatin(cp) || FALLBACK_OK.has(ch)) continue;
    if (!strays.has(ch)) strays.set(ch, new Set());
    strays.get(ch).add(file.pathname.split('/').pop());
  }
}
if (strays.size) {
  const detail = [...strays]
    .map(([ch, files]) => `  ${ch}  U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}  in ${[...files].join(', ')}`)
    .join('\n');
  throw new Error(
    `characters outside the latin subset the fonts ship:\n${detail}\n` +
      'Either reword, or widen the imports in src/styles/fonts.css, or add it to FALLBACK_OK if a system face is fine.',
  );
}

/* ── emit ──────────────────────────────────────────────────────────────────── */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ── font preloads ──────────────────────────────────────────────────────────
   The @font-face rules live in the bundled stylesheet, so without this the
   browser cannot even discover a font until that render-blocking CSS has been
   fetched and parsed. Injected here rather than written into index.html
   because Vite content-hashes the filenames.

   Only the display and body faces. IBM Plex Mono is left to normal discovery:
   it is two more files for two weights, and a longer preload list would
   compete with the hero portrait for the first connections. */
const CRITICAL_FONTS = [
  /^bricolage-grotesque-latin-wght-normal-[\w-]+\.woff2$/,
  /^instrument-sans-latin-wght-normal-[\w-]+\.woff2$/,
];

const preloads = CRITICAL_FONTS.map((re) => {
  const hit = assets.filter((f) => re.test(f));
  // A renamed or dropped subset would otherwise ship a preload for a file that
  // does not exist, which costs a request and warns in every console.
  if (hit.length !== 1) {
    throw new Error(`expected exactly 1 asset matching ${re}, found ${hit.length}: ${hit.join(', ')}`);
  }
  return `<link rel="preload" href="/assets/${hit[0]}" as="font" type="font/woff2" crossorigin />`;
}).join('\n    ');

const template = readFileSync(new URL('index.html', dist), 'utf8').replace(
  /(\s*)(<link rel="canonical")/,
  `$1${preloads}$1$2`,
);

/** Replace the content of a meta tag matched by its identifying attribute. */
function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`meta ${attr}="${key}" not found in template`);
  return html.replace(re, `$1${esc(value)}$2`);
}

let written = 0;
for (const [route, { title, description }] of Object.entries(ROUTES)) {
  // Trailing slash on purpose: Pages serves these as directory indexes and
  // 301s /cv to /cv/, so the slash form is what actually answers 200. Pointing
  // canonical at the non-slash form would aim it at a redirect.
  const url = route === '/' ? `${ORIGIN}/` : `${ORIGIN}${route}/`;

  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${esc(url)}$2`);

  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);

  const outDir = route === '/' ? dist : new URL(`.${route}/`, dist);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(new URL('index.html', outDir), html);
  written++;
}

console.log(`prerendered ${written} routes with per-page metadata`);
