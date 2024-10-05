import { isBun } from './constants';
import gup from './gup';

/* eslint-disable no-console */
enum LogLevel {
  INFO = 0,
  DEBUG = 1,
  WARNING = 2,
  ERROR = 3,
}

class Logger {
  private logLevel: LogLevel;

  constructor(logLevel: LogLevel = LogLevel.DEBUG) {
    this.logLevel = logLevel;
  }

  private log(level: LogLevel, ...args: unknown[]): void {
    switch (level) {
      case LogLevel.DEBUG:
        console.log(...args);
        break;
      case LogLevel.INFO:
        console.log(...args);
        break;
      case LogLevel.WARNING:
        console.warn(...args);
        break;
      case LogLevel.ERROR:
        console.error(...args);
        break;
      default:
        break;
    }
  }

  debug(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      this.log(LogLevel.DEBUG, ...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.INFO) {
      this.log(LogLevel.INFO, ...args);
    }
  }

  warning(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.WARNING) {
      this.log(LogLevel.WARNING, ...args);
    }
  }
  error(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.ERROR) {
      this.log(LogLevel.ERROR, ...args);
    }
  }
}

// Note that vite replaces all log.* calls in development with console.* to preserve line numbers
export const log = new Logger(
  isBun ? LogLevel.DEBUG : import.meta.env?.DEV ? (gup('debug') ? LogLevel.DEBUG : LogLevel.INFO) : LogLevel.INFO
);
