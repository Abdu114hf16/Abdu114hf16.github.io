import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { DOMAIN_LABEL, type Project } from '../data/projects';
import s from './ProjectCard.module.css';

export default function ProjectCard({ project: p }: { project: Project }) {
  const metric = p.metrics[p.home?.metric ?? 0];
  return (
    <Link className={s.card} to={`/projects/${p.slug}`} aria-labelledby={`${p.slug}-title ${p.slug}-action`}>
      <div className={s.heading}>
        <div>
          <p className={s.domain}>{DOMAIN_LABEL[p.domains[0]]}</p>
          <h3 id={`${p.slug}-title`}>{p.title}</h3>
        </div>
        {p.cover && <img className={s.preview} src={p.cover.src} alt="" width={p.cover.w} height={p.cover.h} loading="lazy" />}
      </div>
      <p className={s.summary}>{p.home?.summary ?? p.summary}</p>
      <div className={s.bottom}>
        <span className={s.metric}><strong>{metric.value}</strong> {metric.label}</span>
        <span id={`${p.slug}-action`} className={s.action}>View project <ArrowUpRight size={16} aria-hidden="true" /></span>
      </div>
    </Link>
  );
}
