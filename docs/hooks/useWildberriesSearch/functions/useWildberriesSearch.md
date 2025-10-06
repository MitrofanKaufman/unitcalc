[**WB Calculator Documentation v0.0.0**](../../../README.md)

***

[WB Calculator Documentation](../../../README.md) / [hooks/useWildberriesSearch](../README.md) / useWildberriesSearch

# Function: useWildberriesSearch()

> **useWildberriesSearch**(): `object`

Defined in: [hooks/useWildberriesSearch.ts:44](https://github.com/MitrofanKaufman/unitcalc/blob/46369bebdb436c227fb4c58fb7e6af58af7c90ab/app/web/src/hooks/useWildberriesSearch.ts#L44)

Кастомный хук для управления поиском товаров Wildberries

Обеспечивает:
- Управление состоянием поиска и загрузки
- Автоматическое получение подсказок
- Обработку ошибок сети
- Кеширование результатов
- Пагинацию результатов

## Returns

### products

> **products**: [`Product`](../interfaces/Product.md)[]

### suggestions

> **suggestions**: `string`[]

### isLoading

> **isLoading**: `boolean`

### isSearching

> **isSearching**: `boolean`

### progress

> **progress**: `object`

#### progress.current

> **current**: `number`

#### progress.total

> **total**: `number`

### error

> **error**: `null` \| `string`

### query

> **query**: `string`

### currentPage

> **currentPage**: `number`

### hasMoreProducts

> **hasMoreProducts**: `boolean`

### searchProducts()

> **searchProducts**: (`query`) => `Promise`\<`void`\>

Выполняет поиск товаров по запросу с отслеживанием прогресса

#### Parameters

##### query

`string`

Поисковый запрос

#### Returns

`Promise`\<`void`\>

### fetchSuggestions()

> **fetchSuggestions**: (`query`) => `Promise`\<`void`\>

Получает подсказки поиска для автодополнения

#### Parameters

##### query

`string`

Начало поискового запроса

#### Returns

`Promise`\<`void`\>

### clearSearch()

> **clearSearch**: () => `void`

Очищает результаты поиска

#### Returns

`void`

### retrySearch()

> **retrySearch**: () => `void`

Повторяет последний поиск при ошибке

#### Returns

`void`

### loadMoreProducts()

> **loadMoreProducts**: () => `Promise`\<`void`\>

Загружает дополнительные товары для текущего поиска

#### Returns

`Promise`\<`void`\>
