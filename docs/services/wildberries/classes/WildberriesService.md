[**WB Calculator Documentation v0.0.0**](../../../README.md)

***

[WB Calculator Documentation](../../../README.md) / [services/wildberries](../README.md) / WildberriesService

# Class: WildberriesService

Defined in: [services/wildberries.ts:22](https://github.com/MitrofanKaufman/unitcalc/blob/46369bebdb436c227fb4c58fb7e6af58af7c90ab/app/web/src/services/wildberries.ts#L22)

Сервис для интеграции с API Wildberries

Предоставляет методы для:
- Поиска товаров через официальное API WB
- Получения подсказок поиска
- Получения детальной информации о товаре
- Генерации URL изображений товаров

## Example

```typescript
// Поиск товаров
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

### fetchSuggestions()

> `static` **fetchSuggestions**(`query`): `Promise`\<`string`[]\>

Defined in: [services/wildberries.ts:23](https://github.com/MitrofanKaufman/unitcalc/blob/46369bebdb436c227fb4c58fb7e6af58af7c90ab/app/web/src/services/wildberries.ts#L23)

#### Parameters

##### query

`string`

#### Returns

`Promise`\<`string`[]\>

***

### fetchProducts()

> `static` **fetchProducts**(`query`, `onProgressCallback?`): `Promise`\<`any`[]\>

Defined in: [services/wildberries.ts:38](https://github.com/MitrofanKaufman/unitcalc/blob/46369bebdb436c227fb4c58fb7e6af58af7c90ab/app/web/src/services/wildberries.ts#L38)

Получает список товаров по запросу с отслеживанием прогресса

#### Parameters

##### query

`string`

Поисковый запрос

##### onProgressCallback?

(`current`, `total`) => `void`

Колбек для отслеживания прогресса (текущий шаг, всего шагов)

#### Returns

`Promise`\<`any`[]\>

***

### getImageUrl()

> `static` **getImageUrl**(`productId`): `string`

Defined in: [services/wildberries.ts:122](https://github.com/MitrofanKaufman/unitcalc/blob/46369bebdb436c227fb4c58fb7e6af58af7c90ab/app/web/src/services/wildberries.ts#L122)

#### Parameters

##### productId

`number`

#### Returns

`string`

***

### getProductById()

> `static` **getProductById**(`id`): `Promise`\<`any`\>

Defined in: [services/wildberries.ts:127](https://github.com/MitrofanKaufman/unitcalc/blob/46369bebdb436c227fb4c58fb7e6af58af7c90ab/app/web/src/services/wildberries.ts#L127)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<`any`\>
