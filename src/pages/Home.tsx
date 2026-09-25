import { Mail } from 'lucide-react';
import { Link } from 'react-router';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';
import PipelineHero from '../components/PipelineHero';
import Panel from '../components/Panel';
import Reveal from '../components/Reveal';
import ProjectCard from '../components/ProjectCard';
import { profile, practices } from '../data/profile';
import { homeProjects } from '../data/projects';
import { useSeo } from '../hooks/useSeo';
import s from './Home.module.css';

export default function Home() {
  useSeo();
  return (
    <main id="main" tabIndex={-1} className="wrap">
      <section className={s.hero}>
        <div className={s.heroGrid}>
          <p className={`eyebrow ${s.heroEyebrow}`}>portfolio <b>·</b> data &amp; ai <b>·</b> riyadh</p>
          <div className={s.identity}>
            <h1 className={s.name}>{profile.name}</h1>
            <p className={s.subtitle}>{profile.disciplines.map((discipline, i) => <span key={discipline}>{i > 0 ? ' · ' : ''}{discipline}<wbr /></span>)}</p>
          </div>
          <div className={s.rest}>
            <p className={s.value}>{profile.value}</p>
            <p className={s.meta}>Computer Science Graduate · King Saud University · <b>First-Class Honors</b> · {profile.location} · Open to graduate and entry-level opportunities</p>
            <div className={s.ctas}>
              <Link to="/#selected-work" className={s.btn}>Explore Projects</Link>
              <Link to="/cv" className={`${s.btn} ${s.btnGhost}`}>View CV</Link>
              <a href={profile.github} className={`${s.btn} ${s.btnGhost}`} target="_blank" rel="noopener noreferrer"><GithubIcon size={16} aria-hidden /> GitHub</a>
            </div>
            <ul className={s.contact}>
              <li><a href={`mailto:${profile.email}`}><Mail size={16} aria-hidden="true" />{profile.email}</a></li>
              <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinIcon size={16} aria-hidden />LinkedIn</a></li>
            </ul>
          </div>
          <div className={s.portraitFrame}><img src="/img/portrait.webp" alt="Professional portrait of Abdullah Alshammari" width="480" height="720" fetchPriority="high" /></div>
        </div>
        <div className={s.pipeline}><PipelineHero /></div>
      </section>
      <Reveal>
        <Panel id="selected-work" eyebrow="data & engineering" title="Selected Projects">
          <p className={s.intro}>Four projects in data engineering, analytics, and machine learning.</p>
          <div className={s.selected}>{homeProjects.map(p => <ProjectCard key={p.slug} project={p} />)}</div>
          <p className={s.more}><Link to="/projects">Explore all projects →</Link></p>
        </Panel>
      </Reveal>
      <Reveal>
        <Panel id="about" eyebrow="profile" title="About Me">
          <div className={s.prose}>{profile.about.map(text => <p key={text}>{text}</p>)}</div>
        </Panel>
      </Reveal>
      <Reveal>
        <Panel id="practice" eyebrow="practice" title="Areas of Practice">
          <ul className={s.practices}>{practices.map(p => (
            <li key={p.title} data-tone={p.tone}><h3>{p.title}</h3><p>{p.description}</p></li>
          ))}</ul>
        </Panel>
      </Reveal>
    </main>
  );
}
