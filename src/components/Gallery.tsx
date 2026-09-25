import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import s from './Gallery.module.css';

export interface GalleryItem { src: string; alt: string; w: number; h: number; caption?: string }

/** Native modal supplies focus containment and an inert background. */
export default function Gallery({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const item = open === null ? undefined : items[open];
  return <>
    <div className={s.grid}>{items.map((image, i) => <figure key={image.src} className={s.figure}>
      <button type="button" className={s.thumb} aria-label={`Open full-size figure: ${image.alt}`} onClick={() => setOpen(i)}><img src={image.src} alt={image.alt} width={image.w} height={image.h} loading="lazy" /></button>
      <figcaption>{image.caption ?? image.alt}</figcaption>
    </figure>)}</div>
    {createPortal(<dialog ref={dialog} className={s.overlay} aria-label="Project figures" onCancel={() => setOpen(null)} onClick={event => { if (event.target === event.currentTarget) setOpen(null); }} onKeyDown={event => {
      if (event.key === 'Tab') {
        const controls = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
        const index = controls.findIndex(control => control === document.activeElement);
        if (index === -1 || (!event.shiftKey && index === controls.length - 1) || (event.shiftKey && index === 0)) {
          event.preventDefault();
          (event.shiftKey ? controls.at(-1) : controls[0])?.focus();
        }
      }
      if (event.key === 'ArrowLeft') setOpen(i => i === null ? null : Math.max(0, i - 1));
      if (event.key === 'ArrowRight') setOpen(i => i === null ? null : Math.min(items.length - 1, i + 1));
    }}>
      <button type="button" className={s.close} aria-label="Close gallery" onClick={() => setOpen(null)}><X size={22} aria-hidden="true" /></button>
      {item && <div className={s.stage}>
        <img className={s.full} src={item.src} alt={item.alt} width={item.w} height={item.h} />
        <p className={s.caption} aria-live="polite">{item.caption ?? item.alt}</p>
        <div className={s.controls}><button type="button" aria-label="Previous figure" disabled={open === 0} onClick={() => setOpen(i => Math.max(0, i! - 1))}><ArrowLeft size={20} aria-hidden="true" /></button><span>{open! + 1} / {items.length}</span><button type="button" aria-label="Next figure" disabled={open === items.length - 1} onClick={() => setOpen(i => Math.min(items.length - 1, i! + 1))}><ArrowRight size={20} aria-hidden="true" /></button></div>
      </div>}
    </dialog>, document.body)}
  </>;
}
