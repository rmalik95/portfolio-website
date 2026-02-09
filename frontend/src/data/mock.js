// Mock data for Rishabh Malik Portfolio

export const personalInfo = {
  name: "Rishabh Malik",
  title: "Data Scientist | ML Engineer | Cloud Architect",
  tagline: "Transforming data into insights • Building intelligent systems • 2nd Place Newcastle Data Science Hackathon Winner",
  email: "rishabhm4646@gmail.com",
  location: "Newcastle upon Tyne, United Kingdom",
  linkedin: "https://linkedin.com/in/rishabh-malik-156481aa",
  github: "https://github.com/rishabhmalik",
  headshot: "https://customer-assets.emergentagent.com/job_ebcf7c28-4d6d-49ec-86ac-2bf13e54f7d3/artifacts/7r5tl0l1_IMG_6117%20Large.jpeg"
};

export const stats = [
  { value: "4+", label: "Years Software Engineering" },
  { value: "MSc", label: "Data Science, Newcastle University" },
  { value: "600+", label: "Startups Analyzed (Hackathon)" },
  { value: "18%", label: "Resource Allocation Improvement" }
];

export const aboutContent = {
  intro: "Based in Newcastle upon Tyne, I'm a Data Scientist and ML Engineer passionate about turning complex data into actionable insights. With a Master's in Data Science from Newcastle University and 4+ years in software engineering, I specialize in machine learning, cloud infrastructure, and building data-driven solutions for real-world problems in transportation, insurance, and enterprise systems.",
  journey: "Starting as a Software Engineer, I transitioned through Cloud Infrastructure to Data Science, building expertise across the full spectrum of data-driven development. Today, I work on end-to-end ML pipelines, from data engineering to model deployment.",
  drives: "I'm fascinated by the intersection of data science and real-world impact. Whether it's optimizing railway operations through predictive analytics, clustering 600 startups to find hidden patterns, or automating insurance audits to save thousands of hours—I thrive on solving complex problems with elegant, scalable solutions.",
  education: [
    {
      degree: "MSc in Data Science",
      institution: "Newcastle University",
      period: "Sep 2022 - Sep 2023",
      highlights: ["2nd Place Newcastle Data Science Hackathon", "Machine Learning", "Data Visualization", "Cloud Computing"]
    },
    {
      degree: "B.Tech Computer Science",
      institution: "Krishna Institute of Engineering & Technology",
      period: "2013 - 2017",
      highlights: ["Algorithms", "Data Structures", "Software Engineering"]
    }
  ]
};

