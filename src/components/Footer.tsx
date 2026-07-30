import { GithubIcon, LinkedinIcon } from './BrandIcons';
import s from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`wrap ${s.row}`}>
        <p className={s.credit}>&copy; Designed &amp; built by Abdullah Alshammari</p>
        <nav className={s.links} aria-label="Elsewhere">
          <a href="https://github.com/Abdu114hf16" target="_blank" rel="noopener noreferrer">
            <GithubIcon size={15} aria-hidden /> GitHub
          </a>
          <a href="https://linkedin.com/in/alshammaridev" target="_blank" rel="noopener noreferrer">
            <LinkedinIcon size={15} aria-hidden /> LinkedIn
          </a>
          <a href="/docs/Abdullah_Alshammari_CV.pdf" download>
            CV (PDF)
          </a>
        </nav>
      </div>
    </footer>
  );
}
