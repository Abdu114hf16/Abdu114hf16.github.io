import type { CSSProperties } from 'react';
import s from './PipelineHero.module.css';

/*
 * Signature element: the elevator pitch, animated.
 * Raw scattered data drifts in → outliers are cleaned away at the
 * transform gate → an ordered model line draws itself → decision.
 * Reduced motion collapses the sequence to its final frame.
 */

/** Noisy-but-fixed raw points (deterministic; hand-jittered). */
const RAW: Array<[number, number]> = [
  [24, 168], [38, 96], [52, 200], [66, 140], [79, 62], [92, 178],
  [105, 118], [119, 210], [132, 84], [147, 152], [160, 196], [172, 108],
  [186, 58], [199, 170], [213, 132], [226, 74], [239, 190], [252, 148],
  [265, 100], [278, 176], [290, 126], [302, 88],
];

/** Outliers that get cleaned away when the gate engages. */
const OUTLIERS: Array<[number, number]> = [
  [58, 34], [148, 236], [246, 30],
];

/** The ordered model line the pipeline produces. */
const MODEL = '470,186 552,158 634,142 716,116 798,96 872,58';
const MODEL_PTS: Array<[number, number]> = [
  [470, 186], [552, 158], [634, 142], [716, 116], [798, 96],
];

/*
 * The narrative, declared once. It renders twice: as SVG labels on wide
 * screens, and as a real HTML list on narrow ones. The labels live inside a
 * 920-unit viewBox, so they scale with the graphic: at a 345px render width
 * they land near 4.3px and the sentence becomes a smear. Below 760px the SVG
 * labels are hidden and the list takes over at a fixed, readable size. Three
 * labels cannot share one row legibly on a phone at any font size, so the list
 * wraps instead of shrinking.
 */
const STAGES: Array<{ no: string; label: string; x: number; delay: number }> = [
  { no: '01', label: 'raw', x: 160, delay: 700 },
  { no: '02', label: 'clean · transform', x: 413, delay: 1500 },
  { no: '03', label: 'model → decide', x: 670, delay: 2600 },
];

const dl = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

export default function PipelineHero() {
  return (
    <div className={s.frame}>
      <svg
        className={s.svg}
        viewBox="0 0 920 264"
        role="img"
        aria-label="Animated pipeline: raw scattered data is cleaned and transformed into an ordered model line that ends in a decision"
      >
        {/* raw, noisy points */}
        {RAW.map(([x, y], i) => (
          <circle key={i} className={s.raw} cx={x} cy={y} r="4" style={dl(150 + i * 42)} />
        ))}
        {OUTLIERS.map(([x, y], i) => (
          <circle key={i} className={s.outlier} cx={x} cy={y} r="4.6" style={dl(360 + i * 90)} />
        ))}

        {/* flow into the gate */}
        <path className={s.flow} d="M310 120 C 348 120, 356 128, 384 130" pathLength={1} style={dl(1350)} />
        <path className={s.flow} d="M310 152 C 348 152, 356 140, 384 138" pathLength={1} style={dl(1470)} />

        {/* transform gate */}
        <g className={s.gate} style={dl(950)}>
          <rect className={s.gateBody} x="396" y="58" width="34" height="152" rx="10" />
          <line className={s.gateSlot} x1="404" y1="96" x2="422" y2="96" />
          <line className={s.gateSlot} x1="404" y1="134" x2="422" y2="134" />
          <line className={s.gateSlot} x1="404" y1="172" x2="422" y2="172" />
        </g>

        {/* ordered model line */}
        <polyline className={s.model} points={MODEL} pathLength={1} style={dl(2050)} />
        {MODEL_PTS.map(([x, y], i) => (
          <circle key={i} className={s.vertex} cx={x} cy={y} r="4.4" style={dl(2200 + i * 190)} />
        ))}

        {/* decision marker */}
        <circle className={s.endPulse} cx="872" cy="58" r="7" style={dl(3150)} />
        <circle className={s.end} cx="872" cy="58" r="6.4" style={dl(3150)} />
        <g className={s.chip} style={dl(3300)}>
          <rect x="790" y="14" width="100" height="26" rx="7" />
          <path className={s.check} d="M801 27 l5 5 l9 -9" />
          <text x="822" y="31.5">decision</text>
        </g>

        {/* stage labels: the narrative */}
        {STAGES.map((st) => (
          <text key={st.no} className={s.label} x={st.x} y="248" style={dl(st.delay)}>
            {st.label}
          </text>
        ))}
      </svg>

      {/* Same narrative, at a size that does not depend on the viewBox. */}
      <ol className={s.steps} role="list">
        {STAGES.map((st) => (
          <li key={st.no}>
            <span className={s.stepNo} aria-hidden="true">
              {st.no}
            </span>
            {st.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
