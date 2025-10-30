#!/usr/bin/env node

import { config } from 'dotenv';
import { logger } from './src/logger.ts';
import { scrapeArticle } from './src/scraper.ts';
import { convertToMarkdown } from './src/converter.ts';
import { generateEpub } from './src/epub-generator.ts';

/**
 * Test script with hardcoded values
 */
async function testRun() {
  try {
    // Load environment variables
    config();

    // Test data
    const articleInput = {
      title: 'Building a GPT-like Model from Scratch with Detailed Theory and Code Implementation',
      author: 'Habr',
      url: 'https://habr.com/en/companies/ods/articles/708672/'
    };

    logger.header('📚 Article to EPUB Converter - TEST RUN');
    logger.separator();

    // Step 1: Display article details
    logger.step(1, 'Test article information');
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
      console.error(error.stack);
    } else {
      logger.error('Unknown error');
    }
    process.exit(1);
  }
}

// Run the test
testRun();
