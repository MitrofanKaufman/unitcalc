# Scraper Service

Сервис парсинга и анализа конкурентов с маркетплейсов.

## Функциональность

- Парсинг данных с маркетплейсов (Wildberries, Ozon)
- Анализ цен конкурентов
- Мониторинг изменений цен
- Сбор отзывов и рейтингов

## API

- `POST /api/scrape` - запустить парсинг
- `GET /api/competitors/:productId` - получить данные конкурентов
- `GET /api/prices/:productId` - получить историю цен

## Технологии

- Node.js
- TypeScript
- Puppeteer/Playwright
- Redis для кеширования
