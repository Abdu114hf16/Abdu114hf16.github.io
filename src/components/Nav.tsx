import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Moon, Sun } from 'lucide-react';
import s from './Nav.module.css';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/cv', label: 'CV' },
  { to: '/contact', label: 'Contact' },
];

function currentTheme(): 'dark' | 'light' {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

export default function Nav() {
  const { pathname, hash } = useLocation();
  const [theme, setTheme] = useState(currentTheme);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* private mode: theme just won't persist */
      }
      return next;
    });
  }

  return (
    <header className={s.header}>
      <nav className={`wrap ${s.bar}`} aria-label="Main">
        <Link to="/" className={s.brand} aria-label="alshammari.dev, home">
          <span className={s.dot} aria-hidden="true" />
          <span className={s.brandText}>alshammari.dev</span>
        </Link>
        <ul className={s.links}>
          {LINKS.map((l) => {
            const active = l.to.includes('#') ? pathname === '/' && hash === '#experience' : l.to === '/' ? pathname === '/' && !hash : pathname.startsWith(l.to);
            return (
            <li key={l.to}>
              <Link
                to={l.to}
                aria-current={active ? (l.to.includes('#') ? 'location' : 'page') : undefined}
                className={active ? `${s.link} ${s.active}` : s.link}
              >
                {l.label}
              </Link>
            </li>
          ); })}
        </ul>
        <button
          type="button"
          className={s.theme}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </nav>
    </header>
  );
}
