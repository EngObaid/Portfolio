export interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  challenge?: string;  // Problem statement
  solution?: string;   // How you solved it
  impact?: {
    metrics: Array<{
      label: string;    // "Load Time Improvement"
      value: string;    // "90%"
      description?: string; // "Reduced from 5s to 500ms"
    }>;
  };
  featured: boolean;
  tags: string[];
  techStack: string[];
  coverImage?: string;
  screenshots: string[];
  links: {
    github?: string;
    live?: string;
    caseStudy?: string;
  };
  createdAt: string;
}

export interface Message {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt?: string;
}
