'use client';

import { useState } from 'react';
import type { ResumeData } from '@/lib/types';
import EditorPanel from '@/components/editor-panel';
import ResumePreview from '@/components/resume-preview';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileType, Loader2 } from 'lucide-react';
import { AppLogo } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const initialResumeData: ResumeData = {
  name: 'Alex Doe',
  jobTitle: 'Software Engineer',
  contact: {
    email: 'alex.doe@email.com',
    phone: '123-456-7890',
    linkedin: 'linkedin.com/in/alexdoe',
    website: 'alexdoe.dev',
  },
  summary:
    'Innovative Software Engineer with 5+ years of experience in developing, testing, and maintaining web applications. Proficient in JavaScript, React, and Node.js. Seeking to leverage my skills to contribute to a dynamic engineering team.',
  experience: [
    {
      id: 'exp1',
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      dates: 'Jan 2021 - Present',
      description:
        '- Led a team of 5 engineers in developing a new e-commerce platform, resulting in a 30% increase in sales.\n- Optimized application performance, reducing page load times by 40%.\n- Implemented a CI/CD pipeline, automating the deployment process.',
    },
    {
      id: 'exp2',
      title: 'Software Engineer',
      company: 'Web Innovations LLC',
      dates: 'Jun 2018 - Dec 2020',
      description:
        '- Developed and maintained client-side features for various web applications using React and Redux.\n- Collaborated with UX/UI designers to create responsive and user-friendly interfaces.\n- Wrote unit and integration tests to ensure code quality.',
    },
  ],
  education: [
    {
      id: 'edu1',
      degree: 'B.S. in Computer Science',
      school: 'University of Technology',
      dates: '2014 - 2018',
    },
  ],
  skills: 'JavaScript, TypeScript, React, Node.js, Express, MongoDB, SQL, HTML/CSS, Git, Docker, AWS',
  template: 'modern',
  font: 'inter',
};

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    const resumeElement = document.getElementById('resume-preview');
    if (resumeElement) {
      html2canvas(resumeElement, {
        scale: 2, // Increase scale for better quality
        useCORS: true, 
        logging: false
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        // A4 dimensions in points: 595.28 x 841.89
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'pt',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const newWidth = pdfWidth;
        const newHeight = newWidth / ratio;
        
        // if content is larger than page, scale it down
        const height = newHeight > pdfHeight ? pdfHeight : newHeight;
        const width = height === pdfHeight ? pdfHeight * ratio : newWidth;


        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`${resumeData.name.replace(' ', '_')}_Resume.pdf`);
        setIsDownloading(false);
      }).catch(err => {
        console.error("Error generating PDF:", err);
        setIsDownloading(false);
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="no-print sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 md:px-8">
        <div className="flex items-center gap-2">
          <AppLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Resumatic AI</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isDownloading}>
              {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleDownloadPdf} disabled={isDownloading}>
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <FileType className="mr-2 h-4 w-4" />
              DOCX (soon)
            </DropdownMenuItem>
             <DropdownMenuItem disabled>
              <FileText className="mr-2 h-4 w-4" />
              TXT (soon)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-8 p-4 md:p-8">
        <div className="no-print lg:col-span-1 xl:col-span-2 h-full">
          <EditorPanel resumeData={resumeData} setResumeData={setResumeData} />
        </div>
        <div className="lg:col-span-1 xl:col-span-3">
          <div className="printable-area">
            <ResumePreview resumeData={resumeData} />
          </div>
        </div>
      </main>
    </div>
  );
}
