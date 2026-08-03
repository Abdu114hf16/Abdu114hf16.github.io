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
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

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

/* ── emit ──────────────────────────────────────────────────────────────────── */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const template = readFileSync(new URL('index.html', dist), 'utf8');

/** Replace the content of a meta tag matched by its identifying attribute. */
function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`meta ${attr}="${key}" not found in template`);
  return html.replace(re, `$1${esc(value)}$2`);
}

let written = 0;
for (const [route, { title, description }] of Object.entries(ROUTES)) {
  const url = route === '/' ? `${ORIGIN}/` : `${ORIGIN}${route}`;

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
