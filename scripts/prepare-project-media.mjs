/** Reproducible public-artifact preparation. Run manually, never as a networked build step.
 * Requires Python + PyMuPDF for PDF extracts. MEDIA_CACHE chooses the temporary folder.
 * Existing sharp dependency performs all website image optimization.
 */
import sharp from 'sharp';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const cache = process.env.MEDIA_CACHE ?? join(tmpdir(), 'portfolio-public-media');
const out = fileURLToPath(new URL('../public/img/', import.meta.url));
await mkdir(cache, { recursive: true });
const manifest = [];
const source = {
  donors: ['Optimizing_Donors_Outreach', 'a38c3cfd1999cb1050e4aa6b0614a9eb20b004af'],
  income: ['MacroEconomic-Analysis-PowerBi', '4bb516f0a35b340b2cab2b0fa688f343aaea749f'],
  saudi: ['interactive-ksa-discovery', '0617ad322169721e549e71b1972d39636dcc47a4'],
  digits: ['Handwritten_digit_recognition', 'b06196097e90c8de923f6aee2eb8013c44a276b7'],
  sms: ['Naive_Bayes_SMS_Classifier', '12a34e7222d3e66e281f5469e3c679e1056f0468'],
};
async function download(key, path, filename) {
  const [repo, revision] = source[key];
  const url = `https://raw.githubusercontent.com/Abdu114hf16/${repo}/${revision}/${path}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(join(cache, filename), buffer);
  manifest.push({ source: url, sha256: createHash('sha256').update(buffer).digest('hex') });
  return buffer;
}
await Promise.all([
  download('income', 'Dashboard_Preview.pdf', 'income-dashboard.pdf'),
  download('income', 'Datasets/Inflation_fred_dataset.csv', 'inflation.csv'),
  download('saudi', 'Report.pdf', 'saudi-report.pdf'),
  download('donors', 'finding_donors_report.html', 'donors.html'),
  download('digits', 'demo_screenshot.png', 'digit-demo.png'),
  download('digits', 'Handwritting_Recognition.ipynb', 'digits.ipynb'),
  download('sms', 'assets/term_by_doc_matrix.png', 'sms-matrix.png'),
]);
execFileSync(process.env.PYTHON ?? 'python3', [fileURLToPath(new URL('./extract-project-figures.py', import.meta.url)), cache], { stdio: 'inherit' });

async function image(name, input, note) {
  const result = await sharp(input).rotate().resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 88 }).toBuffer();
  await writeFile(join(out, name), result);
  const { width, height } = await sharp(result).metadata();
  manifest.push({ file: `/img/${name}`, width, height, bytes: result.length, note });
}
const html = await readFile(join(cache, 'donors.html'), 'utf8');
let i = 0;
for (const [, encoded] of html.matchAll(/src="data:image\/png;base64,([^"]+)"/g)) {
  await image(`donor-report-${++i}.webp`, Buffer.from(encoded.replace(/\s/g, ''), 'base64'), 'Original embedded figure from pinned CharityML HTML report.');
}
await image('income-dashboard.webp', join(cache, 'income-2.png'), 'Chart excerpt from page 2; top KPI row excluded.');
await image('income-industry.webp', join(cache, 'income-3.png'), 'Original industry dashboard page 3; source snapshot, not current workforce coverage.');
const ui = (await readdir(cache)).filter(name => /^saudi-\d+\.(jpeg|png)$/.test(name)).sort();
for (const file of ui) await image(`${file.replace(/\.(jpeg|png)$/, '')}.webp`, join(cache, file), 'Public UI screenshot extracted from the pinned, redacted Saudi Discovery report.');
await image('digit-demo.webp', join(cache, 'digit-demo.png'), 'Original drawing-interface screenshot; example output is not a benchmark accuracy.');
const notebook = JSON.parse(await readFile(join(cache, 'digits.ipynb'), 'utf8'));
let digitIndex = 0;
for (const cell of notebook.cells) for (const output of cell.outputs ?? []) {
  const encoded = output.data?.['image/png'];
  if (encoded) await image(`digit-example-${++digitIndex}.webp`, Buffer.from(Array.isArray(encoded) ? encoded.join('') : encoded, 'base64'), 'Saved MNIST example image from the pinned notebook.');
}
await image('sms-matrix.webp', join(cache, 'sms-matrix.png'), 'Bag-of-words teaching illustration from the baseline repository.');
try { await image('arabic-interface.webp', join(cache, 'arabic-ui.png'), 'Static capture of the pinned Arabic prototype interface, with scripts disabled. No image upload was performed.'); } catch (error) { if (!String(error).includes('missing')) throw error; }

const esc = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const text = (x, y, content, size = 24, color = '#e9eef8', mono = false) => `<text x="${x}" y="${y}" fill="${color}" font-family="${mono ? 'monospace' : 'sans-serif'}" font-size="${size}">${esc(content)}</text>`;
const frame = (title, subtitle, body, footnote) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" rx="16" fill="#111a2c"/><path d="M48 118 H1152" stroke="#31446e"/>${text(48, 60, title, 32)}${text(48, 94, subtitle, 18, '#aab7cf')}${body}${text(48, 644, footnote, 17, '#aab7cf')}</svg>`;
async function chart(name, title, subtitle, rows, max, footnote) {
  const step = 400 / rows.length;
  const body = rows.map(([label, value, display], index) => {
    const y = 175 + index * step;
    return `${text(48, y + 26, label, 22)}<rect x="340" y="${y}" width="720" height="36" rx="4" fill="#16213a"/><rect x="340" y="${y}" width="${720 * value / max}" height="36" rx="4" fill="${index === 0 ? '#f5b841' : '#2aa0c4'}"/>${text(350 + 720 * value / max, y + 26, display, 20)}`;
  }).join('');
  await image(name, Buffer.from(frame(title, subtitle, body, footnote)), 'Regenerated from the documented comparison values; full values and limitations appear in the adjacent HTML table.');
}
await chart('donor-comparison.webp', 'Precision-oriented outreach', 'Reported test F0.5 · precision weighted more strongly than recall', [['Untuned boosting', .7029, '0.7029'], ['Tuned boosting', .7223, '0.7223']], 1, '45,222 census records · Udacity CharityML · Scores describe the documented split.');
await chart('sms-comparison.webp', 'Text classifiers: look beyond accuracy', 'Reported test recall · the share of spam caught', [['Probabilistic baseline', .941, '94.1%'], ['Random forest', .849, '84.9%'], ['Bagging', .903, '90.3%'], ['Boosting', .476, '47.6%']], 1, 'Same documented split and text representation · Dataset: 5,572 SMS messages.');

const csv = (await readFile(join(cache, 'inflation.csv'), 'utf8')).trim().split(/\r?\n/).slice(1);
const observations = csv.map(line => { const [date, value] = line.split(','); return [Number(date.slice(0, 4)), Number(value)]; });
const peak = observations.reduce((best, item) => item[1] > best[1] ? item : best);
if (observations.length !== 65 || peak[0] !== 1980 || peak[1].toFixed(2) !== '13.55') throw new Error('Inflation source does not match reviewed scope.');
const at = ([year, rate]) => [90 + (year - 1960) / 64 * 1020, 540 - (rate + 1) / 15 * 340];
const axes = [0, 5, 10].map(value => { const y = at([1960, value])[1]; return `<path d="M90 ${y} H1110" stroke="#31446e"/>${text(48, y + 6, `${value}%`, 18, '#aab7cf')}`; }).join('');
const years = [1960, 1980, 2000, 2024].map(year => text(at([year, 0])[0] - 22, 580, year, 18, '#aab7cf')).join('');
const [px, py] = at(peak);
await image('income-inflation-trend.webp', Buffer.from(frame('Nominal growth needs inflation context', 'US annual consumer-price inflation · 1960–2024', `${axes}<polyline points="${observations.map(item => at(item).join(',')).join(' ')}" fill="none" stroke="#5fc3e4" stroke-width="4"/><circle cx="${px}" cy="${py}" r="6" fill="#f5b841"/>${text(px + 18, py - 12, '1980 · 13.55%', 22, '#f5b841')}${years}`, 'Source: FRED FPCPITOTLZGUSA via the pinned project CSV · 65 annual observations.')), 'Plotted directly from the public inflation CSV; peak and observation count validated.');

const card = (x, y, title, lines, width = 310) => `<rect x="${x}" y="${y}" width="${width}" height="160" rx="8" fill="#16213a" stroke="#31446e"/>${text(x + 20, y + 40, title, 23, '#5fc3e4')}${lines.map((line, index) => text(x + 20, y + 82 + index * 31, line, 21)).join('')}`;
const arrow = (x1, y, x2) => `<path d="M${x1} ${y} H${x2} l-10 -6 m10 6 l-10 6" fill="none" stroke="#f5b841" stroke-width="2"/>`;
await image('boolean-index.webp', Buffer.from(frame('Structure once, search repeatedly', 'Inverted-index retrieval · schematic illustration of the implemented design', `${card(48, 210, 'Normalize documents', ['Headline + description', 'Lowercase and tokenize'])}${arrow(370, 290, 425)}${card(445, 210, 'Term postings', ['data: A, B', 'model: B, C'])}${arrow(768, 290, 822)}${card(840, 210, 'Boolean query', ['AND: B', 'OR: A, B, C'], 312)}${text(48, 480, '209,527 news records in the documented project corpus', 29)}`, 'A, B and C are illustrative document IDs; this diagram is not a timing benchmark.')), 'Explanatory diagram of source-code operations, with explicitly illustrative postings.');
await image('boolean-flow.webp', Buffer.from(frame('AND and OR answer different questions', 'Illustrative posting-set operations; identical normalization at indexing and query time', `${card(48, 210, 'Posting sets', ['data = {A, B}', 'model = {B, C}'])}${arrow(370, 290, 425)}${card(445, 210, 'AND: intersection', ['Present in both sets', 'Result: {B}'])}${card(840, 210, 'OR: union', ['Present in either set', 'Result: {A, B, C}'], 312)}`, 'Exact Boolean membership, not ranked relevance · Based on the public retrieval implementation.')), 'Illustrative set operations, not measured corpus results.');
await image('income-model.webp', Buffer.from(frame('Conform the sources before comparing them', 'Simplified analytical design from the public project description', `${card(48, 210, 'Source tables', ['Jobs and earnings', 'Annual US inflation'])}${arrow(370, 290, 425)}${card(445, 210, 'Shared time model', ['Standardized dates', 'Facts + date dimension'])}${arrow(768, 290, 822)}${card(840, 210, 'Report measures', ['Nominal income', 'Inflation comparisons'], 312)}`, 'Earnings: four snapshots · Inflation: 1960–2024 · Shared dates do not imply equal source coverage.')), 'Simplified data-flow diagram based on the repository model description.');
await image('digit-preprocessing.webp', Buffer.from(frame('The input is part of the model', 'A custom drawing must match the training representation', `${card(48, 210, 'User drawing', ['Variable position', 'Stroke and background'])}${arrow(370, 290, 425)}${card(445, 210, 'Prepare the image', ['28 × 28 grayscale', 'Invert / normalize'])}${arrow(768, 290, 822)}${card(840, 210, 'Classification', ['Convolutional features', 'One of ten digits'], 312)}`, 'A drawing-interface example does not establish an independent accuracy benchmark.')), 'Explanatory preprocessing flow based on the pinned notebook.');
await image('arabic-speech-flow.webp', Buffer.from(frame('Compose speech from reusable segments', 'Manual input path documented in the Arabic numeral prototype', `${card(48, 210, 'Validate input', ['Range: 0–1,000,000', 'Reject other values'])}${arrow(370, 290, 425)}${card(445, 210, 'Decompose number', ['Units and scale words', 'Arabic connectors'])}${arrow(768, 290, 822)}${card(840, 210, 'Compose playback', ['Ordered local audio', 'No image upload'], 312)}`, 'The separate image-extraction service is unavailable; this diagram describes the manual path.')), 'Explanatory diagram based on documented numeral-to-audio composition.');

// Public project covers, all 16:9.
async function cover(name, title, input, footnote) {
  const figure = await sharp(join(out, input)).resize(1104, 470, { fit: 'contain', background: '#111a2c' }).png().toBuffer();
  await sharp(Buffer.from(frame(title, 'Project evidence', '', footnote))).composite([{ input: figure, left: 48, top: 135 }]).webp({ quality: 90 }).toFile(join(out, name));
  manifest.push({ file: `/img/${name}`, width: 1200, height: 675, note: `16:9 composition using ${input}; no invented measurements.` });
}
await cover('cover-medical.webp', 'Interaction-aware medical-cost prediction', 'mcp-interaction.webp', 'Original project plot · Associations in a 1,338-record teaching dataset.');
await cover('cover-donor.webp', 'Precision-oriented donor outreach', 'donor-report-3.webp', 'Original model-family comparison · CharityML classification project.');
await cover('cover-income.webp', 'Income, inflation & purchasing power', 'income-dashboard.webp', 'Excerpt of the original dashboard · Read with source-coverage limitations.');
await cover('cover-eventia.webp', 'Eventia: connected event workflows', 'hero-eventia.webp', 'Team graduation project · Role-based workflows, relational data and an AI assistant.');
await cover('cover-saudi.webp', 'An Arabic-first discovery platform', 'saudi-3.webp', 'Original regional gallery · Search, content management and relational data.');
await cover('cover-boolean.webp', 'Boolean retrieval over news records', 'boolean-index.webp', 'Explanatory inverted-index diagram · Public project scope: 209,527 records.');
const psArtifact = (await readdir(out)).includes('ps-dashboard-overview.webp') ? 'ps-dashboard-overview.webp' : 'hero-ps.webp';
await cover('cover-playstation.webp', 'Multilingual public-reaction analysis', psArtifact, 'Interactive dashboard · 56,677 collected reactions; not a representative customer survey.');
manifest.sort((a, b) => (a.file ?? a.source).localeCompare(b.file ?? b.source));
await writeFile(new URL('../docs/media-manifest.json', import.meta.url), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Prepared ${manifest.filter(item => item.file).length} public-project images. Manifest: docs/media-manifest.json`);
