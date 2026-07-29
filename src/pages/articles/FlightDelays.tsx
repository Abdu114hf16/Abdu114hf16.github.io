import ArticleLayout, { Bq, BtnRow, ResourceLink, Section, Shot, SrcCard, TechStack } from './ArticleLayout';

export default function FlightDelays() {
  return (
    <ArticleLayout
      meta={{
        title: 'Why Are New York Flights Always Late?',
        seoTitle: 'Commercial Flight Delays Analysis',
        lede: "A Power BI investigation into flight delays and passenger satisfaction across New York's airports, with forecasts and recommendations for the National Aviation Administration.",
        hero: { src: '/img/hero-cfd.webp', alt: 'Commercial flight delays dashboard', w: 1000, h: 554 },
      }}
    >
      <Section title="Introduction">
        <p>
          The National Aviation Administration (NAA) oversees airport operations across the United States. Over
          the last few years, flights departing from New York have been running noticeably late, and the delays
          are starting to ripple out to other airports. Airports blame the airlines, the airlines blame a shortage
          of runways, and the NAA worries that if nothing improves, passengers will travel less and investment in
          aviation will fall.
        </p>
        <p>
          I was brought in as an analytics consultant to review a full year of New York departures, explain what
          is driving the delays and the drop in passenger satisfaction, and turn the findings into clear
          recommendations. The whole analysis lives in an interactive Power BI report.
        </p>
      </Section>

      <Section title="Problem Statement">
        <p>
          The NAA needed three things from the data. First, an honest summary of how New York departures performed
          in 2021 and how satisfied passengers were. Second, an understanding of when and why delays happen, so
          new operational policies can target the real cause. Third, a forward look: with a major event in Florida
          in early January 2022, many people would fly out of New York that week, and the NAA wanted to recommend
          the flights least likely to be delayed.
        </p>
      </Section>

      <Section title="Solution">
        <p>
          I built a single Power BI report on a full year of commercial departures from New York in 2021, joined
          to reference data about the airports and airlines. The source tables were imported and modelled into a
          clean star schema, with derived columns added to make the data easier to read, such as turning the raw
          flight status into plain "On time" and "Delayed" labels.
        </p>
        <p>
          From there the report answers the NAA's questions across dedicated pages: headline KPIs, a
          key-influencers breakdown of satisfaction, a linear regression to set a delay target, a clustering
          exercise to place new supervision offices, a time-series forecast with anomaly detection, and a view
          into the delay-prediction model. Every page closes back to a written conclusion the NAA can act on.
        </p>
      </Section>

      <Section title="Tech Stack">
        <TechStack
          items={['Power BI', 'DAX', 'Data Modeling', 'Key Influencers', 'Linear Regression', 'Clustering', 'Forecasting', 'Anomaly Detection']}
        />
      </Section>

      <Section title="What the Data Showed">
        <Bq n={1} q="How did New York departures perform in 2021?">
          <p>
            Across the whole year, flights took off an average of <strong>20.78 minutes late</strong>, and
            passengers rated their experience just <strong>5.62 out of 10</strong>. The monthly view shows delayed
            flights consistently outnumbering on-time ones, with the gap widening in the winter months.
          </p>
          <Shot src="/img/cfd-exploration.webp" alt="Dataset exploration KPIs and monthly trend" w={1400} h={810} />
        </Bq>
        <Bq n={2} q="What drives passenger satisfaction the most?">
          <p>
            Whether a flight is delayed is the single biggest factor: a delayed flight drops the satisfaction
            score by about <strong>1.14 points</strong> on its own. Among numerical factors, the length of the
            take-off delay is the strongest driver. Satisfaction is, in short, a delay problem.
          </p>
          <Shot
            src="/img/cfd-key-influencers.webp"
            alt="Key influencers of passenger satisfaction"
            w={1400}
            h={810}
          />
        </Bq>
        <Bq n={3} q="How short must delays be to keep passengers happy?">
          <p>
            Focusing on the Summer season, a linear regression between take-off delay and satisfaction shows that
            delays must stay <strong>under 7.5 minutes</strong> to clear a score of 6.1. A 7-minute delay yields a
            passing 6.12, while 8 minutes drops it to a failing 6.08. That gives the NAA a concrete operational
            target rather than a vague goal.
          </p>
          <Shot src="/img/cfd-regression.webp" alt="Linear regression of delay versus satisfaction" w={1400} h={810} />
        </Bq>
        <Bq n={4} q="Where should the NAA open its new supervision offices?">
          <p>
            The NAA planned four offices, each supervising at most five airports, and weighed a location-based
            strategy against a passenger-volume one. Clustering the airports both ways showed the{' '}
            <strong>location-based strategy</strong> is the better choice: it respects the five-airport limit and
            keeps each office close to its airports, so supervisors can make weekly on-site visits without driving
            across the entire state.
          </p>
          <Shot src="/img/cfd-offices.webp" alt="Airport clusters for new offices" w={1400} h={810} />
        </Bq>
        <Bq n={5} q="What is the pattern of delays, and what comes next?">
          <p>
            The daily delay time-series is highly volatile, repeating a weekly cycle all year on top of a slight
            downward trend. The one-month forecast into January 2022 expects that rhythm to continue, with an
            initial spike in early January before settling back into the weekly pattern, staying within historical
            confidence intervals. Anomaly detection also flags the specific dates with unusually high or low
            delays for the NAA to investigate.
          </p>
          <Shot src="/img/cfd-forecasting.webp" alt="Delay forecasting and anomaly detection" w={1400} h={810} />
        </Bq>
        <Bq n={6} q="Which flights should travellers actually book?">
          <p>
            The prediction model points to a clear culprit: late departures, especially flights leaving after{' '}
            <strong>14:00</strong>, carry the highest risk of delay. For the Florida trip, the safest options all
            share the lowest predicted delay probability of <strong>37%</strong>, and all leave at midnight: a JFK
            departure via Unique Air Lines, and two more from JFK and ISP via United States Airways.
          </p>
          <Shot src="/img/cfd-prediction.webp" alt="Flight delay prediction and recommendations" w={1400} h={810} />
        </Bq>
      </Section>

      <Section title="Conclusion">
        <p>
          New York's delay problem is, at heart, a satisfaction problem: every minute a flight sits late costs the
          airport in passenger goodwill. The analysis gave the NAA a clear target to chase (keep summer delays
          under 7.5 minutes), a sensible plan for its new offices, a forecast it can trust, and a short list of
          low-risk flights to recommend. Turning a year of raw departures into decisions the NAA can defend is
          exactly what the report set out to do.
        </p>
      </Section>

      <Section title="Takeaway">
        <p>This project was my deep dive into business intelligence with Power BI, and it taught me a lot:</p>
        <ul>
          <li>
            A clean data model is the foundation of everything; the analysis is only as trustworthy as the
            relationships behind it.
          </li>
          <li>DAX turns a dataset into answers, from KPIs to a full linear regression computed in the model.</li>
          <li>
            Power BI's built-in analytics, the Key Influencers visual, forecasting and anomaly detection, can
            surface insight quickly when used with care.
          </li>
          <li>
            Most of all, every page should end in a plain recommendation a stakeholder can act on, not just a
            chart.
          </li>
        </ul>
      </Section>

      <Section title="Resources">
        <SrcCard intro="Explore the full report and the source project:">
          <BtnRow>
            <ResourceLink kind="report" href="/docs/CFD_Report.pdf">
              Read the Full Report (PDF)
            </ResourceLink>
            <ResourceLink kind="repo" href="https://github.com/Abdu114hf16/Commercial_Flights_Delays_Analysis">
              View Repository
            </ResourceLink>
          </BtnRow>
        </SrcCard>
      </Section>
    </ArticleLayout>
  );
}
