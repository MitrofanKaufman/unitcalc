[**WB Calculator Documentation v0.0.0**](../../../README.md)

***

[WB Calculator Documentation](../../../README.md) / [components/ProductCard](../README.md) / ProductCard

# Variable: ProductCard

> `const` **ProductCard**: `React.FC`\<[`ProductCardProps`](../interfaces/ProductCardProps.md)\>

Defined in: [components/ProductCard.tsx:41](https://github.com/MitrofanKaufman/unitcalc/blob/46369bebdb436c227fb4c58fb7e6af58af7c90ab/app/web/src/components/ProductCard.tsx#L41)

Компонент карточки товара для отображения в результатах поиска

Отображает информацию о товаре включая изображение, название, бренд,
цену, рейтинг и доступность. Предоставляет кнопки действий для расчета
доходности и добавления в избранное.

## Param

проперти компонента карточки товара

## Param

объект товара с полной информацией

## Returns

JSX элемент карточки товара

## Example

```tsx
const product = {
  id: 123,
  name: 'Смартфон Samsung Galaxy',
  price: 25000,
  rating: 4.5,
  image: 'https://example.com/image.jpg',
  images: ['https://example.com/image1.jpg'],
  brand: 'Samsung',
  seller: { id: 1, name: 'Магазин', rating: 4.8 },
  feedbacks: 150,
  inStock: true
};

<ProductCard product={product} />
```
