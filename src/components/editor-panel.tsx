'use client';

import type { ResumeData, Experience, Education } from '@/lib/types';
import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, GraduationCap, Info, Layers, Palette, Plus, Trash2, UserSquare, Wand2 } from 'lucide-react';
import AiSuggester from './ai-suggester';

interface EditorPanelProps {
  resumeData: ResumeData;
  setResumeData: Dispatch<SetStateAction<ResumeData>>;
}

export default function EditorPanel({ resumeData, setResumeData }: EditorPanelProps) {
  const handlePersonalInfoChange = (field: string, value: string) => {
    if (field in resumeData.contact) {
      setResumeData(prev => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
    } else {
      setResumeData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleExperienceChange = (id: string, field: keyof Experience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

    const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: `exp${Date.now()}`, title: '', company: '', dates: '', description: '' },
      ],
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  };

  const handleEducationChange = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
        ...prev,
        education: prev.education.map(edu =>
            edu.id === id ? { ...edu, [field]: value } : edu
        )
    }))
  }

  const addEducation = () => {
    setResumeData(prev => ({
        ...prev,
        education: [...prev.education, {id: `edu${Date.now()}`, school: '', degree: '', dates: ''}]
    }))
  }

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
        ...prev,
        education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  return (
    <Card className="h-full shadow-lg">
      <Tabs defaultValue="content" className="w-full h-full flex flex-col">
        <div className="p-4 border-b">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content"><Layers className="mr-2 h-4 w-4" />Content</TabsTrigger>
            <TabsTrigger value="design"><Palette className="mr-2 h-4 w-4"/>Design</TabsTrigger>
            <TabsTrigger value="ai-assistant"><Wand2 className="mr-2 h-4 w-4"/>AI Assistant</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="content" className="flex-1 overflow-y-auto p-1">
          <Accordion type="multiple" defaultValue={['personal-info']} className="w-full p-4">
            <AccordionItem value="personal-info">
              <AccordionTrigger><Info className="mr-2 h-4 w-4" />Personal Info</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={resumeData.name} onChange={e => handlePersonalInfoChange('name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" value={resumeData.jobTitle} onChange={e => handlePersonalInfoChange('jobTitle', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={resumeData.contact.email} onChange={e => handlePersonalInfoChange('email', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" value={resumeData.contact.phone} onChange={e => handlePersonalInfoChange('phone', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input id="linkedin" value={resumeData.contact.linkedin} onChange={e => handlePersonalInfoChange('linkedin', e.target.value)} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" value={resumeData.contact.website} onChange={e => handlePersonalInfoChange('website', e.target.value)} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="summary">
              <AccordionTrigger><UserSquare className="mr-2 h-4 w-4" />Summary</AccordionTrigger>
              <AccordionContent className="pt-2">
                <Textarea value={resumeData.summary} onChange={e => setResumeData(p => ({ ...p, summary: e.target.value }))} rows={5}/>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="experience">
              <AccordionTrigger><Briefcase className="mr-2 h-4 w-4" />Experience</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                {resumeData.experience.map((exp, index) => (
                  <Card key={exp.id}>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">Position {index + 1}</p>
                         <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)}>
                            <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input value={exp.title} onChange={e => handleExperienceChange(exp.id, 'title', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input value={exp.company} onChange={e => handleExperienceChange(exp.id, 'company', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Dates</Label>
                        <Input value={exp.dates} onChange={e => handleExperienceChange(exp.id, 'dates', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={exp.description} onChange={e => handleExperienceChange(exp.id, 'description', e.target.value)} rows={4}/>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button onClick={addExperience} variant="outline" className="w-full"><Plus className="mr-2 h-4 w-4" />Add Experience</Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="education">
              <AccordionTrigger><GraduationCap className="mr-2 h-4 w-4" />Education</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                {resumeData.education.map((edu, index) => (
                  <Card key={edu.id}>
                     <CardContent className="p-4 space-y-4">
                       <div className="flex justify-between items-center">
                        <p className="font-semibold">Entry {index + 1}</p>
                         <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)}>
                            <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                      </div>
                       <div className="space-y-2">
                        <Label>School</Label>
                        <Input value={edu.school} onChange={e => handleEducationChange(edu.id, 'school', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree / Certificate</Label>
                        <Input value={edu.degree} onChange={e => handleEducationChange(edu.id, 'degree', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Dates</Label>
                        <Input value={edu.dates} onChange={e => handleEducationChange(edu.id, 'dates', e.target.value)} />
                      </div>
                     </CardContent>
                  </Card>
                ))}
                 <Button onClick={addEducation} variant="outline" className="w-full"><Plus className="mr-2 h-4 w-4" />Add Education</Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="skills">
              <AccordionTrigger>Skills</AccordionTrigger>
               <AccordionContent className="pt-2">
                 <Label>Skills (comma separated)</Label>
                <Textarea value={resumeData.skills} onChange={e => setResumeData(p => ({ ...p, skills: e.target.value }))} rows={4}/>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        <TabsContent value="design" className="p-4">
           <div className="space-y-6 p-4">
              <div>
                <Label className="text-lg font-semibold">Template</Label>
                <p className="text-sm text-muted-foreground">Select a template for your resume.</p>
                <RadioGroup
                  value={resumeData.template}
                  onValueChange={(value) => setResumeData(p => ({...p, template: value as ResumeData['template']}))}
                  className="mt-4 grid grid-cols-3 gap-4"
                >
                  {['classic', 'modern', 'creative'].map((template) => (
                    <Label key={template} htmlFor={template} className="cursor-pointer">
                      <Card className={`hover:border-primary ${resumeData.template === template ? 'border-primary border-2' : ''}`}>
                         <CardContent className="p-0">
                           <RadioGroupItem value={template} id={template} className="sr-only"/>
                           <img
                            src={`https://placehold.co/400x560.png`}
                            data-ai-hint={`${template} resume`}
                            alt={`${template} template`}
                            className="rounded-lg aspect-[1/1.4]"
                           />
                           <p className="text-center font-medium p-2 capitalize">{template}</p>
                         </CardContent>
                      </Card>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
               <div>
                  <Label className="text-lg font-semibold" htmlFor="font-select">Font Style</Label>
                  <p className="text-sm text-muted-foreground mb-4">Choose a font for your resume.</p>
                   <Select
                    value={resumeData.font}
                    onValueChange={(value) => setResumeData(p => ({...p, font: value as ResumeData['font']}))}
                   >
                     <SelectTrigger id="font-select">
                       <SelectValue placeholder="Select a font" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="inter">Inter (Sans-serif)</SelectItem>
                       <SelectItem value="serif">Serif (e.g. Times New Roman)</SelectItem>
                       <SelectItem value="mono">Monospace (e.g. Courier)</SelectItem>
                     </SelectContent>
                   </Select>
               </div>
           </div>
        </TabsContent>
        <TabsContent value="ai-assistant" className="p-4">
          <AiSuggester />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
