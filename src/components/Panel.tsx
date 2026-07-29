import type { ReactNode } from 'react';
import s from './Panel.module.css';

interface Props {
  eyebrow: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

/** Dashboard-grammar section: mono eyebrow + hairline header, quiet body. */
export default function Panel({ eyebrow, title, children, className }: Props) {
  return (
    <section className={`${s.panel} ${className ?? ''}`}>
      <header className={s.head}>
        <span className="eyebrow">{eyebrow}</span>
        <span className={s.rule} aria-hidden="true" />
      </header>
      {title && <h2 className={s.title}>{title}</h2>}
      {children}
    </section>
  );
}
