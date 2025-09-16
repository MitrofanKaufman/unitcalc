// path: src/core/utils/logger.ts

export class Logger {
  static _enabled() {
    if (typeof window !== "undefined" && typeof import.meta !== "undefined") {
      // В браузере — Vite env через import.meta.env
      return import.meta.env.VITE_DEBUG_LOG === "true";
    }
    if (typeof process !== "undefined" && process.env) {
      // В Node.js — process.env
      return process.env.VITE_DEBUG_LOG === "true";
    }
    return false;
  }

  static _src(stackShift = 2) {
    const line = new Error().stack?.split("\n")[stackShift] || "";
    const match = line.match(/at .*? \((.*?):(\d+):/);
    return match ? `${match[1].split("/").pop()}:${match[2]}` : "—";
  }

  static _print(level: string, message: any, ctx: string, stackShift = 3) {
    if (!Logger._enabled()) return;
    const ts = new Date().toISOString();
    const label = `[${ts}] [${level.padEnd(5)}] ${ctx}`.trim();
    const source = Logger._src(stackShift);
    const logFn = level === "ERROR" ? console.error : console.log;
    logFn(label, message, `(${source})`);
  }

  static createLogger(ctx = "") {
    return {
      log: (msg: any) => Logger._print("INFO", msg, ctx),
      info: (msg: any) => Logger._print("INFO", msg, ctx),
      warn: (msg: any) => Logger._print("WARN", msg, ctx),
      debug: (msg: any) =>
        Logger._enabled() && Logger._print("DEBUG", msg, ctx),
      error: (err: any) => {
        if (!Logger._enabled()) return;
        const msg = err instanceof Error ? err.message : err;
        const stack = err instanceof Error ? `\n${err.stack}` : "";
        const ts = new Date().toISOString();
        const label = `[${ts}] [ERROR] ${ctx}`.trim();
        const source = Logger._src(3);
        console.error(label, msg, `(${source})${stack}`);
      },
    };
  }
}

export default Logger;
