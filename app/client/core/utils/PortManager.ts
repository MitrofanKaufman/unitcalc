// PortManager.ts
import { logger } from '../../utils/logger';
import net from 'net';

/**
 * Utility class for managing and finding available ports
 */
export class PortManager {
  /**
   * Check if a port is available
   * @param port Port number to check
   * @returns Promise that resolves to true if the port is available, false otherwise
   */
  private static async isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer()
        .once('error', (err: NodeJS.ErrnoException) => {
          if (err.code === 'EADDRINUSE') {
            logger.debug(`Port ${port} is already in use`);
            resolve(false);
          } else {
            logger.error(`Error checking port ${port}:`, err);
            resolve(false);
          }
        })
        .once('listening', () => {
          server.close();
          resolve(true);
        })
        .listen(port);
    });
  }

  /**
   * Get an available port starting from the specified port
   * @param startPort The port to start checking from
   * @returns Promise that resolves to an available port number
   */
  public static async getAvailablePort(startPort: number): Promise<number> {
    let port = startPort;
    const maxPort = 65535;

    while (port <= maxPort) {
      if (await this.isPortAvailable(port)) {
        logger.info(`Found available port: ${port}`);
        return port;
      }
      port++;
    }

    throw new Error(`No available ports found starting from ${startPort}`);
  }

  /**
   * Get multiple available ports
   * @param count Number of ports needed
   * @param startPort Starting port number
   * @returns Promise that resolves to an array of available port numbers
   */
  public static async getAvailablePorts(count: number, startPort: number): Promise<number[]> {
    const ports: number[] = [];
    let currentPort = startPort;
    const maxPort = 65535;

    while (ports.length < count && currentPort <= maxPort) {
      if (await this.isPortAvailable(currentPort)) {
        ports.push(currentPort);
      }
      currentPort++;
    }

    if (ports.length < count) {
      throw new Error(`Could not find ${count} available ports starting from ${startPort}`);
    }

    return ports;
  }
}

export default PortManager;
