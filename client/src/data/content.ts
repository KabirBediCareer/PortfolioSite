// All site copy lives here. Edit text in this file; layout lives in the components.

export type SectionId = 'experience' | 'projects' | 'creative' | 'contact';

export interface Entry {
  period: string;
  title: string;
  subtitle?: string;
  description: string;
  highlights?: string[];
  stats?: { value: string; label: string }[];
  link?: { href: string; label: string };
  /** Marks the current role so the viewer can style it as "now". */
  current?: boolean;
}

export const identity = {
  name: 'Kaci Bedi',
  headline: 'Physicist turned operator.',
  summary:
    'Head of Operations & Growth for a creator with 12M+ followers. Before that, social, growth and operations at Fuse Energy, the UK\u2019s fastest growing startup. BSc Physics, King\u2019s College London.',
  quote: {
    text: '\u201CYou are not a drop in the ocean. You are the entire ocean in a drop.\u201D',
    author: 'Rumi',
  },
  email: 'kabirbedi01@hotmail.com',
  phone: '+447877337849',
  phoneDisplay: '+44 7877 337849',
  linkedin: 'https://www.linkedin.com/in/kabir-bedii/',
  github: 'https://github.com/KabirBediCareer',
  instagram: 'https://instagram.com/kaciibedi',
  location: 'London, UK',
};

export const sections: { id: SectionId; label: string; blurb: string }[] = [
  { id: 'experience', label: 'experience', blurb: 'Roles, newest first.' },
  { id: 'projects', label: 'projects', blurb: 'Research and side builds.' },
  { id: 'creative', label: 'creative', blurb: 'Content, brand and video.' },
  { id: 'contact', label: 'contact', blurb: 'Email, phone, socials.' },
];

// TODO: confirm the exact title and dates for the creator role and for Fuse Energy.
export const experience: Entry[] = [
  {
    period: '2026 \u2013 present',
    title: 'Head of Operations & Growth',
    subtitle: 'Creator brand, 12M+ followers across platforms \u2014 London',
    current: true,
    description:
      'Second hand to a creator with an audience of over 12 million. I run the business behind the content.',
    highlights: [
      'Manage a team of creatives, editors and copywriters across video, carousels and a podcast',
      'Own the funnels: lead magnets, email sequences, ManyChat automation, digital courses',
      'Direct the podcast from guest pipeline to clips and distribution',
      'Chime in on copy, scripts and creative direction',
      'Help grow the creator\u2019s supplement company and its US to UK supply chain',
    ],
  },
  {
    period: '2026',
    title: 'Social, Growth & Operations',
    subtitle: 'Fuse Energy \u2014 London',
    description:
      'Social media, growth and operations at the vertically integrated energy company named the UK\u2019s fastest growing startup by The Times, scaling to $500M ARR.',
    highlights: [
      'Brought a physicist\u2019s approach to growth: define the variable, run the experiment, read the data, iterate',
      'Produced and distributed social content for a brand growing at startup speed',
      'Supported the operations behind a supplier adding hundreds of thousands of UK households',
    ],
    link: { href: 'https://fuseenergy.com', label: 'fuseenergy.com' },
  },
  {
    period: 'Oct \u2013 Dec 2025',
    title: 'Growth & Creative Marketing Intern',
    subtitle: 'Naked & Saucy Foods \u2014 Vancouver, BC',
    description:
      'Applied a scientific, data driven approach to marketing for a national CPG brand sold in Costco, Walmart and Loblaws. Dug into customer demographics, purchase patterns and KPIs, then blended that with creative execution to produce UGC, refine brand identity and run engagement experiments.',
    link: { href: 'https://nakedandsaucy.com', label: 'nakedandsaucy.com' },
  },
  {
    period: 'Sep \u2013 Nov 2025',
    title: 'Mobile Mortgage Specialist Assistant',
    subtitle: 'TD Bank \u2014 Vancouver, BC',
    description:
      'Technical backbone of the mortgage practice. Streamlined the IT setup, kept CRM data clean and used real estate finance knowledge to advise clients directly.',
  },
  {
    period: 'Jan \u2013 Oct 2025',
    title: 'Full Stack Rota System Developer',
    subtitle: 'King\u2019s College London',
    description:
      'Started as a Disability Support Worker. Spotted inefficiencies in shift allocation, pitched a fix, won a KCL funding grant and shipped a GDPR compliant rota system on Power Apps and SharePoint that improved efficiency by up to 50%.',
  },
  {
    period: 'May \u2013 Aug 2023',
    title: 'Python Developer',
    subtitle: 'Centre for Urban Science and Progress (CUSP) \u2014 London',
    description:
      'Tested and validated the Vizent Python library for visualising data entropy and complexity. Wrote over 100 test cases and presented findings for researchers, supporting applications for the UK National Grid and TfL.',
    link: { href: 'https://pypi.org/project/vizent', label: 'pypi.org/project/vizent' },
  },
  {
    period: 'Apr \u2013 Aug 2023',
    title: 'Computer Science Hackathon Co-founder',
    subtitle: 'King\u2019s College London',
    description:
      'Co-designed KCLPuzzled, the department\u2019s first hackathon. Built puzzles around Markov chains, graph search, classical ciphers and encryption alongside CS students and AI professors.',
  },
  {
    period: 'Apr \u2013 Jun 2023',
    title: 'Venue Sales Coordinator',
    subtitle: 'King\u2019s College London',
    description:
      'Managed client enquiries, matched events to venues and coordinated security, catering and facilities from first contact to confirmation.',
  },
  {
    period: 'Jan 2019 \u2013 Sep 2021',
    title: 'Primary Caregiver \u2014 Data Analytics',
    subtitle: 'NHS \u2014 Kent',
    description:
      'Employed by the NHS as a primary caregiver for my aunt, who needs 24/7 care. Built a Python and machine learning project on top of the role to improve care and predict behavioural patterns.',
  },
  {
    period: '2021 \u2013 2025',
    title: 'BSc Physics',
    subtitle: 'King\u2019s College London',
    description:
      'Moved to London at 18. Took additional Computer Science modules in AI decision making and planning. Dissertation on quantum machine learning for fraud detection graded 77, First Class.',
  },
];

