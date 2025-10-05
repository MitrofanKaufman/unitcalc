// \packages\config\src\index.ts
// Единая система конфигурации для WB Marketplace Calculator

import { z } from 'zod'
import { config } from 'dotenv'

// Загружаем переменные окружения
config()

// Схемы валидации для конфигурации
export const configSchemas = {
  // API настройки
  api: z.object({
    baseUrl: z.string().url(),
    timeout: z.number().min(1000).max(60000).default(10000),
    retries: z.number().min(0).max(5).default(3),
    rateLimit: z.object({
      windowMs: z.number().min(60000).default(900000), // 15 минут
      maxRequests: z.number().min(1).max(1000).default(100)
    }).default({
      windowMs: 900000,
      maxRequests: 100
    })
  }),

  // UI настройки
  ui: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    language: z.string().default('ru'),
    animations: z.boolean().default(true),
    mobileOptimizations: z.boolean().default(true),
    pwa: z.object({
      enabled: z.boolean().default(true),
      cacheStrategy: z.enum(['cache-first', 'network-first']).default('cache-first'),
      offlineSupport: z.boolean().default(true)
    }).default({
      enabled: true,
      cacheStrategy: 'cache-first' as const,
      offlineSupport: true
    })
  }),

  // Бизнес настройки для расчета доходности
  business: z.object({
    // Валюты и курсы
    currencies: z.object({
      default: z.string().default('RUB'),
      supported: z.array(z.string()).default(['RUB', 'USD', 'CNY']),
      exchangeRates: z.record(z.string(), z.number()).default({
        'USD_RUB': 90,
        'CNY_RUB': 12.5
      })
    }),

    // Наценки по умолчанию
    margins: z.object({
      wholesale: z.number().min(0).max(1).default(0.3),    // 30%
      retail: z.number().min(0).max(1).default(0.5),       // 50%
      marketplace: z.number().min(0).max(1).default(0.15)  // 15%
    }),

    // Налоговые ставки
    taxRates: z.object({
      vat: z.number().min(0).max(1).default(0.20),        // 20% НДС
      incomeTax: z.number().min(0).max(1).default(0.13),  // 13% налог на доход
      marketplaceCommission: z.number().min(0).max(1).default(0.05) // 5% комиссия WB
    }),

    // Стоимости доставки
    shippingCosts: z.object({
      chinaToRussia: z.number().min(0).default(500),      // 500 руб за кг
      russiaInternal: z.number().min(0).default(300),     // 300 руб
      expressDelivery: z.number().min(0).default(1000)    // 1000 руб
    }),

    // Дополнительные затраты
    additionalCosts: z.object({
      photography: z.number().min(0).default(2000),       // 2000 руб за съемку
      packaging: z.number().min(0).default(50),           // 50 руб за упаковку
      certification: z.number().min(0).default(5000),     // 5000 руб за сертификацию
      advertising: z.number().min(0).default(0.1)         // 10% от стоимости товара
    })
  }),

  // Парсинг и анализ конкурентов
  scraping: z.object({
    enabled: z.boolean().default(true),
    rateLimit: z.number().min(100).default(1000),        // 1 запрос в секунду
    timeout: z.number().min(5000).default(30000),        // 30 секунд таймаут
    retries: z.number().min(1).max(5).default(3),
    userAgents: z.array(z.string()).default([
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    ]),
    sources: z.object({
      alibaba: z.object({
        enabled: z.boolean().default(true),
        baseUrl: z.string().default('https://www.alibaba.com'),
        searchDelay: z.number().min(1000).default(2000)
      }),
      taobao: z.object({
        enabled: z.boolean().default(true),
        baseUrl: z.string().default('https://world.taobao.com'),
        searchDelay: z.number().min(1000).default(3000)
      }),
      wildberries: z.object({
        enabled: z.boolean().default(true),
        baseUrl: z.string().default('https://www.wildberries.ru'),
        apiUrl: z.string().default('https://api.wildberries.ru'),
        searchDelay: z.number().min(500).default(1000)
      })
    }).default(() => ({
      alibaba: {
        enabled: true,
        baseUrl: 'https://www.alibaba.com',
        searchDelay: 2000
      },
      taobao: {
        enabled: true,
        baseUrl: 'https://world.taobao.com',
        searchDelay: 3000
      },
      wildberries: {
        enabled: true,
        baseUrl: 'https://www.wildberries.ru',
        apiUrl: 'https://api.wildberries.ru',
        searchDelay: 1000
      }
    }))
  }),

  // Маркетплейсы
  marketplaces: z.object({
    wb: z.object({
      base: z.number().min(0).max(50).default(15),
      categoryMultiplier: z.record(z.string(), z.number()).default({
        "electronics": 0.05,
        "clothing": 0.15,
        "home": 0.10
      })
    }),
    ozon: z.object({
      base: z.number().min(0).max(50).default(12),
      categoryMultiplier: z.record(z.string(), z.number()).default({
        "electronics": 0.08,
        "books": 0.12,
        "toys": 0.15
      })
    }),
    yandex: z.object({
      base: z.number().min(0).max(50).default(8),
      categoryMultiplier: z.record(z.string(), z.number()).default({
        "electronics": 0.05,
        "fashion": 0.12,
        "food": 0.08
      })
    })
  }).default(() => ({
    wb: {
      base: 15,
      categoryMultiplier: {
        "electronics": 0.05,
        "clothing": 0.15,
        "home": 0.10
      }
    },
    ozon: {
      base: 12,
      categoryMultiplier: {
        "electronics": 0.08,
        "books": 0.12,
        "toys": 0.15
      }
    },
    yandex: {
      base: 8,
      categoryMultiplier: {
        "electronics": 0.05,
        "fashion": 0.12,
        "food": 0.08
      }
    }
  })),

  // AI ассистент
  ai: z.object({
    enabled: z.boolean().default(true),
    provider: z.enum(['openai', 'yandex', 'local']).default('openai'),
    openai: z.object({
      apiKey: z.string(),
      model: z.string().default('gpt-3.5-turbo'),
      maxTokens: z.number().min(100).max(4000).default(1000),
      temperature: z.number().min(0).max(2).default(0.7)
    }).optional(),
    yandex: z.object({
      apiKey: z.string(),
      catalogId: z.string(),
      model: z.string().default('general')
    }).optional(),
    features: z.object({
      reviewAnalysis: z.boolean().default(true),
      questionGeneration: z.boolean().default(true),
      productDescription: z.boolean().default(true),
      priceOptimization: z.boolean().default(false)
    }).default({
      reviewAnalysis: true,
      questionGeneration: true,
      productDescription: true,
      priceOptimization: false
    })
  }),

  // Самовыкупы
  selfBuyout: z.object({
    enabled: z.boolean().default(true),
    minOrderValue: z.number().min(0).default(1000),
    maxOrderValue: z.number().min(0).default(50000),
    frequency: z.object({
      minHours: z.number().min(1).default(24),
      maxHours: z.number().min(1).default(168) // 1 неделя
    }),
    paymentMethods: z.array(z.string()).default(['card', 'wallet']),
    deliveryAddresses: z.array(z.string()).default([])
  }),

  // Аналитика
  analytics: z.object({
    enabled: z.boolean().default(true),
    retentionDays: z.number().min(30).max(365).default(90),
    tracking: z.object({
      userActions: z.boolean().default(true),
      performance: z.boolean().default(true),
      errors: z.boolean().default(true),
      businessMetrics: z.boolean().default(true)
    }).default({
      userActions: true,
      performance: true,
      errors: true,
      businessMetrics: true
    })
  }),

  // Оффлайн режим
  offline: z.object({
    enabled: z.boolean().default(true),
    cacheStrategy: z.enum(['aggressive', 'conservative']).default('conservative'),
    maxCacheAge: z.number().min(3600000).default(86400000), // 24 часа
    syncInterval: z.number().min(60000).default(300000),     // 5 минут
    conflictResolution: z.enum(['server-wins', 'client-wins', 'merge']).default('merge')
  }),

  // Уведомления
  notifications: z.object({
    enabled: z.boolean().default(true),
    types: z.object({
      profitAlerts: z.boolean().default(true),
      competitorUpdates: z.boolean().default(true),
      systemUpdates: z.boolean().default(true),
      aiInsights: z.boolean().default(false)
    }).default(() => ({
      profitAlerts: true,
      competitorUpdates: true,
      systemUpdates: true,
      aiInsights: false
    })),
    channels: z.object({
      browser: z.boolean().default(true),
      email: z.boolean().default(false),
      telegram: z.boolean().default(false),
      push: z.boolean().default(true)
    }).default(() => ({
      browser: true,
      email: false,
      telegram: false,
      push: true
    }))
  })
}

