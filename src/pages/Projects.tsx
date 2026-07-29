import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import { FIELD_BADGE, projects, type Field, type Origin } from '../data/projects';
import { useSeo } from '../hooks/useSeo';
import s from './Projects.module.css';

type FieldFilter = Field | 'all';
type OriginFilter = Origin | 'all';

const FIELD_OPTS: Array<{ value: FieldFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'ml', label: 'Machine Learning' },
  { value: 'ba', label: 'Business Analytics' },
  { value: 'web', label: 'Web Development' },
];

const ORIGIN_OPTS: Array<{ value: OriginFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'academic', label: 'Academic' },
  { value: 'personal', label: 'Personal' },
];

export default function Projects() {
  useSeo('Projects', 'Hands-on work across machine learning, business analytics and web development.');
  const [field, setField] = useState<FieldFilter>('all');
  const [origin, setOrigin] = useState<OriginFilter>('all');

  // Derived during render — no effects, no duplicated state.
  const visible = projects.filter(
    (p) => (field === 'all' || p.field === field) && (origin === 'all' || p.origin === origin),
  );

  const where = [
    field !== 'all' && `field = '${field}'`,
    origin !== 'all' && `origin = '${origin}'`,
  ].filter(Boolean);

  return (
    <main className="wrap">
      <section className={s.head}>
        <p className="eyebrow">
          run history <b>·</b> {projects.length} entries
        </p>
        <h1>Projects</h1>
        <p className={s.lede}>
          Hands-on work across machine learning, business analytics and web development. Filter by field or
          type, and open any project for the full write-up.
        </p>
      </section>

      <section aria-label="Project filters">
        <div className={s.filters}>
          <div className={s.group} role="group" aria-label="Filter by field">
            <span className={s.flabel}>Field</span>
            {FIELD_OPTS.map((o) => (
              <button
                key={o.value}
                type="button"
                className={s.chip}
                aria-pressed={field === o.value}
                onClick={() => setField(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className={s.group} role="group" aria-label="Filter by type">
            <span className={s.flabel}>Type</span>
            {ORIGIN_OPTS.map((o) => (
              <button
                key={o.value}
                type="button"
                className={s.chip}
                aria-pressed={origin === o.value}
                onClick={() => setOrigin(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Signature: the filters compose a real, visible query. */}
        <p className={s.query} aria-live="polite">
          <span className={s.kw}>SELECT</span> * <span className={s.kw}>FROM</span> projects
          {where.length > 0 && (
            <>
              {' '}
              <span className={s.kw}>WHERE</span> {where.join(' AND ')}
            </>
          )}
          ;<span className={s.result}> → {visible.length} rows</span>
        </p>

        <div className={s.list}>
          {visible.map((p, i) =>
            p.status === 'live' ? (
              <Reveal key={p.slug} delay={Math.min(i * 40, 200)}>
                <Link className={s.row} to={`/projects/${p.slug}`}>
                  <span className={s.main}>
                    <span className={s.titleRow}>
                      <span className={s.badge} data-field={p.field}>
                        <span className={s.badgeDot} aria-hidden="true" />
                        {FIELD_BADGE[p.field]}
                      </span>
                      <span className={s.title}>{p.title}</span>
                    </span>
                    <span className={s.desc}>{p.desc}</span>
                    <span className={s.tags}>
                      {p.tags.map((t) => (
                        <span key={t} className={s.tag}>
                          {t}
                        </span>
                      ))}
                    </span>
                  </span>
                  <ArrowRight className={s.arr} size={20} aria-hidden="true" />
                </Link>
              </Reveal>
            ) : (
              <Reveal key={p.slug} delay={Math.min(i * 40, 200)}>
                <div className={`${s.row} ${s.queued}`} aria-label={`${p.title} — coming soon`}>
                  <span className={s.main}>
                    <span className={s.titleRow}>
                      <span className={s.badge} data-field={p.field}>
                        <span className={s.badgeDot} aria-hidden="true" />
                        {FIELD_BADGE[p.field]}
                      </span>
                      <span className={s.title}>{p.title}</span>
                    </span>
                    <span className={s.desc}>{p.desc}</span>
                    <span className={s.tags}>
                      {p.tags.map((t) => (
                        <span key={t} className={s.tag}>
                          {t}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className={s.soon}>status: queued</span>
                </div>
              </Reveal>
            ),
          )}
        </div>

        {visible.length === 0 && <p className={s.empty}>No projects match these filters.</p>}
      </section>
    </main>
  );
}
