export type Domain = 'data-science' | 'business-intelligence' | 'data-engineering' | 'ai-ml' | 'data-systems' | 'supporting-software';
export type Context = 'professional' | 'academic' | 'independent' | 'course';
export type ProjectTier = 'featured' | 'supporting' | 'archive';
export interface Resource { label: string; href: string; kind: 'repo' | 'report' | 'demo' | 'dashboard' }
export interface Project {
  slug: string;
  title: string;
  summary: string;
  businessQuestion: string;
  outcome: string;
  domains: Domain[];
  context: Context;
  contextDetail?: string;
  tier: ProjectTier;
  featuredRank: number | null;
  catalogRank: number;
  home?: { rank: number; summary: string; metric: number };
  tags: string[];
  metrics: Array<{ label: string; value: string }>;
  resources: Resource[];
  confidentiality: 'public';
  status: 'published' | 'draft';
  seoDescription: string;
  cover?: { src: string; alt: string; w: number; h: number; caption?: string };
}

export const DOMAIN_LABEL: Record<Domain, string> = {
  'data-engineering': 'Data Engineering', 'data-systems': 'Data Systems',
  'supporting-software': 'Software Development', 'business-intelligence': 'BI & Analytics',
  'data-science': 'Data Science', 'ai-ml': 'AI / Machine Learning',
};
export const DOMAIN_TONE: Record<Domain, string> = {
  'data-science': 'ml', 'business-intelligence': 'ba', 'data-engineering': 'ba',
  'ai-ml': 'ml', 'data-systems': 'web', 'supporting-software': 'web',
};
export const CONTEXT_LABEL: Record<Context, string> = {
  professional: 'Professional', academic: 'Academic', independent: 'Independent', course: 'Course project',
};
export const TIER_LABEL: Record<ProjectTier, string> = {
  featured: 'Featured Projects', supporting: 'More Data Projects', archive: 'Additional Projects',
};

const repo = (name: string): Resource => ({ kind: 'repo', label: 'View repository', href: `https://github.com/Abdu114hf16/${name}` });

