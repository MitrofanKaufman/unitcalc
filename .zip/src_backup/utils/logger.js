// path: src/core/utils/logger.js
// JavaScript version of the logger for Node.js backend

class Logger {
  static _enabled() {
    if (typeof process !== 'undefined' && process.env) {
      // In Node.js — use process.env
      return process.env.VITE_DEBUG_LOG === 'true';
    }
    return false;
  }

  static _src(stackShift = 2) {
    const line = new Error().stack?.split('\n')[stackShift] || '';
    const match = line.match(/at .*? (?:\(.*?\) )?\(?(.*?):(\d+):/);
    return match ? `${match[1].split('/').pop()}:${match[2]}` : '—';
  }

  static _print(level, message, ctx, stackShift = 3) {
    if (!Logger._enabled()) return;
    const ts = new Date().toISOString();
    const label = `[${ts}] [${level.padEnd(5)}] ${ctx}`.trim();
    const source = Logger._src(stackShift);
    const logFn = level === 'ERROR' ? console.error : console.log;
    logFn(label, message, `(${source})`);
  }

  static createLogger(ctx = '') {
    return {
      log: (msg) => Logger._print('INFO', msg, ctx),
      info: (msg) => Logger._print('INFO', msg, ctx),
      warn: (msg) => Logger._print('WARN', msg, ctx),
      debug: (msg) => Logger._enabled() && Logger._print('DEBUG', msg, ctx),
      error: (err) => {
        if (!Logger._enabled()) return;
        const msg = err instanceof Error ? err.message : err;
        const stack = err instanceof Error ? `\n${err.stack}` : '';
        const ts = new Date().toISOString();
        const label = `[${ts}] [ERROR] ${ctx}`.trim();
        const source = Logger._src(3);
        console.error(label, msg, `(${source})${stack}`);
      },
    };
  }
}

export { Logger };
export default Logger;
