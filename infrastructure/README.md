# 📦 infrastructure/

## 🎯 Назначение

Папка содержит **инфраструктуру** проекта - базы данных, логирование, мониторинг, безопасность и инструменты развертывания.

## 📋 Содержимое

### Инфраструктурные компоненты
- `database/` - 💾 Базы данных и миграции
- `logging/` - 📝 Система логирования
- `monitoring/` - 📊 Мониторинг и алертинг
- `deployment/` - 🚀 Инструменты развертывания
- `security/` - 🔒 Безопасность и аутентификация

## 🏗️ Архитектура инфраструктуры

### Database (Базы данных)
```
database/
├── migrations/          # 🗂️  Миграции БД
│   ├── 001_initial.sql  # 🏁 Начальная миграция
│   ├── 002_add_users.sql # 👥 Пользователи
│   └── 003_add_products.sql # 📦 Товары
├── seeds/               # 🌱 Начальные данные
│   ├── development.sql  # 🧪 Данные для разработки
│   └── production.sql   # 🚀 Данные для продакшена
├── schemas/             # 📋 Схемы БД
│   ├── main.sql         # 🏠 Основная схема
│   └── analytics.sql    # 📊 Схема аналитики
└── backups/             # 💾 Резервные копии
    └── scripts/         # 📜 Скрипты бэкапа
```

### Logging (Логирование)
```
logging/
├── config/              # ⚙️  Конфигурация
│   ├── winston.ts       # 🏆 Winston конфигурация
│   └── transports.ts    # 📦 Транспорты логов
├── handlers/            # 🔧 Обработчики
│   ├── console.ts       # 🖥️  Консольный обработчик
│   ├── file.ts          # 📁 Файловый обработчик
│   └── remote.ts        # 🌐 Удаленный обработчик
└── filters/             # 🔍 Фильтры
    ├── level.ts         # 📊 Фильтр по уровню
    └── sensitive.ts     # 🔒 Фильтр конфиденциальных данных
```

### Monitoring (Мониторинг)
```
monitoring/
├── metrics/             # 📈 Метрики
│   ├── system.ts        # 🖥️  Системные метрики
│   ├── business.ts      # 💼 Бизнес-метрики
│   └── performance.ts   # ⚡ Метрики производительности
├── alerts/              # 🚨 Оповещения
│   ├── email.ts         # 📧 Email оповещения
│   ├── slack.ts         # 💬 Slack оповещения
│   └── sms.ts           # 📱 SMS оповещения
└── dashboards/          # 📊 Дашборды
    ├── grafana.json     # 📊 Grafana дашборд
    └── prometheus.yml   # 📈 Prometheus конфигурация
```

### Deployment (Деплой)
```
deployment/
├── docker/              # 🐳 Docker
│   ├── web.Dockerfile   # 🌐 Dockerfile для веб-приложения
│   ├── api.Dockerfile   # 🔌 Dockerfile для API
│   └── nginx.conf       # 🌐 Nginx конфигурация
├── k8s/                 # ☸️  Kubernetes
│   ├── deployment.yaml  # 🚀 Deployment манифесты
│   ├── service.yaml     # 🌐 Service манифесты
│   └── ingress.yaml     # 🛣️  Ingress манифесты
└── scripts/             # 📜 Скрипты деплоя
    ├── deploy.sh        # 🚀 Скрипт деплоя
    └── rollback.sh      # ⏪ Скрипт отката
```

### Security (Безопасность)
```
security/
├── auth/                # 🔐 Аутентификация
│   ├── jwt.ts           # 🔑 JWT утилиты
│   ├── middleware.ts    # 🛡️  Middleware аутентификации
│   └── strategies.ts    # 🎯 Стратегии аутентификации
├── encryption/          # 🔐 Шифрование
│   ├── aes.ts           # 🔒 AES шифрование
│   ├── rsa.ts           # 🔑 RSA шифрование
│   └── hash.ts          # #️⃣ Хеширование
└── firewall/            # 🛡️  Файрвол
    ├── rules.ts         # 📋 Правила файрвола
    └── middleware.ts    # 🛡️  Middleware файрвола
```

## 🚀 Использование инфраструктуры

### Инициализация базы данных
```bash
# Запуск миграций
cd infrastructure/database
npm run migrate

# Загрузка seed данных
npm run seed
```

### Настройка логирования
```typescript
import { logger } from '@wb-calc/logging'

logger.info('Сообщение', { userId: 123 })
logger.error('Ошибка', { error: err })
```

### Мониторинг
```bash
# Запуск Prometheus
cd infrastructure/monitoring
docker-compose up prometheus

# Grafana дашборды
open http://localhost:3000
```

## 🔧 Конфигурация

### Переменные окружения
```bash
# База данных
DATABASE_URL=postgresql://user:pass@localhost:5432/wbcalc
REDIS_URL=redis://localhost:6379

# Логирование
LOG_LEVEL=info
LOG_FILE=/var/log/wbcalc.log

# Мониторинг
PROMETHEUS_PORT=9090
GRAFANA_PORT=3000

# Безопасность
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-encryption-key
```

### Настройка Docker
```yaml
# docker-compose.infrastructure.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: wbcalc
      POSTGRES_USER: wbcalc
      POSTGRES_PASSWORD: password
  redis:
    image: redis:7-alpine
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
```

## 📊 Мониторинг и алертинг

### Метрики
- **Системные**: CPU, Memory, Disk, Network
- **Приложения**: Response time, Throughput, Error rate
- **Бизнес**: Active users, Revenue, Conversion

### Алерты
- **Критические**: Сервис недоступен, Высокая ошибка
- **Важные**: Высокая нагрузка, Медленный ответ
- **Информационные**: Новые пользователи, Пиковые нагрузки

## 🔒 Безопасность

### Аутентификация
- **JWT токены** - stateless аутентификация
- **OAuth 2.0** - интеграция с внешними сервисами
- **2FA** - двухфакторная аутентификация

### Шифрование
- **AES-256** - шифрование данных в покое
- **TLS 1.3** - шифрование в транзите
- **bcrypt** - хеширование паролей

### Мониторинг безопасности
- **Аудит логов** - отслеживание подозрительной активности
- **Rate limiting** - защита от DDoS
- **Input validation** - валидация всех входных данных

## 🚀 Деплой

### Разработка
```bash
# Локальный запуск инфраструктуры
cd infrastructure
docker-compose up -d

# Инициализация БД
npm run db:setup
```

### Продакшн
```bash
# Деплой в Kubernetes
kubectl apply -f infrastructure/k8s/

# Проверка здоровья
kubectl get pods -l app=wb-calc
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
- name: Deploy Infrastructure
  run: |
    kubectl apply -f infrastructure/k8s/
    kubectl rollout status deployment/api-gateway
```

---

*Последнее обновление: Январь 2025*
