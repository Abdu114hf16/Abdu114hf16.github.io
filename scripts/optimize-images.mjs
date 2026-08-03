/**
 * One-off image optimizer: reads the original site images and emits
 * resized WebP into public/img/, printing a manifest with dimensions.
 * Run: npm run images
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'public', 'img');

/** [source, output name, max width] */
const jobs = [
  ['visuals/Personal.png', 'portrait.webp', 480],
  ['heroes/MIC.webp', 'hero-mic.webp', 1600],
  ['heroes/cfd.jpg', 'hero-cfd.webp', 1600],
  ['heroes/eventia.png', 'hero-eventia.webp', 1600],
  ['heroes/ps.jpg', 'hero-ps.webp', 1600],
  ['pictures/Eventia1.jpg', 'eventia-1.webp', 1400],
  ['pictures/Eventia2.jpg', 'eventia-2.webp', 1400],
  ['pictures/cfd_exploration.png', 'cfd-exploration.webp', 1400],
  ['pictures/cfd_key_influencers.png', 'cfd-key-influencers.webp', 1400],
  ['pictures/cfd_regression.png', 'cfd-regression.webp', 1400],
  ['pictures/cfd_offices.png', 'cfd-offices.webp', 1400],
  ['pictures/cfd_forecasting.png', 'cfd-forecasting.webp', 1400],
  ['pictures/cfd_prediction.png', 'cfd-prediction.webp', 1400],
  ['pictures/ps_tweet.png', 'ps-tweet.webp', 840],
  ['visuals/mcp_preview_shap.png', 'mcp-shap.webp', 1400],
  ['visuals/mcp_preview_age.png', 'mcp-age.webp', 1400],
  ['visuals/mcp_preview_interaction.png', 'mcp-interaction.webp', 1400],
  ['visuals/main_ps_logo.jpg', 'ps-logo.webp', 160],
];

await mkdir(out, { recursive: true });
const manifest = {};
for (const [src, name, width] of jobs) {
  const img = sharp(path.join(root, src)).resize({ width, withoutEnlargement: true });
  const info = await img.webp({ quality: 82 }).toFile(path.join(out, name));
  manifest[name] = { w: info.width, h: info.height, kb: Math.round(info.size / 1024) };
}
console.log(JSON.stringify(manifest, null, 1));
