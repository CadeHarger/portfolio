/** Prepend Vite's base URL so asset paths work under any subpath (e.g. /portfolio/). */
const p = (s: string) => import.meta.env.BASE_URL + s.slice(1);

export const nav = ['Experience', 'Projects'];

/** Returns years coding rounded up to the nearest whole year, counted from Feb 17 2014. */
export function getCodingYears(): number {
  const start = new Date(2014, 1, 17);
  const now = new Date();
  const years = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.ceil(years);
}

/** Returns YOE rounded up to the nearest 0.5, counted from July 14 2025. */
export function getYearsOfExperience(): number {
  const start = new Date(2025, 6, 14); // months are 0-indexed
  const now = new Date();
  const years = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.ceil(years / 0.5) * 0.5;
}

export function formatYOE(years: number): string {
  const display = Number.isInteger(years) ? `${years}` : `${years}`;
  const label = years === 1 ? 'yr' : 'yrs';
  return `${display} ${label}`;
}

export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  period: string;
  icon: string;
  tags: string[];
  bullets: string[];
  projectId?: string;
};

export const experience: ExperienceItem[] = [
  {
    company: 'Deutsche Bank',
    role: 'Software Engineer — Instant Payments, Risk & Control Automation',
    location: 'Cary, NC',
    period: 'Jul 2025 – Present',
    icon: p('/icons/DeutscheBank.png'),
    tags: ['Java', 'Spring Boot', 'Hazelcast Jet', 'GCP', 'Terraform', 'Python', 'LangGraph', 'Exadata', 'Graph RAG', 'SQL', 'CI/CD', 'MongoDB', 'Microservices'],
    bullets: [
      'Built low-latency payment flows capable of processing >$1B USD worth of currency daily using Java Spring Boot, Hazelcast Jet, and Exadata microservice architecture',
      'Optimized NLP-based traceability algorithm for risk management findings, achieving 99.7% speedup',
      'Architected agentic AI-powered tech risk surveillance platform with LangGraph and custom tool calls, projected to monitor >1B data points annually',
      'Designed GCP architecture for new team and provisioned resources via Terraform on GitHub Landing Zone',
      'Patched 50+ Java OSS vulnerabilities across microservices',
      'Volunteered on team building graph retrieval-augmented assistant for databases and on team designing graduate SWE bootcamp and onboarding experience'
    ],
  },
  {
    company: 'Allosense',
    role: 'Full-Stack Engineer Intern',
    location: 'San Antonio, TX',
    period: 'Jun 2024 – Aug 2024',
    icon: p('/icons/allosense_logo.jpeg'),
    tags: ['Python', 'Flask', 'React', 'Electron'],
    bullets: [
      'Designed a Flask-React-Electron desktop app for EV battery production diagnosis and unit test visualization',
      'Deployed app and presented insights to Volvo on-site, resulting in a $200K contract',
      'Set up CI/CD pipeline with Gitlab and deployed to local Linux servers'
    ],
  },
  {
    company: 'GlassBrain LLC',
    role: 'Founder',
    location: 'San Antonio, TX',
    period: 'Jan 2023 – Oct 2023',
    icon: p('/projects/glassbrain/Logo.png'),
    tags: ['React', 'Redux', 'React Flow', 'Python', 'Flask', 'PyTorch', 'Electron'],
    bullets: [
      'Invented a visual programming language and desktop IDE for neural network algorithms',
      'Founded startup and won $5,000 in pre-seed funding and secured a spot in 2 incubator programs',
      'Designed a visual neural network programming language platformed with a full-stack desktop app'
    ],
  },
];

