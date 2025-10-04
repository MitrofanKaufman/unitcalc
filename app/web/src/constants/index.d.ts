export declare const APP_NAME = "Marketplace Calculator";
export declare const APP_VERSION = "1.0.0";
export declare const APP_DESCRIPTION = "\u0420\u0430\u0441\u0447\u0435\u0442 \u0434\u043E\u0445\u043E\u0434\u043D\u043E\u0441\u0442\u0438 \u0442\u043E\u0432\u0430\u0440\u043E\u0432 \u0434\u043B\u044F \u043C\u0430\u0440\u043A\u0435\u0442\u043F\u043B\u0435\u0439\u0441\u043E\u0432 \u0420\u043E\u0441\u0441\u0438\u0438";
export declare const MARKETPLACES: readonly [{
    readonly id: "wb";
    readonly name: "Wildberries";
    readonly icon: "🛍️";
    readonly color: "#7B68EE";
    readonly commission: {
        readonly base: 15;
        readonly categoryMultiplier: {
            readonly electronics: 0.05;
            readonly clothing: 0.15;
            readonly home: 0.1;
        };
    };
    readonly isActive: true;
}, {
    readonly id: "ozon";
    readonly name: "Ozon";
    readonly icon: "📦";
    readonly color: "#0058FF";
    readonly commission: {
        readonly base: 12;
        readonly categoryMultiplier: {
            readonly electronics: 0.08;
            readonly books: 0.12;
            readonly toys: 0.15;
        };
    };
    readonly isActive: true;
}, {
    readonly id: "yandex";
    readonly name: "Yandex Market";
    readonly icon: "🛒";
    readonly color: "#FF3333";
    readonly commission: {
        readonly base: 8;
        readonly categoryMultiplier: {
            readonly electronics: 0.05;
            readonly fashion: 0.12;
            readonly food: 0.08;
        };
    };
    readonly isActive: true;
}];
export declare const PRODUCT_CATEGORIES: readonly [{
    readonly id: "electronics";
    readonly name: "Электроника";
    readonly isActive: true;
}, {
    readonly id: "clothing";
    readonly name: "Одежда";
    readonly isActive: true;
}, {
    readonly id: "home";
    readonly name: "Товары для дома";
    readonly isActive: true;
}, {
    readonly id: "books";
    readonly name: "Книги";
    readonly isActive: true;
}, {
    readonly id: "toys";
    readonly name: "Игрушки";
    readonly isActive: true;
}, {
    readonly id: "fashion";
    readonly name: "Мода";
    readonly isActive: true;
}, {
    readonly id: "food";
    readonly name: "Еда";
    readonly isActive: true;
}];
export declare const PRODUCT_STATUSES: readonly [{
    readonly id: "active";
    readonly name: "Активен";
    readonly color: "success";
}, {
    readonly id: "inactive";
    readonly name: "Неактивен";
    readonly color: "default";
}, {
    readonly id: "draft";
    readonly name: "Черновик";
    readonly color: "warning";
}, {
    readonly id: "archived";
    readonly name: "Архивирован";
    readonly color: "error";
}];
export declare const DEFAULT_PAGINATION: {
    readonly page: 0;
    readonly pageSize: 25;
    readonly pageSizeOptions: readonly [10, 25, 50, 100];
};
export declare const API_TIMEOUTS: {
    readonly default: 10000;
    readonly long: 30000;
    readonly scraping: 60000;
};
export declare const CACHE_DURATIONS: {
    readonly products: number;
    readonly search: number;
    readonly calculations: number;
};
export declare const VALIDATION_RULES: {
    readonly productName: {
        readonly minLength: 3;
        readonly maxLength: 200;
    };
    readonly price: {
        readonly min: 0.01;
        readonly max: 1000000;
    };
    readonly percentage: {
        readonly min: 0;
        readonly max: 100;
    };
};
export declare const COLORS: {
    readonly primary: {
        readonly main: "#1976d2";
        readonly light: "#42a5f5";
        readonly dark: "#1565c0";
    };
    readonly secondary: {
        readonly main: "#9c27b0";
        readonly light: "#ba68c8";
        readonly dark: "#7b1fa2";
    };
    readonly success: {
        readonly main: "#4caf50";
        readonly light: "#81c784";
        readonly dark: "#388e3c";
    };
    readonly warning: {
        readonly main: "#ff9800";
        readonly light: "#ffb74d";
        readonly dark: "#f57c00";
    };
    readonly error: {
        readonly main: "#f44336";
        readonly light: "#e57373";
        readonly dark: "#d32f2f";
    };
    readonly info: {
        readonly main: "#2196f3";
        readonly light: "#64b5f6";
        readonly dark: "#1976d2";
    };
};
export declare const SIZES: {
    readonly headerHeight: 64;
    readonly sidebarWidth: 240;
    readonly contentMaxWidth: 1200;
    readonly borderRadius: {
        readonly small: 4;
        readonly medium: 8;
        readonly large: 12;
    };
};
export declare const STORAGE_KEYS: {
    readonly products: "marketplace_products";
    readonly calculations: "marketplace_calculations";
    readonly settings: "marketplace_settings";
    readonly cache: "marketplace_cache";
};
export declare const ERROR_MESSAGES: {
    readonly NETWORK_ERROR: "Ошибка сети. Проверьте подключение к интернету.";
    readonly VALIDATION_ERROR: "Проверьте правильность введенных данных.";
    readonly PERMISSION_DENIED: "Недостаточно прав для выполнения операции.";
    readonly NOT_FOUND: "Запрашиваемый ресурс не найден.";
    readonly SERVER_ERROR: "Внутренняя ошибка сервера.";
    readonly TIMEOUT: "Превышено время ожидания запроса.";
};
export declare const SUCCESS_MESSAGES: {
    readonly PRODUCT_CREATED: "Товар успешно добавлен.";
    readonly PRODUCT_UPDATED: "Товар успешно обновлен.";
    readonly PRODUCT_DELETED: "Товар успешно удален.";
    readonly CALCULATION_SAVED: "Расчет сохранен.";
    readonly SETTINGS_SAVED: "Настройки сохранены.";
    readonly CACHE_CLEARED: "Кеш очищен.";
};
export declare const REGEX_PATTERNS: {
    readonly EMAIL: RegExp;
    readonly PHONE: RegExp;
    readonly PRODUCT_NAME: RegExp;
    readonly URL: RegExp;
};
export declare const API_ENDPOINTS: {
    readonly PRODUCTS: "/api/products";
    readonly CALCULATIONS: "/api/calculations";
    readonly MARKETPLACES: "/api/marketplaces";
    readonly CATEGORIES: "/api/categories";
    readonly SEARCH: "/api/search";
    readonly CACHE: "/api/cache";
};
export declare const FEATURE_FLAGS: {
    readonly ADVANCED_ANALYTICS: false;
    readonly AI_ASSISTANT: false;
    readonly BULK_OPERATIONS: false;
    readonly EXPORT_PDF: false;
    readonly EXPORT_EXCEL: true;
};
