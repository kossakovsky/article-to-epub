import inquirer from 'inquirer';

/**
 * Article metadata collected from user input
 */
export interface ArticleInput {
  title: string;
  author: string;
  url: string;
}

/**
 * Prompt the user for article details
 */
export async function promptForArticleDetails(): Promise<ArticleInput> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Article title:',
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return 'Title cannot be empty';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name:',
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return 'Author name cannot be empty';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'url',
      message: 'Article URL:',
      validate: (input: string) => {
        // Basic URL validation
        try {
          new URL(input);
          return true;
        } catch {
          return 'Please enter a valid URL (e.g., https://example.com/article)';
        }
      }
    }
  ]);

  return {
    title: answers.title.trim(),
    author: answers.author.trim(),
    url: answers.url.trim()
  };
}
