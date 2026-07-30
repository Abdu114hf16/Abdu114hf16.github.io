import { useEffect, useRef, useState } from 'react';
import s from './KpiTile.module.css';

interface Props {
  label: string;
  to: number;
  decimals?: number;
  format?: (n: number) => string;
  caption: string;
  /** 12-point decorative trend; de-emphasis hue, last point in accent. */
  spark?: number[];
  /** 0..1 progress ring (e.g. GPA / 5). */
  ring?: number;
}

const nf = (decimals: number) => (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Count-up that starts when the tile scrolls into view.
 *
 * Seeded at the final value on purpose: the number must be correct in the DOM
 * from first paint, so a card can never read 0 if the observer does not fire,
 * if JavaScript is unavailable, or during a screenshot or print that never
 * scrolls. The animation is enhancement only, and rewinds to 0 just before it
 * plays.
 */
function useCountUp(to: number, started: boolean, decimals: number) {
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return;
    }
    const t0 = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, started, decimals]);

  return value;
}

function Spark({ data }: { data: number[] }) {
  const w = 88;
  const h = 26;
  const min = Math.min(...data);
  const span = Math.max(...data) - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * (w - 8) + 4,
    h - 4 - ((v - min) / span) * (h - 8),
  ]);
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg className={s.spark} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline className={s.sparkLine} points={pts.map((p) => p.join(',')).join(' ')} />
      <circle className={s.sparkDot} cx={lx} cy={ly} r="3" />
    </svg>
  );
}

function Ring({ frac }: { frac: number }) {
  const r = 21;
  const c = 2 * Math.PI * r;
  return (
    <svg className={s.ring} viewBox="0 0 52 52" aria-hidden="true">
      <circle className={s.ringTrack} cx="26" cy="26" r={r} />
      <circle
        className={s.ringFill}
        cx="26"
        cy="26"
        r={r}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - frac)}
      />
    </svg>
  );
}

export default function KpiTile({ label, to, decimals = 0, format, caption, spark, ring }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const value = useCountUp(to, started, decimals);
  const fmt = format ?? nf(decimals);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fail open: without an observer the value simply stays at its final state.
    if (!('IntersectionObserver' in window)) {
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={s.tile}>
      <p className={s.label}>{label}</p>
      <div className={s.row}>
        <span className={s.value}>{fmt(value)}</span>
        {ring !== undefined && <Ring frac={ring} />}
        {spark && <Spark data={spark} />}
      </div>
      <p className={s.caption}>{caption}</p>
    </div>
  );
}
