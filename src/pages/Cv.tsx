import { Award, Download, ExternalLink } from 'lucide-react';
import Panel from '../components/Panel';
import Reveal from '../components/Reveal';
import { useSeo } from '../hooks/useSeo';
import s from './Cv.module.css';

const SKILLS: Array<{ group: string; items: string }> = [
  {
    group: 'programming languages',
    items: 'Python, SQL, Java, C, JavaScript, HTML, CSS, CUDA',
  },
  {
    group: 'data science & business intelligence',
    items:
      'Supervised & Unsupervised Machine Learning, Deep Learning, Classification, Clustering, Regression, EDA, Optimization, Statistical Analysis, Predictive Analytics, Data Collection and Ingestion, Data Cleaning, Data Transformation, Data Modeling, Visualization, Time-Series Analysis, scikit-learn, PyTorch, pandas, NumPy, Matplotlib',
  },
  {
    group: 'tools',
    items: 'Power BI, Git/GitHub, Jupyter Notebook, MS Office, VS Code, PyCharm, Eclipse',
  },
];

const CERTS = [
  {
    href: 'https://coursera.org/share/b4f3772ade9c05f85cf140091528ced5',
    title: 'Machine Learning Specialization',
    org: 'DeepLearning.AI & Stanford University',
  },
  {
    href: 'https://coursera.org/share/e2e4fdf9382b0e83b6b830387cc7b381',
    title: 'Google Data Analytics Professional Certificate',
    org: 'Google',
  },
  {
    href: 'https://www.udacity.com/certificate/e/97af985c-03a5-11f1-b770-a384c7609781',
    title: 'Business Intelligence Analytics Nanodegree',
    org: 'Udacity',
  },
  {
    href: 'https://coursera.org/share/cfc0e4066f9145c48f14b177e8ca8941',
    title: 'IBM Cloud Computing',
    org: 'IBM',
  },
];

export default function Cv() {
  useSeo('CV', 'CV of Abdullah Alshammari: education, technical skills, certifications, and languages.');

  return (
    <main id="main" tabIndex={-1} className="wrap">
      <section className={s.head}>
        <p className="eyebrow">
          model card <b>·</b> abdullah alshammari
        </p>
        <h1>CV</h1>
        <p className={s.lede}>Abdullah Alshammari, Riyadh, Saudi Arabia</p>
        {/* A model card states its intended use and how to deploy it. So does this. */}
        <dl className={s.spec}>
          <div>
            <dt>Intended use</dt>
            <dd>Entry-level data science and analytics roles</dd>
          </div>
          <div>
            <dt>Deployment</dt>
            <dd>Riyadh or remote</dd>
          </div>
          <div>
            <dt>Available</dt>
            <dd>Now</dd>
          </div>
        </dl>
        <p className={s.actions}>
          <a href="/docs/Abdullah_Alshammari_CV.pdf" className={s.dl} download>
            <Download size={16} aria-hidden="true" /> Download CV (PDF)
          </a>
        </p>
        <blockquote className={s.quote}>
          "The future of Saudi Arabia is not dependent on oil but on the minds of our people and their ability to
          unleash their potential."
          <footer>Prince Mohammed bin Salman</footer>
        </blockquote>
      </section>

      <Reveal>
        <Panel eyebrow="education" title="Education">
          <div className={s.edu}>
            <div>
              <p className={s.eduName}>King Saud University (KSU)</p>
              <p className={s.eduLine}>Bachelor of Science in Computer Science</p>
              <p className={s.eduLine}>Riyadh, Saudi Arabia</p>
            </div>
            <div className={s.gpa}>
              <span className={s.gpaValue}>4.87</span>
              <span className={s.gpaCap}>GPA / 5.0</span>
            </div>
          </div>
        </Panel>
      </Reveal>

      <Reveal>
        <Panel eyebrow="features" title="Technical Skills">
          <dl className={s.skills}>
            {SKILLS.map((g) => (
              <div key={g.group} className={s.skillRow}>
                <dt>{g.group}</dt>
                <dd>{g.items}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </Reveal>

      <Reveal>
        <Panel eyebrow="validation" title="Certifications">
          <ul className={s.certs}>
            {CERTS.map((c) => (
              <li key={c.href}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className={s.cert}>
                  <Award size={18} className={s.certIcon} aria-hidden="true" />
                  <span className={s.certBody}>
                    <span className={s.certTitle}>{c.title}</span>
                    <span className={s.certOrg}>{c.org}</span>
                  </span>
                  <ExternalLink size={15} className={s.certExt} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </Panel>
      </Reveal>

      <Reveal>
        <Panel eyebrow="locale" title="Languages">
          <table className={s.langs}>
            <thead>
              <tr>
                <th>Language</th>
                <th>Proficiency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Arabic</td>
                <td>Native</td>
              </tr>
              <tr>
                <td>English</td>
                <td>Professional Working</td>
              </tr>
            </tbody>
          </table>
        </Panel>
      </Reveal>
    </main>
  );
}
