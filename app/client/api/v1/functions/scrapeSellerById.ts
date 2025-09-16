// расположение: ./api/v1/functions/scrapeSellerById.ts
// Функция получения данных о продавце WB с обработкой ошибок, валидацией и логированием

import { fetchWithRetry } from '@/core/utils/fetchWithRetry';
import { Reporter } from '@/function/SmoothWeightedProgressReporter';
import { Logger } from '@/utils/logger';
import { getSellerUrl } from '@/core/constants';

export type SellerInfo = {
    id: number;
    name: string;
    rating?: number | null;
    link?: string;
    [key: string]: any;
};

export async function scrapeSellerById(
    sellerId: number,
    reporter?: Reporter,
    userId?: string
): Promise<{ seller: SellerInfo }> {
    const log = Logger.child('scrapeSeller');
    log.info(`🔍 Получение продавца ID=${sellerId}`);

    try {
        reporter?.start('seller.fetch', 'Загрузка данных продавца…');
        reporter?.next(0.1);

        const url = getSellerUrl(sellerId);
        const data = await fetchWithRetry<SellerInfo>(url, {
            timeout: 10000,
            retries: 2,
        });

        reporter?.next(0.6);

        if (!data || typeof data.name !== 'string' || !data.name.trim()) {
            const msg = `Неполные или некорректные данные продавца: ${JSON.stringify(data)}`;
            log.warn(msg);
            throw new Error(msg);
        }

        const seller: SellerInfo = {
            id: sellerId,
            name: data.name.trim(),
            rating: data.rating ?? null,
            link: url,
            ...data,
        };

        reporter?.done();
        log.info(`✅ Продавец ${sellerId} успешно загружен: ${seller.name}`);
        return { seller };
    } catch (err: any) {
        reporter?.fail();
        log.error(err, `❌ Ошибка при получении продавца ${sellerId}`);
        throw new Error(`Не удалось загрузить продавца с id=${sellerId}: ${err.message}`);
    }
}
