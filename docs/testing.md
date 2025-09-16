# Тестирование

## Стратегия

| Уровень | Фреймворк | Цель |
|---------|-----------|------|
| Unit | Vitest | Проверка отдельных функций (core) |
| Integration | Vitest + Supertest | Проверка слоёв backend + DB |
| E2E | Playwright | Пользовательские сценарии в браузере |

## Запуск

```bash
# Запустить все тесты
npm test

# Watch-mode
npm run test:watch

# Покрытие
npm run test:coverage
```

## Структура каталогов

```
/tests
  ├─ unit/
  ├─ integration/
  └─ e2e/
```

## Continuous Integration

GitHub Actions workflow `.github/workflows/test.yml` запускает `npm test` на push / PR.
