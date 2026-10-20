// All site copy lives here. Edit text in this file; layout lives in the components.

export type SectionId = 'services' | 'experience' | 'personal' | 'contact';

export interface Entry {
  period?: string;
  title: string;
  subtitle?: string;
  description: string;
  highlights?: string[];
  stats?: { value: string; label: string }[];
  /** Small chips under the entry, e.g. the tools behind a service. */
  tags?: string[];
  link?: { href: string; label: string };
  /** Marks the current role so the viewer can style it as "now". */
  current?: boolean;
}

export const identity = {
  name: 'Kaci Bedi',
  role: 'Head of Operations and Growth, 12M+ Audience',
  education: 'BSc Physics, King\u2019s College London',
  quote: {
    text: '“You are not a drop in the ocean. You are the entire ocean in a drop.”',
    author: 'Rumi',
  },
  email: 'kacibedi@hotmail.com',
  phone: '+447849567570',
  phoneDisplay: '+44 7849 567570',
  linkedin: 'https://www.linkedin.com/in/kabir-bedii/',
  github: 'https://github.com/KabirBediCareer',
  instagram: 'https://instagram.com/kaciibedi',
  location: 'London, UK',
};

export const sections: { id: SectionId; label: string; blurb: string }[] = [
  { id: 'services', label: 'services', blurb: 'What I can do for you.' },
  { id: 'experience', label: 'experience', blurb: 'Roles, newest first.' },
  { id: 'personal', label: 'personal', blurb: 'Projects, creative and social.' },
  { id: 'contact', label: 'contact', blurb: 'Email, phone, socials.' },
];

// Opens the services section, ahead of the individual services.
export const bio: Entry = {
  title: 'Physicist turned operator',
  subtitle: 'BSc Physics, King’s College London',
  description:
    'I trained as a physicist and focused my degree on quantum computing and machine learning for finance. Then I found my passion: marrying science communication with operations. I help businesses in the science communication space transform by bringing scientific precision to the media industry.',
  highlights: [
    'Scientific rigour: every claim checked, every decision tested against the data',
    'AI expertise: from quantum machine learning to the agents and automations that run a content business',
    'Media literacy: hooks, formats, funnels and what actually moves an audience',
  ],
  stats: [{ value: '3 in 1', label: 'a rare combination in one person' }],
};

export const services: Entry[] = [
  {
    title: 'Ghost Content Creation',
    description:
      'Content written in your voice, ready to film or post. You stay the face; I do the heavy lifting behind it.',
    highlights: [
      'Short form scripts, hooks and reaction or debunk scripts with citations',
      'Carousels, captions, newsletters and lead magnet guides',
      'Podcast clip selection and episode repurposing',
      'Fact-checked against the research, so nothing you say comes back to bite you',
    ],
    tags: ['Scripts', 'Carousels', 'Newsletters', 'Captions', 'Citations'],
  },
  {
    title: 'Full System Design & Optimisation',
    description:
      'The operating system behind a creator business, designed end to end and tuned until it runs without you.',
    highlights: [
      'Content pipelines from idea to script to edit to publish to repurpose',
      'Team workflows, SOPs and briefs for editors, designers and copywriters',
      'Trackers and dashboards so you always know what is shipping and what is working',
      'Find the bottlenecks, measure them and remove them',
    ],
    tags: ['Notion', 'Airtable', 'Google Workspace', 'Slack', 'Power Automate'],
  },
  {
    title: 'Growth & Funnels',
    description:
      'Turn attention into an audience, and an audience into a business. Treated like an experiment: hypothesis, test, data, iterate.',
    highlights: [
      'Lead magnets, keyword triggers and DM automation',
      'Email sequences, digital courses and launches',
      'Audience, purchase and KPI analysis to decide what to double down on',
      'Podcast growth: guest pipeline, outreach, clips and distribution',
    ],
    tags: ['ManyChat', 'Kit', 'Instagram', 'TikTok', 'YouTube'],
  },
  {
    title: 'AI & Automation',
    description:
      'Every tool available to a creator, used the best way possible. I build the automations so your team spends its time on the creative work.',
    highlights: [
      'Custom Claude workflows and agents for scripting, research, transcripts and briefs',
      'Automated editing: transcription, captions, clipping and first cuts',
      'AI image and video generation for b-roll, thumbnails and product shots',
      'Hands-off reporting and repetitive admin, automated away',
    ],
    tags: ['Claude', 'ManyChat', 'AI video tools', 'Power Automate', 'Python'],
  },
  {
    title: 'Editing & Graphic Design',
    description:
      'The visual side, done in house or briefed to your team with a clear creative direction.',
    highlights: [
      'Short form video editing and automated editing workflows',
      'Carousel, thumbnail and social graphics design',
      'Brand identity, templates and 3D product renders',
    ],
    tags: ['Adobe Suite', 'Canva', 'Blender', 'Cinema4D'],
  },
  {
    title: 'Data & Analytics',
    description:
      'The physicist’s toolkit applied to your business: the numbers behind your content, your funnels and your operations.',
    highlights: [
      'Performance dashboards across platforms, email and sales',
      'Modelling and forecasting with Python and machine learning',
      'Clear write-ups that turn data into decisions',
    ],
    tags: ['Python', 'SQL', 'scikit-learn', 'Power BI'],
  },
];

