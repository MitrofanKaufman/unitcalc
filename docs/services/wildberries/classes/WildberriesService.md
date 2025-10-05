[**WB Calculator Documentation v0.0.0**](../../../README.md)

***

[WB Calculator Documentation](../../../README.md) / [services/wildberries](../README.md) / WildberriesService

# Class: WildberriesService

Defined in: services/wildberries.ts:22

Сервис для интеграции с API Wildberries

Предоставляет методы для:
- Поиска товаров через официальное API WB
- Получения подсказок поиска
- Получения детальной информации о товаре
- Генерации URL изображений товаров

## Example

```typescript
// Поиск товаров
const products = await WildberriesService.fetchProducts('смартфон');

// Получение подсказок
const suggestions = await WildberriesService.fetchSuggestions('смартф');

// Получение товара по ID
const product = await WildberriesService.getProductById(123456);
```

## Constructors

### Constructor

> **new WildberriesService**(): `WildberriesService`

#### Returns

`WildberriesService`

## Methods

### fetchProducts()

> `static` **fetchProducts**(`query`, `onProgressCallback?`): `Promise`\<`any`\>

Defined in: services/wildberries.ts:38

Получает список товаров по запросу с отслеживанием прогресса

#### Parameters

##### query

`string`

Поисковый запрос (название товара)

##### onProgressCallback?

(`current`, `total`) => `void`

Колбек для отслеживания прогресса (текущий шаг, всего шагов)

#### Returns

`Promise`\<`any`\>

Promise с массивом товаров или пустым массивом в случае ошибки

#### Throws

При ошибке сети или некорректном ответе API

#### Example

```typescript
const products = await WildberriesService.fetchProducts(
  'смартфон Samsung',
  (current, total) => console.log(`${current}/${total}`)
);
```

***

### fetchSuggestions()

> `static` **fetchSuggestions**(`query`): `Promise`\<`string`[]\>

Defined in: services/wildberries.ts:112

Получает подсказки поиска для автодополнения

#### Parameters

##### query

`string`

Начало поискового запроса

#### Returns

`Promise`\<`string`[]\>

Promise с массивом строк подсказок

#### Throws

При ошибке сети или некорректном ответе API

***

### getImageUrl()

> `static` **getImageUrl**(`productId`): `string`

Defined in: services/wildberries.ts:135

Генерирует URL изображения товара по его ID

#### Parameters

##### productId

`number`

ID товара

#### Returns

`string`

URL изображения товара в формате WebP

#### Example

```typescript
const imageUrl = WildberriesService.getImageUrl(123456);
// "https://basket-01.wb.ru/vol1/part1/12/123456/images/c516x688/1.webp"
```

***

### getProductById()

> `static` **getProductById**(`id`): `Promise`\<`any`\>

Defined in: services/wildberries.ts:146

Получает детальную информацию о товаре по ID

#### Parameters

##### id

`number`

ID товара

#### Returns

`Promise`\<`any`\>

Promise с объектом товара или null в случае ошибки

#### Throws

При ошибке сети или отсутствии товара
