'use server';

import {
  suggestResumeContent,
  type SuggestResumeContentInput,
  type SuggestResumeContentOutput,
} from '@/ai/flows/suggest-resume-content';

interface ActionResult {
    success: boolean;
    data?: SuggestResumeContentOutput;
    error?: string;
}

export async function handleSuggestContent(input: SuggestResumeContentInput): Promise<ActionResult> {
  try {
    const result = await suggestResumeContent(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in handleSuggestContent:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to get suggestions. ${errorMessage}` };
  }
}
