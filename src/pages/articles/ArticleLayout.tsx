import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ExternalLink, FileText, LayoutDashboard } from 'lucide-react';
import { GithubIcon } from '../../components/BrandIcons';
import { useSeo } from '../../hooks/useSeo';
import s from './ArticleLayout.module.css';

interface Meta {
  title: string;
  seoTitle: string;
  lede: string;
  hero: { src: string; alt: string; w: number; h: number };
}

export default function ArticleLayout({ meta, children }: { meta: Meta; children: ReactNode }) {
  useSeo(meta.seoTitle, meta.lede);
  return (
    <main className="wrap">
      <article className={s.article}>
        <p className={s.backRow}>
          <Link className={s.back} to="/projects" aria-label="Back to Projects" title="Back to Projects">
            <ArrowLeft size={18} aria-hidden="true" /> projects
          </Link>
        </p>
        <h1>{meta.title}</h1>
        <p className={s.lede}>{meta.lede}</p>
        <img
          className={s.hero}
          src={meta.hero.src}
          alt={meta.hero.alt}
          width={meta.hero.w}
          height={meta.hero.h}
          fetchPriority="high"
        />
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

/** A numbered business question — the numbering is real content here. */
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

export function Shot({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  return <img className={s.shot} src={src} alt={alt} width={w} height={h} loading="lazy" />;
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
