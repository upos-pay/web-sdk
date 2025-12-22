export type LogLevel = 'debug' | 'error' | 'info' | 'warn'

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

export class Logger {
  private levelValue: number

  constructor(level: LogLevel = 'error') {
    this.levelValue = LEVELS[level]
  }

  debug(...args: unknown[]): void {
    if (this.levelValue <= LEVELS.debug) { console.debug(...args) }
  }

  info(...args: unknown[]): void {
    if (this.levelValue <= LEVELS.info) { console.info(...args) }
  }

  warn(...args: unknown[]): void {
    if (this.levelValue <= LEVELS.warn) { console.warn(...args) }
  }

  error(...args: unknown[]): void {
    if (this.levelValue <= LEVELS.error) { console.error(...args) }
  }
}
