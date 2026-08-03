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
  /** total reactions in the source dataset */
  total: number;
  /** contingency cube: "dayIndex|langCode|sentiment" -> count */
  cube: Record<string, number>;
  samples: Sample[];
}

function isDashData(x: unknown): x is DashData {
  const d = x as DashData | null;
  return (
    !!d &&
    Array.isArray(d.dayLabels) &&
    Array.isArray(d.samples) &&
    typeof d.total === 'number' &&
    typeof d.cube === 'object' &&
    d.cube !== null &&
    typeof d.langNames === 'object' &&
    d.langNames !== null
  );
}

/*
 * Imported for its URL rather than fetched from a fixed path, so Vite emits it
 * as a content-hashed asset like every other build output. It used to live at
 * /data/ps-dash.json, which carries no hash: a returning visitor kept whatever
 * copy their cache held until its max-age lapsed, so a correction to the data
 * did not reach them. That was not theoretical, it was caught in the browser
 * after the language names were fixed, with fetch(url) and
 * fetch(url, {cache:'reload'}) returning different datasets from the same URL.
 *
 * Importing the URL, not the JSON itself, keeps the 10.4 kB payload out of the
 * route chunk and on its own request, which is what makes it cacheable at all.
 */
import dataUrl from './ps-dash.json?url';

let cache: Promise<DashData> | null = null;

/**
 * Pre-aggregated dataset: fetched once per app load, only on this route.
 * Produced from data/ps-dash.raw.json by scripts/aggregate-dash-data.mjs.
 */
export function loadDashData(): Promise<DashData> {
  cache ??= fetch(dataUrl)
    .then((r) => {
      if (!r.ok) throw new Error(`dataset fetch failed (${r.status})`);
      return r.json() as Promise<unknown>;
    })
    .then((j) => {
      if (!isDashData(j)) throw new Error('dataset malformed');
      return j;
    })
    .catch((e: unknown) => {
      cache = null; // allow a retry on the next mount
      throw e;
    });
  return cache;
}
