import http from 'http';
import { AddressInfo } from 'net';
import kill from 'kill-port';

export async function startServer(app: any, port: number): Promise<http.Server> {
  // Try to close the port if it's in use
  await checkAndClosePort(port);
  
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    
    // Start the server
    server.listen(port, () => {
      const address = server.address() as AddressInfo;
      console.log(`🚀 Server is running on port ${address.port}`);
      resolve(server);
    });
    
    // Handle server errors
    server.on('error', async (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`⚠️  Port ${port} is already in use, trying to close it...`);
        try {
          await kill(port, 'tcp');
          console.log(`✅ Port ${port} has been freed`);
          // Retry starting the server after freeing the port
          const newServer = await startServer(app, port);
          resolve(newServer);
        } catch (err) {
          console.error(`❌ Failed to free port ${port}:`, (err as Error).message);
          reject(err);
        }
      } else {
        console.error('Server error:', error);
        reject(error);
      }
    });
    
    // Handle process termination
    const gracefulShutdown = () => {
      console.log('🛑 Received shutdown signal. Closing server...');
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });
      
      // Force close after 5 seconds
      setTimeout(() => {
        console.error('❌ Forcing server shutdown');
        process.exit(1);
      }, 5000);
    };
    
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  });
}

async function checkAndClosePort(port: number): Promise<void> {
  return new Promise((resolve) => {
    const server = http.createServer()
      .once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is in use, will attempt to close it`);
          resolve();
        } else {
          console.error('Error checking port:', err);
          resolve();
        }
      })
      .once('listening', () => {
        server.close(() => resolve());
      })
      .listen(port);
  });
}
