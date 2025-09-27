// \packages\ui\README.md
// README для дизайн-системы UI библиотеки
// Содержит компоненты, токены и темы для единого стиля приложения

# 📦 packages/ui/

## 🎯 Назначение

Библиотека **дизайн-системы** - переиспользуемые UI компоненты, дизайн-токены и темы для обеспечения консистентного пользовательского интерфейса.

## 📋 Содержимое

### Компоненты
- `components/` - 🧩 Базовые UI компоненты
- `tokens/` - 🎯 Дизайн-токены (цвета, отступы, типографика)
- `themes/` - 🌙 Темы (светлая, темная)
- `utils/` - 🔧 Утилиты для стилизации

## 🚀 Использование

```typescript
import { Button, Card, Input } from '@wb-calc/ui'

function MyComponent() {
  return (
    <Card>
      <Button variant="primary">Кнопка</Button>
      <Input placeholder="Ввод текста" />
    </Card>
  )
}
```

## 🎨 Дизайн-токены

```typescript
// Цвета
export const colors = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
  error: '#ef4444'
}

// Отступы
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem'
}

// Типографика
export const typography = {
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem'
  }
}
```

## 📦 Публикация

```bash
cd packages/ui
npm publish
```

---

*Последнее обновление: Январь 2025*
