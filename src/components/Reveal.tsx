import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Scroll-triggered reveal: fades/slides children in once, on first view. */
export default function Reveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fail open: without an observer the content is simply shown, never hidden.
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      // threshold 0 fires on the first pixel of overlap. A ratio threshold could
      // not: it compares intersected area to the *element's* area, so the old
      // 0.12 was unreachable for anything taller than ~8.3 viewports and those
      // sections would have stayed at opacity 0 forever. The small negative
      // bottom margin is what holds the trigger until the section is properly
      // on screen, and 60px stays clear of the footer at any scroll position.
      { threshold: 0, rootMargin: '0px 0px -60px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'in' : ''} ${className ?? ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
