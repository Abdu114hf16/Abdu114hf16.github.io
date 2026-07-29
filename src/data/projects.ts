export type Field = 'ml' | 'ba' | 'web';
export type Origin = 'academic' | 'personal';

export interface Project {
  slug: string;
  title: string;
  desc: string;
  field: Field;
  origin: Origin;
  tags: string[];
  status: 'live' | 'queued';
}

export const FIELD_LABEL: Record<Field, string> = {
  ml: 'Machine Learning',
  ba: 'Business Analytics',
  web: 'Web Development',
};

export const FIELD_BADGE: Record<Field, string> = {
  ml: 'ML',
  ba: 'Analytics',
  web: 'Web',
};

/** Display order mirrors the original projects page. */
export const projects: Project[] = [
  {
    slug: 'playstation-disc-sentiment',
    title: 'PlayStation Disc Decision Sentiment',
    desc: 'Sentiment analysis represented in an interactive dashboard of public reactions to PlayStation ending physical discs post on X/Twitter.',
    field: 'ba',
    origin: 'personal',
    tags: ['Python', 'NLP', 'XLM-RoBERTa', 'Transformers', 'Hugging Face', 'Pandas', 'Power BI'],
    status: 'live',
  },
  {
    slug: 'medical-cost-prediction',
    title: 'Medical Insurance Cost Prediction',
    desc: 'Annual medical costs prediction using Machine Learning and interpretation techniques.',
    field: 'ml',
    origin: 'personal',
    tags: ['Python', 'EDA', 'Data Cleaning', 'Linear Regression', 'Ridge', 'Lasso', 'SHAP', 'R2 = 0.91'],
    status: 'live',
  },
  {
    slug: 'eventia',
    title: 'Eventia : Events Management Platform',
    desc: 'Centralized platform powered by AI assistant and planner, supported by advanced features and analytics.',
    field: 'web',
    origin: 'academic',
    tags: ['Django', 'Python', 'MySQL', 'Gemini AI', 'Resend', 'JavaScript', 'HTML', 'CSS'],
    status: 'live',
  },
  {
    slug: 'commercial-flights-delays',
    title: 'Commercial Flights Delays Analysis',
    desc: 'A Power BI solution that forecasts delay probability and optimizes operational logistics.',
    field: 'ba',
    origin: 'personal',
    tags: ['Power BI', 'DAX', 'Data Modeling', 'Regression', 'Clustering', 'Time-Series', 'Anomaly Detection'],
    status: 'live',
  },
  {
    slug: 'optimizing-donors-outreach',
    title: 'Optimizing Donors Outreach',
    desc: 'A machine learning pipeline that flags the most likely donors and cuts outreach cost.',
    field: 'ml',
    origin: 'personal',
    tags: ['Python', 'scikit-learn', 'pandas', 'NumPy', 'EDA', 'Cross-Validation'],
    status: 'queued',
  },
  {
    slug: 'sms-spam-classifier',
    title: 'SMS Spam Classifier',
    desc: 'An NLP classifier that separates spam from legitimate messages.',
    field: 'ml',
    origin: 'personal',
    tags: ['Python', 'scikit-learn', 'NLP', 'Naive Bayes', 'Precision = 97.2%'],
    status: 'queued',
  },
  {
    slug: 'boolean-search-engine',
    title: 'Boolean Search Engine',
    desc: 'High-performance Boolean retrieval over 200K+ articles at microsecond speed.',
    field: 'ml',
    origin: 'academic',
    tags: ['Python', 'NLTK', 'Inverted Index', 'Boolean Retrieval', 'Information Retrieval'],
    status: 'queued',
  },
  {
    slug: 'interactive-ksa-discovery',
    title: 'Interactive KSA Discovery',
    desc: 'A full-stack platform for exploring Saudi regions and heritage, with a responsive RTL Arabic UI.',
    field: 'web',
    origin: 'academic',
    tags: ['PHP', 'MySQL', 'JavaScript', 'CRUD', 'RTL Arabic UI'],
    status: 'queued',
  },
];

export const liveProjects = projects.filter((p) => p.status === 'live');

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
