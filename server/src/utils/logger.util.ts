// ─────────────────────────────────────────────────────────────────────────────
// GlobeTrotter — Logger Utility
//
// A lightweight structured logger wrapping console methods.
// In production, this can be swapped for Winston / Pino without changing
// call sites throughout the codebase.
// ─────────────────────────────────────────────────────────────────────────────

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: string;
}

function formatEntry(entry: LogEntry): string {
  const parts = [`[${entry.timestamp}]`, `[${entry.level.toUpperCase()}]`];
  if (entry.context) parts.push(`[${entry.context}]`);
  parts.push(entry.message);
  return parts.join(' ');
}

class Logger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  /** Create a child logger with a specific context label */
  child(context: string): Logger {
    return new Logger(context);
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      context: this.context,
      data,
      timestamp: new Date().toISOString(),
    };

    const formatted = formatEntry(entry);

    switch (level) {
      case 'error':
        console.error(formatted, data !== undefined ? data : '');
        break;
      case 'warn':
        console.warn(formatted, data !== undefined ? data : '');
        break;
      case 'debug':
        if (process.env['NODE_ENV'] !== 'production') {
          console.debug(formatted, data !== undefined ? data : '');
        }
        break;
      default:
        console.log(formatted, data !== undefined ? data : '');
    }
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }
}

// Root logger — also export the class so modules can create contextual loggers
export const logger = new Logger();
export { Logger };
export default logger;
