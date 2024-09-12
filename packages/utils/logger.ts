import chalk, { type ChalkInstance } from "chalk";
import { format } from "date-fns/format";

export class Logger {
  private prefix?: string;

  constructor(options: { prefix?: string } = {}) {
    this.prefix = options.prefix;
  }

  log(message: string, ...args: any[]) {
    console.log(...this.prepareSections(message, args));
  }

  info(message: string, ...args: any[]) {
    console.info(...this.prepareSections(message, args, { color: chalk.blue }));
  }

  warn(message: string, ...args: any[]) {
    console.warn(
      ...this.prepareSections(message, args, { color: chalk.yellow }),
    );
  }

  error(message: string, ...args: any[]) {
    console.error(...this.prepareSections(message, args, { color: chalk.red }));
  }

  exception(error: Error) {
    if (!error.stack) {
      return this.error(error.message);
    }

    const titleRegex = /(?<name>.*?): (?<message>.*)/;
    const traceRegex =
      /at (?<method>.*?) \((?<file>.*?):(?<line>\d+):(?<column>\d+)\)/g;
    // Replace the stack trace with a more readable format
    const stack = error.stack
      .replace(titleRegex, (match, name, message) =>
        this.prepareSections(
          `${chalk.gray("(")}${chalk.bold.red(name)}${chalk.gray(")")} ${chalk.red(message)}`,
        ).join(" "),
      )
      .replace(traceRegex, (match, method, file, line, column) => {
        return `  ${chalk.gray("at")} ${chalk.bold(method)} ${chalk.gray("(")}${chalk.blue(file)}:${chalk.yellow(line)}:${chalk.yellow(column)}${chalk.gray(")")}`;
      });

    return console.error(stack);
  }

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  private getTimestamp() {
    return format(new Date(), "yyyy-MM-ss HH:mm:ss");
  }

  private prepareSections(
    message: string,
    args: any[] = [],
    options: { color?: ChalkInstance } = {},
  ) {
    const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
    const prefix = this.prefix ? chalk.bold(`[${this.prefix}]`) : undefined;
    message = options?.color ? options.color(message) : message;

    const messageSections = [timestamp, prefix, message].filter(Boolean);

    return [messageSections.join(" "), ...args];
  }
}