// TODO: confirm the exact title and dates for the creator role and for Fuse Energy.
export const experience: Entry[] = [
  {
    period: '2026 – present',
    title: 'Head of Operations & Growth',
    subtitle: 'Creator brand, 12M+ followers across platforms — London',
    current: true,
    description:
      'Second hand to a creator with an audience of over 12 million. I run the business behind the content.',
    highlights: [
      'Manage a team of creatives, editors and copywriters across video, carousels and a podcast',
      'Own the funnels: lead magnets, email sequences, ManyChat automation, digital courses',
      'Direct the podcast from guest pipeline to clips and distribution',
      'Chime in on copy, scripts and creative direction',
      'Help grow the creator’s supplement company and its US to UK supply chain',
    ],
  },
  {
    period: '2026',
    title: 'Operations Analyst',
    subtitle: 'Fuse Energy — London',
    description:
      'Operations analysis and data science at the first automated energy company, valued at $5 billion and named the UK’s fastest growing startup by The Times.',
    highlights: [
      'Brought a physicist’s approach to operations: define the variable, run the experiment, read the data, iterate',
      'Used data science to find where automation and process changes would have the most impact',
      'Supported the operations behind a supplier adding hundreds of thousands of UK households',
    ],
    link: { href: 'https://fuseenergy.com', label: 'fuseenergy.com' },
  },
  {
    period: 'Oct – Dec 2025',
    title: 'Growth Marketing Intern',
    subtitle: 'Naked & Saucy Foods — Vancouver, BC',
    description:
      'Drove growth for a national CPG brand sold in Costco, Walmart and Loblaws with a scientific, data driven approach. Dug into customer demographics, purchase patterns and KPIs, then ran engagement experiments and UGC tests to find what grew the brand.',
    link: { href: 'https://nakedandsaucy.com', label: 'nakedandsaucy.com' },
  },
  {
    period: 'Sep – Nov 2025',
    title: 'Mobile Mortgage Specialist Assistant',
    subtitle: 'TD Bank — Vancouver, BC',
    description:
      'Technical backbone of the mortgage practice. Streamlined the IT setup, kept CRM data clean and used real estate finance knowledge to advise clients directly.',
  },
  {
    period: 'Jan – Oct 2025',
    title: 'Full Stack Rota System Developer',
    subtitle: 'King’s College London',
    description:
      'Started as a Disability Support Worker. Spotted inefficiencies in shift allocation, pitched a fix, won a KCL funding grant and shipped a GDPR compliant rota system on Power Apps and SharePoint that improved efficiency by up to 50%.',
  },
  {
    period: 'May – Aug 2023',
    title: 'Python Developer',
    subtitle: 'Centre for Urban Science and Progress (CUSP) — London',
    description:
      'Tested and validated the Vizent Python library for visualising data entropy and complexity. Wrote over 100 test cases and presented findings for researchers, supporting applications for the UK National Grid and TfL.',
    link: { href: 'https://pypi.org/project/vizent', label: 'pypi.org/project/vizent' },
  },
  {
    period: 'Apr – Aug 2023',
    title: 'Computer Science Hackathon Co-founder',
    subtitle: 'King’s College London',
    description:
      'Co-designed KCLPuzzled, the department’s first hackathon. Built puzzles around Markov chains, graph search, classical ciphers and encryption alongside CS students and AI professors.',
  },
  {
    period: 'Apr – Jun 2023',
    title: 'Venue Sales Coordinator',
    subtitle: 'King’s College London',
    description:
      'Managed client enquiries, matched events to venues and coordinated security, catering and facilities from first contact to confirmation.',
  },
  {
    period: 'Jan 2019 – Sep 2021',
    title: 'Primary Caregiver — Data Analytics',
    subtitle: 'NHS — Kent',
    description:
      'Employed by the NHS as a primary caregiver for my aunt, who needs 24/7 care. Built a Python and machine learning project on top of the role to improve care and predict behavioural patterns.',
  },
  {
    period: '2021 – 2025',
    title: 'BSc Physics',
    subtitle: 'King’s College London',
    description:
      'Moved to London at 18. Focused my degree on quantum computing and machine learning for finance, with additional Computer Science modules in AI decision making and planning. Dissertation on quantum machine learning for fraud detection graded 77, First Class.',
  },
];

