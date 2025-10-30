#!/usr/bin/env node

import { config } from 'dotenv';
import { logger } from './logger.ts';
import { promptForArticleDetails } from './cli.ts';
import { scrapeArticle } from './scraper.ts';
import { convertToMarkdown } from './converter.ts';
import { generateEpub } from './epub-generator.ts';

/**
 * Main application entry point
 */
async function main() {
  try {
    // Load environment variables
    config();

    logger.header('📚 Article to EPUB Converter');
    logger.separator();

    // Step 1: Get article details from user
    logger.step(1, 'Collecting article information');
    const articleInput = await promptForArticleDetails();
    logger.success(`Title: ${articleInput.title}`);
    logger.success(`Author: ${articleInput.author}`);
    logger.success(`URL: ${articleInput.url}`);
    logger.separator();

    // Step 2: Scrape the article
    logger.step(2, 'Scraping article from web');
    const scrapedContent = await scrapeArticle(articleInput.url);
    logger.separator();

    // Step 3: Convert to Markdown using OpenAI
    logger.step(3, 'Converting content to Markdown');

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      logger.error('OPENAI_API_KEY not found in environment variables');
      logger.info('Please create a .env file with your OpenAI API key');
      logger.info('Example: OPENAI_API_KEY=sk-...');
      process.exit(1);
    }

    const markdown = await convertToMarkdown(scrapedContent, apiKey);
    logger.separator();

    // Step 4: Generate EPUB
    logger.step(4, 'Generating EPUB file');
    const epubPath = await generateEpub({
      title: articleInput.title,
      author: articleInput.author,
      content: markdown
    });

    logger.separator();
    logger.success(`✓ EPUB file created successfully!`);
    logger.info(`📁 File location: ${epubPath}`);
    logger.separator();

  } catch (error) {
    logger.separator();
    logger.error('An error occurred:');
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error('Unknown error');
    }
    process.exit(1);
  }
}

// Run the application
main();
