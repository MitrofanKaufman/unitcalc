// path: src/api/settings.ts
/**
 * Класс Settings
 * Конфигурация приложения с использованием переменных окружения.
 * Все настройки загружаются через dotenv из файла .env.
 *
 * Предоставляет удобный интерфейс для доступа к настройкам,
 * включая базу данных, таймауты, логирование, пользовательский агент и пр.
 */

import dotenv from 'dotenv';
import Messages from './app/client/core/messages.js';

dotenv.config();

export default class Settings {
    messages: Messages;
    logEnabled: boolean;
    db: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        waitForConnections: boolean;
        connectionLimit: number;
        queueLimit: number;
    };
    scrapeTimeout: number;
    waitForSelectorTimeouts: {
        title: number;
        sellerDetails: number;
        productDetails: number;
    };
    userAgent: string;
    errorHideDelay: number;
    progressStep: number;
    portDefault: number;
    portRange: {
        min: number;
        max: number;
    };

    /**
     * Конструктор настроек
     * @param {string} locale - Локаль для сообщений (default: 'ru')
     */
    constructor(locale: string = 'ru') {
        this.messages = new Messages(locale);

        // Логирование (включено, если переменная окружения LOGGING=ON)
        this.logEnabled = this._envFlag('LOGGING', true);

        // Конфигурация подключения к БД
        this.db = this._buildDbConfig();

        // Таймауты парсера (в миллисекундах)
        this.scrapeTimeout = this._envNumber('SCRAPE_TIMEOUT', 30000);
        this.waitForSelectorTimeouts = {
            title: this._envNumber('TIMEOUT_TITLE', 10000),
            sellerDetails: this._envNumber('TIMEOUT_SELLER_DETAILS', 10000),
            productDetails: this._envNumber('TIMEOUT_PRODUCT_DETAILS', 10000),
        };

        // User-Agent для имитации браузера
        this.userAgent = this._getUserAgent();

        // Прогресс и ошибки
        this.errorHideDelay = this._envNumber('ERROR_HIDE_DELAY', 8000);
        this.progressStep = Math.max(0.1, this._envNumber('PROGRESS_STEP', 0.5));

        // Настройки портов
        this.portDefault = this._envNumber('PORT_DEFAULT') || this._envNumber('PORT') || 3030;
        this.portRange = {
            min: this._envNumber('PORT_MIN', 3000),
            max: this._envNumber('PORT_MAX', 3999),
        };
    }

    /**
     * Получает числовое значение из переменных окружения
     * @private
     */
    private _envNumber(key: string, defaultValue: number = 0): number {
        const value = process.env[key];
        return value ? parseInt(value, 10) : defaultValue;
    }

    /**
     * Получает булево значение из переменных окружения
     * @private
     */
    private _envFlag(key: string, defaultValue: boolean = false): boolean {
        const value = process.env[key];
        if (value === undefined) return defaultValue;
        return value === 'true' || value === '1' || value === 'ON';
    }

    /**
     * Собирает конфигурацию для подключения к БД
     * @private
     */
    private _buildDbConfig() {
        return {
            host: process.env.DB_HOST || 'localhost',
            port: this._envNumber('DB_PORT', 3306),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'wb_calculator',
            waitForConnections: true,
            connectionLimit: this._envNumber('DB_CONNECTION_LIMIT', 10),
            queueLimit: 0
        };
    }

    /**
     * Генерирует случайный User-Agent
     * @private
     */
    private _getUserAgent(): string {
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
        ];
        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }

    /**
     * Получает сообщение по ключу с подстановкой параметров
     * @param {string} key - Ключ сообщения
     * @param {...any} params - Параметры для подстановки
     * @returns {string} Отформатированное сообщение
     */
    getMessage(key: string, ...params: any[]): string {
        return this.messages.get(key, ...params);
    }

    /**
     * Получает уведомление по ключу с подстановкой параметров
     * @param {string} key - Ключ уведомления
     * @param {...any} params - Параметры для подстановки
     * @returns {string} Отформатированное уведомление
     */
    getNotification(key: string, ...params: any[]): string {
        return this.messages.getNotification(key, ...params);
    }
}