// Personal projects, creative work and social media, together.
export const personal: Entry[] = [
  {
    period: '2025',
    title: 'Science Communication',
    subtitle: 'Instagram and TikTok',
    description: 'Educational short form content on physics, AI and personal growth.',
    stats: [
      { value: '2M+', label: 'views' },
      { value: '4,000+', label: 'organic followers in 2 months' },
    ],
    link: {
      href: 'https://www.instagram.com/reel/DN1xiAy0E3m/',
      label: 'Watch on Instagram',
    },
  },
  {
    period: '2026 – present',
    title: 'Creator Brand Content Operation',
    subtitle: '12M+ followers across platforms',
    current: true,
    description:
      'Run the content machine behind a major creator: briefing editors and designers, directing the podcast, reviewing scripts and copy, and building the carousel, clip and lead magnet pipelines that turn one recording into a week of posts.',
  },
  {
    period: '2025',
    title: 'Quantum Machine Learning for Financial Fraud Detection',
    subtitle: 'Dissertation — 77, First Class',
    description:
      'Benchmarked Quantum SVMs against SVM, CatBoost, XGBoost and LightGBM on the PCA transformed Kaggle credit card fraud dataset. Ran QSVM circuits on the IBM Kyiv quantum backend and Qiskit Aer to evaluate performance and quantum advantage.',
  },
  {
    period: '2019 – 2025',
    title: 'Behavioural Forecasting for Care',
    subtitle: 'Personal project',
    description:
      'As a primary caregiver for my aunt, who is autistic and has bipolar disorder, I built a Python application with pandas and scikit-learn. A random forest classifier analysed behavioural patterns, found cyclic mood variations and forecast short term temperament so we could plan hospital visits, holidays and routines around her stability.',
  },
  {
    period: 'Feb 2024',
    title: 'Physics of DJing Workshop',
    subtitle: 'Jane Street × KCL Women in Physics',
    description:
      'Hosted an interactive workshop for an audience ranging from professors to STEM students, explaining Fourier analysis, Fourier transforms and frequency equalisation through DJing.',
  },
  {
    period: '2022 – 2024',
    title: 'KCL DJ Society President',
    description:
      'Elected for leadership and community focus. Organised and DJ’d events of over 1,000 people, raised over £3,000 for charity, hosted renowned DJs and grew membership to the largest in the society’s history.',
    link: { href: 'https://instagram.com/kaciibedi', label: 'Instagram' },
  },
  {
    period: '2023 – 2025',
    title: 'Audiovisual Business',
    subtitle: 'Founder',
    description:
      'Ran a DJ, sound and lighting business for events. Clients included Yoto Play, Imperial CGCU, Imperial RCSU, KCLSU and the School of Politics and Economics. Around £10,000 ARR, which helped fund my degree.',
  },
];
