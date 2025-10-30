import epub from 'epub-gen-memory';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { logger } from './logger.ts';

/**
 * EPUB generation options
 */
export interface EpubOptions {
  title: string;
  author: string;
  content: string;
}

/**
 * Generate an EPUB file from markdown content
 * Saves the file to the epub/ directory
 */
export async function generateEpub(options: EpubOptions): Promise<string> {
  try {
    logger.startSpinner('Generating EPUB file');

    // Create sanitized filename from title
    const sanitizedTitle = options.title
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    const filename = `${sanitizedTitle}.epub`;
    const outputPath = join(process.cwd(), 'epub', filename);

    // Convert markdown to HTML for EPUB (basic conversion)
    // epub-gen-memory expects HTML content
    const htmlContent = markdownToHtml(options.content);

    // Generate EPUB in memory
    const epubBuffer = await epub(
      {
        title: options.title,
        author: options.author,
        publisher: 'Article to EPUB Converter',
      },
      [
        {
          title: options.title,
          data: htmlContent
        }
      ]
    );

    logger.updateSpinner('Writing EPUB file to disk');

    // Write buffer to file
    await writeFile(outputPath, epubBuffer);

    logger.succeedSpinner(`EPUB file created successfully`);

    return outputPath;

  } catch (error) {
    logger.failSpinner('EPUB generation failed');
    throw new Error(`Failed to generate EPUB: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert markdown to HTML (basic conversion)
 * For more advanced conversion, consider using a library like 'marked'
 */
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Convert headings
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\_\_(.*?)\_\_/g, '<strong>$1</strong>');

  // Convert italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/\_(.*?)\_/g, '<em>$1</em>');

  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Convert line breaks to paragraphs
  html = html.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n');

  return html;
}
