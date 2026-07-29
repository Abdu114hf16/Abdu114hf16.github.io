import ArticleLayout, { BtnRow, ResourceLink, Section, SrcCard, TechStack } from './ArticleLayout';
import Gallery from '../../components/Gallery';

export default function Eventia() {
  return (
    <ArticleLayout
      meta={{
        title: 'Eventia',
        seoTitle: 'Eventia',
        lede: 'A centralized platform that runs the full event lifecycle, from official licensing to live analytics, for organizers, vendors, attendees and authorities.',
        hero: { src: '/img/hero-eventia.webp', alt: 'Eventia platform interface', w: 1600, h: 896 },
      }}
    >
      <BtnRow>
        <ResourceLink kind="demo" href="https://www.eventia.software">
          Visit Live Demo
        </ResourceLink>
      </BtnRow>

      <Section title="Introduction">
        <p>
          Eventia is my graduation project, and the largest system I have built. It is an end-to-end platform for
          the full event lifecycle: planning an event, getting it licensed, running it, keeping everyone involved
          in touch, and reviewing how it went. Today that work is spread across spreadsheets, chat apps, separate
          government portals and disconnected dashboards. Eventia pulls all of it, and every role that touches an
          event, into one place. It runs live at{' '}
          <a href="https://www.eventia.software" target="_blank" rel="noopener noreferrer">
            eventia.software
          </a>
          .
        </p>
      </Section>

      <Section title="Problem Statement">
        <p>
          An event passes through many hands before, during and after it happens. Organizers plan it, vendors
          deliver parts of it, attendees take part, and authorities license it. Each group tends to work in its
          own tool, so information is scattered, status is hard to track, and the compliance steps that make an
          event legal happen far away from where the event is actually managed. The result is slow coordination,
          duplicated effort and no single source of truth.
        </p>
      </Section>

      <Section title="Solution">
        <p>
          Eventia answers this with one role-based platform. Organizers, vendors, attendees and authorities each
          sign in to an experience shaped for them, with the permissions and views that fit their part of the job,
          while everyone shares the same underlying data.
        </p>
        <p>
          Licensing is built in rather than bolted on. The platform guides an organizer through the official
          licensing workflow of the Saudi Conventions and Exhibitions General Authority, step by step, so
          compliance happens inside the same system that manages the event, instead of in a separate portal.
        </p>
        <p>
          A Gemini-powered AI assistant supports users throughout, answering questions and offering the kind of
          guidance that would otherwise need a manual or a support desk. In-app messaging keeps organizers,
          vendors and authorities in sync, and analytics dashboards turn day-to-day activity into a clear picture
          organizers can act on.
        </p>
        <p>
          Under the hood, Eventia is a Django and Python application backed by a MySQL database, with the Gemini
          API integrated for the assistant. The aim throughout was a single, coherent product rather than a stack
          of disconnected tools.
        </p>
      </Section>

      <Section title="Tech Stack">
        <TechStack items={['Django', 'Python', 'MySQL', 'Gemini AI', 'Resend', 'JavaScript', 'HTML', 'CSS']} />
      </Section>

      <Section title="Key Features">
        <p>A few of the pieces that make Eventia work as one system:</p>
        <ul>
          <li>Role-based access tailored to organizers, vendors, attendees and authorities.</li>
          <li>A built-in official licensing workflow that handles compliance in-platform.</li>
          <li>A Gemini-powered AI assistant for guidance and support.</li>
          <li>In-app messaging that keeps every role in sync.</li>
          <li>Analytics dashboards that turn activity into decisions.</li>
        </ul>
      </Section>

      <Section title="Pictures">
        <Gallery
          items={[
            { src: '/img/eventia-1.webp', alt: 'Eventia platform interface', w: 960, h: 1280 },
            { src: '/img/eventia-2.webp', alt: 'Eventia dashboard and management view', w: 960, h: 1280 },
          ]}
        />
      </Section>

      <Section title="Conclusion">
        <p>
          Eventia took the messy, multi-tool reality of running an event and turned it into one coherent platform.
          Bringing planning, licensing, communication and analytics together under role-based access was the
          hardest and most rewarding part, and it is what makes the system feel like a single product rather than
          a collection of features.
        </p>
      </Section>

      <Section title="Takeaway">
        <p>
          Building Eventia stretched me as a software engineer in ways earlier projects did not. A few things I am
          keeping with me:
        </p>
        <ul>
          <li>
            Designing a role-based system from the ground up taught me to think in permissions and trust
            boundaries, not just features.
          </li>
          <li>
            Building in a real compliance workflow showed how much value a product gains when it handles the
            mandatory, unglamorous steps for the user.
          </li>
          <li>
            Adding a Gemini-powered assistant was my first time weaving a large language model into a production
            web app.
          </li>
          <li>
            Carrying a large project from an idea to a working, deployed system was a lesson in scope, planning
            and finishing.
          </li>
          <li>
            Most of all, it grew my soft skills: communicating clearly, dividing the work and collaborating as
            part of a team toward one shared goal.
          </li>
        </ul>
      </Section>

      <Section title="Explore Eventia">
        <SrcCard intro="See it running and read the full story behind the build:">
          <BtnRow>
            <ResourceLink kind="demo" href="https://www.eventia.software">
              Visit Live Demo
            </ResourceLink>
            <ResourceLink kind="report" href="/docs/Eventia_Report.pdf">
              Read the Full Report (PDF)
            </ResourceLink>
          </BtnRow>
        </SrcCard>
      </Section>
    </ArticleLayout>
  );
}
