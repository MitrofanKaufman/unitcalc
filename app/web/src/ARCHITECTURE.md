# 🏗️ Архитектура и стандарты Marketplace Calculator

## 📁 Структура проекта

### Общая структура клиентской части
```
client/src/
├── components/
│   ├── common/           # Общие переиспользуемые компоненты
│   │   ├── PageHeader/   # Заголовок страницы с действиями
│   │   ├── SearchBar/    # Поисковая панель
│   │   ├── DataTable/    # Таблица данных
│   │   ├── Form/         # Формы ввода
│   │   ├── Loading/      # Индикаторы загрузки
│   │   └── Error/        # Обработка ошибок
│   ├── features/         # Функциональные модули (страницы)
│   │   ├── calculator/   # Калькулятор доходности
│   │   ├── admin/        # Админ панель
│   │   └── [feature]/    # Другие функциональные модули
│   ├── layout/          # Layout и навигация
│   └── ui/             # Базовые UI элементы
├── hooks/              # Кастомные React хуки
├── services/           # API сервисы и бизнес-логика
├── stores/             # Управление состоянием (Zustand)
├── types/              # TypeScript типы и интерфейсы
├── utils/              # Вспомогательные функции
└── constants/          # Константы приложения
```

## 📄 Стандарты разметки страниц

### Структура каждой страницы (Page Layout Standard)

```tsx
// [FeatureName].tsx
import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchBar } from '@/components/common/SearchBar';

export function FeatureName() {
  return (
    <Container maxWidth="lg">
      {/* Заголовок страницы с действиями */}
      <PageHeader
        title="Название страницы"
        subtitle="Описание функционала"
        actions={[
          { label: 'Добавить', icon: <AddIcon />, onClick: handleAdd },
          { label: 'Экспорт', icon: <ExportIcon />, onClick: handleExport }
        ]}
      />

      {/* Поиск и фильтры */}
      <SearchBar
        placeholder="Поиск..."
        onSearch={handleSearch}
        filters={[
          { key: 'category', label: 'Категория', options: categories },
          { key: 'status', label: 'Статус', options: statuses }
        ]}
      />

      {/* Основной контент */}
      <Box sx={{ mt: 3 }}>
        <Paper elevation={1} sx={{ p: 3 }}>
          {/* Конкретный контент страницы */}
          <Typography variant="h6">Основной контент</Typography>
          {/* ... */}
        </Paper>
      </Box>
    </Container>
  );
}
```

### Стандарты компонентов

#### 1. PageHeader (Заголовок страницы)
```tsx
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
  }>;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}
```

#### 2. SearchBar (Поисковая панель)
```tsx
interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
  filters?: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
    defaultValue?: string;
  }>;
  showAdvanced?: boolean;
}
```

#### 3. DataTable (Таблица данных)
```tsx
interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
    sortable?: boolean;
    width?: number;
  }>;
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
    color?: 'primary' | 'secondary' | 'error';
  }>;
}
```

## 🎨 Дизайн-стандарты

### Цветовая палитра
```css
/* Primary Colors */
--primary-main: #1976d2;
--primary-light: #42a5f5;
--primary-dark: #1565c0;

/* Status Colors */
--success-main: #4caf50;
--warning-main: #ff9800;
--error-main: #f44336;
--info-main: #2196f3;

/* Neutral Colors */
--background-default: #fafafa;
--background-paper: #ffffff;
--text-primary: #212121;
--text-secondary: #757575;
```

### Типографика
```css
/* Headings */
--font-size-h1: 2.5rem;    /* 40px */
--font-size-h2: 2rem;      /* 32px */
--font-size-h3: 1.75rem;   /* 28px */
--font-size-h4: 1.5rem;    /* 24px */
--font-size-h5: 1.25rem;   /* 20px */
--font-size-h6: 1rem;      /* 16px */

/* Body text */
--font-size-body1: 1rem;   /* 16px */
--font-size-body2: 0.875rem; /* 14px */
--font-size-caption: 0.75rem; /* 12px */
```

### Отступы и размеры
```css
/* Spacing Scale */
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
--spacing-2xl: 3rem;    /* 48px */

/* Component Heights */
--height-input: 3.5rem;      /* 56px */
--height-button: 3rem;       /* 48px */
--height-header: 4rem;       /* 64px */
```

