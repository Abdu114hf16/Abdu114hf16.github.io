import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { projects, publishedProjects, homeProjects, filterProjects, orderProjects, isResourceUrl, validateProjects } from '../src/data/projects.ts';
import { routeMetadata } from '../src/data/site.ts';
import { articleFiles } from '../src/data/articleFiles.ts';

test('ranking survives source-order changes without mutating the input', () => {
  const reversed = [...projects].reverse();
  assert.equal(orderProjects(reversed)[0].slug, 'olist-data-warehouse');
  assert.equal(reversed[0].slug, 'arabic-numeral-ocr-speech');
  assert.deepEqual(orderProjects(reversed).map(p => p.catalogRank), Array.from({ length: 13 }, (_, i) => i + 1));
});
test('domain union includes multidisciplinary projects without duplicates', () => {
  const result = filterProjects(projects, ['data-science', 'ai-ml']);
  assert.ok(result.some(p => p.slug === 'medical-cost-prediction'));
  assert.ok(result.every(p => p.domains.some(d => ['data-science', 'ai-ml'].includes(d))));
  assert.equal(new Set(result.map(p => p.slug)).size, result.length);
  assert.equal(filterProjects([], ['supporting-software']).length, 0);
});
test('draft visibility is enforced even with matching filters', () => {
  const draft = { ...projects[0], status: 'draft' };
  assert.deepEqual(filterProjects([draft], draft.domains), []);
});
test('each published project has build metadata and a real article; drafts have neither route nor listing', () => {
  for (const p of projects) {
    const route = `/projects/${p.slug}`;
    if (p.status === 'published') {
      assert.equal(routeMetadata[route].description, p.seoDescription);
      assert.ok(existsSync(new URL(`../src/pages/articles/${articleFiles[p.slug]}`, import.meta.url)));
    } else {
      assert.ok(!routeMetadata[route]);
      assert.ok(!publishedProjects.includes(p));
    }
  }
});
test('resource validation rejects executable, protocol-relative and credentialed URLs', () => {
  for (const url of ['javascript:alert(1)', '//other.test', 'http://example.com', 'https://user:pass@example.com', '/docs/../private', '/\\evil.test', '']) assert.equal(isResourceUrl(url), false, url);
  for (const url of ['https://github.com/Abdu114hf16', '/docs/CFD_Report.pdf']) assert.equal(isResourceUrl(url), true, url);
});
test('metadata validator rejects duplicate slugs and non-public projects', () => {
  assert.throws(() => validateProjects([projects[0], projects[0]]), /duplicate slug/);
  assert.throws(() => validateProjects([{ ...projects[0], confidentiality: 'private' }]), /Only public/);
  assert.doesNotThrow(() => validateProjects(projects));
});

test('Home keeps four specific projects independently of catalog ranking', () => {
  assert.deepEqual(homeProjects.map(p => p.slug), ['olist-data-warehouse', 'medical-cost-prediction', 'optimizing-donor-outreach', 'income-inflation-purchasing-power']);
  assert.deepEqual(publishedProjects.slice(0, 3).map(p => p.slug), ['olist-data-warehouse', 'eventia', 'interactive-saudi-arabia-discovery']);
  assert.deepEqual(publishedProjects.slice(-4).map(p => p.slug), ['playstation-disc-sentiment', 'boolean-search-engine', 'handwritten-digit-recognition', 'arabic-numeral-ocr-speech']);
});

test('editorial ranks cannot silently fall back to source order', () => {
  assert.throws(() => validateProjects([projects[0], { ...projects[1], featuredRank: projects[0].featuredRank }]), /featured rank/);
  assert.throws(() => validateProjects([{ ...projects[0], featuredRank: 1.5 }]), /featured rank/);
  assert.throws(() => validateProjects([{ ...projects[0], tier: 'archive' }]), /Non-featured/);
});
