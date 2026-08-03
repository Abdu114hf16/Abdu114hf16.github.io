import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { loadDashData, type DashData } from './data';
import { useSeo } from '../../hooks/useSeo';
import s from './PsDashboard.module.css';

/* ── the project's own PS-brand theming (kept verbatim from the original) ── */

const THEMES: Record<string, Record<string, string>> = {
  'PS Blue': { '--bg': '#0E1320', '--tile': '#151B2B', '--tile2': '#1B2337', '--border': '#233047', '--txt': '#FFFFFF', '--muted': '#8A94A6' },
  Midnight: { '--bg': '#05070D', '--tile': '#0E1422', '--tile2': '#131B2B', '--border': '#1C2740', '--txt': '#FFFFFF', '--muted': '#7F8AA0' },
  'PS5 Light': { '--bg': '#EEF2F8', '--tile': '#FFFFFF', '--tile2': '#F3F6FB', '--border': '#D7DEEA', '--txt': '#0E1320', '--muted': '#5B6577' },
  Carbon: { '--bg': '#0A0A0C', '--tile': '#151518', '--tile2': '#1C1C20', '--border': '#2A2A30', '--txt': '#FFFFFF', '--muted': '#8B8F98' },
  Retro: { '--bg': '#1B1B1F', '--tile': '#27272D', '--tile2': '#2F2F36', '--border': '#3A3A42', '--txt': '#EDEDED', '--muted': '#9AA0AA' },
};
const THEME_SWATCH: Record<string, string> = {
  'PS Blue': '#0070D1', Midnight: '#0091FF', 'PS5 Light': '#EEF2F8', Carbon: '#2E9BFF', Retro: '#9AA7FF',
};
const ACCENTS: Record<string, [string, string]> = {
  Blue: ['#0070D1', '#2E9BFF'], Cyan: ['#00B7C3', '#4FD6DF'], Violet: ['#6A5CFF', '#9D94FF'], Magenta: ['#D42E86', '#FF6BB0'],
};
const POS_COLORS: Record<string, string> = { Yellow: '#FFC400', Green: '#00A94F', Cyan: '#00B7C3' };

const SENT = ['negative', 'neutral', 'positive'] as const;
const SC = ['neg', 'neu', 'pos'] as const;
const SYM = ['◯', '◻', '△'] as const; // negative, neutral, positive
const COL = ['var(--neg)', 'var(--neu)', 'var(--pos)'] as const;

const fmt = (n: number) => n.toLocaleString('en-US');

interface Filters {
  sent: number | null;
  day: number | null;
  lang: string | null;
}

function Marks() {
  return (
    <div className={s.shapes} aria-hidden="true">
      <span className={s.t}>&#9651;</span>
      <span className={s.c}>&#9711;</span>
      <span className={s.x}>&#10005;</span>
      <span className={s.sq}>&#9723;</span>
    </div>
  );
}