## 📂 Структура функционального модуля

### Стандартная структура feature-модуля
```
features/[feature-name]/
├── components/           # Компоненты конкретной страницы
│   ├── [FeatureName]Form.tsx      # Форма создания/редактирования
│   ├── [FeatureName]List.tsx      # Список элементов
│   ├── [FeatureName]Card.tsx      # Карточка элемента
│   └── [FeatureName]Filters.tsx   # Фильтры и поиск
├── hooks/               # Хуки для этой страницы
│   └── use[FeatureName].ts
├── services/            # API сервисы для этой страницы
│   └── [featureName]Service.ts
├── types/               # Типы для этой страницы
│   └── [featureName]Types.ts
├── utils/               # Утилиты для этой страницы
│   └── [featureName]Utils.ts
└── [FeatureName].tsx    # Главный компонент страницы
```

### Пример структуры для калькулятора доходности
```
features/calculator/
├── components/
│   ├── CalculatorForm.tsx      # Форма ввода данных
│   ├── CalculatorResults.tsx   # Результаты расчетов
│   ├── CalculatorChart.tsx     # Графики и диаграммы
│   └── CalculatorHistory.tsx   # История расчетов
├── hooks/
│   └── useCalculator.ts        # Логика калькулятора
├── services/
│   └── calculatorService.ts    # API для расчетов
├── types/
│   └── calculatorTypes.ts      # Типы для калькулятора
├── utils/
│   └── calculationUtils.ts     # Математические функции
└── Calculator.tsx              # Главная страница калькулятора
```

## 🔧 Правила именования

### Файлы и компоненты
- PascalCase для компонентов: `CalculatorForm.tsx`
- camelCase для утилит и хуков: `calculationUtils.ts`, `useCalculator.ts`
- kebab-case для CSS модулей: `calculator-form.module.css`

### Переменные и функции
- camelCase для переменных и функций
- UPPER_SNAKE_CASE для констант
- PascalCase для классов и интерфейсов

### Директории
- kebab-case для директорий: `calculator-form/`
- camelCase для файлов в директориях

## 📋 Шаблоны кода

### Шаблон компонента страницы
```tsx
import React from 'react';
import { Container } from '@mui/material';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchBar } from '@/components/common/SearchBar';

interface [FeatureName]Props {}

export function [FeatureName]({}: [FeatureName]Props) {
  return (
    <Container maxWidth="lg">
      <PageHeader
        title="[Название страницы]"
        subtitle="[Описание функционала]"
      />

      <SearchBar
        placeholder="Поиск..."
        onSearch={handleSearch}
      />

      {/* Основной контент */}
    </Container>
  );
}
```

### Шаблон кастомного хука
```tsx
import { useState, useCallback } from 'react';

export function use[FeatureName]() {
  const [state, setState] = useState(initialState);

  const handleAction = useCallback((data: Type) => {
    // Логика
  }, []);

  return {
    state,
    handleAction,
  };
}
```

## 🚀 Лучшие практики

### 1. Разделение ответственности
- Каждый компонент должен иметь одну ответственность
- Логика должна быть в хуках или сервисах
- UI компоненты должны быть максимально глупыми

### 2. Переиспользование
- Создавать общие компоненты для повторяющихся паттернов
- Использовать composition over inheritance
- Избегать дублирования кода

### 3. Производительность
- Использовать React.memo для дорогих компонентов
- Избегать inline объектов в render
- Использовать useMemo и useCallback где нужно

### 4. Доступность
- Все интерактивные элементы должны быть доступны через клавиатуру
- Использовать семантические HTML элементы
- Добавлять ARIA labels где нужно

## 📚 Документация компонентов

Каждый компонент должен иметь JSDoc комментарии:

```tsx
/**
 * Компонент для отображения карточки товара
 *
 * @param product - Данные товара для отображения
 * @param onEdit - Функция вызываемая при редактировании
 * @param onDelete - Функция вызываемая при удалении
 * @returns JSX элемент карточки товара
 */
export function ProductCard({
  product,
  onEdit,
  onDelete
}: ProductCardProps) {
  // ...
}
```

---

*Этот документ определяет стандарты разработки для Marketplace Calculator и должен соблюдаться всеми участниками команды.*
