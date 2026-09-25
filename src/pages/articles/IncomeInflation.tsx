import CaseStudy from './CaseStudy';
import { DataTable, Shot } from './ArticleLayout';
import Gallery from '../../components/Gallery';

export default function IncomeInflation() {
  return <CaseStudy slug="income-inflation-purchasing-power"
    dataVisual={<Shot src="/img/income-inflation-trend.webp" alt="US annual inflation from 1960 through 2024, with the 1980 peak at 13.55 percent" w={1200} h={675} caption="Regenerated directly from the public FRED-source CSV: 65 annual observations, peaking at 13.55% in 1980." />}
    designVisual={<Shot src="/img/income-model.webp" alt="Source tables flow through a shared date model into income and inflation measures" w={1200} h={675} caption="Simplified model schematic. Conformed dates support comparison but do not make source time coverage identical." />}
    evaluationVisual={<Gallery items={[
      { src: '/img/income-dashboard.webp', alt: 'Original dashboard charts comparing earnings snapshots with inflation and sector compensation', w: 1440, h: 600, caption: 'Excerpt from dashboard page 2, excluding the top KPI row. The high-inflation earnings comparison has limited overlapping snapshots.' },
      { src: '/img/income-industry.webp', alt: 'Original industry job-growth dashboard with time-series and workforce composition views', w: 1440, h: 833, caption: 'Original dashboard page 3: an exercise-data snapshot, not a current workforce estimate. Shares require the displayed model/filter context.' },
    ]} />}
    summary={[
      'This independently implemented BI project combines US workforce, earnings, and inflation information to examine how inflation changes the interpretation of nominal income growth. The scenario and part of the data were supplied through Udacity; the preparation, modeling, and dashboard implementation were developed independently.',
      'Conformed source tables and a shared date dimension support three dashboard pages: Executive Summary, Income vs. Inflation Dynamics, and Industry Job Growth. The public inflation source peaks at 13.55% in 1980. Different source time coverage limits direct cross-series comparisons.',
    ]}
    data={[
      'The public inflation CSV identifies FRED series FPCPITOTLZGUSA, annual US consumer-price inflation, with 65 observations from 1960 through 2024. The earnings workbook contains 80 rows across four snapshot years: 1990, 2000, 2010, and 2020.',
      'The repository describes local, cloud-hosted, and public economic sources. Dates, categories, measures, and data types are standardized for the model. Earnings snapshots must not be presented as annual coverage over the full inflation history. The public source material does not establish a reproducible denominator for the previously stated two-sector workforce share, so that percentage is omitted.',
    ]}
    approach={['Ingest the economic source tables and profile their time coverage.', 'Standardize dates, categories, data types, and measure definitions.', 'Build a dimensional model connecting jobs, earnings, inflation, and time.', 'Define reusable measures for nominal income, inflation conditions, and comparative sector analysis.', 'Design overview and drill-down pages that keep source coverage visible.']}
    design="The analytical design uses a jobs/earnings fact table and shared date dimension to support sector and time comparisons. Inflation conditions provide context for nominal compensation. A nominal amount and a purchasing-power comparison answer different questions; neither alone establishes a causal effect of inflation on a sector."
    evaluation={<><p>This is descriptive BI, evaluated through source checks and interpretable comparisons rather than predictive accuracy. The public CSV directly supports the peak-inflation figure.</p><DataTable caption="Source coverage and verification" headers={['Source or artifact', 'Documented scope']} rows={[
      ['US inflation series', '1960–2024; annual observations'], ['Peak inflation in source', '13.55% in 1980'], ['Industry earnings', '1990, 2000, 2010, 2020 snapshots'], ['Dashboard', '3 pages'],
    ]} /></>}
    findings={['Nominal income growth alone does not demonstrate stronger purchasing power.', 'Higher-inflation filters change the comparison set: only the 1990 earnings snapshot coincides with inflation above 4%.', 'Sector composition and time coverage must be considered before comparing average compensation.', 'The inflation maximum describes the full source history, not necessarily the period of an earnings comparison.']}
    recommendation="Use the dashboard to explore descriptive sector and time differences and identify questions for deeper analysis. Check the active period, workforce coverage, and whether values are nominal or explicitly inflation-adjusted before drawing conclusions."
    limitations={['Source datasets have different time granularities and coverage.', 'Descriptive associations do not establish causal effects or predict future purchasing power.', 'Compensation rankings during higher-inflation conditions reflect limited overlapping snapshots, not sustained sector resilience.', 'Industry workforce shares require the model denominator and filter context to be independently reproduced before quoting percentages.']}
    stack={['Power BI', 'Power Query', 'DAX', 'Microsoft Excel', 'FRED', 'Dimensional Modeling']}
    contribution="I independently developed the source preparation, dimensional model, measures, and dashboard using a Udacity-supplied scenario and data alongside public inflation information. The most important lesson was that a consistent date dimension cannot compensate for mismatched source coverage; that distinction must remain visible in the report."
  />;
}