// Типы на основе схем
export type ApiConfig = z.infer<typeof configSchemas.api>
export type UiConfig = z.infer<typeof configSchemas.ui>
export type BusinessConfig = z.infer<typeof configSchemas.business>
export type ScrapingConfig = z.infer<typeof configSchemas.scraping>
export type MarketplacesConfig = z.infer<typeof configSchemas.marketplaces>
export type AiConfig = z.infer<typeof configSchemas.ai>
export type SelfBuyoutConfig = z.infer<typeof configSchemas.selfBuyout>
export type AnalyticsConfig = z.infer<typeof configSchemas.analytics>
export type OfflineConfig = z.infer<typeof configSchemas.offline>
export type NotificationsConfig = z.infer<typeof configSchemas.notifications>

// Основной конфиг приложения
export type AppConfig = {
  api: ApiConfig
  ui: UiConfig
  business: BusinessConfig
  scraping: ScrapingConfig
  marketplaces: MarketplacesConfig
  ai: AiConfig
  selfBuyout: SelfBuyoutConfig
  analytics: AnalyticsConfig
  offline: OfflineConfig
  notifications: NotificationsConfig
  environment: 'development' | 'staging' | 'production'
  version: string
  buildTime: string
}

/**
 * Загрузчик конфигурации с валидацией
 */
