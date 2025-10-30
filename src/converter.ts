import OpenAI from 'openai';
import { logger } from './logger.ts';

/**
 * Convert HTML content to clean Markdown using OpenAI API
 */
export async function convertToMarkdown(content: { html: string; text: string }, apiKey: string): Promise<string> {
  try {
    logger.startSpinner('Initializing OpenAI client');

    const openai = new OpenAI({
      apiKey: apiKey
    });

    logger.succeedSpinner('OpenAI client initialized');

    logger.startSpinner('Sending content to OpenAI for conversion');

    const prompt = `You are a content converter. Convert the following HTML content into clean, well-formatted Markdown.

Instructions:
- Extract only the main article content, ignore navigation, headers, footers, ads, etc.
- Preserve headings, paragraphs, lists, links, and emphasis
- Remove any HTML tags not needed for content
- Format code blocks properly if present
- Keep images with their alt text
- Output only the Markdown, no additional commentary

HTML Content:
${content.html}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-5-mini', // Using cost-effective model for content conversion
      messages: [
        {
          role: 'system',
          content: 'You are an expert at converting HTML to clean, readable Markdown format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
    });

    const markdown = response.choices[0]?.message?.content;

    if (!markdown) {
      throw new Error('No markdown content received from OpenAI');
    }

    logger.succeedSpinner(`Markdown conversion complete (${markdown.length} characters)`);

    return markdown;

  } catch (error) {
    logger.failSpinner('Conversion failed');

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid OpenAI API key. Please check your .env file');
      }
      throw new Error(`OpenAI conversion failed: ${error.message}`);
    }

    throw new Error('Unknown error during conversion');
  }
}
