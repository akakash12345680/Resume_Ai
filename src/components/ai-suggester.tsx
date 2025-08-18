'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { handleSuggestContent } from '@/app/actions';
import { Loader2, Sparkles, Clipboard } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { SuggestResumeContentOutput, ResumeSection } from '@/lib/types';


const formSchema = z.object({
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters.'),
  resumeSection: z.enum(['summary', 'experience', 'skills', 'education']),
  currentContent: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AiSuggester() {
  const [suggestion, setSuggestion] = useState<SuggestResumeContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: '',
      resumeSection: 'summary',
      currentContent: '',
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSuggestion(null);
    const result = await handleSuggestContent(data);
    setIsLoading(false);

    if (result.success && result.data) {
      setSuggestion(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "An unknown error occurred.",
      })
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        toast({
            title: "Copied!",
            description: "Suggestion copied to clipboard.",
        })
    }).catch(err => {
        toast({
            variant: "destructive",
            title: "Failed to copy",
            description: "Could not copy text to clipboard.",
        })
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Content Helper</CardTitle>
          <CardDescription>
            Paste a job description and select a resume section to get AI-powered suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="jobDescription">Job Description</Label>
              <Controller
                name="jobDescription"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the full job description here..."
                    className="mt-1"
                    rows={8}
                    {...field}
                  />
                )}
              />
              {errors.jobDescription && (
                <p className="text-sm text-destructive mt-1">{errors.jobDescription.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="resumeSection">Resume Section</Label>
              <Controller
                name="resumeSection"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="resumeSection" className="mt-1">
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                      <SelectItem value="skills">Skills</SelectItem>
                       <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            
             <div>
              <Label htmlFor="currentContent">Current Content (Optional)</Label>
              <Controller
                name="currentContent"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="currentContent"
                    placeholder="Paste your current resume content for this section here..."
                    className="mt-1"
                    rows={5}
                    {...field}
                  />
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Get Suggestions
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card>
            <CardContent className="p-6 text-center space-y-4">
                 <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                 <p className="text-muted-foreground">Generating suggestions...</p>
            </CardContent>
         </Card>
      )}

      {suggestion && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Content</CardTitle>
               <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => copyToClipboard(suggestion.suggestedContent)}>
                  <Clipboard className="h-4 w-4" />
               </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{suggestion.suggestedContent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reasoning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestion.reasoning}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
