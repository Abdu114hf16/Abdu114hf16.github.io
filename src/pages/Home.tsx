import { Mail, Phone } from 'lucide-react';
import { LinkedinIcon } from '../components/BrandIcons';
import PipelineHero from '../components/PipelineHero';
import KpiTile from '../components/KpiTile';
import Panel from '../components/Panel';
import Reveal from '../components/Reveal';
import { useSeo } from '../hooks/useSeo';
import s from './Home.module.css';

const INTERESTS: Array<{ label: string; tone: 'ml' | 'ba' | 'web' | 'none' }> = [
  { label: 'Data Science', tone: 'ba' },
  { label: 'Data & Business Analytics', tone: 'ba' },
  { label: 'Machine Learning & Deep Learning', tone: 'ml' },
  { label: 'Cutting-edge Artificial Intelligence', tone: 'ml' },
  { label: 'Software Development', tone: 'web' },
  { label: 'FinTech', tone: 'none' },
];

export default function Home() {
  useSeo(undefined, 'Portfolio of Abdullah Alshammari — machine learning, analytics dashboards, and decision-ready insights.');

  return (
    <main className="wrap">
      <section className={s.hero}>
        <div className={s.heroGrid}>
          <div>
            <p className="eyebrow">
              portfolio <b>·</b> data science &amp; ai <b>·</b> riyadh
            </p>
            <h1 className={s.name}>Abdullah Alshammari</h1>
            <p className={s.subtitle}>Aspiring Data Science &amp; AI</p>
            <ul className={s.contact}>
              <li>
                <a href="mailto:abdullah.tecch@gmail.com">
                  <Mail size={16} aria-hidden="true" /> abdullah.tecch@gmail.com
                </a>
              </li>
              <li>
                <Phone size={16} aria-hidden="true" /> 0538845755
              </li>
              <li>
                <a href="https://linkedin.com/in/alshammaridev" target="_blank" rel="noopener noreferrer">
                  <LinkedinIcon size={16} aria-hidden /> Abdullah Alshammari
                </a>
              </li>
            </ul>
          </div>
          <div className={s.portraitFrame}>
            <img
              src="/img/portrait.webp"
              alt="Professional portrait of Abdullah Alshammari"
              width="480"
              height="720"
              fetchPriority="high"
            />
          </div>
        </div>
        <div className={s.pipeline}>
          <PipelineHero />
        </div>
      </section>

      <Reveal>
        <div className={s.kpis}>
          <KpiTile label="GPA — KSU" to={4.87} decimals={2} caption="of 5.00 · First Honors" ring={4.87 / 5} />
          <KpiTile
            label="Best model R²"
            to={0.91}
            decimals={2}
            caption="variance explained, unseen data"
            spark={[62, 66, 64, 70, 73, 71, 76, 80, 79, 84, 88, 91]}
          />
          <KpiTile
            label="Reactions scored"
            to={56677}
            caption="multilingual NLP sentiment"
            spark={[8, 22, 18, 30, 34, 31, 38, 42, 47, 45, 52, 57]}
          />
          <KpiTile label="Certifications" to={4} caption="ML · Analytics · BI · Cloud" />
        </div>
      </Reveal>

      <Reveal>
        <Panel eyebrow="mission brief" title="About Me">
          <div className={s.prose}>
            <p>
              First-Honors Computer Science student at King Saud University. I turn raw, messy data into clear
              answers that help people make better decisions. That means cleaning and organizing data, building
              dashboards that show what is happening at a glance, and turning insights into practical
              recommendations a business can act on.
            </p>
            <p>
              Machine learning is my strong suit, and I apply it to almost any kind of problem: predicting future
              outcomes like cost or demand, grouping similar customers or products to reveal hidden patterns,
              sorting items into categories, and spotting the unusual cases that need attention. Whatever the
              question, I can shape data into a model that answers it.
            </p>
          </div>
        </Panel>
      </Reveal>

      <Reveal>
        <Panel eyebrow="legend" title="Interests">
          <ul className={s.legend}>
            {INTERESTS.map((it) => (
              <li key={it.label} className={s.legendItem} data-tone={it.tone}>
                <span className={s.legendDot} aria-hidden="true" />
                {it.label}
              </li>
            ))}
          </ul>
        </Panel>
      </Reveal>
    </main>
  );
}
