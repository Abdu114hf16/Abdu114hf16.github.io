import Panel from './Panel';
import { profile } from '../data/profile';
import s from './Experience.module.css';

export default function Experience() {
  return (
    <Panel id="experience" eyebrow="professional experience" title={profile.experience.title}>
      <p className={s.organization}>{profile.experience.organization} · {profile.location} · {profile.experience.period}</p>
      <ul className={s.bullets}>{profile.experience.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
    </Panel>
  );
}
