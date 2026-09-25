export const profile = {
  name: 'Abdullah Alshammari',
  location: 'Riyadh, Saudi Arabia',
  email: 'abdullah.tecch@gmail.com',
  github: 'https://github.com/Abdu114hf16',
  linkedin: 'https://linkedin.com/in/alshammaridev',
  disciplines: ['Data Science', 'Business Intelligence', 'Data Engineering', 'AI'],
  value: 'I build decision-ready data solutions—from reliable data foundations and analytical models to dashboards and applied AI.',
  about: [
    'I am a Computer Science graduate from King Saud University with First-Class Honors, interested in building data solutions that connect technical work with practical business needs.',
    'My background spans data science, business intelligence, data engineering, and artificial intelligence. Through academic, independent, and professional projects, I have transformed complex data into structured analytical solutions, developed and evaluated machine-learning models, designed relational databases, and contributed to automated data and AI workflows.',
    'I value structured problem-solving, continuous learning, clear communication, and teamwork. I am interested in graduate and entry-level opportunities where data and technology support better business decisions.',
  ],
  experience: {
    title: 'Business & Technology Intern (Cooperative Training)',
    organization: 'Ojoor Business Solutions (OBS)',
    period: 'Jun 2026 – Aug 2026',
    bullets: [
      'Developed an internal financial reporting solution covering data preparation, quality validation, dimensional modeling, reusable measures, and Power BI dashboards.',
      'Collaborated on an AI-enabled product through relational database design and data-workflow development, translating stakeholder requirements into implementation priorities and presenting weekly progress.',
      'Participated in field visits and business-exposure sessions with external companies and consultants, gaining practical insight into project delivery, operational efficiency, customer needs, and the role of data and technology in business decision-making.',
    ],
  },
};

export const practices = [
  { title: 'Data Engineering & Databases', description: 'SQL ETL, dimensional modeling, relational design, data quality, and dependable analytical foundations.', tone: 'ba' },
  { title: 'Data Science & Machine Learning', description: 'Predictive modeling, segmentation, feature engineering, model evaluation, and explainability.', tone: 'ml' },
  { title: 'Business Intelligence & Analytics', description: 'Data transformation, dimensional modeling, KPI design, dashboards, and decision-ready reporting.', tone: 'ba' },
  { title: 'Artificial Intelligence', description: 'NLP, computer vision, AI-enabled workflows, and responsible applied-AI experimentation.', tone: 'web' },
];

export const skills = [
  { group: 'Data Science & Machine Learning', items: 'Python, pandas, NumPy, scikit-learn, Supervised Learning, Unsupervised Learning, Feature Engineering, Model Evaluation, Optimization' },
  { group: 'Business Intelligence & Analytics', items: 'Data Cleaning, Data Transformation, Data Modeling, Dashboard Development, KPI Reporting, Data Visualization' },
  { group: 'Data Engineering & Databases', items: 'ETL, Data Integration, Data Pipelines, Relational Modeling, Dimensional Modeling, Data Quality Validation' },
  { group: 'Tools', items: 'Python, Power BI, Jupyter Notebook, Microsoft Excel, Git, GitHub, SQL, PostgreSQL, MySQL' },
  { group: 'Professional Skills', items: 'Problem Solving, Communication, Adaptability and Resilience, Relationship Building, Cross-Functional Collaboration, Emotional Intelligence' },
];

export const credentials: Array<{ title: string; org: string; href?: string; preview?: boolean; badge?: { src: string; w: number; h: number } }> = [
  { title: 'Data Engineer Associate', org: 'DataCamp', href: 'https://www.datacamp.com/certificate/DEA0016972420970', badge: { src: '/img/datacamp-data-engineer-associate.webp', w: 112, h: 137 } },
  { title: 'Machine Learning Specialization', org: 'DeepLearning.AI & Stanford Online', href: 'https://coursera.org/share/b4f3772ade9c05f85cf140091528ced5', preview: true },
  { title: 'Google Data Analytics Professional Certificate', org: 'Google', href: 'https://coursera.org/share/e2e4fdf9382b0e83b6b830387cc7b381' },
  { title: 'Google Advanced Data Analytics Professional Certificate', org: 'Google', preview: true },
  { title: 'Business Intelligence Analytics Nanodegree', org: 'Udacity', href: 'https://www.udacity.com/certificate/e/97af985c-03a5-11f1-b770-a384c7609781' },
  { title: 'Predictive Analytics for Business Nanodegree', org: 'Udacity' },
  { title: 'Introduction to Cloud Computing', org: 'IBM', href: 'https://coursera.org/share/cfc0e4066f9145c48f14b177e8ca8941' },
  { title: 'McKinsey Forward Program', org: 'McKinsey & Company', preview: true },
];
