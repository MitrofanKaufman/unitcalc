// Полифилл для process в браузере
if (typeof process === 'undefined') {
  globalThis.process = {
    cwd: () => '/',
    env: { NODE_ENV: 'development' },
    platform: 'browser',
    version: ''
  };
}
