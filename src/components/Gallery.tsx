import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import s from './Gallery.module.css';

export interface GalleryItem {
  src: string;
  alt: string;
  w: number;
  h: number;
}

/** Image grid with an in-page lightbox (Escape / overlay click to close). */
export default function Gallery({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <div className={s.grid}>
        {items.map((it, i) => (
          <button key={it.src} type="button" className={s.thumb} onClick={() => setOpen(i)}>
            <img src={it.src} alt={it.alt} width={it.w} height={it.h} loading="lazy" />
          </button>
        ))}
      </div>
      {open !== null &&
        createPortal(
          <div
            className={s.overlay}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(null);
            }}
            role="dialog"
            aria-modal="true"
            aria-label={items[open].alt}
          >
            <button type="button" className={s.close} aria-label="Close" onClick={() => setOpen(null)}>
              <X size={22} />
            </button>
            <img className={s.full} src={items[open].src} alt={items[open].alt} />
          </div>,
          document.body,
        )}
    </>
  );
}
