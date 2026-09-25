import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';

const positions = new Map<string, number>();

/** Runs inside the loaded page, so anchor targets exist even on a cold lazy route. */
export function usePageNavigation() {
  const { key, hash } = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    // Snapshot before any scroll event from the outgoing page can be delivered.
    const restoreSaved = navigationType === 'POP' && positions.has(key);
    const savedTop = restoreSaved ? positions.get(key)! : 0;
    // A Suspense fallback can shorten the document before this page unmounts.
    // Ignore that navigation-induced scroll: it belongs to the next history entry.
    const page = document.querySelector('main');
    const remember = () => {
      if (page?.getClientRects().length && (history.state?.key ?? 'default') === key) positions.set(key, window.scrollY);
    };
    const frame = requestAnimationFrame(() => {
      let id = '';
      try { id = decodeURIComponent(hash.slice(1)); } catch { /* malformed URL: focus main */ }
      const target = (id ? document.getElementById(id) : null) ?? document.querySelector<HTMLElement>('main');
      target?.focus({ preventScroll: true });
      if (!restoreSaved && id && target?.id === id) target.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollTo({ top: savedTop, behavior: 'instant' });
      positions.set(key, window.scrollY);
      // Only record this entry after its initial restoration has completed.
      window.addEventListener('scroll', remember, { passive: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', remember);
      if (positions.size > 50) positions.delete(positions.keys().next().value!);
    };
  }, [key, hash, navigationType]);
}
