export type ProjectCategory = 'Graphic Design' | 'AI Art' | 'Chatbots' | 'AI Apps' | 'AI Agents';

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  link?: string;
  image?: string;
}

export const about = {
  name: 'Maheen Touqeer',
  title: 'AI Engineer | Generative AI App Developer | Prompt Engineer | Graphic Designer',
  location: 'Karachi Division, Sindh, Pakistan',
  email: 'maheentouqeer@gmail.com',
  linkedin: 'https://www.linkedin.com/in/maheen-touqeer-3b5b03289',
  summary:
    'BS AI student at DUET focused on ethical, creative, and impactful AI. I build AI apps with Python, Streamlit & Hugging Face, develop AI agents (CrewAI, Agentic RAG), automate workflows (Make, no-code), design visuals, and implement RAG (LangChain, FAISS, vector DBs). Currently on a 30 AI apps in 30 days challenge.'
};

export const skills = [
  'Python', 'Streamlit', 'Hugging Face', 'LangChain', 'CrewAI', 'Gradio', 'Java', 'C/C++', 'HTML', 'Google Colab', 'Canva', 'MS Office'
];

export const topSkills = ['Python', 'Streamlit', 'LangChain', 'CrewAI', 'Hugging Face'];

export const education = [
  {
    school: 'Dawood University of Engineering and Technology',
    detail: 'BS Artificial Intelligence',
    period: 'Sep 2024 - Sep 2028'
  },
  {
    school: 'Icode Guru',
    detail: 'AI Engineer',
    period: 'Jun 2025'
  },
  {
    school: 'IBA GRADS',
    detail: 'ECAT',
    period: 'Sep 2023 - Jun 2024'
  },
  {
    school: 'Govt. Degree College Malir Cantt',
    detail: 'Intermediate, Computer Science',
    period: '2022 - 2024'
  },
  {
    school: 'The Educators',
    detail: 'Matriculation, Computer Science',
    period: '2020 - 2022'
  }
];

export const achievements = [
  'Merit Certificate for 1st position in Sports Day (2017-18)',
  'Merit Certificate for hard work (2022)',
  'Poem published in school magazine (2015-16)',
  'Certificate of appreciation from Bahria University for computer literacy course in MS Excel and statistical backup of social science'
];

export const certifications = [
  'Presentation',
  'Digital Literacy',
  'Introduction to C++',
  'AI-Powered Marketing Data Analytics',
  'AI and Sustainable Development'
];

export const projects: ProjectItem[] = [
  {
    id: 'p1',
    name: 'Agentic RAG Knowledge Bot',
    description: 'A RAG chatbot using LangChain + FAISS with agentic tools to answer domain questions.',
    category: 'Chatbots',
    link: '#'
  },
  {
    id: 'p2',
    name: 'Streamlit AI Art Studio',
    description: 'Interactive app to generate and curate AI art using Hugging Face models.',
    category: 'AI Art',
    link: '#'
  },
  {
    id: 'p3',
    name: 'CrewAI Task Automator',
    description: 'Multi-agent automation flows for research and content drafting.',
    category: 'AI Agents',
    link: '#'
  },
  {
    id: 'p4',
    name: 'Design Portfolio Set',
    description: 'A collection of brand visuals and social content designed in Canva.',
    category: 'Graphic Design',
    link: '#'
  },
  {
    id: 'p5',
    name: 'AI Apps Sprint',
    description: 'Highlights from the "30 AI apps in 30 days" challenge.',
    category: 'AI Apps',
    link: '#'
  }
];
