import { writeFileSync } from 'node:fs';
import { routeMetadata, canonicalUrl } from '../src/data/site.ts';
const output = Object.keys(routeMetadata).map(canonicalUrl).join('\n') + '\n';
writeFileSync(new URL('../public/sitemap.txt', import.meta.url), output);
console.log(`Updated sitemap: ${Object.keys(routeMetadata).length} canonical routes`);
