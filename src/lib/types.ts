export interface ResumeData {
  name: string;
  jobTitle: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
  template: 'classic' | 'modern' | 'creative';
  font: 'inter' | 'serif' | 'mono';
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  dates: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  dates: string;
}

export type ResumeSection = 'summary' | 'experience' | 'skills' | 'education';
