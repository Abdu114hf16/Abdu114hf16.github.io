import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, ExternalLink, FileText, LayoutDashboard } from 'lucide-react';
import { GithubIcon } from '../../components/BrandIcons';
import { useSeo } from '../../hooks/useSeo';
import { bySlug, CONTEXT_LABEL, DOMAIN_LABEL, isResourceUrl } from '../../data/projects';
import s from './ArticleLayout.module.css';

interface Meta {
  title: string;
  seoTitle: string;
  lede: string;
  hero?: { src: string; alt: string; w: number; h: number; caption?: string };
}

export default function ArticleLayout({ meta, slug, children }: { meta?: Meta; slug?: string; children: ReactNode }) {
  const params = useParams();
  const project = bySlug(slug ?? params.slug ?? '');
  useSeo(project?.title ?? meta?.seoTitle, project?.seoDescription ?? meta?.lede);
  const hero = meta?.hero ?? project?.cover;
  return (
    <main id="main" tabIndex={-1} className="wrap">
      <article className={s.article}>
        <nav className={s.backRow} aria-label="Breadcrumb">
          <Link className={s.back} to="/projects" aria-label="Back to Projects" title="Back to Projects">
            <ArrowLeft size={18} aria-hidden="true" /> projects
          </Link>
          {project && <span className={s.breadcrumb} aria-current="page">{project.title}</span>}
        </nav>
        {project && <div className={s.badges}><span>{CONTEXT_LABEL[project.context]}</span>{project.domains.map(d => <span key={d}>{DOMAIN_LABEL[d]}</span>)}</div>}
        <h1>{meta?.title ?? project?.title}</h1>
        {project?.contextDetail && <p className={s.context}>{project.contextDetail}</p>}
        <p className={s.lede}>{meta?.lede ?? project?.outcome}</p>
        {project && <dl className={s.metrics}>{project.metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl>}
        {project && project.resources.length > 0 && <BtnRow>{project.resources.slice(0, 2).map(resource => <ResourceLink key={resource.href} kind={resource.kind} href={resource.href}>{resource.label}</ResourceLink>)}</BtnRow>}
        {hero && <figure className={s.figure}><img
          className={s.hero}
          src={hero.src}
          alt={hero.alt}
          width={hero.w}
          height={hero.h}
          style={{ aspectRatio: `${hero.w} / ${hero.h}` }}
          fetchPriority="high"
        /><figcaption>{hero.caption ?? hero.alt}</figcaption></figure>}
        {children}
      </article>
    </main>
  );
}

/* ── shared article pieces ─────────────────────────────────────── */

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={s.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function TechStack({ items }: { items: string[] }) {
  return (
    <ul className={s.stack}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

/** A numbered business question: the numbering is real content here. */
export function Bq({ n, q, children }: { n: number; q: string; children: ReactNode }) {
  return (
    <div className={s.bq}>
      <p className={s.bqQ}>
        <span className={s.bqN}>Q{n}</span> {q}
      </p>
      {children}
    </div>
  );
}

export function Shot({ src, alt, w, h, caption }: { src: string; alt: string; w: number; h: number; caption?: string }) {
  return <figure className={s.figure}><a href={src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size figure: ${alt}`}><img className={s.shot} src={src} alt={alt} width={w} height={h} loading="lazy" /></a><figcaption>{caption ?? alt}</figcaption></figure>;
}

export function DataTable({ caption, headers, rows }: { caption: string; headers: string[]; rows: string[][] }) {
  return <div className={s.tableWrap} tabIndex={0} role="region" aria-label={caption}><table className={s.table}><caption>{caption}</caption><thead><tr>{headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

export function SrcCard({ intro, children }: { intro: string; children: ReactNode }) {
  return (
    <div className={s.srcCard}>
      <p>{intro}</p>
      {children}
    </div>
  );
}

export function BtnRow({ children }: { children: ReactNode }) {
  return <div className={s.btnRow}>{children}</div>;
}

const BTN_ICON = {
  repo: GithubIcon,
  report: FileText,
  demo: ExternalLink,
  dashboard: LayoutDashboard,
} as const;

export function ResourceLink({
  kind,
  href,
  children,
}: {
  kind: keyof typeof BTN_ICON;
  href: string;
  children: ReactNode;
}) {
  const Icon = BTN_ICON[kind];
  if (!isResourceUrl(href)) return null;
  const external = href.startsWith('http') || href.endsWith('.pdf');
  return (
    <a
      className={`${s.btn} ${kind === 'repo' ? s.btnDark : ''}`}
      href={href}
      target="_blank"
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <Icon size={17} aria-hidden /> {children}
    </a>
  );
}
