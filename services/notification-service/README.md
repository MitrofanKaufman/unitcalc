# Notification Service

Сервис уведомлений для пользователей приложения.

## Функциональность

- Отправка email уведомлений
- Push уведомления в браузере
- Уведомления в Telegram
- Настройка персональных уведомлений

## API

- `POST /api/notifications` - отправить уведомление
- `GET /api/notifications/preferences` - получить настройки уведомлений
- `PUT /api/notifications/preferences` - обновить настройки уведомлений

## Технологии

- Node.js
- TypeScript
- Nodemailer
- Web Push API
