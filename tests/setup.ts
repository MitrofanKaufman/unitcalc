// Import global testing utilities
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// Set up MSW (Mock Service Worker) for API mocking
beforeAll(() => {
  // Start the mock server
  server.listen({ onUnhandledRequest: 'bypass' });
  
  // Mock window.matchMedia which is not available in JSDOM
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

// Reset any request handlers between tests
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests are done
afterAll(() => {
  server.close();
});

// Mock global objects
Object.defineProperty(global, 'scrollTo', {
  value: () => {},
  writable: true,
});