export class ConfigLoader {
  private static instance: ConfigLoader
  private config: AppConfig | null = null

  private constructor() {}

  static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader()
    }
    return ConfigLoader.instance
  }

  /**
   * Загрузка конфигурации из переменных окружения
   */
  async load(): Promise<AppConfig> {
    if (this.config) {
      return this.config
    }

    try {
      // Определяем окружение
      const environment = this.getEnvironment()

      // Загружаем и валидируем каждую секцию
      const api = this.loadApiConfig()
      const ui = this.loadUiConfig()
      const business = this.loadBusinessConfig()
      const scraping = this.loadScrapingConfig()
      const marketplaces = this.loadMarketplacesConfig()
      const ai = this.loadAiConfig()
      const selfBuyout = this.loadSelfBuyoutConfig()
      const analytics = this.loadAnalyticsConfig()
      const offline = this.loadOfflineConfig()
      const notifications = this.loadNotificationsConfig()

      // Сборка полного конфига
      this.config = {
        api,
        ui,
        business,
        scraping,
        marketplaces,
        ai,
        selfBuyout,
        analytics,
        offline,
        notifications,
        environment,
        version: process.env.npm_package_version || '1.0.0',
        buildTime: new Date().toISOString()
      }

      // Валидация полного конфига
      this.validateConfig(this.config)

      return this.config
    } catch (error) {
      throw new Error(`Ошибка загрузки конфигурации: ${error}`)
    }
  }

  /**
   * Получение значения из окружения с дефолтом
   */
  private getEnv(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || ''
  }

  /**
   * Получение числа из окружения
   */
  private getEnvNumber(key: string, defaultValue?: number): number {
    const value = this.getEnv(key)
    if (!value) return defaultValue || 0

    const parsed = parseFloat(value)
    if (isNaN(parsed)) {
      throw new Error(`Некорректное число в переменной ${key}: ${value}`)
    }
    return parsed
  }

  /**
   * Получение булевого значения из окружения
   */
  private getEnvBoolean(key: string, defaultValue = false): boolean {
    const value = this.getEnv(key, defaultValue.toString())
    return value.toLowerCase() === 'true'
  }

  /**
   * Получение массива из окружения
   */
  private getEnvArray(key: string, defaultValue: string[] = []): string[] {
    const value = this.getEnv(key)
    if (!value) return defaultValue
    return value.split(',').map(item => item.trim())
  }

  /**
   * Определение окружения
   */
  private getEnvironment(): 'development' | 'staging' | 'production' {
    const env = this.getEnv('NODE_ENV', 'development')
    if (['development', 'staging', 'production'].includes(env)) {
      return env as 'development' | 'staging' | 'production'
    }
    return 'development'
  }

  /**
   * Загрузка API конфигурации
   */
  private loadApiConfig(): ApiConfig {
    const config = {
      baseUrl: this.getEnv('VITE_API_URL', 'http://localhost:3001/api'),
      timeout: this.getEnvNumber('API_TIMEOUT', 10000),
      retries: this.getEnvNumber('API_RETRIES', 3),
      rateLimit: {
        windowMs: this.getEnvNumber('API_RATE_LIMIT_WINDOW', 900000),
        maxRequests: this.getEnvNumber('API_RATE_LIMIT_MAX', 100)
      }
    }

    return configSchemas.api.parse(config)
  }

  /**
   * Загрузка UI конфигурации
   */
  private loadUiConfig(): UiConfig {
    const config = {
      theme: this.getEnv('UI_THEME', 'auto') as 'light' | 'dark' | 'auto',
      language: this.getEnv('UI_LANGUAGE', 'ru'),
      animations: this.getEnvBoolean('UI_ANIMATIONS', true),
      mobileOptimizations: this.getEnvBoolean('UI_MOBILE_OPTIMIZATIONS', true),
      pwa: {
        enabled: this.getEnvBoolean('PWA_ENABLED', true),
        cacheStrategy: this.getEnv('PWA_CACHE_STRATEGY', 'cache-first') as 'cache-first' | 'network-first',
        offlineSupport: this.getEnvBoolean('PWA_OFFLINE_SUPPORT', true)
      }
    }

    return configSchemas.ui.parse(config)
  }

  /**
   * Загрузка бизнес конфигурации
   */
  private loadBusinessConfig(): BusinessConfig {
    const config = {
      currencies: {
        default: this.getEnv('CURRENCY_DEFAULT', 'RUB'),
        supported: this.getEnvArray('CURRENCIES_SUPPORTED', ['RUB', 'USD', 'CNY']),
        exchangeRates: {
          'USD_RUB': this.getEnvNumber('EXCHANGE_RATE_USD_RUB', 90),
          'CNY_RUB': this.getEnvNumber('EXCHANGE_RATE_CNY_RUB', 12.5)
        }
      },
      margins: {
        wholesale: this.getEnvNumber('MARGIN_WHOLESALE', 0.3),
        retail: this.getEnvNumber('MARGIN_RETAIL', 0.5),
        marketplace: this.getEnvNumber('MARGIN_MARKETPLACE', 0.15)
      },
      taxRates: {
        vat: this.getEnvNumber('TAX_VAT', 0.20),
        incomeTax: this.getEnvNumber('TAX_INCOME', 0.13),
        marketplaceCommission: this.getEnvNumber('TAX_MARKETPLACE', 0.05)
      },
      shippingCosts: {
        chinaToRussia: this.getEnvNumber('SHIPPING_CHINA_RUSSIA', 500),
        russiaInternal: this.getEnvNumber('SHIPPING_RUSSIA_INTERNAL', 300),
        expressDelivery: this.getEnvNumber('SHIPPING_EXPRESS', 1000)
      },
      additionalCosts: {
        photography: this.getEnvNumber('COST_PHOTOGRAPHY', 2000),
        packaging: this.getEnvNumber('COST_PACKAGING', 50),
        certification: this.getEnvNumber('COST_CERTIFICATION', 5000),
        advertising: this.getEnvNumber('COST_ADVERTISING', 0.1)
      }
    }

    return configSchemas.business.parse(config)
  }

  /**
   * Загрузка конфигурации парсинга
   */
  private loadScrapingConfig(): ScrapingConfig {
    const config = {
      enabled: this.getEnvBoolean('SCRAPING_ENABLED', true),
      rateLimit: this.getEnvNumber('SCRAPING_RATE_LIMIT', 1000),
      timeout: this.getEnvNumber('SCRAPING_TIMEOUT', 30000),
      retries: this.getEnvNumber('SCRAPING_RETRIES', 3),
      userAgents: this.getEnvArray('SCRAPING_USER_AGENTS', [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      ]),
      sources: {
        alibaba: {
          enabled: this.getEnvBoolean('SCRAPING_ALIBABA_ENABLED', true),
          baseUrl: this.getEnv('SCRAPING_ALIBABA_URL', 'https://www.alibaba.com'),
          searchDelay: this.getEnvNumber('SCRAPING_ALIBABA_DELAY', 2000)
        },
        taobao: {
          enabled: this.getEnvBoolean('SCRAPING_TAOBAO_ENABLED', true),
          baseUrl: this.getEnv('SCRAPING_TAOBAO_URL', 'https://world.taobao.com'),
          searchDelay: this.getEnvNumber('SCRAPING_TAOBAO_DELAY', 3000)
        },
        wildberries: {
          enabled: this.getEnvBoolean('SCRAPING_WB_ENABLED', true),
          baseUrl: this.getEnv('SCRAPING_WB_URL', 'https://www.wildberries.ru'),
          apiUrl: this.getEnv('SCRAPING_WB_API_URL', 'https://api.wildberries.ru'),
          searchDelay: this.getEnvNumber('SCRAPING_WB_DELAY', 1000)
        }
      }
    }

    return configSchemas.scraping.parse(config)
  }

  /**
   * Загрузка конфигурации маркетплейсов
   */
  private loadMarketplacesConfig(): MarketplacesConfig {
    const config = {
      wb: {
        base: this.getEnvNumber('MARKETPLACE_WB_BASE_COMMISSION', 15),
        categoryMultiplier: {
          'electronics': this.getEnvNumber('MARKETPLACE_WB_ELECTRONICS_MULTIPLIER', 0.05),
          'clothing': this.getEnvNumber('MARKETPLACE_WB_CLOTHING_MULTIPLIER', 0.15),
          'home': this.getEnvNumber('MARKETPLACE_WB_HOME_MULTIPLIER', 0.10)
        }
      },
      ozon: {
        base: this.getEnvNumber('MARKETPLACE_OZON_BASE_COMMISSION', 12),
        categoryMultiplier: {
          'electronics': this.getEnvNumber('MARKETPLACE_OZON_ELECTRONICS_MULTIPLIER', 0.08),
          'books': this.getEnvNumber('MARKETPLACE_OZON_BOOKS_MULTIPLIER', 0.12),
          'toys': this.getEnvNumber('MARKETPLACE_OZON_TOYS_MULTIPLIER', 0.15)
        }
      },
      yandex: {
        base: this.getEnvNumber('MARKETPLACE_YANDEX_BASE_COMMISSION', 8),
        categoryMultiplier: {
          'electronics': this.getEnvNumber('MARKETPLACE_YANDEX_ELECTRONICS_MULTIPLIER', 0.05),
          'fashion': this.getEnvNumber('MARKETPLACE_YANDEX_FASHION_MULTIPLIER', 0.12),
          'food': this.getEnvNumber('MARKETPLACE_YANDEX_FOOD_MULTIPLIER', 0.08)
        }
      }
    }

    return configSchemas.marketplaces.parse(config)
  }

  /**
   * Загрузка AI конфигурации
   */
  private loadAiConfig(): AiConfig {
    const config = {
      enabled: this.getEnvBoolean('AI_ENABLED', true),
      provider: this.getEnv('AI_PROVIDER', 'openai') as 'openai' | 'yandex' | 'local',
      openai: process.env.OPENAI_API_KEY ? {
        apiKey: process.env.OPENAI_API_KEY,
        model: this.getEnv('OPENAI_MODEL', 'gpt-3.5-turbo'),
        maxTokens: this.getEnvNumber('OPENAI_MAX_TOKENS', 1000),
        temperature: this.getEnvNumber('OPENAI_TEMPERATURE', 0.7)
      } : undefined,
      yandex: process.env.YANDEX_API_KEY ? {
        apiKey: process.env.YANDEX_API_KEY,
        catalogId: this.getEnv('YANDEX_CATALOG_ID', ''),
        model: this.getEnv('YANDEX_MODEL', 'general')
      } : undefined,
      features: {
        reviewAnalysis: this.getEnvBoolean('AI_REVIEW_ANALYSIS', true),
        questionGeneration: this.getEnvBoolean('AI_QUESTION_GENERATION', true),
        productDescription: this.getEnvBoolean('AI_PRODUCT_DESCRIPTION', true),
        priceOptimization: this.getEnvBoolean('AI_PRICE_OPTIMIZATION', false)
      }
    }

    return configSchemas.ai.parse(config)
  }

  /**
   * Загрузка конфигурации самовыкупов
   */
  private loadSelfBuyoutConfig(): SelfBuyoutConfig {
    const config = {
      enabled: this.getEnvBoolean('SELFBUYOUT_ENABLED', true),
      minOrderValue: this.getEnvNumber('SELFBUYOUT_MIN_VALUE', 1000),
      maxOrderValue: this.getEnvNumber('SELFBUYOUT_MAX_VALUE', 50000),
      frequency: {
        minHours: this.getEnvNumber('SELFBUYOUT_FREQUENCY_MIN', 24),
        maxHours: this.getEnvNumber('SELFBUYOUT_FREQUENCY_MAX', 168)
      },
      paymentMethods: this.getEnvArray('SELFBUYOUT_PAYMENT_METHODS', ['card', 'wallet']),
      deliveryAddresses: this.getEnvArray('SELFBUYOUT_ADDRESSES', [])
    }

    return configSchemas.selfBuyout.parse(config)
  }

  /**
   * Загрузка конфигурации аналитики
   */
  private loadAnalyticsConfig(): AnalyticsConfig {
    const config = {
      enabled: this.getEnvBoolean('ANALYTICS_ENABLED', true),
      retentionDays: this.getEnvNumber('ANALYTICS_RETENTION', 90),
      tracking: {
        userActions: this.getEnvBoolean('ANALYTICS_USER_ACTIONS', true),
        performance: this.getEnvBoolean('ANALYTICS_PERFORMANCE', true),
        errors: this.getEnvBoolean('ANALYTICS_ERRORS', true),
        businessMetrics: this.getEnvBoolean('ANALYTICS_BUSINESS_METRICS', true)
      }
    }

    return configSchemas.analytics.parse(config)
  }

  /**
   * Загрузка конфигурации оффлайн режима
   */
  private loadOfflineConfig(): OfflineConfig {
    const config = {
      enabled: this.getEnvBoolean('OFFLINE_ENABLED', true),
      cacheStrategy: this.getEnv('OFFLINE_CACHE_STRATEGY', 'conservative') as 'aggressive' | 'conservative',
      maxCacheAge: this.getEnvNumber('OFFLINE_MAX_CACHE_AGE', 86400000),
      syncInterval: this.getEnvNumber('OFFLINE_SYNC_INTERVAL', 300000),
      conflictResolution: this.getEnv('OFFLINE_CONFLICT_RESOLUTION', 'merge') as 'server-wins' | 'client-wins' | 'merge'
    }

    return configSchemas.offline.parse(config)
  }

  /**
   * Загрузка конфигурации уведомлений
   */
  private loadNotificationsConfig(): NotificationsConfig {
    const config = {
      enabled: this.getEnvBoolean('NOTIFICATIONS_ENABLED', true),
      types: {
        profitAlerts: this.getEnvBoolean('NOTIFICATIONS_PROFIT_ALERTS', true),
        competitorUpdates: this.getEnvBoolean('NOTIFICATIONS_COMPETITOR_UPDATES', true),
        systemUpdates: this.getEnvBoolean('NOTIFICATIONS_SYSTEM_UPDATES', true),
        aiInsights: this.getEnvBoolean('NOTIFICATIONS_AI_INSIGHTS', false)
      },
      channels: {
        browser: this.getEnvBoolean('NOTIFICATIONS_BROWSER', true),
        email: this.getEnvBoolean('NOTIFICATIONS_EMAIL', false),
        telegram: this.getEnvBoolean('NOTIFICATIONS_TELEGRAM', false),
        push: this.getEnvBoolean('NOTIFICATIONS_PUSH', true)
      }
    }

    return configSchemas.notifications.parse(config)
  }

  /**
   * Валидация конфигурации
   */
  private validateConfig(config: AppConfig): void {
    try {
      // Дополнительная валидация связей между настройками
      if (config.business.margins.wholesale >= config.business.margins.retail) {
        throw new Error('Оптовая наценка не может быть больше или равна розничной')
      }

      if (config.scraping.enabled && !config.scraping.sources.alibaba.enabled &&
          !config.scraping.sources.taobao.enabled && !config.scraping.sources.wildberries.enabled) {
        throw new Error('Парсинг включен, но не выбран ни один источник данных')
      }

      if (config.ai.enabled && !config.ai.openai && !config.ai.yandex) {
        throw new Error('AI включен, но не настроен ни один провайдер')
      }
    } catch (error) {
      throw new Error(`Ошибка валидации конфигурации: ${error}`)
    }
  }

  /**
   * Получение текущей конфигурации
   */
  getConfig(): AppConfig {
    if (!this.config) {
      throw new Error('Конфигурация не загружена. Вызовите load() сначала.')
    }
    return this.config
  }

  /**
   * Получение секции конфигурации
   */
  getSection<K extends keyof AppConfig>(section: K): AppConfig[K] {
    const config = this.getConfig()
    return config[section]
  }

  /**
   * Проверка доступности функции
   */
  isFeatureEnabled(feature: string): boolean {
    const config = this.getConfig()

    switch (feature) {
      case 'ai':
        return config.ai.enabled
      case 'scraping':
        return config.scraping.enabled
      case 'selfBuyout':
        return config.selfBuyout.enabled
      case 'analytics':
        return config.analytics.enabled
      case 'offline':
        return config.offline.enabled
      case 'notifications':
        return config.notifications.enabled
      default:
        return false
    }
  }
}

// Экспорт singleton instance
export const configLoader = ConfigLoader.getInstance()
export default configLoader
