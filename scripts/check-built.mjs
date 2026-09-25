import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import sharp from 'sharp';
import { routeMetadata, canonicalUrl, legacyRoutes } from '../src/data/site.ts';
import { publishedProjects } from '../src/data/projects.ts';
const root = new URL('../', import.meta.url);
const esc = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const sitemap = (await readFile(new URL('public/sitemap.txt', root), 'utf8')).trim().split('\n');
assert.deepEqual(sitemap, Object.keys(routeMetadata).map(canonicalUrl));
for (const [path, meta] of Object.entries(routeMetadata)) {
  const html = await readFile(new URL(`dist/${path === '/' ? '' : `${path.slice(1)}/`}index.html`, root), 'utf8');
  assert.ok(html.includes(`<title>${esc(meta.title)}</title>`), path);
  assert.ok(html.includes(`rel="canonical" href="${canonicalUrl(path)}"`), path);
  assert.ok(html.includes(`name="description" content="${esc(meta.description)}"`), path);
  const schemaText = html.match(/<script type="application\/ld\+json" id="page-schema">(.*?)<\/script>/s)?.[1];
  const schema = JSON.parse(schemaText);
  assert.equal(schema['@graph'][0]['@type'], 'Person');
  assert.ok(!schemaText.includes('telephone'));
  if (meta.projectSlug) assert.equal(schema['@graph'][1]['@type'], 'TechArticle');
}
for (const [from, to] of Object.entries(legacyRoutes)) {
  if (from === '/index.html') continue;
  const html = await readFile(new URL(`dist${from}${from.endsWith('.html') ? '' : '/index.html'}`, root), 'utf8');
  const destination = to === '/' ? '/' : `${to}/`;
  assert.ok(html.includes(`content="0;url=${destination}"`), `Alias must use a directory URL to avoid .html fallback loops: ${from}`);
}
await assert.rejects(access(new URL('dist/docs/Abdullah_Alshammari_CV.pdf', root)));
await assert.rejects(access(new URL('dist/projects/melbourne-housing-segmentation/index.html', root)));
for (const project of publishedProjects) {
  assert.equal(project.confidentiality, 'public');
  if (project.cover) {
    const image = await sharp(new URL(`public${project.cover.src}`, root).pathname).metadata();
    assert.equal(image.width, project.cover.w);
    assert.equal(image.height, project.cover.h);
    if (project.tier === 'featured') assert.equal(image.width / image.height, 16 / 9);
  }
}
const manifest = JSON.parse(await readFile(new URL('docs/media-manifest.json', root), 'utf8'));
for (const image of manifest.filter(m => m.file)) {
  const actual = await sharp(new URL(`public${image.file}`, root).pathname).metadata();
  assert.equal(actual.width, image.width, image.file);
  assert.equal(actual.height, image.height, image.file);
}
console.log(`${Object.keys(routeMetadata).length} built routes: metadata/schema/sitemap/alias parity passed; media dimensions passed; stale CV and draft excluded.`);
