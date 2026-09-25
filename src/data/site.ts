import { publishedProjects } from './projects.ts';
import { profile } from './profile.ts';

export const ORIGIN = 'https://alshammari.dev';
export const HOME_TITLE = 'Abdullah Alshammari | Data Science, BI, Data Engineering & AI';
export const HOME_DESCRIPTION = 'Computer Science graduate with First-Class Honors building decision-ready solutions across data science, business intelligence, data engineering, and AI.';
export const legacyRoutes: Record<string, string> = {
  '/index.html': '/', '/cv.html': '/cv', '/projects.html': '/projects', '/contact.html': '/contact',
  '/blog/medical-cost-prediction.html': '/projects/medical-cost-prediction',
  '/blog/playstation-disc-sentiment.html': '/projects/playstation-disc-sentiment',
  '/blog/eventia.html': '/projects/eventia',
  '/blog/commercial-flights-delays.html': '/projects/commercial-flights-delays',
  '/blog/ps-disc-dashboard.html': '/projects/playstation-disc-sentiment/dashboard',
  '/projects/optimizing-donors-outreach': '/projects/optimizing-donor-outreach',
  '/projects/sms-spam-classifier': '/projects/sms-spam-model-comparison',
  '/projects/interactive-ksa-discovery': '/projects/interactive-saudi-arabia-discovery',
};
export const canonicalUrl = (path: string) => `${ORIGIN}${path === '/' ? '/' : `${path.replace(/\/$/, '')}/`}`;
export interface PageMeta { title: string; description: string; projectSlug?: string }
export const routeMetadata: Record<string, PageMeta> = {
  '/': { title: HOME_TITLE, description: HOME_DESCRIPTION },
  '/experience': { title: `Experience | ${profile.name}`, description: 'Professional experience in data preparation, dimensional modeling, database design and internal analytics during cooperative training at Ojoor Business Solutions.' },
  '/cv': { title: `CV | ${profile.name}`, description: 'Computer Science graduate with First-Class Honors: cooperative training, education, skills and credentials across data science, BI, data engineering and AI.' },
  '/projects': { title: `Data Engineering & Software Projects | ${profile.name}`, description: 'Data engineering, database, software and analytics projects, including an Olist PostgreSQL warehouse, event management, BI dashboards and machine learning.' },
  '/contact': { title: `Contact | ${profile.name}`, description: 'Contact Abdullah Alshammari about graduate and entry-level opportunities across data science, business intelligence, data engineering, and applied AI.' },
  '/projects/playstation-disc-sentiment/dashboard': { title: `PlayStation Sentiment Dashboard | ${profile.name}`, description: 'Explore 56,677 collected public reactions by sentiment, day and language, with transparent net-sentiment calculations and sampling limitations.' },
  ...Object.fromEntries(publishedProjects.map(p => [`/projects/${p.slug}`, { title: `${p.title} Project | ${profile.name}`, description: p.seoDescription, projectSlug: p.slug }])),
};

export const person = {
  '@type': 'Person', '@id': `${ORIGIN}/#person`, name: profile.name, url: `${ORIGIN}/`,
  description: HOME_DESCRIPTION, jobTitle: 'Computer Science Graduate',
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'King Saud University' },
  homeLocation: { '@type': 'Place', name: profile.location },
  sameAs: [profile.github, profile.linkedin], knowsAbout: profile.disciplines,
};
export function structuredData(path: string) {
  const meta = routeMetadata[path];
  return { '@context': 'https://schema.org', '@graph': [person, ...(meta?.projectSlug ? [{
    '@type': 'TechArticle', headline: publishedProjects.find(p => p.slug === meta.projectSlug)?.title,
    description: meta.description, url: canonicalUrl(path), author: { '@id': `${ORIGIN}/#person` },
    mainEntityOfPage: canonicalUrl(path), inLanguage: 'en',
  }] : [])] };
}
