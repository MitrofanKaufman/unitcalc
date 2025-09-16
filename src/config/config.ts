// src/config/config.ts
// Базовая конфигурация для восстановления работоспособности

export const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  // Другие параметры конфигурации могут быть добавлены здесь
};
