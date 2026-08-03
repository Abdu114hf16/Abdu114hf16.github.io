import { Link } from 'react-router';
import { useSeo } from '../hooks/useSeo';

export default function NotFound() {
  useSeo('Page not found');
  return (
    <main id="main" tabIndex={-1} className="wrap" style={{ paddingTop: '4rem', minHeight: '50vh' }}>
      <p className="eyebrow">
        status <b>·</b> 404
      </p>
      <h1>Row not found</h1>
      <p style={{ color: 'var(--muted)', maxWidth: '38rem' }}>
        This page doesn't match any record. Head back to the <Link to="/">home page</Link> or browse the{' '}
        <Link to="/projects">projects</Link>.
      </p>
    </main>
  );
}
