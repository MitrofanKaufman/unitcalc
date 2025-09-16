// path: src/api/messages.js
/**
 * Класс для управления локализованными сообщениями об ошибках, уведомлениях и этапах выполнения.
 */
export default class Messages {
    /**
     * @param {string} language — код языка ('ru', 'en', ...).
     */
    constructor(language = 'ru') {
        this.language = language;
        this.messages = {
            errors: {
                scraping: 'Ошибка при парсинге:',
                dataFetch: 'Ошибка при получении данных',
                pageNotFound: 'Страница не найдена',
                sellerNotFound: 'Не найдена ссылка на продавца',
                getTitleError: 'Ошибка получения названия',
                getPriceError: 'Ошибка получения цены',
                handlePriceHistoryError: 'Ошибка получения истории цен',
                getPriceRangeError: 'Ошибка получения диапазона цен',
                closePopupError: 'Ошибка закрытия всплывающего окна',
                getRatingAndReviewsError: 'Ошибка получения рейтинга и отзывов',
                getAdditionalCountsError: 'Ошибка получения дополнительных данных',
                getImgError: 'Ошибка получения изображения',
                getOriginalMarkError: 'Ошибка получения показателя оригинальности',
                getProductParametersError: 'Ошибка получения характеристик продукта',
                getSellerInfoError: 'Ошибка получения данных о продавце'
            },
            notifications: {
                //serverStarted: (host, port) => `🚀 Сервер запущен: http://${host}:${port}`,
                dataFetchedSuccessfully: 'Данные успешно получены',
                productFetchedSuccessfully: 'Продукт успешно спарсен',
                sellerInfoFetchedSuccessfully: 'Информация о продавце успешно получена',
                sellerPageOpenedSuccessfully: 'Страница продавца успешно открыта',
                titleFetchedSuccessfully: 'Название успешно получено',
                priceFetchedSuccessfully: 'Цена успешно получена',
                priceHistoryFetchedSuccessfully: 'История цен успешно получена',
                priceRangeFetchedSuccessfully: 'Диапазон цен успешно получен',
                productParametersFetchedSuccessfully: 'Характеристики продукта успешно получены',
                imageFetchedSuccessfully: 'Изображение успешно получено',
                ratingAndReviewsFetchedSuccessfully: 'Рейтинг и отзывы успешно получены',
                additionalCountsFetchedSuccessfully: 'Дополнительные данные успешно получены',
                originalMarkFetchedSuccessfully: 'Показатель оригинальности успешно получен'
            },
            steps: {
                pageLoad: (timeout) => `Ожидание полной загрузки страницы (таймаут ${timeout} мс)…`,
                title: 'Определение наименования товара…',
                price: 'Определение текущей цены товара…',
                ratingAndReviews: 'Определение рейтинга и отзывов товара…',
                image: 'Сохранение изображения товара…',
                seller: 'Определение информации о продавце…'
            }
        };
    }

    /**
     * Возвращает текст ошибки по ключу, поддерживая короткие алиасы.
     *
     * @param {string} key — ключ сообщения об ошибке. Например, можно использовать 'title' вместо 'getTitleError'
     * @returns {string} — текст ошибки.
     */
    getError(key) {
        // Сопоставление коротких ключей с корректными ключами сообщений
        const keyMapping = {
            title: 'getTitleError',
            price: 'getPriceError'
            // Можно добавить дополнительные сопоставления, если потребуется
        };
        if (keyMapping.hasOwnProperty(key)) {
            key = keyMapping[key];
        }
        return this.messages.errors[key] || '';
    }

    /**
     * Возвращает текст уведомления по ключу, подставляя аргументы в шаблон.
     * @param {string} key — ключ уведомления.
     * @param {...any} args — аргументы для шаблонной функции.
     * @returns {string} — текст уведомления.
     */
    getNotification(key, ...args) {
        const msg = this.messages.notifications[key];
        return typeof msg === 'function' ? msg(...args) : (msg || '');
    }

    /**
     * Возвращает описание этапа выполнения по ключу, подставляя аргументы.
     * @param {string} key — ключ этапа.
     * @param {...any} args — аргументы для шаблонной функции.
     * @returns {string} — описание этапа выполнения.
     */
    getStep(key, ...args) {
        const msg = this.messages.steps[key];
        return typeof msg === 'function' ? msg(...args) : (msg || '');
    }
}
