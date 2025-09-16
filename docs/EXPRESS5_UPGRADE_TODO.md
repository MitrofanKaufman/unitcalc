# Список файлов для обновления при переходе на Express 5

## Критические изменения

### 1. Основные файлы приложения
- [ ] `src/api/server.js` - обновить middleware и обработку ошибок
- [ ] `src/core/RouteManager.ts` - обновить обработку маршрутов

### 2. Роутеры API
- [ ] `src/api/suggest.ts` - обновить обработку запросов
- [ ] `src/api/v1/calculator.js` - обновить загрузку и обработку данных
- [ ] `src/api/v1/endpoints/pvz.js` - обновить обработку запросов
- [ ] `src/api/v1/endpoints/tariffs/box.js` - обновить обработку запросов
- [ ] `src/api/v1/endpoints/tariffs/commission.js` - обновить обработку запросов
- [ ] `src/api/v1/endpoints/tariffs/pallet.js` - обновить обработку запросов
- [ ] `src/api/v1/endpoints/tariffs/return.js` - обновить обработку запросов
- [ ] `src/api/v1/functions/WarehouseCoeffs.js` - обновить обработку данных
- [ ] `src/api/v1/main.js` - обновить настройки Express
- [ ] `src/api/v1/routes/calcRouter.js` - обновить маршруты
- [ ] `src/api/v1/routes/json/cache.js` - обновить обработку кэша
- [ ] `src/api/v1/routes/json/product.ts` - обновить обработку продуктов
- [ ] `src/api/v1/routes/json/results.ts` - обновить обработку результатов
- [ ] `src/api/v1/routes/json/saveResults.ts` - обновить сохранение результатов
- [ ] `src/api/v1/routes/json/seller.js` - обновить обработку продавцов
- [ ] `src/api/v1/routes/mysql/product.ts` - обновить работу с MySQL
- [ ] `src/api/v1/routes/parse/calculate.js` - обновить парсинг расчетов
- [ ] `src/api/v1/routes/parse/product.js` - обновить парсинг продуктов
- [ ] `src/api/v1/routes/parse/testRouter.js` - обновить тестовые маршруты
- [ ] `src/api/v1/routes/sql/product.js` - обновить SQL-запросы

### 3. Утилиты и хелперы
- [ ] `src/core/utils/search/server.ts` - обновить сервер поиска
- [ ] `src/inc/parseProduct.js` - обновить парсинг продуктов

### 4. React-компоненты (обновление fetch-запросов)
- [ ] `src/pages/CalculatorForm.tsx`
- [ ] `src/pages/CalculatorLatest.tsx`
- [ ] `src/pages/CalculatorResultData.tsx`
- [ ] `src/pages/CalculatorVersion.tsx`
- [ ] `src/pages/Product.tsx`
- [ ] `src/pages/ProductAnalyse.tsx`
- [ ] `src/pages/ProductDetails.tsx`

## Основные изменения для Express 5

1. **Обновление middleware**
   - Заменить `bodyParser.json()` на `express.json()`
   - Заменить `bodyParser.urlencoded()` на `express.urlencoded()`

2. **Обработка ошибок**
   - Обновить обработчики ошибок для асинхронных функций
   - Добавить обработку ошибок для промисов

3. **Маршрутизация**
   - Заменить неименованные параметры на именованные
   - Обновить регулярные выражения в маршрутах

4. **Ответы сервера**
   - Обновить формат JSON-ответов
   - Добавить правильные заголовки Content-Type

## Инструкция по обновлению

1. Обновить зависимости в `package.json`:
   ```json
   "express": "^5.0.0"
   ```

2. Установить обновленные зависимости:
   ```bash
   npm install
   ```

3. Запустить тесты:
   ```bash
   npm test
   ```

4. Проверить логи на наличие предупреждений о deprecated-методах.

## Примечания

- Все изменения должны быть протестированы
- Рекомендуется делать изменения постепенно, по одному файлу
- После каждого изменения запускать тесты
- Следить за логами на наличие предупреждений
