# README.md

Это проект для калькуляции и учёта товаров на Wildberries.

Он включает:

- Класс `APIClient` для загрузки данных с API (карточки, цены, остатки, комиссии).
- `App` – главный класс приложения, связывающий все части логики.
- `TableRenderer` для отрисовки таблицы.
- `ColumnDetails` с описаниями колонок, формулами, зависимостями и источниками данных.
- `FilterController` (управление фильтрами).
- `ProfileController` (настройка видимости колонок).
- `ThemeManager` (тема dark/light).
- `ExcelManager` (импорт/экспорт в XLSX).
- `TokenManager` (работа с API-токеном, хранение в cookie).
- `ShowModal.js` (функция для показа модального окна токена).
- `Utils.js` (вспомогательные методы форматирования и парсинга).
- `main.js` (точка входа, инициализация приложения).
- `index.html` (основная страница) и `main.css` (CSS).

## Как запускать

1. Открыть `index.html` в браузере.
2. При необходимости ввести токен (по умолчанию используется `CONFIG.DEFAULT_TOKEN` из `TokenManager.js`).
3. Кнопки в нижней панели позволяют:
    - Скрывать товары без цены (где нет `priceBeforeDiscount`) или с нулевым остатком.
    - Показать все.
    - Импорт/экспорт Excel.
    - Калькулятор себестоимости.
    - Справку по формулам.
4. В шапке можно менять тему (тёмная/светлая) и масштаб (3 режима).

## Структура проекта

