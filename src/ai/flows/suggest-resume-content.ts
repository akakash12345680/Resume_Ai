'use server';

/**
 * @fileOverview A resume content suggestion AI agent.
 *
 * - suggestResumeContent - A function that suggests optimized resume content based on a job description.
 * - SuggestResumeContentInput - The input type for the suggestResumeContent function.
 * - SuggestResumeContentOutput - The return type for the suggestResumeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestResumeContentInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description to tailor the resume content to.'),
  resumeSection: z
    .string()
    .describe('The specific resume section to optimize (e.g., Experience, Skills, Education).'),
  currentContent: z
    .string()
    .optional()
    .describe('The current content of the resume section, if any.'),
});
export type SuggestResumeContentInput = z.infer<typeof SuggestResumeContentInputSchema>;

const SuggestResumeContentOutputSchema = z.object({
  suggestedContent: z
    .string()
    .describe('The AI-suggested content for the resume section, optimized for the job description.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the suggested content.'),
});
export type SuggestResumeContentOutput = z.infer<typeof SuggestResumeContentOutputSchema>;

export async function suggestResumeContent(input: SuggestResumeContentInput): Promise<SuggestResumeContentOutput> {
  return suggestResumeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestResumeContentPrompt',
  input: {schema: SuggestResumeContentInputSchema},
  output: {schema: SuggestResumeContentOutputSchema},
  prompt: `You are an expert resume writer, skilled at tailoring resumes to specific job descriptions.

  Based on the provided job description and the current content of the resume section (if any), suggest optimized content for the resume section.
  Also provide the reasoning behind the suggested content.  If no current content is provided, generate optimized content from scratch.

  Job Description: {{{jobDescription}}}
  Resume Section: {{{resumeSection}}}
  Current Content (if any): {{{currentContent}}}

  Specifically, you must:
  - Closely analyze the job description and identify the key skills, experience, and keywords required for the role.
  - Rewrite the current content to match the job description as closely as possible.
  - Ensure the suggested content is clear, concise, and easy to read.
  - Make sure the content is ATS compatible.
  - Use industry best practices.

  Output the suggested content in a single paragraph, followed by a single paragraph with the reasoning.
  `,
});

const suggestResumeContentFlow = ai.defineFlow(
  {
    name: 'suggestResumeContentFlow',
    inputSchema: SuggestResumeContentInputSchema,
    outputSchema: SuggestResumeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
