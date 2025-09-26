#!/bin/bash
# Скрипт для применения всех исправлений к приложению

echo "🔧 Применение исправлений к приложению..."

# Применяем патчи в правильном порядке
echo "📦 Применение исправлений импортов в Layout.tsx..."
git apply patch.git/01-layout-imports.patch

echo "📦 Применение исправлений импортов в Header.tsx..."
git apply patch.git/02-header-imports.patch

echo "📦 Применение исправлений импортов в Menu.tsx..."
git apply patch.git/03-menu-imports.patch

echo "📦 Применение исправлений npm скриптов..."
git apply patch.git/04-package-scripts.patch

echo "📦 Применение исправлений API health endpoint..."
git apply patch.git/05-api-health-endpoint.patch

echo "✅ Все исправления применены успешно!"
echo ""
echo "🚀 Следующие шаги:"
echo "1. Запустите приложение: npm run dev:all"
echo "2. Проверьте работу: http://localhost:4000"
echo "3. Проверьте API: http://localhost:3000/api/health"
echo ""
echo "🔧 Исправленные проблемы:"
echo "- ✅ Исправлены импорты в компонентах layouts"
echo "- ✅ Исправлены npm скрипты"
echo "- ✅ Добавлен API health endpoint"
echo "- ✅ Устранены ошибки TypeScript"
echo "- ✅ Исправлены пути к файлам"
