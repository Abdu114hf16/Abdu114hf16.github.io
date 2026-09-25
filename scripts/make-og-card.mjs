/** Regenerate the existing 1200×630 share-card treatment using durable evidence. */
import sharp from 'sharp';
import { profile } from '../src/data/profile.ts';
import { bySlug } from '../src/data/projects.ts';

const esc = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const text = (x, y, value, size = 24, color = '#e9eef8', mono = false) => `<text x="${x}" y="${y}" font-family="${mono ? 'monospace' : 'sans-serif'}" font-size="${size}" fill="${color}">${esc(value)}</text>`;
const tiles = [
  ['GPA · KSU', '4.87 / 5.00'],
  ['BEST HOLDOUT R²', bySlug('medical-cost-prediction').metrics[1].value],
  ['WAREHOUSE DIMENSIONS', bySlug('olist-data-warehouse').metrics[0].value],
];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0a101e"/>
  <rect x="72" y="65" width="56" height="4" rx="2" fill="#f5b841"/>
  ${text(72, 112, 'PORTFOLIO · DATA & AI · RIYADH', 18, '#8b98b4', true)}
  ${text(72, 185, profile.name, 54)}
  ${text(72, 240, 'Data Science · Business Intelligence', 26)}
  ${text(72, 278, 'Data Engineering · AI', 26)}
  ${text(72, 325, 'Computer Science Graduate · First-Class Honors', 20, '#8b98b4')}
  <rect x="938" y="64" width="202" height="266" rx="12" fill="#111a2c" stroke="#223052"/>
  ${tiles.map(([label, value], i) => `<rect x="${72 + i * 272}" y="388" width="248" height="132" rx="8" fill="#111a2c" stroke="#223052"/>${text(96 + i * 272, 430, label, 15, '#8b98b4', true)}${text(96 + i * 272, 483, value, 34)}`).join('')}
  <path d="M78 564 H790" stroke="#223052" stroke-width="2"/>
  ${['source', 'validate', 'model', 'communicate', 'decide'].map((stage, i) => `<circle cx="${78 + i * 178}" cy="564" r="4" fill="${i === 4 ? '#f5b841' : '#2aa0c4'}"/>${text(72 + i * 178, 598, stage, 14, '#8b98b4', true)}`).join('')}
  ${text(937, 596, 'alshammari.dev', 20, '#e9eef8', true)}
</svg>`;
const mask = Buffer.from('<svg width="190" height="254"><rect width="190" height="254" rx="8" fill="white"/></svg>');
const portrait = await sharp(new URL('../public/img/portrait.webp', import.meta.url).pathname).resize(190, 254, { fit: 'cover', position: 'top' }).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
await sharp(Buffer.from(svg)).composite([{ input: portrait, left: 944, top: 70 }]).png().toFile(new URL('../public/img/og-card.png', import.meta.url).pathname);
console.log('Updated 1200×630 Open Graph card with multi-discipline positioning and supported evidence.');