export const experiences = [
  {
    id: 1,
    company: "London North Eastern Railway (LNER)",
    logo: "https://customer-assets.emergentagent.com/job_portfolio-creator-44/artifacts/xatxuk58_lner.png",
    roles: [
      {
        title: "Data Scientist",
        period: "October 2025 - Present",
        location: "Newcastle, UK",
        current: true,
        achievements: [
          "Developed predictive models for passenger demand forecasting using Python and scikit-learn, improving resource allocation accuracy by 18%",
          "Built real-time delay prediction system analyzing historical train performance data and weather patterns using PySpark on AWS",
          "Designed ML-based customer sentiment analysis pipeline processing 10,000+ daily interactions from Salesforce CRM",
          "Created interactive Power BI dashboards for stakeholder reporting",
          "Automated data extraction and transformation workflows, reducing manual data preparation time by 60%"
        ],
        technologies: ["Python", "scikit-learn", "PySpark", "AWS", "Power BI", "SQL", "Salesforce CRM"]
      },
      {
        title: "Solutions Analyst",
        period: "October 2024 - October 2025",
        location: "Newcastle, UK",
        current: false,
        achievements: [
          "Analyzed customer journey data to identify pain points, presenting actionable insights to senior management",
          "Managed high-volume customer cases with 95%+ satisfaction ratings",
          "Developed data-driven process improvements reducing average case resolution time by 22%",
          "Collaborated with data analytics team to implement ticket classification system, improving routing efficiency by 30%"
        ],
        technologies: ["Salesforce CRM", "SQL", "Excel", "Power BI", "Data Analysis"]
      }
    ]
  },
  {
    id: 2,
    company: "Teleperformance (DWP)",
    logo: "https://customer-assets.emergentagent.com/job_portfolio-creator-44/artifacts/53jbutaq_images.png",
    roles: [
      {
        title: "Data Analyst",
        period: "January 2024 - October 2024",
        location: "Newcastle, UK",
        current: false,
        achievements: [
          "Conducted comprehensive fraud and error analysis within Universal Credit Claim Review (UCR) teams, supporting the Department for Work and Pensions' compliance initiatives",
          "Developed and maintained data visualizations to identify patterns and anomalies in UC claims related to identity verification, earnings declarations, and housing cost assessments",
          "Collaborated with cross-functional investigation teams to provide data-driven insights that informed evidence-based decision making on claim reviews",
          "Streamlined data reporting processes through automated dashboard creation, reducing manual analysis time by 40%",
          "Presented analytical findings to senior stakeholders, contributing to enhanced fraud detection methodologies"
        ],
        technologies: ["Power BI", "Excel", "SQL", "Data Visualization", "Statistical Analysis", "Fraud Analytics"]
      }
    ]
  },
  {
    id: 3,
    company: "DXC Technology",
    logo: "https://customer-assets.emergentagent.com/job_portfolio-creator-44/artifacts/s637pkim_dxc.png",
    roles: [
      {
        title: "Professional - Information Security",
        period: "July 2021 - July 2022",
        location: "Bangalore, India",
        current: false,
        achievements: [
          "Deployed production-grade Matomo analytics platform using Terraform & Helm on AWS, serving 50+ internal users",
          "Architected scalable monitoring stack (Grafana, Loki), reducing system downtime by 35%",
          "Automated cloud infrastructure deployment, cutting deployment time from 4 hours to 30 minutes",
          "Designed custom Ansible playbooks for legacy SUSE11 systems automation"
        ],
        technologies: ["Terraform", "Kubernetes", "Helm", "Ansible", "AWS", "Grafana", "Loki", "Git"]
      }
    ]
  },
  {
    id: 4,
    company: "Capgemini Technology Services",
    logo: "https://customer-assets.emergentagent.com/job_portfolio-creator-44/artifacts/grjc5iz3_CAP.PA-9b4110b0.png",
    roles: [
      {
        title: "Associate Consultant → Senior Software Engineer → Software Engineer",
        period: "September 2017 - July 2021",
        location: "Bangalore, India",
        current: false,
        achievements: [
          "Developed enterprise document management systems (CorsoEDMS & CorDocs) serving 200+ users across multiple countries",
          "Built web-based audit automation tool reducing manual document review time by 70%",
          "Implemented RESTful APIs improving cross-system integration efficiency by 40%",
          "Maintained 99.5% uptime SLA with 4-hour critical bug turnaround",
          "Received \"Quick on the Block\" award (Q1 2020) for performance improvements"
        ],
        technologies: ["Java", "Spring MVC", "JPA", "SQL", "Documentum", "Oracle Database", "Agile/Scrum"]
      }
    ]
  }
];

