// path: src/core/PortManager.ts
import net from 'net';
import { exec } from 'child_process';
import * as readline from 'readline';

export class PortManager {
  private rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  constructor(private settings: any) {}

  private ask(question: string): Promise<string> {
    return new Promise(res => this.rl.question(question, a => res(a.trim())));
  }

  private async isFree(port: number): Promise<boolean> {
    return new Promise(resolve => {
      const server = net.createServer()
        .once('error', () => resolve(false))
        .once('listening', () => server.close(() => resolve(true)))
        .listen(port);
    });
  }

  private async findPortOwner(port: number): Promise<number | null> {
    const cmd = process.platform === 'win32'
      ? `netstat -ano | findstr :${port}`
      : `lsof -nP -iTCP:${port} -sTCP:LISTEN`;

    return new Promise(resolve => {
      exec(cmd, (err, stdout) => {
        if (err || !stdout) return resolve(null);
        const match = stdout.match(/\b(\d+)\b/);
        resolve(match ? Number(match[1]) : null);
      });
    });
  }

  private validatePort(input: string): number {
    const port = Number(input);
    if (!Number.isInteger(port) || port < this.settings.portRange.min || port > this.settings.portRange.max) {
      console.log('Некорректный порт. Выход.');
      process.exit(1);
    }
    return port;
  }

  private async findFirstFreePort(start: number): Promise<number> {
    let port = start;
    while (true) {
      if (!this.settings.reservedPorts.includes(port) && await this.isFree(port)) return port;
      port++;
      if (port > this.settings.portRange.max) port = this.settings.portRange.min;
    }
  }

  public async resolvePort(): Promise<number> {
    const envPort = process.env.PORT ? Number(process.env.PORT) : null;
    const interactive = process.stdin.isTTY && process.stdout.isTTY;
    let port = envPort || this.settings.portDefault;

    if (envPort) return port;
    if (!interactive) return await this.findFirstFreePort(port);

    if (!(await this.isFree(port))) {
      console.log(`⚠️  Порт ${port} уже занят.`);
      const pid = await this.findPortOwner(port);
      if (pid) console.log(`   Использует PID ${pid}.`);

      port = await this.findFirstFreePort(port + 1);
      const answer = await this.ask(`Использовать порт ${port} или введите другой (q - выход): `);
      if (['q', 'Q', '\u001B'].includes(answer)) process.exit(0);
      if (answer) port = this.validatePort(answer);
    }

    this.rl.close();
    return port;
  }
}
