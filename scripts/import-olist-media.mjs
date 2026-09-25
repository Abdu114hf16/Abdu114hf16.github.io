/** Import the owner's public Olist screenshots and unmodified certification badge. */
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const source = process.env.OLIST_DIR ?? fileURLToPath(new URL('../../olist-data-warehouse/', import.meta.url));
const badge = process.env.DATACAMP_BADGE;
if (!badge) throw new Error('Set DATACAMP_BADGE to the owner-supplied official badge PNG before importing media.');
const out = new URL('../public/img/', import.meta.url);
const manifest = [];
for (const [original, name] of [
  ['ERD.png', 'olist-schema.webp'],
  ['dimensions_ETL.png', 'olist-etl.webp'],
  ['data_quality.png', 'olist-quality.webp'],
  ['DBeaver_environment.png', 'olist-workspace.webp'],
  ['project_structure.png', 'olist-structure.webp'],
]) {
  const bytes = await sharp(join(source, 'snapshots', original)).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 90 }).toBuffer();
  await writeFile(new URL(name, out), bytes);
  const { width, height } = await sharp(bytes).metadata();
  manifest.push({ file: `/img/${name}`, width, height, source: `https://github.com/Abdu114hf16/olist-data-warehouse/blob/ff33c00dfc4acf37ddc9197105c80eb0edfc882f/snapshots/${original}` });
}
const diagram = await sharp(new URL('olist-schema.webp', out).pathname).resize(1104, 500, { fit: 'contain', background: '#111a2c' }).png().toBuffer();
const frame = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675"><rect width="1200" height="675" fill="#111a2c"/><text x="48" y="52" font-family="sans-serif" font-size="30" fill="#e9eef8">Olist E-Commerce Data Warehouse</text><text x="48" y="91" font-family="monospace" font-size="17" fill="#aab7cf">PostgreSQL · SQL ETL · Dimensional modeling</text><text x="48" y="645" font-family="sans-serif" font-size="18" fill="#aab7cf">One order-item fact table · Four dimensions · Five date roles</text></svg>');
await sharp(frame).composite([{ input: diagram, left: 48, top: 120 }]).webp({ quality: 90 }).toFile(new URL('cover-olist.webp', out).pathname);
manifest.push({ file: '/img/cover-olist.webp', width: 1200, height: 675, source: 'Composition of the original public Olist ERD; no invented measurements.' });
const badgeBytes = await sharp(badge).resize({ width: 112 }).webp({ lossless: true }).toBuffer();
await writeFile(new URL('datacamp-data-engineer-associate.webp', out), badgeBytes);
const { width, height } = await sharp(badgeBytes).metadata();
manifest.push({ file: '/img/datacamp-data-engineer-associate.webp', width, height, source: 'Owner-supplied official DataCamp badge; resized without altering its design.', verification: 'https://www.datacamp.com/certificate/DEA0016972420970' });
// Append to the existing public-media provenance register without duplicating entries.
const path = new URL('../docs/media-manifest.json', import.meta.url);
const previous = JSON.parse(await readFile(path, 'utf8'));
const names = new Set(manifest.map(item => item.file));
await writeFile(path, JSON.stringify([...previous.filter(item => !names.has(item.file)), ...manifest].sort((a, b) => (a.file ?? a.source).localeCompare(b.file ?? b.source)), null, 2) + '\n');
console.log(JSON.stringify(manifest, null, 2));
