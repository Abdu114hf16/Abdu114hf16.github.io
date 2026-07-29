import { useState } from 'react';
import { NavLink } from 'react-router';
import { Moon, Sun } from 'lucide-react';
import s from './Nav.module.css';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/cv', label: 'CV' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

function currentTheme(): 'dark' | 'light' {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

export default function Nav() {
  const [theme, setTheme] = useState(currentTheme);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* private mode — theme just won't persist */
      }
      return next;
    });
  }

  return (
    <header className={s.header}>
      <nav className={`wrap ${s.bar}`} aria-label="Main">
        <NavLink to="/" className={s.brand} aria-label="alshammari.dev — home">
          <span className={s.dot} aria-hidden="true" />
          <span className={s.brandText}>alshammari.dev</span>
        </NavLink>
        <ul className={s.links}>
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => (isActive ? `${s.link} ${s.active}` : s.link)}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
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
