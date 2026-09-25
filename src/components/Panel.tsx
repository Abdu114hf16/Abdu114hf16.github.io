import type { ReactNode } from 'react';
import s from './Panel.module.css';

interface Props {
  eyebrow: string;
  title?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}

/** Dashboard-grammar section: mono eyebrow + hairline header, quiet body. */
export default function Panel({ eyebrow, title, children, className, id }: Props) {
  return (
    <section id={id} tabIndex={id ? -1 : undefined} className={`${s.panel} ${className ?? ''}`}>
      <header className={s.head}>
        <span className="eyebrow">{eyebrow}</span>
        <span className={s.rule} aria-hidden="true" />
      </header>
      {title && <h2 className={s.title}>{title}</h2>}
      {children}
    </section>
  );
}
