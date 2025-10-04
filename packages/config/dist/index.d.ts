import { z } from 'zod';
export declare const configSchemas: {
    api: z.ZodObject<{
        baseUrl: z.ZodString;
        timeout: z.ZodDefault<z.ZodNumber>;
        retries: z.ZodDefault<z.ZodNumber>;
        rateLimit: z.ZodDefault<z.ZodObject<{
            windowMs: z.ZodDefault<z.ZodNumber>;
            maxRequests: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            windowMs: number;
            maxRequests: number;
        }, {
            windowMs?: number | undefined;
            maxRequests?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        baseUrl: string;
        timeout: number;
        retries: number;
        rateLimit: {
            windowMs: number;
            maxRequests: number;
        };
    }, {
        baseUrl: string;
        timeout?: number | undefined;
        retries?: number | undefined;
        rateLimit?: {
            windowMs?: number | undefined;
            maxRequests?: number | undefined;
        } | undefined;
    }>;
    ui: z.ZodObject<{
        theme: z.ZodDefault<z.ZodEnum<["light", "dark", "auto"]>>;
        language: z.ZodDefault<z.ZodString>;
        animations: z.ZodDefault<z.ZodBoolean>;
        mobileOptimizations: z.ZodDefault<z.ZodBoolean>;
        pwa: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            cacheStrategy: z.ZodDefault<z.ZodEnum<["cache-first", "network-first"]>>;
            offlineSupport: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            cacheStrategy: "cache-first" | "network-first";
            offlineSupport: boolean;
        }, {
            enabled?: boolean | undefined;
            cacheStrategy?: "cache-first" | "network-first" | undefined;
            offlineSupport?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        theme: "light" | "dark" | "auto";
        language: string;
        animations: boolean;
        mobileOptimizations: boolean;
        pwa: {
            enabled: boolean;
            cacheStrategy: "cache-first" | "network-first";
            offlineSupport: boolean;
        };
    }, {
        theme?: "light" | "dark" | "auto" | undefined;
        language?: string | undefined;
        animations?: boolean | undefined;
        mobileOptimizations?: boolean | undefined;
        pwa?: {
            enabled?: boolean | undefined;
            cacheStrategy?: "cache-first" | "network-first" | undefined;
            offlineSupport?: boolean | undefined;
        } | undefined;
    }>;
    business: z.ZodObject<{
        currencies: z.ZodObject<{
            default: z.ZodDefault<z.ZodString>;
            supported: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            exchangeRates: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            default: string;
            supported: string[];
            exchangeRates: Record<string, number>;
        }, {
            default?: string | undefined;
            supported?: string[] | undefined;
            exchangeRates?: Record<string, number> | undefined;
        }>;
        margins: z.ZodObject<{
            wholesale: z.ZodDefault<z.ZodNumber>;
            retail: z.ZodDefault<z.ZodNumber>;
            marketplace: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            wholesale: number;
            retail: number;
            marketplace: number;
        }, {
            wholesale?: number | undefined;
            retail?: number | undefined;
            marketplace?: number | undefined;
        }>;
        taxRates: z.ZodObject<{
            vat: z.ZodDefault<z.ZodNumber>;
            incomeTax: z.ZodDefault<z.ZodNumber>;
            marketplaceCommission: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            vat: number;
            incomeTax: number;
            marketplaceCommission: number;
        }, {
            vat?: number | undefined;
            incomeTax?: number | undefined;
            marketplaceCommission?: number | undefined;
        }>;
        shippingCosts: z.ZodObject<{
            chinaToRussia: z.ZodDefault<z.ZodNumber>;
            russiaInternal: z.ZodDefault<z.ZodNumber>;
            expressDelivery: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            chinaToRussia: number;
            russiaInternal: number;
            expressDelivery: number;
        }, {
            chinaToRussia?: number | undefined;
            russiaInternal?: number | undefined;
            expressDelivery?: number | undefined;
        }>;
        additionalCosts: z.ZodObject<{
            photography: z.ZodDefault<z.ZodNumber>;
            packaging: z.ZodDefault<z.ZodNumber>;
            certification: z.ZodDefault<z.ZodNumber>;
            advertising: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            photography: number;
            packaging: number;
            certification: number;
            advertising: number;
        }, {
            photography?: number | undefined;
            packaging?: number | undefined;
            certification?: number | undefined;
            advertising?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        currencies: {
            default: string;
            supported: string[];
            exchangeRates: Record<string, number>;
        };
        margins: {
            wholesale: number;
            retail: number;
            marketplace: number;
        };
        taxRates: {
            vat: number;
            incomeTax: number;
            marketplaceCommission: number;
        };
        shippingCosts: {
            chinaToRussia: number;
            russiaInternal: number;
            expressDelivery: number;
        };
        additionalCosts: {
            photography: number;
            packaging: number;
            certification: number;
            advertising: number;
        };
    }, {
        currencies: {
            default?: string | undefined;
            supported?: string[] | undefined;
            exchangeRates?: Record<string, number> | undefined;
        };
        margins: {
            wholesale?: number | undefined;
            retail?: number | undefined;
            marketplace?: number | undefined;
        };
        taxRates: {
            vat?: number | undefined;
            incomeTax?: number | undefined;
            marketplaceCommission?: number | undefined;
        };
        shippingCosts: {
            chinaToRussia?: number | undefined;
            russiaInternal?: number | undefined;
            expressDelivery?: number | undefined;
        };
        additionalCosts: {
            photography?: number | undefined;
            packaging?: number | undefined;
            certification?: number | undefined;
            advertising?: number | undefined;
        };
    }>;
    scraping: z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        rateLimit: z.ZodDefault<z.ZodNumber>;
        timeout: z.ZodDefault<z.ZodNumber>;
        retries: z.ZodDefault<z.ZodNumber>;
        userAgents: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        sources: z.ZodDefault<z.ZodObject<{
            alibaba: z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
                baseUrl: z.ZodDefault<z.ZodString>;
                searchDelay: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                baseUrl: string;
                enabled: boolean;
                searchDelay: number;
            }, {
                baseUrl?: string | undefined;
                enabled?: boolean | undefined;
                searchDelay?: number | undefined;
            }>;
            taobao: z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
                baseUrl: z.ZodDefault<z.ZodString>;
                searchDelay: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                baseUrl: string;
                enabled: boolean;
                searchDelay: number;
            }, {
                baseUrl?: string | undefined;
                enabled?: boolean | undefined;
                searchDelay?: number | undefined;
            }>;
            wildberries: z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
                baseUrl: z.ZodDefault<z.ZodString>;
                apiUrl: z.ZodDefault<z.ZodString>;
                searchDelay: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                baseUrl: string;
                enabled: boolean;
                searchDelay: number;
                apiUrl: string;
            }, {
                baseUrl?: string | undefined;
                enabled?: boolean | undefined;
                searchDelay?: number | undefined;
                apiUrl?: string | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            alibaba: {
                baseUrl: string;
                enabled: boolean;
                searchDelay: number;
            };
            taobao: {
                baseUrl: string;
                enabled: boolean;
                searchDelay: number;
            };
            wildberries: {
                baseUrl: string;
                enabled: boolean;
                searchDelay: number;
                apiUrl: string;
            };
        }, {
            alibaba: {
                baseUrl?: string | undefined;
                enabled?: boolean | undefined;
                searchDelay?: number | undefined;
            };
            taobao: {
                baseUrl?: string | undefined;
                enabled?: boolean | undefined;
                searchDelay?: number | undefined;
            };
            wildberries: {
                baseUrl?: string | undefined;
                enabled?: boolean | undefined;
                searchDelay?: number | undefined;
                apiUrl?: string | undefined;
            };
        }>>;
    }, "strip", z.ZodTypeAny, {
        timeout: number;
        retries: number;
        rateLimit: number;
        enabled: boolean;
        userAgents: string[];
        sources: {
            alibaba: {
                baseUrl: string;
                enabled: boolean;
                searchDelay: number;
            };
            taobao: {
                baseUrl: string;
                enabled: boolean;
                searchDelay: number;
            };
            wildberries: {
                baseUrl: string;
                enabled: boolean;
                searchDelay: number;
                apiUrl: string;
            };
        };
    }, {
        timeout?: number | undefined;
        retries?: number | undefined;
        rateLimit?: number | undefined;
        enabled?: boolean | undefined;
        userAgents?: string[] | undefined;
        sources?: {
            alibaba: {
                baseUrl?: string | undefined;
                enabled?: boolean | undefined;
                searchDelay?: number | undefined;
            };
            taobao: {
                baseUrl?: string | undefined;
                enabled?: boolean | undefined;
                searchDelay?: number | undefined;
            };
            wildberries: {
                baseUrl?: string | undefined;
                enabled?: boolean | undefined;
                searchDelay?: number | undefined;
                apiUrl?: string | undefined;
            };
        } | undefined;
    }>;
    ai: z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        provider: z.ZodDefault<z.ZodEnum<["openai", "yandex", "local"]>>;
        openai: z.ZodOptional<z.ZodObject<{
            apiKey: z.ZodString;
            model: z.ZodDefault<z.ZodString>;
            maxTokens: z.ZodDefault<z.ZodNumber>;
            temperature: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            apiKey: string;
            model: string;
            maxTokens: number;
            temperature: number;
        }, {
            apiKey: string;
            model?: string | undefined;
            maxTokens?: number | undefined;
            temperature?: number | undefined;
        }>>;
        yandex: z.ZodOptional<z.ZodObject<{
            apiKey: z.ZodString;
            catalogId: z.ZodString;
            model: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            apiKey: string;
            model: string;
            catalogId: string;
        }, {
            apiKey: string;
            catalogId: string;
            model?: string | undefined;
        }>>;
        features: z.ZodDefault<z.ZodObject<{
            reviewAnalysis: z.ZodDefault<z.ZodBoolean>;
            questionGeneration: z.ZodDefault<z.ZodBoolean>;
            productDescription: z.ZodDefault<z.ZodBoolean>;
            priceOptimization: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            reviewAnalysis: boolean;
            questionGeneration: boolean;
            productDescription: boolean;
            priceOptimization: boolean;
        }, {
            reviewAnalysis?: boolean | undefined;
            questionGeneration?: boolean | undefined;
            productDescription?: boolean | undefined;
            priceOptimization?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        provider: "openai" | "yandex" | "local";
        features: {
            reviewAnalysis: boolean;
            questionGeneration: boolean;
            productDescription: boolean;
            priceOptimization: boolean;
        };
        openai?: {
            apiKey: string;
            model: string;
            maxTokens: number;
            temperature: number;
        } | undefined;
        yandex?: {
            apiKey: string;
            model: string;
            catalogId: string;
        } | undefined;
    }, {
        enabled?: boolean | undefined;
        openai?: {
            apiKey: string;
            model?: string | undefined;
            maxTokens?: number | undefined;
            temperature?: number | undefined;
        } | undefined;
        yandex?: {
            apiKey: string;
            catalogId: string;
            model?: string | undefined;
        } | undefined;
        provider?: "openai" | "yandex" | "local" | undefined;
        features?: {
            reviewAnalysis?: boolean | undefined;
            questionGeneration?: boolean | undefined;
            productDescription?: boolean | undefined;
            priceOptimization?: boolean | undefined;
        } | undefined;
    }>;
    selfBuyout: z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        minOrderValue: z.ZodDefault<z.ZodNumber>;
        maxOrderValue: z.ZodDefault<z.ZodNumber>;
        frequency: z.ZodObject<{
            minHours: z.ZodDefault<z.ZodNumber>;
            maxHours: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            minHours: number;
            maxHours: number;
        }, {
            minHours?: number | undefined;
            maxHours?: number | undefined;
        }>;
        paymentMethods: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        deliveryAddresses: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        minOrderValue: number;
        maxOrderValue: number;
        frequency: {
            minHours: number;
            maxHours: number;
        };
        paymentMethods: string[];
        deliveryAddresses: string[];
    }, {
        frequency: {
            minHours?: number | undefined;
            maxHours?: number | undefined;
        };
        enabled?: boolean | undefined;
        minOrderValue?: number | undefined;
        maxOrderValue?: number | undefined;
        paymentMethods?: string[] | undefined;
        deliveryAddresses?: string[] | undefined;
    }>;
    analytics: z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        retentionDays: z.ZodDefault<z.ZodNumber>;
        tracking: z.ZodDefault<z.ZodObject<{
            userActions: z.ZodDefault<z.ZodBoolean>;
            performance: z.ZodDefault<z.ZodBoolean>;
            errors: z.ZodDefault<z.ZodBoolean>;
            businessMetrics: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            userActions: boolean;
            performance: boolean;
            errors: boolean;
            businessMetrics: boolean;
        }, {
            userActions?: boolean | undefined;
            performance?: boolean | undefined;
            errors?: boolean | undefined;
            businessMetrics?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        retentionDays: number;
        tracking: {
            userActions: boolean;
            performance: boolean;
            errors: boolean;
            businessMetrics: boolean;
        };
    }, {
        enabled?: boolean | undefined;
        retentionDays?: number | undefined;
        tracking?: {
            userActions?: boolean | undefined;
            performance?: boolean | undefined;
            errors?: boolean | undefined;
            businessMetrics?: boolean | undefined;
        } | undefined;
    }>;
    offline: z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        cacheStrategy: z.ZodDefault<z.ZodEnum<["aggressive", "conservative"]>>;
        maxCacheAge: z.ZodDefault<z.ZodNumber>;
        syncInterval: z.ZodDefault<z.ZodNumber>;
        conflictResolution: z.ZodDefault<z.ZodEnum<["server-wins", "client-wins", "merge"]>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        cacheStrategy: "aggressive" | "conservative";
        maxCacheAge: number;
        syncInterval: number;
        conflictResolution: "server-wins" | "client-wins" | "merge";
    }, {
        enabled?: boolean | undefined;
        cacheStrategy?: "aggressive" | "conservative" | undefined;
        maxCacheAge?: number | undefined;
        syncInterval?: number | undefined;
        conflictResolution?: "server-wins" | "client-wins" | "merge" | undefined;
    }>;
    notifications: z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        types: z.ZodDefault<z.ZodObject<{
            profitAlerts: z.ZodDefault<z.ZodBoolean>;
            competitorUpdates: z.ZodDefault<z.ZodBoolean>;
            systemUpdates: z.ZodDefault<z.ZodBoolean>;
            aiInsights: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            profitAlerts: boolean;
            competitorUpdates: boolean;
            systemUpdates: boolean;
            aiInsights: boolean;
        }, {
            profitAlerts?: boolean | undefined;
            competitorUpdates?: boolean | undefined;
            systemUpdates?: boolean | undefined;
            aiInsights?: boolean | undefined;
        }>>;
        channels: z.ZodDefault<z.ZodObject<{
            browser: z.ZodDefault<z.ZodBoolean>;
            email: z.ZodDefault<z.ZodBoolean>;
            telegram: z.ZodDefault<z.ZodBoolean>;
            push: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            push: boolean;
            browser: boolean;
            email: boolean;
            telegram: boolean;
        }, {
            push?: boolean | undefined;
            browser?: boolean | undefined;
            email?: boolean | undefined;
            telegram?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        types: {
            profitAlerts: boolean;
            competitorUpdates: boolean;
            systemUpdates: boolean;
            aiInsights: boolean;
        };
        channels: {
            push: boolean;
            browser: boolean;
            email: boolean;
            telegram: boolean;
        };
    }, {
        enabled?: boolean | undefined;
        types?: {
            profitAlerts?: boolean | undefined;
            competitorUpdates?: boolean | undefined;
            systemUpdates?: boolean | undefined;
            aiInsights?: boolean | undefined;
        } | undefined;
        channels?: {
            push?: boolean | undefined;
            browser?: boolean | undefined;
            email?: boolean | undefined;
            telegram?: boolean | undefined;
        } | undefined;
    }>;
};
export type ApiConfig = z.infer<typeof configSchemas.api>;
export type UiConfig = z.infer<typeof configSchemas.ui>;
export type BusinessConfig = z.infer<typeof configSchemas.business>;
export type ScrapingConfig = z.infer<typeof configSchemas.scraping>;
export type AiConfig = z.infer<typeof configSchemas.ai>;
export type SelfBuyoutConfig = z.infer<typeof configSchemas.selfBuyout>;
export type AnalyticsConfig = z.infer<typeof configSchemas.analytics>;
export type OfflineConfig = z.infer<typeof configSchemas.offline>;
export type NotificationsConfig = z.infer<typeof configSchemas.notifications>;
export type AppConfig = {
    api: ApiConfig;
    ui: UiConfig;
    business: BusinessConfig;
    scraping: ScrapingConfig;
    ai: AiConfig;
    selfBuyout: SelfBuyoutConfig;
    analytics: AnalyticsConfig;
    offline: OfflineConfig;
    notifications: NotificationsConfig;
    environment: 'development' | 'staging' | 'production';
    version: string;
    buildTime: string;
};
/**
 * Загрузчик конфигурации с валидацией
 */
