import { useEffect } from 'react';

const BASE = 'Abdullah Alshammari';

/** Per-route document title + meta description. */
export function useSeo(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} - ${BASE}` : `${BASE} — Data Science & AI`;
    if (description) {
      const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (meta) meta.content = description;
    }
  }, [title, description]);
}
