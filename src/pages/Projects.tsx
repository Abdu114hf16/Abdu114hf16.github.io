import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import { DOMAIN_LABEL, DOMAIN_TONE, TIER_LABEL, filterProjects, publishedProjects, type Domain, type ProjectTier } from '../data/projects';
import { useSeo } from '../hooks/useSeo';
import s from './Projects.module.css';

export default function Projects() {
  useSeo('Projects');
  const [domains, setDomains] = useState<Domain[]>([]);
  const visible = filterProjects(publishedProjects, domains);
  const toggleDomain = (domain: Domain) => setDomains(previous => previous.includes(domain) ? previous.filter(d => d !== domain) : [...previous, domain]);

  return (
    <main id="main" tabIndex={-1} className="wrap">
      <section className={s.head}>
        <p className="eyebrow">project collection <b>·</b> {publishedProjects.length} projects</p>
        <h1>Projects</h1>
        <p className={s.lede}>Data engineering, databases, software, and analytics projects—from warehouse foundations to useful products and predictive models.</p>
      </section>
      <section aria-label="Project filters">
        <div className={s.filters}>
          <div className={s.group} role="group" aria-label="Filter by domain">
            <span className={s.flabel}>Domain</span>
            <button className={s.chip} type="button" aria-pressed={domains.length === 0} onClick={() => setDomains([])}>All</button>
            {(Object.entries(DOMAIN_LABEL) as [Domain, string][]).map(([value, label]) => (
              <button key={value} type="button" className={s.chip} aria-pressed={domains.includes(value)} onClick={() => toggleDomain(value)}>{label}</button>
            ))}
          </div>
        </div>
        <p className={s.query}>
          <span className={s.kw}>SELECT</span> projects <span className={s.kw}>WHERE</span>{' '}
          {domains.length ? `domain matches ${domains.map(d => DOMAIN_LABEL[d]).join(' OR ')}` : 'any domain'}
          ;
        </p>
        <p className={s.result} role="status" aria-live="polite" aria-atomic="true">{visible.length} {visible.length === 1 ? 'project' : 'projects'} found.</p>
      </section>
      {(Object.keys(TIER_LABEL) as ProjectTier[]).map(tier => {
        const group = visible.filter(p => p.tier === tier);
        return group.length ? (
          <section key={tier} className={s.tier} aria-labelledby={`tier-${tier}`}>
            <h2 id={`tier-${tier}`}>{TIER_LABEL[tier]}</h2>
            <div className={s.list}>
              {group.map(p => (
                <Reveal key={p.slug}>
                  <Link className={s.row} to={`/projects/${p.slug}`}>
                    <div className={s.main}>
                      <div className={s.titleRow}>
                        {p.domains.slice(0, 3).map(domain => <span key={domain} className={s.badge} data-field={DOMAIN_TONE[domain]}><span className={s.badgeDot} aria-hidden="true" />{DOMAIN_LABEL[domain]}</span>)}
                      </div>
                      <h3 className={s.title}>{p.title}</h3>
                      <p className={s.desc}>{p.summary}</p>
                      <p className={s.outcome}>{p.outcome}</p>
                      <div className={s.tags}>{p.tags.slice(0, 4).map(tag => <span className={s.tag} key={tag}>{tag}</span>)}</div>
                      <span className={s.read}>View project</span>
                    </div>
                    <ArrowRight className={s.arr} size={20} aria-hidden="true" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        ) : null;
      })}
      {visible.length === 0 && <p className={s.empty}>No projects match these filters. Try another domain or reset to All.</p>}
      <p className={s.method}>Each project documents its approach, results, limitations, and contribution. Source and course attribution are included in the project details.</p>
    </main>
  );
}
