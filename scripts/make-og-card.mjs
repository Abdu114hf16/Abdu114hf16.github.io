/**
 * Generates the 1200x630 Open Graph / Twitter share card at public/img/og-card.png.
 *
 * Run with:  node scripts/make-og-card.mjs
 *
 * The card reuses the site's dark-theme tokens so a shared link previews as the
 * same object it points at. Type is set in generic families on purpose — the
 * brand webfonts are not installed in the rendering environment, so metrics are
 * chosen to stay safe under a wide fallback face.
 */
import sharp from 'sharp';

const W = 1200;
const H = 630;

// Tokens lifted from src/styles/tokens.css (dark theme).
const BG = '#0a101e';
const PANEL = '#111a2c';
const BORDER = '#223052';
const TEXT = '#e9eef8';
const MUTED = '#8b98b4';
const ACCENT = '#f5b841';
const CAT_BA = '#2aa0c4';

// Portrait frame geometry (right side).
const PF = { x: 934, y: 66, w: 204, h: 260, pad: 6, r: 10 };
const PI = { x: PF.x + PF.pad, y: PF.y + PF.pad, w: PF.w - PF.pad * 2, h: PF.h - PF.pad * 2 };

// Sparkline mirroring the R² climb on the home-page KPI tile.
const spark = [62, 66, 64, 70, 73, 71, 76, 80, 79, 84, 88, 91];
const sx = 760;
const sy = 470;
const sw = 350;
const sh = 92;
const min = Math.min(...spark);
const max = Math.max(...spark);
const at = (i) => {
  const x = sx + (i / (spark.length - 1)) * sw;
  const y = sy + sh - ((spark[i] - min) / (max - min)) * sh;
  return [x, y];
};
const pts = spark.map((_, i) => at(i).map((n) => n.toFixed(1)).join(',')).join(' ');
const [lastX, lastY] = at(spark.length - 1);

// Dot grid, echoing the RAW stage of the pipeline hero. Kept clear of text and tiles.
const dots = [];
for (let r = 0; r < 11; r++) {
  for (let c = 0; c < 27; c++) {
    const cx = 60 + c * 42;
    const cy = 90 + r * 42;
    const inTextBlock = cy < 330 && cx < 900;
    const inTiles = cy > 420 && cy < 590 && cx < 760;
    if (!inTextBlock && !inTiles) dots.push(`<circle cx="${cx}" cy="${cy}" r="1.6"/>`);
  }
}

const tile = (x, label, value) => `
  <rect x="${x}" y="440" width="208" height="126" rx="8" fill="${PANEL}" stroke="${BORDER}"/>
  <text x="${x + 24}" y="481" font-family="monospace" font-size="15" letter-spacing="2.2" fill="${MUTED}">${label}</text>
  <text x="${x + 24}" y="534" font-family="monospace" font-size="40" font-weight="600" fill="${TEXT}">${value}</text>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>

  <g fill="${BORDER}" opacity="0.5">${dots.join('')}</g>

  <rect x="72" y="74" width="56" height="4" rx="2" fill="${ACCENT}"/>

  <text x="72" y="128" font-family="monospace" font-size="18" letter-spacing="3.8" fill="${MUTED}">PORTFOLIO · DATA SCIENCE &amp; AI · RIYADH</text>

  <text x="72" y="216" font-family="sans-serif" font-size="60" font-weight="700" letter-spacing="-1.6" fill="${TEXT}">Abdullah Alshammari</text>

  <text x="72" y="268" font-family="sans-serif" font-size="26" fill="${MUTED}">Machine learning · analytics dashboards · decisions</text>

  <rect x="${PF.x}" y="${PF.y}" width="${PF.w}" height="${PF.h}" rx="${PF.r}" fill="${PANEL}" stroke="${BORDER}" stroke-width="1.5"/>

  ${tile(72, 'REACTIONS', '56,677')}
  ${tile(304, 'BEST MODEL R²', '0.91')}
  ${tile(536, 'CASE STUDIES', '4')}

  <polyline points="${pts}" fill="none" stroke="${ACCENT}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="6.5" fill="${ACCENT}"/>

  <circle cx="946" cy="586" r="5" fill="${CAT_BA}"/>
  <text x="962" y="592" font-family="monospace" font-size="20" letter-spacing="1.2" fill="${MUTED}">alshammari.dev</text>
</svg>`;

const out = new URL('../public/img/og-card.png', import.meta.url).pathname;

// Rounded-corner mask so the portrait matches the frame's inner radius.
const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${PI.w}" height="${PI.h}"><rect width="${PI.w}" height="${PI.h}" rx="6" fill="#fff"/></svg>`,
);

const portrait = await sharp(new URL('../public/img/portrait.webp', import.meta.url).pathname)
  .resize(PI.w, PI.h, { fit: 'cover', position: 'top' })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: portrait, left: PI.x, top: PI.y }])
  .png()
  .toFile(out);

const meta = await sharp(out).metadata();
console.log(`wrote ${out} — ${meta.width}x${meta.height}, ${(meta.size / 1024).toFixed(1)} kB`);