export const projects: Project[] = [
  {
    slug: 'olist-data-warehouse', title: 'Olist E-Commerce Data Warehouse',
    summary: 'Built a PostgreSQL sales warehouse with an order-item star schema, SQL loading scripts, data-quality checks, and reusable reporting views.',
    businessQuestion: 'How can raw e-commerce records become a consistent, validated foundation for sales, customer, and delivery analysis?',
    outcome: 'Connected four dimensions to an order-item fact table, with five quality checks and two reusable reporting views.',
    domains: ['data-engineering', 'data-systems', 'business-intelligence'], context: 'independent',
    contextDetail: 'Independent application of concepts from DataCamp’s Associate Data Engineer in SQL track',
    tier: 'featured', featuredRank: 1, catalogRank: 1,
    home: { rank: 1, summary: 'A PostgreSQL sales warehouse with dimensional modeling, SQL ETL, and data-quality checks.', metric: 0 },
    tags: ['PostgreSQL', 'SQL ETL', 'Star Schema', 'Data Quality'],
    metrics: [{ label: 'Dimensions', value: '4' }, { label: 'Quality checks', value: '5' }, { label: 'Reporting views', value: '2' }],
    resources: [repo('olist-data-warehouse')], confidentiality: 'public', status: 'published',
    cover: { src: '/img/cover-olist.webp', alt: 'Olist warehouse star schema with a sales fact table and customer, product, seller and date dimensions', w: 1200, h: 675, caption: 'Original project schema. The SQL DDL is authoritative for physical data types and constraints.' },
    seoDescription: 'A PostgreSQL data engineering project turns Olist e-commerce data into a four-dimension sales warehouse, with SQL ETL, quality checks and reporting views.',
  },
  {
    slug: 'medical-cost-prediction', title: 'Medical Insurance Cost Prediction',
    summary: 'Modeled annual medical costs and explained the drivers behind large pricing differences using interaction-aware regression and feature attribution.',
    businessQuestion: 'How much can interaction-aware regression improve annual medical-cost estimates, and which attributes explain the predictions?',
    outcome: 'Improved holdout R² from 0.81 to 0.91 and reduced RMSE from approximately $5,956 to $4,085.',
    domains: ['data-science', 'ai-ml'], context: 'independent', tier: 'featured', featuredRank: 5, catalogRank: 5,
    home: { rank: 2, summary: 'Interaction-aware regression improves medical-cost predictions and explains the model’s decisions.', metric: 1 },
    tags: ['Regression', 'Feature Attribution', 'Python', 'Model Evaluation'],
    metrics: [{ label: 'Records', value: '1,338' }, { label: 'Holdout R²', value: '0.91' }, { label: 'Holdout RMSE', value: '$4,085' }],
    resources: [repo('medical-insurance-cost-prediction')], confidentiality: 'public', status: 'published',
    seoDescription: 'Interaction-aware regression explains annual medical costs across 1,338 records, improving holdout R² from 0.81 to 0.91 with transparent limitations.',
    cover: { src: '/img/cover-medical.webp', alt: 'Medical-cost interaction plot showing different BMI relationships by smoking status', w: 1200, h: 675, caption: 'Original project plot: interaction features account for different BMI patterns within the teaching dataset.' },
  },
  {
    slug: 'optimizing-donor-outreach', title: 'Optimizing Donor Outreach',
    summary: 'Benchmarked precision-oriented classifiers for targeted outreach using income eligibility as a proxy for potential donor capacity.',
    businessQuestion: 'How can an outreach team prioritize likely high-capacity prospects instead of sending the same campaign to everyone?',
    outcome: 'Selected and tuned a boosting model with reported test accuracy of 85.68% and an F0.5 score of 0.7223.',
    domains: ['data-science', 'ai-ml', 'business-intelligence'], context: 'course', contextDetail: 'Udacity CharityML exercise',
    tier: 'featured', featuredRank: 6, catalogRank: 6, tags: ['Classification', 'Cross-Validation', 'Precision', 'Python'],
    home: { rank: 3, summary: 'Precision-focused model comparison to prioritize outreach using an income-based proxy.', metric: 2 },
    metrics: [{ label: 'Census records', value: '45,222' }, { label: 'Test accuracy', value: '85.68%' }, { label: 'Test F0.5', value: '0.7223' }],
    resources: [repo('Optimizing_Donors_Outreach')], confidentiality: 'public', status: 'published',
    cover: { src: '/img/cover-donor.webp', alt: 'Original CharityML report comparison of classifier families before tuning', w: 1200, h: 675, caption: 'Model-family comparison from the saved project report; these are pre-tuning comparisons.' },
    seoDescription: 'Precision-oriented donor outreach classification on 45,222 census records achieves a reported F0.5 of 0.7223, with clear income-proxy limitations.',
  },
  {
    slug: 'income-inflation-purchasing-power', title: 'Income, Inflation & Purchasing Power',
    summary: 'Integrated workforce, earnings, and inflation data into a dimensional BI model to distinguish nominal income growth from changes in purchasing power.',
    businessQuestion: 'How do inflation and labor-market composition change the interpretation of income growth across time and sectors?',
    outcome: 'Revealed that rising nominal income did not consistently protect purchasing power during higher-inflation periods.',
    domains: ['business-intelligence', 'data-engineering'], context: 'independent', contextDetail: 'Independent implementation · Udacity-supplied scenario and data',
    tier: 'featured', featuredRank: 4, catalogRank: 4, tags: ['Data Integration', 'Star Schema', 'Power BI', 'Economic Analysis'],
    home: { rank: 4, summary: 'A dimensional BI model connecting earnings and inflation to purchasing-power analysis.', metric: 0 },
    metrics: [{ label: 'Peak inflation in source', value: '13.55%' }, { label: 'Inflation coverage', value: '1960–2024' }, { label: 'Dashboard pages', value: '3' }],
    resources: [repo('MacroEconomic-Analysis-PowerBi'), { kind: 'report', label: 'Original dashboard PDF', href: 'https://github.com/Abdu114hf16/MacroEconomic-Analysis-PowerBi/blob/4bb516f0a35b340b2cab2b0fa688f343aaea749f/Dashboard_Preview.pdf' }, { kind: 'report', label: 'FRED inflation series', href: 'https://fred.stlouisfed.org/series/FPCPITOTLZGUSA' }, { kind: 'report', label: 'Inflation data snapshot', href: 'https://github.com/Abdu114hf16/MacroEconomic-Analysis-PowerBi/blob/4bb516f0a35b340b2cab2b0fa688f343aaea749f/Datasets/Inflation_fred_dataset.csv' }],
    cover: { src: '/img/cover-income.webp', alt: 'Original dashboard excerpt comparing income snapshots and annual inflation', w: 1200, h: 675, caption: 'Chart excerpt from the public dashboard. Earnings snapshots and annual inflation have different time coverage.' },
    confidentiality: 'public', status: 'published',
    seoDescription: 'A US economic BI model combines earnings snapshots and inflation data to explain purchasing-power changes, with a documented 13.55% inflation peak.',
  },
  {
    slug: 'playstation-disc-sentiment', title: 'PlayStation Disc Decision Sentiment',
    summary: 'Classified multilingual public reactions to a PlayStation-related post and delivered an interactive dashboard for sentiment, language, and time-based exploration.',
    businessQuestion: 'What does sentiment classification reveal about the collected conversation, and how does it vary across language and day?',
    outcome: 'Scored 56,677 public reactions while making sampling and representativeness limitations explicit.',
    domains: ['ai-ml', 'business-intelligence'], context: 'independent', tier: 'archive', featuredRank: null, catalogRank: 9,
    tags: ['Multilingual NLP', 'Sentiment Analysis', 'Python', 'Interactive Reporting'],
    metrics: [{ label: 'Public reactions', value: '56,677' }, { label: 'Sentiment classes', value: '3' }],
    resources: [{ kind: 'dashboard', label: 'Explore dashboard', href: '/projects/playstation-disc-sentiment/dashboard' }],
    confidentiality: 'public', status: 'published',
    seoDescription: 'Multilingual sentiment classification explores 56,677 public reactions in an interactive dashboard, with explicit sampling and interpretation limits.',
    cover: { src: '/img/cover-playstation.webp', alt: 'Actual sentiment dashboard KPIs, sentiment distribution and day charts for the collected reactions', w: 1200, h: 675, caption: 'An excerpt of the interactive dashboard. Results describe the supplied 56,677-reaction sample, not all customers.' },
  },
  {
    slug: 'boolean-search-engine', title: 'Boolean Search Engine',
    summary: 'Built an inverted-index retrieval engine that supports AND and OR queries across the headlines and short descriptions of a large news corpus.',
    businessQuestion: 'How can a large document collection be structured once so repeated Boolean searches avoid scanning every document?',
    outcome: 'Indexed searchable text from 209,527 news records and supported AND/OR retrieval using posting-set operations.',
    domains: ['data-systems', 'data-engineering'], context: 'academic', contextDetail: 'CSC484 information retrieval project',
    tier: 'archive', featuredRank: null, catalogRank: 10, tags: ['Inverted Index', 'Information Retrieval', 'Python', 'Boolean Queries'],
    metrics: [{ label: 'Indexed news records', value: '209,527' }, { label: 'Query operations', value: 'AND / OR' }],
    resources: [repo('boolean-search-engine'), { kind: 'report', label: 'Project presentation', href: 'https://github.com/Abdu114hf16/boolean-search-engine/blob/HEAD/docs/project_deck.pptx' }],
    cover: { src: '/img/cover-boolean.webp', alt: 'Explanatory inverted-index diagram from document normalization to term postings and Boolean queries', w: 1200, h: 675, caption: 'Schematic of the implemented retrieval design. The document identifiers in this illustration are examples, not benchmark results.' },
    confidentiality: 'public', status: 'published',
    seoDescription: 'An inverted index enables AND/OR retrieval across 209,527 news records, separating search design from environment-dependent performance measurements.',
  },
  {
    slug: 'commercial-flights-delays', title: 'Commercial Flight Delay Analysis',
    summary: 'Explored delay patterns, seasonal disruption, and passenger-experience signals through a decision-support dashboard combining descriptive, predictive, and anomaly-oriented analysis.',
    businessQuestion: 'Which delay patterns and operational tradeoffs can a scenario-based aviation analysis illuminate?',
    outcome: 'Connected a year of New York departures to satisfaction analysis, scenario-based office placement, and exploratory forecasts.',
    domains: ['business-intelligence', 'data-science'], context: 'independent', contextDetail: 'Independent analysis of a hypothetical scenario brief',
    tier: 'supporting', featuredRank: null, catalogRank: 7, tags: ['Forecasting', 'Clustering', 'Power BI', 'Regression'],
    metrics: [{ label: 'Departure data', value: '2021' }, { label: 'Scope', value: 'New York' }],
    resources: [repo('Commercial_Flights_Delays_Analysis'), { kind: 'report', label: 'Read full report', href: '/docs/CFD_Report.pdf' }],
    confidentiality: 'public', status: 'published',
    seoDescription: 'A scenario-based BI study of 2021 New York departures explores delays, satisfaction and forecasting, with operational and data-coverage limitations.',
    cover: { src: '/img/hero-cfd.webp', alt: 'Commercial flight delay dashboard overview', w: 1000, h: 554 },
  },
  {
    slug: 'melbourne-housing-segmentation', title: 'Melbourne Housing Market Segmentation',
    summary: 'An academic group project exploring mixed-type housing-market segmentation.',
    businessQuestion: 'Which interpretable groups can support differentiated housing-market analysis?',
    outcome: 'Publication awaits an accessible source report and a verified personal contribution statement.',
    domains: ['data-science', 'ai-ml'], context: 'academic', tier: 'archive', featuredRank: null, catalogRank: 13,
    tags: ['Mixed-Type Clustering'], metrics: [], resources: [], confidentiality: 'public', status: 'draft',
    seoDescription: 'Academic housing-market segmentation using mixed numerical and categorical features.',
  },
  {
    slug: 'sms-spam-model-comparison', title: 'SMS Spam Classification & Model Comparison',
    summary: 'Compared four text-classification approaches and retained the strongest balanced model at 98.9% accuracy and 0.956 F1.',
    businessQuestion: 'Which classifier best balances blocking spam against incorrectly blocking legitimate messages?',
    outcome: 'The probabilistic text classifier achieved the strongest documented precision/recall balance across four approaches.',
    domains: ['data-science', 'ai-ml'], context: 'course', contextDetail: 'Udacity exercise extended into a multi-model comparison', tier: 'supporting', featuredRank: null, catalogRank: 8,
    tags: ['Text Classification', 'Model Comparison', 'Bag of Words', 'Python'],
    metrics: [{ label: 'Messages', value: '5,572' }, { label: 'Test accuracy', value: '98.9%' }, { label: 'Test F1', value: '0.956' }],
    resources: [{ ...repo('Naive_Bayes_SMS_Classifier'), label: 'Baseline repository' }, { ...repo('Ensemble_SMS_Classifier'), label: 'Comparison repository' }],
    confidentiality: 'public', status: 'published',
    seoDescription: 'Four SMS classifiers are compared across accuracy, precision and recall on 5,572 messages; the strongest balanced model reaches a reported F1 of 0.956.',
  },
  {
    slug: 'handwritten-digit-recognition', title: 'Handwritten Digit Recognition',
    summary: 'Trained a convolutional neural network for handwritten digit recognition and built an interactive drawing interface to explore predictions on custom input.',
    businessQuestion: 'How can a handwritten digit classifier connect a benchmark dataset to a usable drawing interface?',
    outcome: 'Connected image normalization and convolutional classification to interactive handwritten-digit inference.',
    domains: ['ai-ml', 'data-science'], context: 'independent', tier: 'archive', featuredRank: null, catalogRank: 11,
    tags: ['Computer Vision', 'Convolutional Networks', 'TensorFlow', 'Gradio'],
    metrics: [{ label: 'Digit classes', value: '10' }, { label: 'Input dimensions', value: '28 × 28' }],
    resources: [repo('Handwritten_digit_recognition')], confidentiality: 'public', status: 'published',
    seoDescription: 'A convolutional digit classifier connects MNIST preprocessing to an interactive drawing interface, with explicit limits on real-world image transfer.',
  },
  {
    slug: 'eventia', title: 'Eventia: Centralized Events Management Platform',
    summary: 'A graduation-project platform supporting event creation, licensing workflows, attendee engagement, messaging, analytics, and AI-assisted planning.',
    businessQuestion: 'How can a shared event workflow reduce fragmented planning, communication, and oversight?',
    outcome: 'A four-person graduation project joining role-based event workflows with a shared relational database and an AI assistant.',
    domains: ['supporting-software', 'data-systems', 'ai-ml'], context: 'academic', contextDetail: 'Team graduation project',
    tier: 'featured', featuredRank: 2, catalogRank: 2, tags: ['Relational Design', 'Django', 'MySQL', 'Applied AI'],
    metrics: [{ label: 'Team members', value: '4' }, { label: 'Context', value: 'Graduation project' }],
    resources: [repo('Eventia_Software'), { kind: 'report', label: 'Project report', href: '/docs/Eventia_Report.pdf' }],
    confidentiality: 'public', status: 'published',
    seoDescription: 'A team graduation project unifies event workflows, relational data and an AI assistant, with clear attribution for backend and database contributions.',
    cover: { src: '/img/cover-eventia.webp', alt: 'Eventia event-management platform', w: 1200, h: 675, caption: 'Team graduation project supporting connected event-management workflows.' },
  },
  {
    slug: 'interactive-saudi-arabia-discovery', title: 'Interactive Saudi Arabia Discovery Platform',
    summary: 'A responsive Arabic RTL platform for exploring Saudi regions and heritage, with search, media galleries, content-management workflows, and database access.',
    businessQuestion: 'How can regional and cultural content become searchable and manageable through an Arabic-first interface?',
    outcome: 'Connected Arabic RTL browsing, search, and administrative content workflows to a relational content model.',
    domains: ['supporting-software', 'data-systems'], context: 'academic', tier: 'featured', featuredRank: 3, catalogRank: 3,
    tags: ['Relational Design', 'PHP', 'MySQL', 'Arabic RTL'],
    cover: { src: '/img/cover-saudi.webp', alt: 'Arabic RTL region gallery in the Saudi Discovery platform', w: 1200, h: 675, caption: 'Original project interface: database-backed regional browsing, search, and categories.' },
    metrics: [{ label: 'Interface', value: 'Arabic RTL' }, { label: 'Content workflow', value: 'CRUD' }],
    resources: [repo('interactive-ksa-discovery'), { kind: 'report', label: 'Redacted project report', href: 'https://github.com/Abdu114hf16/interactive-ksa-discovery/blob/HEAD/Report.pdf' }], confidentiality: 'public', status: 'published',
    seoDescription: 'An Arabic-first discovery platform connects searchable Saudi regional content, responsive RTL browsing and administrative workflows to a relational model.',
  },
  {
    slug: 'arabic-numeral-ocr-speech', title: 'Arabic Numeral OCR & Speech Prototype',
    summary: 'Composes Arabic speech from manually entered numbers up to 1,000,000, with a documented but currently unavailable external image-extraction path.',
    businessQuestion: 'How can manual or image-extracted numerals be converted into composed Arabic speech?',
    outcome: 'Documented manual number-to-speech composition; image extraction is unavailable because its external service is offline.',
    domains: ['ai-ml', 'supporting-software'], context: 'independent', tier: 'archive', featuredRank: null, catalogRank: 12,
    tags: ['Arabic Interface', 'Speech Composition', 'OCR Prototype', 'JavaScript'],
    metrics: [{ label: 'Manual input range', value: '0–1,000,000' }, { label: 'Status', value: 'Prototype' }],
    resources: [repo('ArabicOCR-NumToSpeech')], confidentiality: 'public', status: 'published',
    seoDescription: 'An Arabic-interface prototype composes spoken numbers from manual input up to 1,000,000 and documents the limits of its external image-extraction path.',
  },
];