export const projects: Entry[] = [
  {
    period: '2025',
    title: 'Quantum Machine Learning for Financial Fraud Detection',
    subtitle: 'Dissertation \u2014 77, First Class',
    description:
      'Benchmarked Quantum SVMs against SVM, CatBoost, XGBoost and LightGBM on the PCA transformed Kaggle credit card fraud dataset. Ran QSVM circuits on the IBM Kyiv quantum backend and Qiskit Aer to evaluate performance and quantum advantage.',
  },
  {
    period: '2019 \u2013 2025',
    title: 'Behavioural Forecasting for Care',
    subtitle: 'Personal project',
    description:
      'As a primary caregiver for my aunt, who is autistic and has bipolar disorder, I built a Python application with pandas and scikit-learn. A random forest classifier analysed behavioural patterns, found cyclic mood variations and forecast short term temperament so we could plan hospital visits, holidays and routines around her stability.',
  },
  {
    period: 'Feb 2024',
    title: 'Physics of DJing Workshop',
    subtitle: 'Jane Street \u00D7 KCL Women in Physics',
    description:
      'Hosted an interactive workshop for an audience ranging from professors to STEM students, explaining Fourier analysis, Fourier transforms and frequency equalisation through DJing.',
  },
  {
    period: '2022 \u2013 2024',
    title: 'KCL DJ Society President',
    description:
      'Elected for leadership and community focus. Organised and DJ\u2019d events of over 1,000 people, raised over \u00A33,000 for charity, hosted renowned DJs and grew membership to the largest in the society\u2019s history.',
    link: { href: 'https://instagram.com/kaciibedi', label: 'Instagram' },
  },
  {
    period: '2023 \u2013 2025',
    title: 'Audiovisual Business',
    subtitle: 'Founder',
    description:
      'Ran a DJ, sound and lighting business for events. Clients included Yoto Play, Imperial CGCU, Imperial RCSU, KCLSU and the School of Politics and Economics. Around \u00A310,000 ARR, which helped fund my degree.',
  },
];

export const creative: Entry[] = [
  {
    period: '2026 \u2013 present',
    title: 'Creator Brand Content Operation',
    subtitle: '12M+ followers across platforms',
    current: true,
    description:
      'Run the content machine behind a major creator: briefing editors and designers, directing the podcast, reviewing scripts and copy, and building the carousel, clip and lead magnet pipelines that turn one recording into a week of posts.',
  },
  {
    period: '2026',
    title: 'Fuse Energy Social',
    description:
      'Social content for a startup scaling past $500M ARR. Short turnaround, high volume, judged on the numbers.',
    link: { href: 'https://fuseenergy.com', label: 'fuseenergy.com' },
  },
  {
    period: '2025',
    title: 'Clarius Living',
    description:
      'Directed social media creative and brand identity. Led 3D product design and rendering for the full catalogue.',
    link: { href: 'https://clariusliving.com', label: 'clariusliving.com' },
  },
  {
    period: '2025',
    title: 'Naked & Saucy',
    subtitle: 'Growth & creative marketing',
    description:
      'UGC, brand identity refinement and engagement experiments for a national CPG brand, all informed by the purchase data.',
    link: { href: 'https://nakedandsaucy.com', label: 'nakedandsaucy.com' },
  },
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
];

export const capabilities: { title: string; description: string; tools: string[] }[] = [
  {
    title: 'Operations & Growth',
    description:
      'The business side of a content brand: team, funnels, email, automation, courses and launches.',
    tools: ['Notion', 'ManyChat', 'Kit', 'Airtable', 'Power Automate'],
  },
  {
    title: 'Content & Creative',
    description:
      'Short form video, carousels, podcast production, copy and brand identity.',
    tools: ['Adobe Suite', 'Canva', 'Blender', 'Cinema4D', 'AI video tools'],
  },
  {
    title: 'Data & Technical',
    description:
      'Scientific computing, machine learning, dashboards and full stack builds.',
    tools: ['Python', 'SQL', 'scikit-learn', 'Qiskit', 'Power BI', 'React'],
  },
];
