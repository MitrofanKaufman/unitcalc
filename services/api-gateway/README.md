# API Gateway для WB Marketplace Calculator

## 🎯 Описание

API Gateway сервис предоставляет REST API для всех функций WB Marketplace Calculator:
- Конвертация единиц измерения
- Валютные расчеты
- Математические операции
- Скрапинг веб-страниц

## 🚀 Запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшена
npm start
```

## 📚 API Endpoints

- `GET /api/units/convert` - Конвертация единиц
- `GET /api/currency/rates` - Курсы валют
- `POST /api/calculations/math` - Математические операции
- `POST /api/scraping/scrape` - Скрапинг данных

## 🔧 Конфигурация

Создайте файл `.env` на основе `.env.example` и настройте:
- Порт сервера
- API ключи внешних сервисов
- Настройки базы данных