export default function PsDashboard() {
  useSeo('PlayStation Disc Sentiment - Interactive Dashboard');
  const [data, setData] = useState<DashData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState<Filters>({ sent: null, day: null, lang: null });
  const [dist, setDist] = useState<'donut' | 'bar'>('donut');
  const [density, setDensity] = useState<'normal' | 'compact'>('normal');
  const [corner, setCorner] = useState<'round' | 'sharp'>('round');
  const [motif, setMotif] = useState(true);
  const [theme, setTheme] = useState('PS Blue');
  const [accent, setAccent] = useState('Blue');
  const [posColor, setPosColor] = useState('Yellow');
  const [remoteOpen, setRemoteOpen] = useState(false);

  useEffect(() => {
    let on = true;
    loadDashData().then(
      (d) => on && setData(d),
      (e: Error) => on && setError(e.message),
    );
    return () => {
      on = false;
    };
  }, []);

  const toggleSent = (v: number) => setF((p) => ({ ...p, sent: p.sent === v ? null : v }));
  const toggleDay = (v: number) => setF((p) => ({ ...p, day: p.day === v ? null : v }));
  const setLang = (v: string | null) => setF((p) => ({ ...p, lang: v }));
  const reset = () => setF({ sent: null, day: null, lang: null });

  /* The cube's keys are parsed once per dataset, not once per filter change. */
  const cells = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.cube).map(([key, n]) => {
      const [day, lang, sent] = key.split('|');
      return { day: Number(day), lang: lang ?? '', sent: Number(sent), n };
    });
  }, [data]);

  /* One pass over the 77-cell cube computes every aggregate (cross-filter style:
     each visual ignores its own dimension's filter). */
  const agg = useMemo(() => {
    if (!data) return null;
    const c = [0, 0, 0];
    let n = 0;
    const dc = [
      [0, 0, 0],
      [0, 0, 0],
    ];
    const lm: Record<string, [number, number, number]> = {};
    for (const cell of cells) {
      const { day, lang, sent } = cell;
      const mS = f.sent === null || sent === f.sent;
      const mD = f.day === null || day === f.day;
      const mL = f.lang === null || lang === f.lang;
      if (mS && mD && mL) {
        n += cell.n;
        c[sent] += cell.n;
      }
      if (mS && mL) dc[day][sent] += cell.n;
      if (mS && mD) (lm[lang] ??= [0, 0, 0])[sent] += cell.n;
    }
    const langs = Object.entries(lm)
      .map(([l, v]) => ({ l, v, t: v[0] + v[1] + v[2] }))
      .sort((a, b) => b.t - a.t)
      .slice(0, 3);
    const samples = data.samples
      .filter(
        (x) =>
          (f.sent === null || x.s === f.sent) &&
          (f.day === null || x.d === f.day) &&
          (f.lang === null || x.l === f.lang),
      )
      .slice(0, 3);
    return { c, n, dc, langs, samples };
  }, [data, cells, f]);

  /* Language dropdown options: unfiltered, computed once per dataset. */
  const langOptions = useMemo(() => {
    const m: Record<string, number> = {};
    for (const cell of cells) m[cell.lang] = (m[cell.lang] ?? 0) + cell.n;
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [cells]);

  const rootStyle = {
    ...THEMES[theme],
    '--ps': ACCENTS[accent][0],
    '--ps2': ACCENTS[accent][1],
    '--pos': POS_COLORS[posColor],
    '--radius': corner === 'sharp' ? '0px' : '10px',
  } as CSSProperties;

  if (error) {
    return (
      <div className={s.root} style={rootStyle}>
        <main className={s.page}>
          <p className={s.status}>Dataset could not load ({error}). Refresh to retry.</p>
        </main>
      </div>
    );
  }

  if (!data || !agg) {
    return (
      <div className={s.root} style={rootStyle}>
        <main className={s.page}>
          <p className={s.status}>loading 56,677 reactions…</p>
        </main>
      </div>
    );
  }

  const { c, n, dc } = agg;
  const pct = (x: number) => (n ? (100 * x) / n : 0);
  const pn = pct(c[0]);
  const pu = pct(c[1]);
  const pp = pct(c[2]);
  /* Share positive minus share negative, on the class labels. Named for what it
     is: it was previously surfaced as "Avg Sentiment" over a "scale -1 to +1",
     which reads as the mean of a continuous score and is not what this computes.
     The write-up's -0.44 IS that continuous mean, taken over the model's class
     probabilities, and the two are consistent rather than contradictory: a soft
     score is always less extreme than the hard label it came from, so a
     probability mean must sit closer to zero than this -0.528. Filtering to a
     single class makes the difference obvious, since net sentiment over an
     all-positive subset is exactly +1.00 while a score mean could not be. */
  const net = n ? (c[2] - c[0]) / n : 0;
  const dtot = [dc[0][0] + dc[0][1] + dc[0][2], dc[1][0] + dc[1][1] + dc[1][2]];
  const dmax = Math.max(dtot[0], dtot[1], 1);
  const top = c[0] >= c[1] && c[0] >= c[2] ? 0 : c[2] >= c[1] ? 2 : 1;

  return (
    <div className={`${s.root} ${density === 'compact' ? s.compact : ''}`} style={rootStyle}>
      <div className={s.page}>
        {/* This route renders standalone, outside the shared Layout, so it has to
            carry its own landmarks: header, nav, main and footer. */}
        <header className={s.barTop}>
          <div className={s.brand}>
            <img src="/img/ps-logo.webp" alt="PlayStation logo" width="160" height="160" />
            <div>
              <h1>END OF DISCS - PUBLIC REACTION</h1>
              <div className={s.sub}>
                X / TWITTER · SENTIMENT VIA PYTHON NLP · {fmt(data.total)} REACTIONS
              </div>
            </div>
          </div>
          {motif && <Marks />}
        </header>

        <div className={s.filters}>
          <nav aria-label="Breadcrumb">
            <Link to="/projects/playstation-disc-sentiment" className={s.backLink} title="Back to the write-up">
              <ArrowLeft size={13} aria-hidden="true" /> write-up
            </Link>
          </nav>
          <span className={s.lbl}>Sentiment</span>
          {([0, 1, 2] as const).map((v) => (
            <button
              key={v}
              type="button"
              className={`${s.chip} ${s[SC[v]]}`}
              aria-pressed={f.sent === v}
              onClick={() => toggleSent(v)}
            >
              {SYM[v]} {SENT[v][0].toUpperCase() + SENT[v].slice(1)}
            </button>
          ))}
          <span className={s.lbl}>Day</span>
          {data.dayLabels.map((d, i) => (
            <button key={d} type="button" className={s.chip} aria-pressed={f.day === i} onClick={() => toggleDay(i)}>
              {d}
            </button>
          ))}
          <span className={s.lbl}>Language</span>
          <select
            className={s.chip}
            value={f.lang ?? ''}
            onChange={(e) => setLang(e.target.value || null)}
            aria-label="Filter by language"
          >
            <option value="">All</option>
            {langOptions.map(([code, count]) => (
              <option key={code} value={code}>
                {data.langNames[code] ?? code} ({fmt(count)})
              </option>
            ))}
          </select>
          <button type="button" className={s.reset} onClick={reset}>
            <RotateCcw size={12} aria-hidden="true" /> Reset filters
          </button>
        </div>

        <main>
          <div className={s.kpis}>
            <div className={`${s.tile} ${s.kpi} ${s.kpiAccent}`}>
              <h2>Reactions</h2>
              <div className={`${s.big} ${s.bigPs}`}>{fmt(n)}</div>
              <div className={s.cap}>
                {n === data.total ? 'of all reactions' : `${((100 * n) / data.total).toFixed(1)}% of total`}
              </div>
            </div>
            <div className={`${s.tile} ${s.kpi}`}>
              <h2>% Negative</h2>
              <div className={`${s.big} ${s.bigNeg}`}>{pn.toFixed(1)}%</div>
              <div className={s.cap}>{fmt(c[0])} reactions</div>
            </div>
            <div className={`${s.tile} ${s.kpi}`}>
              <h2>% Positive</h2>
              <div className={`${s.big} ${s.bigPos}`}>{pp.toFixed(1)}%</div>
              <div className={s.cap}>{fmt(c[2])} reactions</div>
            </div>
            <div className={`${s.tile} ${s.kpi}`}>
              <h2>Net Sentiment</h2>
              <div className={`${s.big} ${net < 0 ? s.bigNeg : s.bigPos}`}>
                {(net >= 0 ? '+' : '−') + Math.abs(net).toFixed(2)}
              </div>
              <div className={s.cap}>share positive &minus; share negative</div>
            </div>
          </div>

          <div className={s.row2}>
            <div className={s.tile}>
              <h2>
                Sentiment Split <span className={s.hint}>(click to filter)</span>
              </h2>
              <div className={s.donutwrap}>
                {dist === 'bar' ? (
                  <div className={s.distbar}>
                    {([0, 1, 2] as const).map((v) => {
                      const p = [pn, pu, pp][v];
                      return (
                        <button
                          key={v}
                          type="button"
                          style={{ background: COL[v], width: `${p}%` }}
                          onClick={() => toggleSent(v)}
                          aria-label={`${SENT[v]} ${p.toFixed(1)}%`}
                        >
                          {p > 7 ? `${Math.round(p)}%` : ''}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className={s.donut}
                    style={{
                      background: `conic-gradient(var(--neg) 0 ${pn}%, var(--neu) ${pn}% ${pn + pu}%, var(--pos) ${pn + pu}% 100%)`,
                    }}
                  >
                    <div className={s.mid}>
                      <b>{Math.round(pct(c[top]))}%</b>
                      <span>{SENT[top].toUpperCase()}</span>
                    </div>
                  </div>
                )}
                <div className={s.legend}>
                  {([0, 1, 2] as const).map((i) => (
                    <button key={i} type="button" className={s.li} onClick={() => toggleSent(i)}>
                      <span className={s.dot} style={{ background: COL[i] }} />
                      {SENT[i][0].toUpperCase() + SENT[i].slice(1)}&nbsp;<b>{pct(c[i]).toFixed(1)}%</b>&nbsp;
                      <span className={s.liCount}>
                        ({SYM[i]} {fmt(c[i])})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={s.tile}>
              <h2>
                Reactions by Day <span className={s.hint}>(click a bar to filter)</span>
              </h2>
              <div className={s.days}>
                {data.dayLabels.map((label, d) => {
                  const t = dtot[d];
                  const h = (210 * t) / dmax;
                  return (
                    <button
                      key={label}
                      type="button"
                      className={s.daycol}
                      onClick={() => toggleDay(d)}
                      aria-pressed={f.day === d}
                    >
                      <div className={s.daytot}>{fmt(t)}</div>
                      <div className={s.stack} style={{ height: `${h}px` }}>
                        <div style={{ background: 'var(--neg)', height: `${t ? (100 * dc[d][0]) / t : 0}%` }} />
                        <div style={{ background: 'var(--neu)', height: `${t ? (100 * dc[d][1]) / t : 0}%` }} />
                        <div style={{ background: 'var(--pos)', height: `${t ? (100 * dc[d][2]) / t : 0}%` }} />
                      </div>
                      <div className={s.daylbl}>{label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={s.row3}>
            <div className={s.tile}>
              <h2>
                Sentiment by Language{' '}
              <span className={s.hint}>(share within each language, click a row to filter)</span>
              </h2>
              <div className={s.lang}>
                {agg.langs.length === 0 && <span className={s.none}>No rows.</span>}
                {agg.langs.map(({ l, v, t }) => (
                  <button
                    key={l}
                    type="button"
                    className={s.lrow}
                    onClick={() => setLang(f.lang === l ? null : l)}
                    aria-pressed={f.lang === l}
                  >
                    <span className={s.lname}>{data.langNames[l] ?? l}</span>
                    <span className={s.lbar}>
                      <span style={{ background: 'var(--neg)', width: `${(100 * v[0]) / t}%` }} />
                      <span style={{ background: 'var(--neu)', width: `${(100 * v[1]) / t}%` }} />
                      <span style={{ background: 'var(--pos)', width: `${(100 * v[2]) / t}%` }} />
                    </span>
                    <span className={s.lcount}>{fmt(t)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={s.tile}>
              <h2>
                Most-Viral Reactions <span className={s.hint}>(current filter)</span>
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>Sentiment</th>
                    <th>Reaction</th>
                    <th className={s.thRight}>Likes</th>
                  </tr>
                </thead>
                <tbody>
                  {agg.samples.length === 0 && (
                    <tr>
                      <td colSpan={3} className={s.none}>
                        No sample tweets match this filter.
                      </td>
                    </tr>
                  )}
                  {agg.samples.map((x, i) => (
                    <tr key={i}>
                      <td>
                        <span className={`${s.tchip} ${s[`tchip_${SC[x.s]}`]}`}>
                          {SYM[x.s]} {SC[x.s].toUpperCase()}
                        </span>
                      </td>
                      <td>{x.t}</td>
                      <td className={s.likes}>{fmt(x.k)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <footer className={s.foot}>
          &#9651; positive · &#9723; neutral · &#9711; negative &nbsp; Data: X/Twitter reactions to PlayStation's
          1 July 2026 announcement that new games stop shipping on discs in January 2028 · Sentiment:
          CardiffNLP twitter-XLM-RoBERTa (Python)
        </footer>
      </div>

      {/* REMOTE control */}
      <button type="button" className={s.remoteToggle} onClick={() => setRemoteOpen((o) => !o)}>
        &#9651;&#9711;&#10005;&#9723; REMOTE
      </button>
      {remoteOpen && (
        <div className={s.remote}>
          <div className={s.grp}>
            <h3>&#9679; Colors</h3>
            <div className={s.swatches}>
              {Object.keys(THEMES).map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`${s.sw} ${theme === name ? s.swActive : ''}`}
                  style={{ background: THEME_SWATCH[name] }}
                  title={name}
                  onClick={() => setTheme(name)}
                >
                  {theme === name && <span>{name}</span>}
                </button>
              ))}
            </div>
            <div className={s.optlbl}>Accent</div>
            <div className={s.swatches}>
              {Object.keys(ACCENTS).map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`${s.sw} ${accent === name ? s.swActive : ''}`}
                  style={{ background: ACCENTS[name][0] }}
                  title={name}
                  onClick={() => setAccent(name)}
                >
                  {accent === name && <span>{name}</span>}
                </button>
              ))}
            </div>
            <div className={s.optlbl}>Positive color</div>
            <div className={s.swatches}>
              {Object.keys(POS_COLORS).map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`${s.sw} ${posColor === name ? s.swActive : ''}`}
                  style={{ background: POS_COLORS[name] }}
                  title={`${name} positive`}
                  onClick={() => setPosColor(name)}
                >
                  {posColor === name && <span>{name}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className={s.divider} />
          <div className={s.grp}>
            <h3>&#9723; Style &amp; Layout</h3>
            <div className={s.optlbl}>Distribution chart</div>
            <div className={s.opts}>
              <button type="button" className={s.opt} aria-pressed={dist === 'donut'} onClick={() => setDist('donut')}>
                Donut
              </button>
              <button type="button" className={s.opt} aria-pressed={dist === 'bar'} onClick={() => setDist('bar')}>
                Bar
              </button>
            </div>
            <div className={s.optlbl}>Density</div>
            <div className={s.opts}>
              <button
                type="button"
                className={s.opt}
                aria-pressed={density === 'normal'}
                onClick={() => setDensity('normal')}
              >
                Comfortable
              </button>
              <button
                type="button"
                className={s.opt}
                aria-pressed={density === 'compact'}
                onClick={() => setDensity('compact')}
              >
                Compact
              </button>
            </div>
            <div className={s.optlbl}>Corners</div>
            <div className={s.opts}>
              <button type="button" className={s.opt} aria-pressed={corner === 'round'} onClick={() => setCorner('round')}>
                Rounded
              </button>
              <button type="button" className={s.opt} aria-pressed={corner === 'sharp'} onClick={() => setCorner('sharp')}>
                Sharp
              </button>
            </div>
            <div className={s.optlbl}>Controller motif</div>
            <div className={s.opts}>
              <button type="button" className={s.opt} aria-pressed={motif} onClick={() => setMotif(true)}>
                On
              </button>
              <button type="button" className={s.opt} aria-pressed={!motif} onClick={() => setMotif(false)}>
                Off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
