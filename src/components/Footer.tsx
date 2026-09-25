import { Link } from 'react-router';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { profile } from '../data/profile';
import s from './Footer.module.css';

export default function Footer() {
  return <footer className={s.footer}><div className={`wrap ${s.row}`}>
    <div><p className={s.credit}>{profile.name} · Computer Science Graduate · {profile.location}</p><p className={s.credit}>© {new Date().getFullYear()} {profile.name}</p></div>
    <nav className={s.links} aria-label="Elsewhere">
      <a href={profile.github} target="_blank" rel="noopener noreferrer"><GithubIcon size={15} aria-hidden />GitHub</a>
      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinIcon size={15} aria-hidden />LinkedIn</a>
      <a href={`mailto:${profile.email}`}>Email</a><Link to="/cv">View CV</Link>
    </nav>
  </div></footer>;
}
