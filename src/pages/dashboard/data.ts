/** Row tuple: [dayIndex, langCode, sentiment(0 neg | 1 neu | 2 pos), reserved] */
export type Row = [number, string, number, number];

export interface Sample {
  /** tweet text */
  t: string;
  /** sentiment 0|1|2 */
  s: number;
  /** day index */
  d: number;
  /** language code */
  l: string;
  /** likes */
  k: number;
}

export interface DashData {
  dayLabels: string[];
  langNames: Record<string, string>;
  rows: Row[];
  samples: Sample[];
}

let cache: Promise<DashData> | null = null;

/** 56,677-row dataset — fetched once per app load, only on this route. */
export function loadDashData(): Promise<DashData> {
  cache ??= fetch('/data/ps-dash.json').then((r) => {
    if (!r.ok) {
      cache = null;
      throw new Error(`dataset fetch failed (${r.status})`);
    }
    return r.json() as Promise<DashData>;
  });
  return cache;
}