export declare class ConfigLoader {
    private static instance;
    private config;
    private constructor();
    static getInstance(): ConfigLoader;
    /**
     * Загрузка конфигурации из переменных окружения
     */
    load(): Promise<AppConfig>;
    /**
     * Получение значения из окружения с дефолтом
     */
    private getEnv;
    /**
     * Получение числа из окружения
     */
    private getEnvNumber;
    /**
     * Получение булевого значения из окружения
     */
    private getEnvBoolean;
    /**
     * Получение массива из окружения
     */
    private getEnvArray;
    /**
     * Определение окружения
     */
    private getEnvironment;
    /**
     * Загрузка API конфигурации
     */
    private loadApiConfig;
    /**
     * Загрузка UI конфигурации
     */
    private loadUiConfig;
    /**
     * Загрузка бизнес конфигурации
     */
    private loadBusinessConfig;
    /**
     * Загрузка конфигурации парсинга
     */
    private loadScrapingConfig;
    /**
     * Загрузка AI конфигурации
     */
    private loadAiConfig;
    /**
     * Загрузка конфигурации самовыкупов
     */
    private loadSelfBuyoutConfig;
    /**
     * Загрузка конфигурации аналитики
     */
    private loadAnalyticsConfig;
    /**
     * Загрузка конфигурации оффлайн режима
     */
    private loadOfflineConfig;
    /**
     * Загрузка конфигурации уведомлений
     */
    private loadNotificationsConfig;
    /**
     * Валидация конфигурации
     */
    private validateConfig;
    /**
     * Получение текущей конфигурации
     */
    getConfig(): AppConfig;
    /**
     * Получение секции конфигурации
     */
    getSection<K extends keyof AppConfig>(section: K): AppConfig[K];
    /**
     * Проверка доступности функции
     */
    isFeatureEnabled(feature: string): boolean;
}
export declare const configLoader: ConfigLoader;
export default configLoader;
//# sourceMappingURL=index.d.ts.map