export const projects = [
  {
    id: 1,
    title: "Railway Passenger Demand Forecasting",
    type: "Machine Learning / Predictive Analytics",
    company: "LNER",
    featured: true,
    period: "Nov 2025 - Jan 2026",
    description: "Built end-to-end ML pipeline to forecast passenger demand across 100+ railway routes using historical ticketing data, weather patterns, and event calendars.",
    impact: [
      "18% improvement in resource allocation accuracy",
      "25% reduction in overcrowding incidents",
      "Processed 5M+ historical booking records"
    ],
    technologies: ["Python", "PySpark", "scikit-learn", "AWS S3", "AWS Lambda", "Pandas", "Time Series Analysis"],
    category: "ml"
  },
  {
    id: 2,
    title: "Startup Clustering Analysis - Newcastle Hackathon",
    type: "Machine Learning / Data Analysis",
    company: "Newcastle University",
    featured: true,
    badge: "🏆 2nd Place",
    period: "March 2023 - April 2023",
    description: "Analyzed 600 startups from Elevate Greece platform using unsupervised learning algorithms to identify patterns, market opportunities, and investment trends.",
    impact: [
      "Identified 5 distinct startup clusters",
      "2nd place out of 40+ competing teams",
      "Created interactive Plotly visualizations"
    ],
    technologies: ["Python", "scikit-learn", "Pandas", "Plotly", "K-Means", "DBSCAN", "PCA"],
    category: "ml"
  },
  {
    id: 3,
    title: "CleanSweep - Cloud Infrastructure Automation",
    type: "DevOps / Infrastructure as Code",
    company: "DXC Technology",
    featured: false,
    period: "July 2021 - July 2022",
    description: "Designed IaC solution using Terraform and Ansible for multi-environment AWS deployment, supporting 50+ developers.",
    impact: [
      "87.5% reduction in deployment time",
      "35% reduction in system downtime",
      "Enabled rapid environment replication"
    ],
    technologies: ["Terraform", "Ansible", "Kubernetes", "Helm", "AWS", "Grafana", "Loki"],
    category: "cloud"
  },
  {
    id: 4,
    title: "CorDocs - Insurance Audit Automation",
    type: "Web Application / Process Automation",
    company: "Capgemini / Swiss Re",
    featured: false,
    period: "2018 - 2021",
    description: "Developed web-based automation tool to streamline insurance claim document audits, eliminating manual processes.",
    impact: [
      "70% reduction in manual review time",
      "1000+ documents processed daily",
      "Improved audit accuracy"
    ],
    technologies: ["Java", "Spring MVC", "JPA", "Documentum", "Oracle Database", "RESTful APIs"],
    category: "backend"
  },
  {
    id: 5,
    title: "CorsoEDMS - Enterprise Document Management",
    type: "Enterprise Application Development",
    company: "Capgemini / Swiss Re",
    featured: false,
    period: "2017 - 2021",
    description: "Core contributor to enterprise-scale document management system serving 200+ users across multiple countries.",
    impact: [
      "99.5% system uptime maintained",
      "Multi-language support",
      "10,000+ documents supported"
    ],
    technologies: ["Java", "Spring Framework", "JPA", "SQL", "Documentum", "Agile/Scrum"],
    category: "backend"
  }
];

export const skills = [
  {
    category: "Machine Learning & Data Science",
    icon: "🎯",
    items: [
      { name: "Clustering (K-Means, DBSCAN)", level: 90 },
      { name: "scikit-learn", level: 90 },
      { name: "Statistical Modeling", level: 85 },
      { name: "Time Series Analysis", level: 85 },
      { name: "Feature Engineering", level: 88 },
      { name: "TensorFlow/Keras", level: 70 }
    ]
  },
  {
    category: "Programming Languages",
    icon: "💻",
    items: [
      { name: "Python", level: 95 },
      { name: "SQL", level: 90 },
      { name: "Java", level: 85 },
      { name: "R", level: 70 },
      { name: "HTML/CSS", level: 75 }
    ]
  },
  {
    category: "Big Data & Cloud",
    icon: "☁️",
    items: [
      { name: "AWS (S3, Lambda, EC2)", level: 88 },
      { name: "PySpark", level: 82 },
      { name: "ETL Pipelines", level: 85 }
    ]
  },
  {
    category: "Data Visualization",
    icon: "📊",
    items: [
      { name: "Power BI", level: 90 },
      { name: "Plotly", level: 85 },
      { name: "Matplotlib/Seaborn", level: 88 }
    ]
  },
  {
    category: "DevOps & Infrastructure",
    icon: "🔧",
    items: [
      { name: "Terraform", level: 85 },
      { name: "Kubernetes", level: 78 },
      { name: "Docker", level: 80 },
      { name: "Grafana", level: 82 },
      { name: "Git", level: 90 }
    ]
  },
  {
    category: "Databases",
    icon: "🗄️",
    items: [
      { name: "Oracle", level: 85 },
      { name: "PostgreSQL", level: 80 },
      { name: "MySQL", level: 78 }
    ]
  }
];

export const contactSubjects = [
  "Job Opportunity (DS, ML, Cloud/DevOps)",
  "Collaboration Proposal",
  "Consulting Inquiry",
  "Hackathon/Competition",
  "General Question",
  "Other"
];
