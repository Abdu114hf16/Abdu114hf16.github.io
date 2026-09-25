import { Link } from 'react-router';
import ExperienceDetails from '../components/Experience';
import { useSeo } from '../hooks/useSeo';
import s from './Experience.module.css';

export default function Experience() {
  useSeo('Experience');
  return (
    <main id="main" tabIndex={-1} className="wrap">
      <header className={s.head}>
        <p className="eyebrow">professional background</p>
        <h1>Experience</h1>
        <p className={s.lede}>Connecting data preparation, analytical systems, and technical delivery with practical business needs.</p>
      </header>
      <ExperienceDetails />
      <p className={s.note}>Internal work is described at a high level. Company data, financial findings, assumptions, and deliverables remain confidential.</p>
      <p className={s.links}><Link to="/projects">Explore public projects →</Link><Link to="/cv">View CV →</Link></p>
    </main>
  );
}
