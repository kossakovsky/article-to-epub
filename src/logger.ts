import chalk from 'chalk';
import ora from 'ora';

/**
 * Logger utility for step-by-step console output with colors and spinners
 */
export class Logger {
  private spinner: ReturnType<typeof ora> | null = null;

  /**
   * Log an informational message
   */
  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  /**
   * Log a success message
   */
  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  /**
   * Log an error message
   */
  error(message: string): void {
    console.log(chalk.red('✗'), message);
  }

  /**
   * Log a warning message
   */
  warning(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  /**
   * Start a spinner with a message
   */
  startSpinner(message: string): void {
    this.spinner = ora(message).start();
  }

  /**
   * Update the spinner text
   */
  updateSpinner(message: string): void {
    if (this.spinner) {
      this.spinner.text = message;
    }
  }

  /**
   * Stop the spinner with a success message
   */
  succeedSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.succeed(message);
      this.spinner = null;
    }
  }

  /**
   * Stop the spinner with a failure message
   */
  failSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.fail(message);
      this.spinner = null;
    }
  }

  /**
   * Log a step in the process
   */
  step(stepNumber: number, message: string): void {
    console.log(chalk.cyan(`[Step ${stepNumber}]`), message);
  }

  /**
   * Log a separator line
   */
  separator(): void {
    console.log(chalk.gray('─'.repeat(50)));
  }

  /**
   * Log a header with emphasis
   */
  header(message: string): void {
    console.log('\n' + chalk.bold.magenta(message) + '\n');
  }
}

// Export a singleton instance
export const logger = new Logger();
