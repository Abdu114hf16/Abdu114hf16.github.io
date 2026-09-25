import { Award, ExternalLink } from 'lucide-react';
import Panel from '../components/Panel';
import Reveal from '../components/Reveal';
import Experience from '../components/Experience';
import { profile, skills, credentials } from '../data/profile';
import { useSeo } from '../hooks/useSeo';
import s from './Cv.module.css';

export default function Cv() {
  useSeo('CV');
  return (
    <main id="main" tabIndex={-1} className="wrap">
      <section className={s.head}>
        <p className="eyebrow">profile card <b>·</b> abdullah alshammari</p>
        <h1>CV</h1><p className={s.lede}>{profile.location}</p>
        <dl className={s.spec}>
          <div><dt>Target paths</dt><dd>{profile.disciplines.join(' · ')}</dd></div>
          <div><dt>Level</dt><dd>Graduate and entry-level</dd></div>
          <div><dt>Location</dt><dd>{profile.location} · Open to relevant opportunities</dd></div>
        </dl>
        <div className={s.summary}><p>{profile.about[0]}</p><p>I develop structured analytical solutions, evaluate machine-learning models, design relational databases, and contribute to data and AI workflows. I value structured problem-solving, continuous learning, clear communication, and teamwork, and seek opportunities where data supports better business decisions.</p></div>
      </section>
      <Reveal><Experience /></Reveal>
      <Reveal><Panel id="education" eyebrow="education" title="Education"><div className={s.edu}><div><p className={s.eduName}>Bachelor of Science in Computer Science</p><p className={s.eduLine}>King Saud University (KSU) · {profile.location}</p><p className={s.eduLine}>Sep 2026 · First-Class Honors</p></div><div className={s.gpa}><span className={s.gpaValue}>4.87</span><span className={s.gpaCap}>GPA / 5.00</span></div></div></Panel></Reveal>
      <Reveal><Panel eyebrow="capabilities" title="Skills"><dl className={s.skills}>{skills.map(group => <div key={group.group} className={s.skillRow}><dt>{group.group}</dt><dd>{group.items}</dd></div>)}</dl></Panel></Reveal>
      <Reveal><Panel id="credentials" eyebrow="professional development" title="Certifications"><ul className={s.certs}>{credentials.map(c => {
        const content = <>{c.badge ? <img className={s.certBadge} src={c.badge.src} alt="DataCamp certification badge" width={c.badge.w} height={c.badge.h} loading="lazy" /> : <Award size={18} className={s.certIcon} aria-hidden="true" />}<span className={s.certBody}><span className={s.certTitle}>{c.title}</span><span className={s.certOrg}>{c.org}</span></span>{c.href ? <ExternalLink size={15} className={s.certExt} aria-hidden="true" /> : null}</>;
        return <li key={c.title}>{c.href ? <a href={c.href} target="_blank" rel="noopener noreferrer" className={s.cert}>{content}</a> : <div className={s.cert}>{content}</div>}</li>;
      })}</ul></Panel></Reveal>
      <Reveal><Panel eyebrow="locale" title="Languages"><table className={s.langs}><thead><tr><th scope="col">Language</th><th scope="col">Proficiency</th></tr></thead><tbody><tr><th scope="row">Arabic</th><td>Native</td></tr><tr><th scope="row">English</th><td>Professional Working Proficiency</td></tr></tbody></table></Panel></Reveal>
    </main>
  );
}
