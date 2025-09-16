// path: src/core/waitPorts.js
import net from 'net';

const ports = [3000, 3001, 4000];
const RETRY_INTERVAL = 1000;

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net
      .createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        server.close(() => resolve(true));
      })
      .listen(port);
  });
}

async function waitUntilAllPortsFree() {
  while (true) {
    const results = await Promise.all(ports.map(isPortFree));
    const busyPorts = ports.filter((_, i) => !results[i]);
    if (busyPorts.length === 0) {
      console.log(`✅ Все порты свободны: ${ports.join(', ')}`);
      break;
    } else {
      console.log(`⏳ Порты заняты: ${busyPorts.join(', ')}. Повтор через ${RETRY_INTERVAL} мс...`);
      await new Promise((r) => setTimeout(r, RETRY_INTERVAL));
    }
  }
}

waitUntilAllPortsFree();
