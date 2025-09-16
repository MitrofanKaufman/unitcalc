# UI-компоненты

## Библиотеки

| Библиотека | Назначение |
|------------|-----------|
| Radix UI | Доступные примитивы (Dialog, Tooltip, Dropdown) |
| Framer Motion | Анимации появления/скрытия |
| Headless UI | Неконтролируемые компоненты без стилей |
| Lucide-react | Иконки |

## Принципы стилизации

1. TailwindCSS + CSS-modules → быстрый прототип, легко переопределить.
2. Dark / Light тема через data-theme и `:root {...}` переменные.
3. Layout-компоненты (`Container`, `Grid`, `Flex`) в `src/components/layouts/`.

## Каталог компонентов

| Категория | Путь | Кратко |
|-----------|------|--------|
| Карточки | `components/ui/ProductCard.tsx` | Превью товара |
| Формы | `components/ui-neu/neu-input.tsx` | Неоморфные поля ввода |
| Кнопки | `components/ui-neu/neu-button.tsx` | Primary / Secondary |
| Modal | `components/ui/alert-dialog.tsx` | Подтверждения |

## Порядок импорта

```tsx
import { NeuButton } from '@ui-neu/neu-button';
```

## Пример использования

```tsx
<NeuCard>
  <ProductCard product={p} />
  <NeuButton onClick={() => addToCart(p)}>Добавить</NeuButton>
</NeuCard>
```

## Пример использования (расширенный)

```tsx
import { NeuCard, NeuButton } from '@/components/ui-neu';
import { ShoppingCart } from 'lucide-react';

function ProductTile({ product }) {
  return (
    <NeuCard className="max-w-sm p-4 flex flex-col gap-3">
      <ProductCard product={product} />

      <div className="flex justify-between items-center">
        <NeuButton onClick={() => addToCart(product)}>
          <ShoppingCart size={18} className="mr-2" />
          Добавить
        </NeuButton>
        <span className="text-xl font-semibold text-primary">
          {product.price} ₽
        </span>
      </div>
    </NeuCard>
  );
}
```

## Галерея компонентов

| Компонент | Скриншот |
|-----------|----------|
| NeuButton | ![NeuButton](../public/docs/screenshots/neu-button.png) |
| NeuCard   | ![NeuCard](../public/docs/screenshots/neu-card.png) |
| ProductCard | ![ProductCard](../public/docs/screenshots/product-card.png) |

> Скриншоты генерируются Storybook (`npm run storybook:build`) и автоматически копируются в `public/docs/screenshots` через скрипт `scripts/export-storybook-assets.js`.