const tiers: Record<ProjectTier, number> = { featured: 0, supporting: 1, archive: 2 };
export const orderProjects = (items: readonly Project[]) => [...items].sort((a, b) =>
  tiers[a.tier] - tiers[b.tier] || (a.featuredRank ?? a.catalogRank) - (b.featuredRank ?? b.catalogRank));
export function filterProjects(items: readonly Project[], domains: readonly Domain[] = []) {
  return orderProjects(items.filter(p => p.status === 'published' &&
    (domains.length === 0 || domains.some(d => p.domains.includes(d)))));
}
export const publishedProjects = filterProjects(projects);
export const homeProjects = publishedProjects.filter(p => p.home).sort((a, b) => a.home!.rank - b.home!.rank);
export const bySlug = (slug: string) => publishedProjects.find(p => p.slug === slug);

/** Public resources use HTTPS or an absolute same-site path, never executable URLs. */
export function isResourceUrl(value: string): boolean {
  if (!value || /[\s\\]/.test(value)) return false;
  if (value.startsWith('/') && !value.startsWith('//')) return !value.includes('..');
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch { return false; }
}

export function validateProjects(items: readonly Project[]) {
  const slugs = new Set<string>();
  const ranks = new Set<number>();
  const featuredRanks = new Set<number>();
  const homeRanks = new Set<number>();
  for (const p of items) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || slugs.has(p.slug)) throw new Error(`Invalid/duplicate slug: ${p.slug}`);
    slugs.add(p.slug);
    if (!p.domains.length || p.domains.some(d => !(d in DOMAIN_LABEL)) || new Set(p.domains).size !== p.domains.length) throw new Error(`Invalid domains: ${p.slug}`);
    if (!(p.context in CONTEXT_LABEL) || !(p.tier in TIER_LABEL) || !['published', 'draft'].includes(p.status)) throw new Error(`Invalid taxonomy: ${p.slug}`);
    if (ranks.has(p.catalogRank) || !Number.isInteger(p.catalogRank) || p.catalogRank < 1) throw new Error(`Invalid editorial rank: ${p.slug}`);
    ranks.add(p.catalogRank);
    if (p.tier === 'featured') {
      if (!p.featuredRank || !Number.isInteger(p.featuredRank) || p.featuredRank < 1 || featuredRanks.has(p.featuredRank)) throw new Error(`Invalid featured rank: ${p.slug}`);
      featuredRanks.add(p.featuredRank);
    } else if (p.featuredRank !== null) throw new Error(`Non-featured project has a featured rank: ${p.slug}`);
    if (p.resources.some(r => !isResourceUrl(r.href))) throw new Error(`Invalid resource URL: ${p.slug}`);
    if (p.confidentiality !== 'public') throw new Error(`Only public projects belong in the catalog: ${p.slug}`);
    if (p.home) {
      if (!Number.isInteger(p.home.rank) || p.home.rank < 1 || homeRanks.has(p.home.rank) || !p.metrics[p.home.metric] || !p.home.summary) throw new Error(`Invalid home selection: ${p.slug}`);
      homeRanks.add(p.home.rank);
    }
    if (p.status === 'published' && (!p.title || !p.summary || !p.businessQuestion || !p.outcome || !p.metrics.length || !p.seoDescription)) throw new Error(`Incomplete published metadata: ${p.slug}`);
  }
}
validateProjects(projects);
