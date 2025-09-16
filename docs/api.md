# API

> Версия: v1

## 🚏 Базовый URL

```
http://localhost:3000/api/v1
```

## 🔐 Авторизация

| Тип | Заголовок | Описание |
|-----|-----------|----------|
| Bearer Token | `Authorization: Bearer <token>` | JWT, получают через `/auth/login` |

## 📬 Эндпоинты

> В примерах запросы показаны через `curl`. Все ответы в формате `application/json`.

### 🔑 Авторизация

`POST /auth/login`

```jsonc
// body
{
  "email": "user@example.com",
  "password": "secret"
}
```

Ответ `200 OK`:

```jsonc
{
  "token": "<jwt>",
  "expiresIn": 3600
}
```

```bash
curl -X POST "$BASE/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"secret"}'
```

---

### Получить расчёт рентабельности

`POST /calculate`

```jsonc
{
  "productId": 123,
  "purchasePrice": 350,
  "sellingPrice": 599,
  "model": "FBO" // или FBS
}
```

Ответ:

```jsonc
{
  "roi": 0.42,
  "margin": 0.23,
  "breakeven": 128,
  "feeBreakdown": {
    "wbCommission": 0.25,
    "fulfillment": 45,
    "logistics": 38
  }
}
```

### Поиск товаров

`GET /products/search?q=кроссовки&page=1`

Ответ укорочен:

```jsonc
{
  "items": [
    { "id": 123, "name": "Кроссовки ABC", "price": 2999 },
    { "id": 124, "name": "Кроссовки XYZ", "price": 3499 }
  ],
  "total": 87,
  "page": 1,
  "pageSize": 20
}
```

### Получить детали товара

`GET /products/:id`

```bash
curl "$BASE/products/123"
```

Ответ `200`:

```jsonc
{
  "id": 123,
  "name": "Кроссовки ABC",
  "brand": "ABC",
  "category": "Обувь",
  "price": 2999,
  "rating": 4.7,
  "images": ["/img/123/1.jpg", "/img/123/2.jpg"]
}
```

### Получить историю вычислений

`GET /history?limit=20&offset=0`

Ответ `200`:

```jsonc
{
  "items": [
    { "id": 1, "productId": 123, "roi": 0.42, "createdAt": "2025-08-16T12:00:00Z" }
  ],
  "total": 57
}
```

### Схема ошибок

| Код | Сообщение | Описание |
|-----|-----------|----------|
| 401 | `UNAUTHORIZED` | Неверный токен или срок действия истёк |
| 403 | `FORBIDDEN` | Недостаточно прав |
| 400 | `VALIDATION_ERROR` | Ошибка валидации входных данных |
| 404 | `NOT_FOUND` | Ресурс не найден |
| 500 | `INTERNAL_ERROR` | Непредвиденная ошибка сервера |
