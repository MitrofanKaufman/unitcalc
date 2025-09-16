// src/hooks/middleware.ts
// Базовая реализация middleware для восстановления работоспособности

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

export const applyMiddleware = (app: Application, config: any) => {
  // Включаем CORS (Cross-Origin Resource Sharing)
  app.use(cors());

  // Устанавливаем различные HTTP-заголовки для безопасности
  app.use(helmet());

  // Парсер для JSON-тел запросов
  app.use(express.json());

  // Парсер для URL-encoded тел запросов
  app.use(express.urlencoded({ extended: true }));
};
