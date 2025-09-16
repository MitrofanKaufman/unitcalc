// path: src/api/v1/method/priceHistory.js

/**
 * Вытаскивает историю изменения цены из SVG-графика на странице.
 * @param {import('playwright').Page} page
 * @param {Settings} settings
 * @param {Messages} messages
 * @param {ExecutionData} executionData
 * @param {object} result — объект, в который запишем поле result.priceHistory
 *
 * Пример:
 * await scrapePriceHistory(
 *     this.page,
 *     this.settings,
 *     this.messages,
 *     this.executionData,
 *     this.result
 * );
 *
 */

export async function scrapePriceHistory(page, settings, messages, executionData, result) {
    try {
        // 1. Ждём, пока секция появится в DOM
        await page.waitForSelector('section.price-history', {
            timeout: settings.scrapeTimeout
        });

        // 2. Берём последнюю секцию с историей и дожидаемся её видимости
        const allSections = page.locator('section.price-history');
        const section     = allSections.last();
        await section.waitFor({ state: 'visible', timeout: settings.scrapeTimeout });

        // 3. Прокручиваем её в видимую область и кликаем (force на случай перекрытия)
        await section.scrollIntoViewIfNeeded();
        await section.click({ force: true, timeout: settings.scrapeTimeout });

        // 4. Ждём появления SVG-графика внутри этой секции
        await page.waitForSelector('section.price-history svg.history-chart', {
            timeout: settings.scrapeTimeout
        });

        // 5. Достаём viewBox чтобы узнать размеры графика
        const viewBox = await section.$eval(
            'svg.history-chart',
            svg => svg.getAttribute('viewBox')
        );
        const [ , , chartWidth, chartHeight ] = viewBox.split(' ').map(Number);

        // 6. Получаем d‑атрибут линии цены (stroke‑path)
        const d = await section.$eval(
            'svg.history-chart path[stroke]',
            path => path.getAttribute('d')
        );
        const coords = d.match(/-?\d+(\.\d+)?/g).map(Number);

        // 7. Первые две точки определяют y0 (базовую линию)
        const y0 = coords[1];

        // 8. Вычисляем, сколько точек цен хранится в атрибуте d
        const stepCount = Math.floor((coords.length - 2) / 6);
        const points = [];
        for (let i = 0; i < stepCount; i++) {
            const idx = 2 + i * 6;
            points.push({ x: coords[idx + 4], y: coords[idx + 5] });
        }

        // 9. Читаем текстовые min/max цены
        const [ minPrice, maxPrice ] = await section.$$eval(
            '.price-history__text > span',
            spans => spans.map(s => parseInt(s.textContent.replace(/\D/g,''), 10))
        );

        // 10. Парсим даты начала/конца
        const [ startText, endText ] = await section.$$eval(
            '.price-history__date span',
            spans => spans.map(s => s.textContent.trim())
        );
        const parseRuDate = str => {
            const [d, m, y] = str.split(' ');
            const months = {
                янв:'Jan', фев:'Feb', мар:'Mar', апр:'Apr',
                май:'May', июн:'Jun', июл:'Jul', авг:'Aug',
                сен:'Sep', окт:'Oct', ноя:'Nov', дек:'Dec'
            };
            return new Date(`${d} ${months[m]} ${y}`);
        };
        const startDate = parseRuDate(startText);
        const endDate   = parseRuDate(endText);
        const totalMs   = endDate.getTime() - startDate.getTime();

        // 11. Строим массив { date, price }
        const history = points.map(({ x, y }) => {
            const timestamp = startDate.getTime() + (x / chartWidth) * totalMs;
            // инвертируем y‑координату (меньшее y = большая цена)
            const price = minPrice + ((y - y0) / (chartHeight - y0)) * (maxPrice - minPrice);
            return {
                date:  new Date(timestamp).toISOString().slice(0, 10),
                price: Math.round(price)
            };
        });

        result.priceHistory = history;
        executionData.markCompleted('priceHistory');

    } catch (err) {
        executionData.addError({
            text: messages.getError('handlePriceHistoryError'),
            original: err.toString()
        });
    }
}
