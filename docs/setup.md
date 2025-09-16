# Установка и запуск

## 📦 Требования

- Node.js >= 18
- npm >= 9
- SQLite (по умолчанию встроенный файл `database.sqlite`)

## 🚀 Быстрый старт

```bash
# 1. Клонируйте репозиторий
git clone <repo>
cd unit.calculator

# 2. Установите зависимости
npm install

# 3. Запустите проект в dev-режиме (клиент + сервер)
npm run dev:all
```

## 🐳 Docker

```bash
# билд образа
 docker build -t wb-calculator .
# запуск
 docker run -p 4000:4000 wb-calculator
```

## ℹ️ Полный список скриптов

| Скрипт | Действие |
|--------|----------|
| `dev` | Запуск фронтенда Vite |
| `dev:server` | Запуск backend-API (TSX watch) |
| `dev:all` | Параллельно клиент + сервер |
| `build` | Сборка фронтенда |
| `build:server` | Компиляция backend до JS |
| `start` | Запуск production-сборки |
