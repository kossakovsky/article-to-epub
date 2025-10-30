# Article to EPUB Converter

Interactive CLI tool to convert web articles into EPUB format using Playwright for web scraping and OpenAI for content conversion.

## Features

- 📖 **Interactive CLI** - User-friendly prompts for article details
- 🌐 **Web Scraping** - Playwright-powered content extraction with visible browser
- 🤖 **AI-Powered Conversion** - OpenAI API converts HTML to clean, readable Markdown
- 📚 **EPUB Generation** - Creates properly formatted EPUB files ready for e-readers
- 🎨 **Rich Logging** - Color-coded console output with progress spinners

## Requirements

- **Node.js 24+** (uses `--experimental-strip-types` flag)
- **OpenAI API Key** (get one at [platform.openai.com](https://platform.openai.com/api-keys))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd article-to-epub
```

2. Install dependencies (Chromium browser will be installed automatically):
```bash
npm install
```

3. Create a `.env` file with your OpenAI API key:
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

## Usage

Run the CLI tool:
```bash
npm start
```

You'll be prompted to enter:
1. **Article title** - The title for your EPUB book
2. **Author name** - The article author
3. **Article URL** - The web page to convert

The tool will then:
- Launch Chromium browser visibly (so you can see the scraping process)
- Extract the main article content using smart selectors
- Convert HTML to clean Markdown via OpenAI
- Generate an EPUB file in the `epub/` directory

## Project Structure

```
article-to-epub/
├── src/
│   ├── index.ts          # Main entry point
│   ├── cli.ts            # Interactive CLI prompts
│   ├── scraper.ts        # Playwright web scraping (headless: false)
│   ├── converter.ts      # OpenAI content conversion
│   ├── epub-generator.ts # EPUB file generation
│   └── logger.ts         # Colored logging utilities
├── epub/                 # Generated EPUB files (gitignored)
├── .env                  # Environment variables (gitignored)
├── .env.example          # Environment template
└── package.json
```

## Configuration

### Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)

### Playwright Settings

The scraper runs in **non-headless mode** (`headless: false`) so you can see the browser opening and loading the page. This is configured in `src/scraper.ts`.

## Output

Generated EPUB files are saved to the `epub/` directory with sanitized filenames based on the article title.

Example:
- Title: "My Awesome Article"
- Output: `epub/my_awesome_article.epub`

## Technical Details

- **No Build Step**: Uses Node.js 24's `--experimental-strip-types` flag to run TypeScript directly without transpilation
- **ESM Modules**: Pure ES modules - all imports use `.js` extensions even for `.ts` files
- **Visible Browser**: Playwright runs with `headless: false` to show the scraping process in real-time
- **Smart Content Extraction**: Tries multiple semantic selectors (`article`, `main`, etc.) to find article content
- **AI-Powered**: Uses OpenAI's GPT models for intelligent HTML-to-Markdown conversion

## Troubleshooting

**"OPENAI_API_KEY not found"**
Make sure you've created a `.env` file in the project root with your API key:
```bash
OPENAI_API_KEY=sk-your-actual-key-here
```

**Browser doesn't open**
Chromium is installed automatically via the `postinstall` script. If it fails, run manually:
```bash
npx playwright install chromium
```

**Node version error**
This project requires Node.js 24+ for TypeScript support. Check your version:
```bash
node --version  # Should be v24.0.0 or higher
```

**Article content not extracted properly**
The scraper tries multiple selectors but some websites have unusual layouts. The fallback is to extract the entire `body` content, which may include navigation and other non-article elements.

## License

Apache-2.0
