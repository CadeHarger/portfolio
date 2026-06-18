export const nav = ['Experience', 'Projects', 'Skills', 'Education'];

export const experience = [
  {
    company: 'Deutsche Bank',
    role: 'Software Engineer — Instant Payments, Risk & Control Automation',
    location: 'Cary, NC',
    period: 'Jul 2025 – Present',
    bullets: [
      'Built payment flows with sub-60 ms latency processing >$1B USD daily using Java Spring Boot, Hazelcast Jet, and Exadata microservice architecture',
      'Optimized NLP-based traceability algorithm for risk management findings, achieving 99.7% speedup',
      'Architected agentic AI-powered tech risk surveillance platform with LangGraph and custom tool calls, projected to monitor >1B data points annually',
      'Designed GCP architecture for new team and provisioned resources via Terraform on GitHub Landing Zone',
      'Patched 50+ Java OSS vulnerabilities across microservices',
    ],
  },
  {
    company: 'Allosense',
    role: 'Full-Stack Engineer Intern',
    location: 'San Antonio, TX',
    period: 'Jun 2024 – Aug 2024',
    bullets: [
      'Designed a Flask-React-Electron desktop app for EV battery production diagnosis and unit test visualization',
      'Deployed app and presented insights to Volvo on-site, resulting in a $200K contract',
    ],
  },
  {
    company: 'GlassBrain LLC',
    role: 'Founder',
    location: 'San Antonio, TX',
    period: 'Jan 2023 – Oct 2023',
    bullets: [
      'Invented a visual programming language and desktop IDE for neural network algorithms',
      'Won $5,000 in pre-seed funding and secured a spot in 2 incubator programs',
    ],
  },
];

export const projects = [
  {
    name: 'Scepter',
    subtitle: 'Universal Forecasting Platform',
    description:
      'Suite of AI agents automating every step of tabular data forecasting — from scraping and ingesting data to AutoML modeling, target optimization, and pipeline risk analysis. Manages a 100K-line codebase with AI-driven coding, testing, and DevOps strategies.',
    tags: ['Python', 'AI Agents', 'AutoML', 'LLM', 'Prediction Markets'],
    highlight: 'Scraped >100K websites · Traded on >300 markets · Runs 24/7',
  },
  {
    name: 'Cathode',
    subtitle: 'Music-Finding AI',
    description:
      'RAG-powered agent that matches user life experiences to music with cathartic lyrics. Full frontend with Google Cloud deployment using Cloud Build, BigQuery, and Vertex AI.',
    tags: ['RAG', 'Python', 'React', 'GCP', 'BigQuery', 'Vertex AI'],
    highlight: 'Full-stack · Cloud-native on GCP',
  },
  {
    name: 'NLP Research',
    subtitle: 'Machine Learning Research',
    description:
      'Invented a novel LLM algorithm to exploit test-time compute under mentorship of a top ML researcher. Also researched the effect of politically biased media on LLM predictive capabilities.',
    tags: ['PyTorch', 'NLP', 'LLMs', 'Research'],
    highlight: 'Under mentorship of top ML researcher',
  },
];

export const skills = {
  Languages: ['Python', 'Java', 'JavaScript', 'C++', 'Swift', 'Scala', 'HTML/CSS'],
  'Backend & Infrastructure': [
    'Spring Boot',
    'Flask',
    'GCP',
    'SQL',
    'Terraform',
    'GitHub Actions',
    'Hazelcast',
    'FastAPI',
    'Celery',
    'Redis',
  ],
  'AI / ML': [
    'PyTorch',
    'NumPy',
    'Pandas',
    'LangGraph',
    'RAG Systems',
    'Neural Networks',
    'Agentic AI',
  ],
  Tooling: ['Git', 'CI/CD', 'Cursor', 'Claude Code', 'Jira', 'Agile/Scrum', 'Tableau'],
};

export const certs = [
  'Google Associate Cloud Engineer',
  'AWS Cloud Practitioner',
  'Microsoft Excel Expert',
];

export const education = {
  school: 'Trinity University',
  location: 'San Antonio, TX',
  degree: 'B.S. Computer Science, Minor in Data Science — Cum Laude',
  period: 'Aug 2021 – May 2025',
  involvement: [
    'Omega Phi Fraternity — Risk Chairman',
    'Chess Club — Co-President, globally rated 99.8th percentile',
  ],
};
