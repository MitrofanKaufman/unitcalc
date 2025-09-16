# Dev-процессы

## Git Flow

1. `main` — стабильная ветка, деплой в production.
2. `develop` — интеграционная ветка feature-веток.
3. `feature/<slug>` — одна задача/фича.
4. `hotfix/<issue>` — критические правки production.

```text
main ← hotfix/*
  ↑
develop ← feature/*
```

## Коммиты

- Используется [Conventional Commits](https://www.conventionalcommits.org/).
- Шаблон через `commitizen` (`npm run cz`).

| Тип | Префикс | Пример |
|-----|---------|--------|
| Фича | `feat` | `feat: add ROI chart` |
| Баг | `fix` | `fix: correct FBS logistics fee` |
| Док | `docs` | `docs: update README` |
| Тесты | `test` | `test: add unit tests for calculator` |
| Рефактор | `refactor` | `refactor: move utils to core` |

## Линтинг и форматирование

| Инструмент | Скрипт |
|------------|--------|
| ESLint | `npm run lint` |
| Prettier | `npm run format` |
| lint-staged | Автофиксы в pre-commit |

## CI/CD

GitHub Actions:

- `ci.yml` — lint + тесты.
- `release.yml` — семантический релиз + changelog.
- `docker.yml` — билд и пуш Docker-образа.

## Husky Hooks

| Хук | Действие |
|-----|----------|
| `pre-commit` | `lint-staged` (ESLint + Prettier) |
| `post-commit` | `npm run log:history && npm run log:table` |

## Code Review

- Pull Request → минимум 1 approval.
- Проверка линтера и тестов должна проходить.
- Описание PR по шаблону (что сделано, мотивация, ссылки на задачи).
