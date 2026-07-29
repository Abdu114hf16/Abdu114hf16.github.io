import s from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`wrap ${s.row}`}>
        <p className={s.credit}>&copy; Designed &amp; built by Abdullah Alshammari</p>
        <p className={s.meta}>
          <span className={s.ok} aria-hidden="true" />
          react · vite · github pages
        </p>
      </div>
    </footer>
  );
}
