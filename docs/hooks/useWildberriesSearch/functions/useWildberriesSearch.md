[**WB Calculator Documentation v0.0.0**](../../../README.md)

***

[WB Calculator Documentation](../../../README.md) / [hooks/useWildberriesSearch](../README.md) / useWildberriesSearch

# Function: useWildberriesSearch()

> **useWildberriesSearch**(): `object`

Defined in: hooks/useWildberriesSearch.ts:61

Кастомный хук для управления поиском товаров Wildberries

Обеспечивает:
- Управление состоянием поиска и загрузки
- Автоматическое получение подсказок
- Обработку ошибок сети
- Кеширование результатов

## Returns

Объект с состоянием поиска и функциями управления

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

## Example

```typescript
const {
  products,
  suggestions,
  isSearching,
  searchProducts,
  fetchSuggestions
} = useWildberriesSearch();

// Поиск товаров
const handleSearch = (query: string) => {
  searchProducts(query);
};
```
