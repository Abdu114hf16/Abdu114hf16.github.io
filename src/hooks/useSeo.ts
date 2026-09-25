import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { canonicalUrl, routeMetadata, HOME_TITLE, HOME_DESCRIPTION, ORIGIN, structuredData } from '../data/site';
import { usePageNavigation } from './usePageNavigation';

export function useSeo(title?: string, description?: string) {
  usePageNavigation();
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, '') || '/';
  const metadata = routeMetadata[path];
  useEffect(() => {
    const fullTitle = metadata?.title ?? (title ? `${title} | Abdullah Alshammari` : HOME_TITLE);
    const desc = metadata?.description ?? description ?? HOME_DESCRIPTION;
    document.title = fullTitle;
    const set = (attribute: 'name' | 'property', name: string, value: string) => {
      let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.append(element); }
      element.content = value;
    };
    set('name', 'description', desc);
    set('name', 'robots', metadata ? 'index,follow' : 'noindex,follow');
    set('property', 'og:type', metadata?.projectSlug ? 'article' : 'website');
    set('property', 'og:title', fullTitle);
    set('property', 'og:description', desc);
    set('property', 'og:url', canonicalUrl(path));
    set('property', 'og:image', `${ORIGIN}/img/og-card.png`);
    set('property', 'og:image:alt', 'Abdullah Alshammari · Computer Science Graduate · Data Science, Business Intelligence, Data Engineering & AI');
    set('name', 'twitter:title', fullTitle);
    set('name', 'twitter:description', desc);
    set('name', 'twitter:image', `${ORIGIN}/img/og-card.png`);
    set('name', 'twitter:image:alt', 'Abdullah Alshammari · Computer Science Graduate · Data Science, Business Intelligence, Data Engineering & AI');
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
    canonical.href = canonicalUrl(path);
    let schema = document.querySelector<HTMLScriptElement>('#page-schema');
    if (!schema) { schema = document.createElement('script'); schema.id = 'page-schema'; schema.type = 'application/ld+json'; document.head.append(schema); }
    schema.textContent = metadata ? JSON.stringify(structuredData(path)).replace(/</g, '\\u003c') : '{}';
  }, [path, title, description, metadata]);
}
