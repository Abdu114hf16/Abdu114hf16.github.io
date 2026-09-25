import { lazy, type ComponentType } from 'react';
import { useParams } from 'react-router';
import { publishedProjects } from '../../data/projects';
import { articleFiles } from '../../data/articleFiles';
import NotFound from '../NotFound';

const modules = import.meta.glob<{ default: ComponentType }>('./*.tsx');
const articles = Object.fromEntries(publishedProjects.map(p => {
  const loader = modules[`./${articleFiles[p.slug]}`];
  if (!loader) throw new Error(`Missing published article: ${p.slug}`);
  return [p.slug, lazy(loader)];
}));

export default function Article() {
  const { slug } = useParams();
  const Body = slug && Object.hasOwn(articles, slug) ? articles[slug] : undefined;
  if (!Body) return <NotFound />;
  // Let the layout boundary keep content and footer together during loading.
  return <Body />;
}