- **css/main.css** – оформление.
- **index.html** – HTML-каркас приложения, модальные окна, toolbar.
- **obj/** – данные для работы:
    - `ColumnDetails.js` – описание полей/формул.
- **js/** – все скрипты:
    - `ShowModal.js` – показ диалога для ввода токена.
    - `TokenManager.js` – хранение токена в cookie.
    - `Utils.js` – вспомогательные методы (форматирование/парсинг).
    - `APIClient.js` – запросы к API Wildberries, с ретраями при ошибках.
    - `TableRenderer.js` – отрисовка и логика таблицы (пересчёт формул, сортировка).
    - `FilterController.js` – фильтрация по цене/остаткам и пр.
    - `ProfileController.js` – профили отображения колонок.
    - `ThemeManager.js` – тёмная/светлая тема.
    - `ExcelManager.js` – импорт/экспорт XLSX (с использованием библиотеки XLSX).
    - `App.js` – главный класс приложения (соединяет все модули).
    - `Main.js` – инициализация и запуск `App`.

## Зависимости

- jQuery
- js-cookie
- xlsx
- Bootstrap 5

## Подробное описание таблицы

Вся логика расчётов и отображения сведена в объекте `ColumnDetails` (см. файл `ColumnDetails.js`). Ниже приведена сводная таблица по всем колонкам с указанием ключа, названия, описания, формулы (если применяется), источника данных и информации о единице измерения или способе расчёта итогового значения:

| Ключ                         | Название                         | Описание                                                                                                                       | Формула                                                                                           | Источник | Единица измерения / Расчёт итоговой цифры                                   |
|------------------------------|----------------------------------|--------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------------------|
| **brand**                    | Бренд                            | Название бренда                                                                                                                | –                                                                                                 | API      | Текстовое значение (без единицы измерения)                                  |
| **title**                    | Название                         | Название товара                                                                                                                | –                                                                                                 | API      | Текстовое значение (без единицы измерения)                                  |
| **type**                     | Тип                              | Тип продаж: FBO, FBS, DBS                                                                                                        | –                                                                                                 | User     | Текстовое значение (без единицы измерения)                                  |
| **totalBatchAmount**         | Объем партии                     | Количество товара в партии                                                                                                     | –                                                                                                 | API      | Количество в партии ("ед-партия")                                           |
| **stockQuantity**            | Остаток                          | Количество товара на складе                                                                                                    | –                                                                                                 | API      | Количество в партии ("ед-партия")                                           |
| **costPrice**                | Стоимость закупки                | Закупочная цена товара (за 1 ед.)                                                                                               | –                                                                                                 | User     | Рубли за 1 ед.                                                             |
| **costUponArrival**          | Стоимость по приб.               | Стоимость товара при прибытии (за 1 ед.)                                                                                         | –                                                                                                 | User     | Рубли за 1 ед.                                                             |
| **ffPrice**                  | Цена ФФ                          | Общая сумма цены ФФ                                                                                                              | –                                                                                                 | User     | Рубли за 1 ед.                                                             |
| **deliveryToFF**             | Доставка до ФФ                   | Общая сумма доставки до ФФ                                                                                                       | –                                                                                                 | User     | Рубли за 1 ед.                                                             |
| **deliveryToWarehouse**      | Доставка до WB                   | Общая сумма доставки до WB                                                                                                       | –                                                                                                 | User     | Рубли за 1 ед.                                                             |
| **batchCost**                | Стоимость партии                 | Объем партии * стоимость закупки                                                                                               | totalBatchAmount * costPrice                                                                      | Formula  | Рубли за партию (итоговая сумма по партии)                                  |
| **batchCostAfterShipment**   | Стоимость партии после отгрузки  | Объем партии * (стоимость закупки + цена ФФ + доставка до ФФ + доставка до WB)                                                  | totalBatchAmount * (costPrice + ffPrice + deliveryToFF + deliveryToWarehouse)                     | Formula  | Рубли за партию (итоговая сумма по партии)                                  |
| **desiredSalePrice**         | Желаемая цена                    | Ориентировочная цена продажи (не участвует в расчетах)                                                                        | –                                                                                                 | User     | Рубли за 1 ед.                                                             |
| **priceBeforeDiscount**      | Цена до скидки                   | Цена товара до применения скидки                                                                                               | –                                                                                                 | API      | Рубли за 1 ед.                                                             |
| **sellerDiscount**           | Скидка продавца (%)              | Процент скидки от продавца                                                                                                       | –                                                                                                 | API      | Процент (%)                                                               |
| **priceAfterDiscount**       | Цена после скидки                | Цена до скидки минус скидка продавца                                                                                           | priceBeforeDiscount - (priceBeforeDiscount * sellerDiscount / 100)                                | Formula  | Рубли за 1 ед. (вычисляется на основе цены до скидки)                      |
| **wbDiscount**               | Скидка WB                        | Скидка Wildberries                                                                                                               | –                                                                                                 | API      | Процент (%)                                                               |
| **priceForClientWithDiscount**| Цена для клиента                | Итоговая цена для клиента                                                                                                        | –                                                                                                 | API      | Рубли за 1 ед.                                                             |
| **dimensions**               | Размеры (см)                     | Габариты товара                                                                                                                  | –                                                                                                 | API      | Сантиметры (формат: длина x ширина x высота)                               |
| **weightBrutto**             | Вес (кг)                         | Вес товара брутто                                                                                                                | –                                                                                                 | API      | Килограммы                                                                 |
| **marketplaceCommissionPercentage** | Комиссия (%)            | Процент комиссии маркетплейса                                                                                                    | –                                                                                                 | API      | Процент (%)                                                               |
| **marketplaceCommission**    | Комиссия (руб)                   | Цена для клиента * процент комиссии / 100                                                                                      | priceForClientWithDiscount * marketplaceCommissionPercentage / 100                                | Formula  | Рубли за 1 ед. (итоговая комиссия на единицу)                              |
| **wbAdditionalExpenses**     | Расходы WB (%)                   | Общая сумма расходов WB (в рублях)                                                                                               | –                                                                                                 | User     | Процент (%)                                                               |
| **wbAdditionalExpensesRub**  | Расходы WB (руб)                 | Цена для клиента × (Расходы WB (%) / 100)                                                                                        | priceForClientWithDiscount * wbAdditionalExpenses / 100                                           | Formula  | Рубли за 1 ед. (итоговое значение расходов WB на единицу)                  |
| **logisticsCost**            | Логистика                        | Логистика = (Коэффициент склада × Вес товара × Объем партии × (Процент хранения/100))                                            | warehouseCoeff * weightBrutto * totalBatchAmount * (paidStorageKgvp / 100)                         | Formula  | Рубли за партию (итоговая логистика; при расчёте себестоимости делится на объем) |
| **advertising**              | Реклама                          | Расходы на рекламу (за 1 ед.)                                                                                                    | –                                                                                                 | User     | Рубли за 1 ед.                                                             |
| **additionalExpenses**       | Доп. расходы                     | Общая сумма дополнительных расходов                                                                                            | –                                                                                                 | User     | Рубли за 1 ед. (если применяется к единице товара)                        |
| **selfPurchases**            | Самовыкупы                       | Самовыкупы (за 1 ед.)                                                                                                            | –                                                                                                 | User     | Рубли за 1 ед.                                                             |
| **taxPercentage**            | Налог (%)                        | Процент налога (1 или 6)                                                                                                           | –                                                                                                 | User     | Процент (%)                                                               |
| **tax**                      | Налог (руб)                      | Цена для клиента * налоговый процент / 100                                                                                    | priceForClientWithDiscount * taxPercentage / 100                                                  | Formula  | Рубли за 1 ед. (итоговый налог на единицу)                                 |
| **costPerUnit**              | Себестоимость на 1 ед.           | batchCost / totalBatchAmount                                                                                                     | batchCost / totalBatchAmount                                                                       | Formula  | Рубли за 1 ед.                                                             |
| **finalCostPrice**           | Конечная себестоимость           | costPerUnit + marketplaceCommission + logisticsCost + advertising + additionalExpenses + selfPurchases + returnCost + tax       | costPerUnit + marketplaceCommission + logisticsCost + advertising + additionalExpenses + selfPurchases + returnCost + tax | Formula  | Рубли за 1 ед. (итоговая себестоимость на единицу товара)                  |
| **purchasePickupReview**     | Покупка/самовывоз                | Покупки/Самовывоз                                                                                                                | –                                                                                                 | API      | Рубли (общая сумма; применяется к партии)                                |
| **returnCost**               | Возврат                          | Стоимость возврата товара (сумма по всем складам)                                                                               | –                                                                                                 | API      | Рубли (общая сумма)                                                       |
| **purchasePercentage**       | Процент покупки                  | Процент покупки                                                                                                                  | –                                                                                                 | API      | Процент (%)                                                               |
| **margin**                   | Маржа (%)                        | ((Цена для клиента - конечная себестоимость) / цена для клиента) * 100                                                         | ((priceForClientWithDiscount - finalCostPrice) / priceForClientWithDiscount) * 100                 | Formula  | Процент (%) (итоговая маржа на единицу товара)                             |
| **netProfit**                | Прибыль                          | (Цена для клиента - конечная себестоимость) * объем партии                                                                     | (priceForClientWithDiscount - finalCostPrice) * totalBatchAmount                                   | Formula  | Рубли за партию (итоговая прибыль по партии)                              |
| **netProfitPerUnit**         | Прибыль на ед.                   | Цена для клиента - конечная себестоимость                                                                                       | priceForClientWithDiscount - finalCostPrice                                                        | Formula  | Рубли за 1 ед. (итоговая прибыль на единицу товара)                        |

> **Примечания:**
> - Колонки с источником **Formula** вычисляются итеративно (до достижения сходимости) на основе текущих значений других полей.
> - Если значение задаётся напрямую из API или ввода пользователя, единица измерения указывается как "Рубли за 1 ед." или "Количество в партии", соответственно.
> - Для процентных значений единица измерения – "%", а текстовые поля не имеют единицы измерения.
> - При расчётах, если итоговое значение определяется для всей партии (например, batchCost), оно указано "за партию", а если для одной единицы – "за 1 ед.".

## Дополнительная информация

- **Источники данных:**
    - **API:** данные, получаемые из запросов к Wildberries (например, цена, скидки, остатки, комиссии).
    - **User:** данные, вводимые вручную (например, закупочная цена, расходы на рекламу).
    - **Formula:** вычисляемые значения на основании других полей (описаны в соответствующих формулах).

- **Формулы:**  
  Формулы заданы как строки в объекте `ColumnDetails`. При пересчёте таблицы метод `recalcRow` берет текущее значение из ячеек и вычисляет новые значения с помощью формул. Расчет производится итеративно до сходимости.

- **Единица измерения:**  
  Все расчеты проводятся для одной единицы товара или партии, в зависимости от логики конкретной колонки. Эта информация отражена в столбце «Единица измерения / Расчёт итоговой цифры».

 
