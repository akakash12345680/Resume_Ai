'use client';

import type { ResumeData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Briefcase, GraduationCap, Mail, Phone, Linkedin, Globe, User, Wrench } from 'lucide-react';

interface ResumePreviewProps {
  resumeData: ResumeData;
}

const TemplateWrapper = ({
  template,
  font,
  children,
}: {
  template: ResumeData['template'];
  font: ResumeData['font'];
  children: React.ReactNode;
}) => {
  const fontClass = {
    inter: 'font-body',
    serif: 'font-serif',
    mono: 'font-mono',
  }[font];

  return (
    <div
      className={cn(
        'bg-white text-black aspect-[8.5/11] w-full max-w-4xl mx-auto p-8 lg:p-12 shadow-2xl rounded-lg resume-preview-container',
        fontClass
      )}
    >
      {children}
    </div>
  );
};

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const { name, jobTitle, contact, summary, experience, education, skills, template, font } = resumeData;

  const renderHeader = () => (
    <div className={cn(
        'text-center pb-4 mb-4',
        template === 'classic' && 'border-b-2 border-gray-300',
        template === 'modern' && 'border-b-2 border-primary',
        template === 'creative' && 'relative'
    )}>
      {template === 'creative' && <div className="absolute top-0 left-0 w-full h-2 bg-primary rounded-t-lg" />}
      <h1 className={cn(
          "font-bold",
          template === 'classic' && 'text-4xl',
          template === 'modern' && 'text-5xl text-primary',
          template === 'creative' && 'text-4xl tracking-widest'
      )}>{name}</h1>
      <p className={cn(
          "text-xl",
          template === 'classic' && 'text-gray-600',
          template === 'modern' && 'text-primary/80',
          template === 'creative' && 'text-gray-500'
      )}>{jobTitle}</p>
    </div>
  );

  const renderContact = () => (
    <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-6">
      {contact.email && <div className="flex items-center gap-2"><Mail size={14}/> {contact.email}</div>}
      {contact.phone && <div className="flex items-center gap-2"><Phone size={14}/> {contact.phone}</div>}
      {contact.linkedin && <div className="flex items-center gap-2"><Linkedin size={14}/> {contact.linkedin}</div>}
      {contact.website && <div className="flex items-center gap-2"><Globe size={14}/> {contact.website}</div>}
    </div>
  );

  const Section = ({ icon, title, children, titleClassName }: { icon: React.ReactNode, title: string, children: React.ReactNode, titleClassName?: string }) => (
    <section className="mb-6">
        <h2 className={cn(
            "text-xl font-bold flex items-center gap-3 mb-2",
            template === 'classic' && 'border-b border-gray-200 pb-1',
            template === 'modern' && 'text-primary',
            template === 'creative' && 'text-primary/90 tracking-wider',
            titleClassName
        )}>
            {icon}
            {title}
        </h2>
        <div className={cn(
            "text-sm",
            template === 'modern' && "pl-8",
        )}>
            {children}
        </div>
    </section>
  )

  const content = (
    <>
      {template !== 'modern' && renderHeader()}
      {template !== 'modern' && renderContact()}

      <Section icon={<User size={18} />} title="Summary">
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      </Section>

      <Section icon={<Briefcase size={18} />} title="Experience">
        <div className="space-y-4">
          {experience.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-base">{exp.title}</h3>
                <p className="text-xs text-gray-500">{exp.dates}</p>
              </div>
              <p className="text-sm text-gray-600 italic">{exp.company}</p>
              <ul className="mt-1 list-disc list-inside text-gray-700 space-y-1">
                {exp.description.split('\n').map((item, index) => item && <li key={index}>{item.replace(/^- /, '')}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={<GraduationCap size={18} />} title="Education">
         <div className="space-y-2">
            {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                        <h3 className="font-semibold text-base">{edu.degree}</h3>
                        <p className="text-sm text-gray-600 italic">{edu.school}</p>
                    </div>
                    <p className="text-xs text-gray-500">{edu.dates}</p>
                </div>
            ))}
         </div>
      </Section>

      <Section icon={<Wrench size={18} />} title="Skills">
        <div className="flex flex-wrap gap-2">
            {skills.split(',').map(skill => skill.trim() && (
                <span key={skill.trim()} className={cn(
                    "text-xs rounded-full px-3 py-1",
                    template === 'classic' && 'bg-gray-200 text-gray-800',
                    template === 'modern' && 'bg-primary/10 text-primary',
                    template === 'creative' && 'border border-primary/50 text-primary/90'
                )}>{skill.trim()}</span>
            ))}
        </div>
      </Section>
    </>
  );

  if (template === 'modern') {
    return (
        <TemplateWrapper template={template} font={font}>
            <div className="flex h-full">
                <div className="w-1/3 bg-primary text-primary-foreground p-6">
                    <div className='text-center'>
                      <h1 className="text-4xl font-bold">{name}</h1>
                      <p className="text-xl text-primary-foreground/80">{jobTitle}</p>
                    </div>
                    <div className="mt-8 space-y-4 text-sm">
                      {contact.email && <div className="flex items-center gap-2"><Mail size={14}/> {contact.email}</div>}
                      {contact.phone && <div className="flex items-center gap-2"><Phone size={14}/> {contact.phone}</div>}
                      {contact.linkedin && <div className="flex items-center gap-2"><Linkedin size={14}/> {contact.linkedin}</div>}
                      {contact.website && <div className="flex items-center gap-2"><Globe size={14}/> {contact.website}</div>}
                    </div>
                </div>
                <div className="w-2/3 p-6 text-black overflow-y-auto">
                    {content}
                </div>
            </div>
        </TemplateWrapper>
    )
  }

  return (
    <TemplateWrapper template={template} font={font}>
      {content}
    </TemplateWrapper>
  );
}