export const projects = [
  {
    id: 'scepter',
    icon: 'crown',
    name: 'Scepter',
    subtitle: 'Universal Forecasting Platform',
    period: 'Mar 2026 – Present',
    description:
      'Suite of AI agents automating every step of tabular data forecasting — from scraping and ingesting data to AutoML modeling, target optimization, and pipeline risk analysis. Manages massive codebase with novel AI-driven coding, testing, and DevOps strategies.',
    tags: ['Python', 'AI Agents', 'AutoML', 'LLM', 'Prediction Markets'],
    highlight: '100K+ Lines of Code · Instant ML Pipelines',
  },
  {
    id: 'politicalbias',
    icon: p('/icons/Politics.png'),
    name: 'NLP Research',
    subtitle: 'Machine Learning Research',
    period: 'Feb 2026 – Mar 2026',
    description:
      'Researched the effect of politically biased media intake upon LLM predictive capabilities on related political events.',
    tags: ['PyTorch', 'NLP', 'LLMs', 'Research'],
    highlight: '400 Political Events Analyzed',
  },
  {
    id: 'cathode',
    icon: p('/projects/cathode/IconLogo.png'),
    name: 'Cathode',
    subtitle: 'Music-Finding AI',
    period: 'Aug 2025 – Sep 2025',
    description:
      'RAG-powered agent that matches user life experiences to music with cathartic lyrics. Full frontend with Google Cloud deployment using Cloud Build, BigQuery, and Vertex AI.',
    tags: ['RAG', 'Python', 'React', 'GCP', 'BigQuery', 'Vertex AI'],
    highlight: '3M+ Songs Analyzed · Cloud-native',
  },
  {
    id: 'kalshibot',
    icon: p('/icons/Kalshi.png'),
    name: 'KalshiBot',
    subtitle: 'Prediction Market Trading Bot',
    period: 'Jan 2025 – Jan 2026',
    description:
      'Automated trading bot targeting Kalshi Rotten Tomatoes score markets. Combined LLM research, MLP models, and historic backtesting to generate price targets and run 24/7 trades.',
    tags: ['Python', 'LLM', 'ML', 'Prediction Markets'],
    highlight: 'Scraped >100K webpages · Traded on >300 markets · Runs 24/7',
  },
  {
    id: 'glassbrain',
    icon: p('/projects/glassbrain/Logo.png'),
    name: 'GlassBrain',
    subtitle: 'Visual Neural Network IDE',
    period: 'Mar 2023 – Oct 2023',
    description:
      'Invented a visual programming language for neural networks and built a full-stack desktop IDE. Won $5,000 in no-equity pre-seed funding and secured spots in two incubator programs.',
    tags: ['React', 'Flask', 'PyTorch', 'Electron'],
    highlight: '$5K pre-seed funding · Stumberg + Geekdom incubators',
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
    'TensorFlow',
    'NumPy',
    'Pandas',
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

export type ProjectImage = {
  src: string;
  caption: string;
};

export type ProjectLink = {
  label: string;
  url: string;
};

export type ProjectDetail = {
  id: string;
  icon?: string;
  name: string;
  subtitle: string;
  period?: string;
  highlights?: string[];
  body: string[];
  tags: string[];
  images: ProjectImage[];
  links: ProjectLink[];
  pdfUrl?: string;
  features?: { category: string; items: string[] }[];
};

export const projectDetails: ProjectDetail[] = [
  {
    id: 'scepter',
    icon: 'crown',
    name: 'Scepter',
    subtitle: 'Universal Forecasting Platform',
    period: 'Mar 2026 – Present',
    highlights: [
      'Developed a suite of AI agents that automate tabular forecasting end-to-end (data discovery → cleaning → modeling)',
      'Built a data collection agent that can generate scrapers for arbitrary websites, call APIs, ingest CSV/Excel files, and normalize everything into a universal dataset format',
      'Implemented LLM-powered data transformation, AutoML/model search, target-value optimization, and pipeline risk analysis',
      'Solely managed a low-error 100,000-line codebase by developing novel AI-assisted coding, testing, and DevOps strategies',
    ],
    body: [
      'Scepter grew out of the infrastructure I built for the Kalshi trading bot. I had built up a lot of code for gathering data and training models for new prediction targets, and I saw massive potential in automating the entire pipeline.',
      'The result is a platform where a user can describe what they want to predict in plain English, and Scepter handles the rest: it agents its way through the web to collect relevant data, cleans and merges datasets, trains multiple model families, runs an AutoML hyperparameter search, and surfaces a model with feature attributions and pipeline health analysis.',
      'I validated it by uploading two former Data Science minor final projects: one predicting housing prices and one predicting Trinity University admission decisions. For both datasets, Scepter completed the entire project in under a minute of manual work and achieved better performance than the manual approach: parsing, cleaning, training, selecting the best model, and flagging potential data issues.',
      'The codebase has grown to 100K+ lines. Because of this, I\'ve developed a set of AI-driven coding, testing, and DevOps strategies that help me manage this codebase. This includes custom AI agents designed for smoke testing, test coverage, and more.',
    ],
    tags: ['Python', 'AI Agents', 'AutoML', 'LLM', 'React', 'FastAPI', 'PostgreSQL', 'Celery'],
    images: [
      { src: p('/projects/scepter/admissions_dataset.png'), caption: 'Trinity admissions dataset loaded into Scepter' },
      { src: p('/projects/scepter/model_training.png'), caption: 'Model training configuration UI' },
      { src: p('/projects/scepter/column_definition.png'), caption: 'Natural-language column definition form' },
      { src: p('/projects/scepter/strategize.png'), caption: 'AI-generated predictor strategy plan' },
      { src: p('/projects/scepter/training_pipeline.png'), caption: '(Old) Training pipeline for natural-language text columns (modeling is more complex now)' },
      { src: p('/projects/scepter/row_discovery.png'), caption: 'Agentic row discovery from the web' },
    ],
    links: [],
    features: [
      {
        category: 'Data Collection',
        items: [
          'Agentic web discovery — searches public datasets, APIs, and structured sites to find rows automatically',
          'CSV/Excel upload with LLM-assisted column mapping and smart deduplication',
          'Natural-language column definition — describe a column, AI fills it for every row in parallel',
          'Strategize — describe your prediction goal and AI proposes a full set of predictor columns with importance scores',
        ],
      },
      {
        category: 'AutoML & Training',
        items: [
          'Multi-family model search: MLP neural net, XGBoost, and linear baseline trained in one job',
          'Automated hyperparameter optimization via Optuna (TPE sampler + median pruner)',
          'K-Fold cross-validation with stratified folds for classification targets',
          'Ensemble building: equal-weight, loss-weighted, and stacked meta-learner strategies',
        ],
      },
      {
        category: 'Explainability & Analysis',
        items: [
          'Feature importances via first-layer weight magnitudes and permutation importance',
          'Integrated Gradients per-row attribution waterfall charts',
          'LLM-generated plain-English prediction explanations grounded in attribution drivers',
          'Pipeline Review: data quality scoring, leakage detection, multicollinearity heatmaps, and calibration curves',
        ],
      },
      {
        category: 'Dataset Management',
        items: [
          'Git-style linear version history for every dataset — restore, redo, and branch without data loss',
          'Excel-like dataset viewer with inline editing, filtering, sorting, and per-column type inference',
          'Export to CSV or multi-sheet Excel with a full metadata sheet',
          'AutoML dataset profiling: health score, missing-data signals, leakage flags, and class-imbalance stats',
        ],
      },
      {
        category: 'Optimization',
        items: [
          'Target optimization: select influenceable columns, set an objective, and receive an exportable action plan',
          'Gradient descent optimizer for MLP models; greedy coordinate-descent for XGBoost and linear models',
          'Margins of error and per-feature change recommendations with business-readable output',
        ],
      },
    ],
  },
  {
    id: 'cathode',
    icon: p('/projects/cathode/IconLogo.png'),
    name: 'Cathode',
    subtitle: 'Music-Finding AI',
    period: 'Aug 2025 – Sep 2025',
    highlights: [
      'Created a RAG-powered agent that matches user life experiences to songs with cathartic lyrics (3M+ song lyric corpus)',
      'Built the full frontend and architected a Google Cloud deployment (Cloud Build, BigQuery, Vertex AI)',
    ],
    body: [
      "Cathode (Cath·arsis + Ode) matches user-described life experiences to songs with emotionally resonant lyrics. I built it in fall 2025 A) because it was a cool project I wanted to use myself and B) because I wanted to teach myself how to vibe code better and see how far I could push the models.",
      "The pipeline works in four steps: Gemini generates Spotify playlist search queries from the user's experience, candidate tracks are matched against a local lyrics corpus of ~3M songs, a finetuned FAISS vector index ranks results by semantic similarity, and Gemini re-ranks the top hits using full lyrics for a final cathartic score (0.7 vector + 0.3 LLM, with a views popularity boost).",
      "I learned a lot about agents here, and I really started to see how strong the pattern is: vector search + an LLM result-checker (RAG) can be ridiculously effective. It was also just very satisfying to go from idea to working prototype that fast.",
      "Around this time I was also learning GCP, so I architected my first real deployment (Firebase Hosting, Cloud Run, Cloud Tasks, BigQuery, Vertex AI) and thought about sharing it publicly. I ultimately decided against it after seeing the price tag for running these ML flows with any real concurrency. I learned a ton doing it (which services are for what, and how to think about deployment at all). Looking back from mid-2026, the frontend would be unrecognizably better if I rebuilt it today. I'd probably do the whole thing in a day instead of 2–3 weeks after work.",
    ],
    tags: ['RAG', 'Python', 'React', 'FastAPI', 'FAISS', 'SentenceTransformers', 'Spotipy', 'Gemini', 'GCP'],
    images: [
      { src: p('/projects/cathode/HomePage.png'), caption: 'Cathode landing page' },
      { src: p('/projects/cathode/Step1InputPrompt.png'), caption: 'Step 1 — describe your life experience' },
      { src: p('/projects/cathode/Step2Filters.png'), caption: 'Step 2 — genre and exploration filters' },
      { src: p('/projects/cathode/Step3Loading.png'), caption: 'Generating the playlist…' },
      { src: p('/projects/cathode/ResultsPage.png'), caption: 'Results — your cathartic playlist' },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/CadeHarger/Cathode' },
    ],
  },
  {
    id: 'glassbrain',
    icon: p('/projects/glassbrain/Logo.png'),
    name: 'GlassBrain',
    subtitle: 'Visual Neural Network IDE',
    period: 'Mar 2023 – Oct 2023',
    highlights: [
      'Invented a visual programming language and desktop IDE for designing and running neural network architectures',
      'Built a full-stack Electron app (React/Redux/React Flow + Flask/PyTorch) and taught myself the stack while shipping the MVP',
      'Won $5,000 in no-equity pre-seed funding and participated in Trinity\'s Stumberg Summer Accelerator + Geekdom Incubator',
    ],
    body: [
      "GlassBrain was a startup I founded as part of Trinity University's <a href=\"https://trinity.edu/directory/departments-offices/center-innovation-and-entrepreneurship/co-curricular-experiences/stumberg\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"inline-link\">Stumberg Entrepreneurship program</a> in early 2023. The core thesis: neural networks are better understood through visual flowcharts, and if those flowcharts are made interactive and hierarchical, they can become a full neural-network programming language.",
      "I designed a novel set of abstractions that simplified concepts like tensor shapes, backpropagation, and training loops, letting users focus on architecture decisions and building intuition rather than wrestling with math. The full-stack desktop app was built on React, Redux, React Flow, Python/Flask, PyTorch, and Electron.",
      "I taught myself JavaScript, React, Flask, and Electron while building this as it was my first large project with any real size. I cut a lot of corners to get to an MVP (few tests, messy backend abstractions), and it taught me the hard way why elegant class structure, tests, and general reliability/scalability practices matter if you ever want to come back to something.",
      "In March 2023, I competed in the <a href=\"https://trinity.edu/directory/departments-offices/center-innovation-and-entrepreneurship/co-curricular-experiences/stumberg\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"inline-link\">Stumberg pitch competition</a> and won $5,000 of no-equity pre-seed funding, then spent the summer in the Stumberg Summer Accelerator and <a href=\"https://geekdom.com/our-programs/geekdom-incubator/\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"inline-link\">Geekdom Incubator</a>. That October, I competed for an additional $25,000. If I were to redo the build today, I'd probably start with a PyTorch visual editor and then add my abstractions slowly after seeing where the opportunity actually is. I think I'd land in a similar place conceptually, but the backend would be structured way better.",
      "I had a ton of fun designing it. It was always satisfying to say \"Scratch, but for neural networks\" and instantly see software people's eyes light up. In the startup incubators, I was surrounded by people risking a lot for their dreams, and I'm really grateful for the chance to be in those programs and have that kind of support.",
    ],
    tags: ['React', 'Redux', 'React Flow', 'Python', 'Flask', 'PyTorch', 'Electron', 'JavaScript'],
    images: [
      { src: p('/projects/glassbrain/Logo.png'), caption: 'GlassBrain logo' },
      { src: p('/projects/glassbrain/LSTM.png'), caption: 'LSTM architecture rendered in the GlassBrain visual editor' },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/glassbrainai/GlassBrain' },
      { label: 'Pitch Video (34:08)', url: 'https://youtu.be/ygzP1kAupz8?t=2048' },
      { label: 'Demo Playlist', url: 'https://youtube.com/playlist?list=PLeoB7O0bOChOzAXhIJ2ddWaGKpluJLQxJ' },
    ],
  },
  {
    id: 'kalshibot',
    icon: p('/icons/Kalshi.png'),
    name: 'KalshiBot',
    subtitle: 'Prediction Market Trading Bot',
    period: 'Jan 2025 – Jan 2026',
    highlights: [
      'Engineered a 24/7 AI workflow that detects new markets, researches each target, and places trades automatically',
      'Built forecasting tools for prediction markets including trading strategy evaluation and backtesting',
      'Scraped >100,000 webpages and traded on >300 markets',
    ],
    body: [
      "I realized the potential of Kalshi (and prediction markets in general) in early 2024. I even tried to invest. I kept thinking about what I could do to work with them. Later in 2024 it clicked that if LLMs can predict the next word (and then be turned conversational through post-training), they can probably also be good at predictive tasks, especially in markets where the signal is buried in unstructured public info. I didn't have the hardware or money to train anything for this though.",
      "So in January 2025 I started building a bot for Kalshi's Movie Rotten Tomatoes score markets: detect markets, research the movie, model an RT score distribution, then use implied probabilities as price targets and trade 24/7. I threw a ton at it: Exa + Google News, Reddit posts, the movie's RT page details, historical RT scores of directors/actors/writers, and YouTube trailer comments — plus sentiment models, 10+ LLM prompting strategies to get prediction distributions, plain MLPs, and text embeddings.",
      "I tried a ton of trading strategies too (market making, RL-based trading, simple implied-value trades, orderbook modeling). I kept having to redeploy it after seeing bad performance and then discovering another bug or data leak that messed with results. These markets also weren't that liquid and returns were noisy, so once it finally got stable it was only making about $10–20/month.",
      "I ended up shutting it down due to my current job's trading restrictions. I also just realized this isn't a business I want to be in for a bunch of reasons. But the underlying infrastructure here was the start of Scepter, and it taught me exactly what a real ML data pipeline needs.",
    ],
    tags: ['Python', 'Web Scraping', 'Machine Learning', 'Prediction Markets', 'Kalshi', 'Exa'],
    images: [
      { src: p('/projects/kalshibot/profit.png'), caption: 'Backtested portfolio value (orange) vs cash (blue), Jan–Nov 2025. Edge diminishes mid-year — likely front-run.' },
      { src: p('/projects/kalshibot/training_algorithm.png'), caption: 'Data pipeline: from Exa search results to RT score predictions' },
    ],
    links: [],
  },
  {
    id: 'politicalbias',
    icon: p('/icons/Politics.png'),
    name: 'Political Bias Research',
    subtitle: 'LLM Forecasting Under Biased Media',
    period: 'Feb 2026 – Mar 2026',
    highlights: [
      'Researched the effect of politically biased media consumption on the predictive capabilities of LLMs',
      'Designed and ran an end-to-end forecasting experiment pipeline using the infrastructure built for KalshiBot',
    ],
    body: [
      "I used the same prediction system I'd built for the Kalshi bot to test the influence of politically biased news articles on the LLM-predicted outcome for related political events.",
      "I was unable to find significant effects of this leading to bias in predictions. That might sound like there's \"no finding\", but the absence of evidence suggests LLMs could be good at filtering bias from signal like this, unlike humans. Figure 8 shows the base-rate-normalized analysis (δnorm per site), where positive values indicate the site pushes predictions toward the correct partisan outcome on average.",
      "I began writing a paper for this, but ultimately decided not to further pursue it. The findings weren't great (I'd need a lot more experimentation to prove anything beyond absence-of-evidence), the publishing process is long and I'm not in school anymore, and my heart wasn't in it. I was using AI to blaze through the writing and constantly had to go back and rewrite it in my own words.",
    ],
    tags: ['Python', 'Web Scraping', 'Statistics', 'Research', 'Prediction Markets'],
    images: [
      {
        src: p('/projects/politicalbias/Figure_8.png'),
        caption: 'Figure 8 — Base-rate-normalized δnorm per news site. Positive values indicate a site pushes predictions toward the correct partisan outcome.',
      },
    ],
    links: [],
    pdfUrl: p('/projects/politicalbias/Studying_LLM_Based_Political_Forecasting_under_Biased_Media_Intake.pdf'),
  },
];

export type SchoolProject = {
  name: string;
  course: string;
  year: string;
  description: string;
  tags: string[];
  note?: string;
};

export const schoolProjects: SchoolProject[] = [
  {
    name: 'Trinevents',
    course: 'Web Applications — Final Group Project',
    year: 'Fall 2023',
    description:
      'Campus event management web app built with a team of four. Organizers can create events; students can browse and sign up. Full authentication and PostgreSQL-backed persistence.',
    tags: ['React', 'Scala', 'Play Framework', 'PostgreSQL'],
  },
  {
    name: 'Pet Store Website',
    course: 'CSCI-3321',
    year: 'Spring 2023',
    description:
      'Full-stack e-commerce site for a fictional pet store. Includes product browsing, a shopping cart, and an admin panel for inventory management with a PostgreSQL backend.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Express'],
  },
  {
    name: 'Web Applications Coursework',
    course: 'Web Applications (Dr. Mark Lewis)',
    year: 'Fall 2023',
    description:
      '11 progressive mini-projects spanning raw HTML/CSS through Scala Play, React, PostgreSQL, and Scala.js. Notable tasks include a multi-user public/private message board, a real-time multiplayer lobby with WebSockets, and a collaborative drawing app supporting concurrent non-local users.',
    tags: ['HTML/CSS', 'JavaScript', 'Scala', 'Play Framework', 'React', 'PostgreSQL', 'Scala.js'],
    note: 'Tasks 1–2, 3, 4, and 10 are live at cs.trinity.edu/~charger/WebApps/',
  },
  {
    name: 'Sunoco Oil Demand Prediction',
    course: 'Machine Learning (Data Science Minor)',
    year: 'Spring 2025',
    description:
      'ML pipeline predicting weekly U.S. oil demand from a curated set of macroeconomic indicators (VIX, USD index, rig count, refinery utilization, GDP, household debt, etc.). Earned 2nd place in a class-wide competition judged by Sunoco representatives.',
    tags: ['Python', 'scikit-learn', 'Pandas', 'NumPy'],
    note: '2nd place in class-wide Sunoco competition',
  },
  {
    name: 'GAN Stock Prediction',
    course: 'Artificial Intelligence (Dr. Eva Tuba)',
    year: 'Fall 2024',
    description:
      'Research project exploring whether GANs can model the distribution of stock price outcomes rather than a single point prediction — similar to how diffusion models avoid the blurriness of MSE-based generation. The discriminator struggled to keep up with the generator, which tended to produce similarly shaped outcomes.',
    tags: ['Python', 'PyTorch', 'GANs', 'Finance', 'Research'],
  },
];

export const education = {
  school: 'Trinity University',
    icon: p('/icons/Trinity.webp'),
  location: 'San Antonio, TX',
  degree: 'B.S. Computer Science, Minor in Data Science — Cum Laude',
  period: 'Aug 2021 – May 2025',
  involvement: [
    'Omega Phi Fraternity — Risk Chairman',
    'Chess Club — Co-President, globally rated 99.8th percentile',
  ],
};
