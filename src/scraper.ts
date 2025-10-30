import { chromium } from 'playwright';
import { logger } from './logger.ts';

/**
 * Scraped article content
 */
export interface ScrapedContent {
  html: string;
  text: string;
}

/**
 * Scrape article content from a URL using Playwright
 * Browser runs in visible mode (headless: false)
 */
export async function scrapeArticle(url: string): Promise<ScrapedContent> {
  let browser: any = null;
  let page: any = null;

  try {
    logger.startSpinner('Launching Chromium browser (visible mode)');

    // Launch browser in non-headless mode to see the rendering
    browser = await chromium.launch({
      headless: false,
      slowMo: 100 // Add slight delay to make browser actions visible
    });

    logger.succeedSpinner('Browser launched successfully');

    logger.startSpinner('Opening page and loading content');
    page = await browser.newPage();

    // Navigate to the URL with a timeout
    // Try 'domcontentloaded' first as it's more reliable than 'networkidle'
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
    } catch (error) {
      // If domcontentloaded fails, try 'load'
      logger.updateSpinner('Retrying with different wait strategy...');
      await page.goto(url, {
        waitUntil: 'load',
        timeout: 60000
      });
    }

    // Wait a bit for any dynamic content to load
    await page.waitForTimeout(2000);

    logger.succeedSpinner('Page loaded successfully');

    logger.startSpinner('Extracting article content');

    // Try to find the main article content
    // Common selectors for article content
    const selectors = [
      'article',
      'main',
      '[role="main"]',
      '.article-content',
      '.post-content',
      '.entry-content',
      '#content'
    ];

    let html = '';
    let text = '';

    // Try each selector until we find content
    for (const selector of selectors) {
      const element = await page.$(selector);
      if (element) {
        html = await element.innerHTML();
        text = await element.innerText();

        // If we found substantial content, use it
        if (text.length > 200) {
          logger.info(`Content found using selector: ${selector}`);
          break;
        }
      }
    }

    // Fallback to body if no article content found
    if (!html || text.length < 200) {
      logger.warning('No article-specific content found, using full page body');
      const bodyElement = await page.$('body');
      if (bodyElement) {
        html = await bodyElement.innerHTML();
        text = await bodyElement.innerText();
      }
    }

    logger.succeedSpinner(`Content extracted (${text.length} characters)`);

    // Keep browser open for a moment so user can see the result
    await page.waitForTimeout(1000);

    return { html, text };

  } catch (error) {
    logger.failSpinner('Failed to scrape article');
    throw new Error(`Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Clean up
    if (page) await page.close();
    if (browser) await browser.close();
    logger.info('Browser closed');
  }
}
