# Article to EPUB Converter

Interactive CLI tool to convert web articles into EPUB format using Playwright for web scraping and OpenAI for content conversion.

## Features

- 📖 **Interactive CLI** - User-friendly prompts for article details
- 🌐 **Web Scraping** - Playwright-powered content extraction with visible browser
- 🤖 **AI Conversion** - OpenAI API to convert HTML to clean Markdown
- 📚 **EPUB Generation** - Create properly formatted EPUB files
- 🎨 **Detailed Logging** - Step-by-step colored console output

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

The tool will guide you through:
1. Enter article title
2. Enter author name
3. Enter article URL

The browser will open visibly, load the page, and the tool will:
- Extract the article content
- Convert it to clean Markdown using OpenAI
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

- **No Build Step**: Uses Node.js 24's `--experimental-strip-types` to run TypeScript directly
- **ESM Modules**: Pure ES modules with `.js` extensions in imports
- **Visible Browser**: Playwright runs with `headless: false` for visual feedback
- **AI-Powered**: Uses GPT-5-mini for efficient content conversion

## Troubleshooting

### "OPENAI_API_KEY not found"
Make sure you've created a `.env` file with your API key:
```bash
OPENAI_API_KEY=sk-your-key-here
```

### Browser doesn't open
Chromium should be installed automatically during `npm install`. If you encounter issues, manually install it:
```bash
npx playwright install chromium
```

### Node version error
Ensure you're using Node.js 24 or higher:
```bash
node --version
```

## License

Apache-2.0
