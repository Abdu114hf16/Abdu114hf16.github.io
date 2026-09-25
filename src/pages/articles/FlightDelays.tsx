import CaseStudy from './CaseStudy';
import { Shot } from './ArticleLayout';
import Gallery from '../../components/Gallery';

export default function FlightDelays() {
  return <CaseStudy slug="commercial-flights-delays" title="What Can Flight Delays Tell Us About Passenger Experience?"
    summary={[
      'This independent scenario-based study uses a year of New York departures to explore delay patterns, passenger satisfaction, supervisory-office placement, and exploratory forecasts. It connects descriptive reporting with operational questions while keeping the assumptions behind each recommendation visible.',
      'The brief supplies a hypothetical aviation authority. No organization commissioned this work, and the conclusions were not delivered as a client engagement. Forecasts and predicted delay probabilities describe the exercise rather than proven future performance.',
    ]}
    data={['The repository documents New York commercial departures in 2021, joined to reference tables for airports and airlines. A dimensional model and consistent on-time/delayed definitions support the report pages.', '2021 was an unusual year for air travel. One region and one year limit transfer to other networks or seasons; weather, aircraft rotation, air-traffic constraints, and schedule changes are not represented in the supplied data.']}
    dataVisual={<Shot src="/img/cfd-exploration.webp" alt="Flight dashboard with delay and satisfaction KPIs and monthly trends" w={1400} h={810} caption="The descriptive overview reports an average departure delay of 20.78 minutes and a satisfaction score of 5.62/10 for the exercise data." />}
    approach={['Prepare departure and reference tables in a dimensional model.', 'Explore delay patterns and associations with passenger satisfaction.', 'Use a seasonal regression to investigate a scenario satisfaction threshold.', 'Compare geographic and passenger-volume office-placement clusters against the brief constraints.', 'Explore a 30-day forecast, anomalies, and relative predicted delay risks.']}
    design="Each report page answers a distinct question. Descriptive views summarize observed records; influence and regression views characterize associations; clustering compares planning scenarios; forecasts project a temporal pattern. The scenario office-placement constraint concerns supervision of at most five airports per office, rather than a measured commercial outcome."
    designVisual={<><Gallery items={[
      { src: '/img/cfd-key-influencers.webp', alt: 'Associations between flight characteristics and satisfaction in the exercise data', w: 1400, h: 810 },
      { src: '/img/cfd-regression.webp', alt: 'Summer delay and satisfaction regression used to examine a scenario threshold', w: 1400, h: 810 },
      { src: '/img/cfd-offices.webp', alt: 'Geographic and volume-based airport clustering for the hypothetical office-placement scenario', w: 1400, h: 810 },
    ]} /><p>Open a figure for its full-size report view. Regression associations and planning scenarios have different evidential roles.</p></>}
    evaluation={<><p>The report's seasonal regression associates summer delays below roughly 7.5 minutes with its 6.1 satisfaction threshold. This is an exercise-specific association, not a year-round service guarantee. Geographic clustering better satisfies the scenario's proximity and airport-count needs than the compared volume strategy.</p><p>The forecast projects 30 days with a reported 95% interval; an interval alone is not an out-of-sample accuracy score. The lowest reported predicted delay probability is 37%, a relative ranking rather than a low-risk guarantee.</p></>}
    evaluationVisual={<Gallery items={[
      { src: '/img/cfd-forecasting.webp', alt: 'Exploratory delay forecast and anomaly analysis, including uncertainty bands', w: 1400, h: 810 },
      { src: '/img/cfd-prediction.webp', alt: 'Relative predicted delay probabilities for scenario flight recommendations', w: 1400, h: 810 },
    ]} />}
    findings={['Delays and satisfaction move together in the recorded scenario data; causal effects are not established.', 'Geographic grouping supports the brief office-placement constraints more directly than passenger-volume grouping.', 'The delay series contains a repeating weekly pattern and substantial variability.', 'Even the lowest reported predicted risk leaves meaningful uncertainty for a traveler.']}
    recommendation="Use the dashboard to prioritize questions for operational investigation: examine disruption dates, review geographic coverage, and test whether observed associations persist in current data. Forecasts need independent backtesting and richer operational inputs before supporting real scheduling decisions."
    limitations={['The scope is one region and the atypical 2021 travel period.', 'Weather, schedule changes, route coverage, and other operational factors limit interpretation.', 'Influence and regression results show correlation rather than causation.', 'Forecasts and relative flight recommendations are exploratory; no validated commercial impact or out-of-sample performance is claimed.']}
    stack={['Power BI', 'Power Query', 'DAX', 'Azure Maps', 'Dimensional Modeling', 'Forecasting']}
    contribution="I independently prepared the data, built the analytical model and report, and interpreted the scenario questions. The takeaway was to separate descriptive evidence, prediction, and recommendation so a dashboard reader can judge each on its own terms."
  />;
}
