// path: src/api/v1/main.js
import { initStorageCalculator } from "@api/calculator";

const prodInp     = document.getElementById('productInput');
const prodBtn     = document.getElementById('getProductBtn');
const sellInp     = document.getElementById('sellerInput');
const sellBtn     = document.getElementById('getSellerBtn');
const btnToggle   = document.getElementById('toggleBtn');

const parsedView  = document.getElementById('parsedView');
const jsonView    = document.getElementById('jsonView');
const calcView    = document.getElementById('calcView');
const loadingBox  = document.getElementById('loadingContainer');
const statusText  = document.getElementById('loadingStatus');
const resultContainer = document.getElementById('result');
const tooltip = document.createElement('div');

const progressBar = loadingBox.querySelector('.progress-bar');
let data = null;
let raw = false;
let currentProgress = 0;
window.prevParsedHTML = null;

tooltip.id = 'sellerTooltip';
tooltip.style.display = 'none';
tooltip.style.position = 'fixed';
tooltip.style.zIndex = 9999;
tooltip.style.background = '#fff';
tooltip.style.padding = '8px';
tooltip.style.border = '1px solid #ccc';
tooltip.style.borderRadius = '4px';
tooltip.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
document.body.appendChild(tooltip);

// 🌙 Тёмная тема и onboarding
document.addEventListener("DOMContentLoaded", () => {
    console.log("[INFO] DOM загружен. Инициализация темы и onboarding...");
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        console.log("[INFO] Включена тёмная тема из локального хранилища");
        document.documentElement.classList.add("dark-theme");
    }

    document.querySelectorAll(".card, .controls, .input-area").forEach(el => {
        el.classList.add("fade-in");
    });

    const onboardBtn = document.getElementById("startBtn");
    onboardBtn?.addEventListener("click", () => {
        console.log("[INFO] Onboarding завершён пользователем");
        document.getElementById("onboarding").style.display = "none";
    });

    const themeToggle = document.getElementById("toggleTheme");
    themeToggle?.addEventListener("click", () => {
        const root = document.documentElement;
        root.classList.toggle("dark-theme");
        const theme = root.classList.contains("dark-theme") ? "dark" : "light";
        localStorage.setItem("theme", theme);
        console.log(`[INFO] Тема переключена на: ${theme}`);
    });
});

/**
 * Загружает данные комиссий из json-файла
 * @returns {Promise<Object>}
 */
async function loadCommissionData() {
    console.log("[INFO] Загружаем данные комиссий...");
    const res = await fetch('api/v1/json/commission_ru.json');
    if (!res.ok) {
        console.error("[ERROR] Не удалось загрузить данные комиссий");
        throw new Error('Не удалось загрузить данные комиссий');
    }
    const json = await res.json();
    console.log("[INFO] Данные комиссий загружены");
    return json;
}

/**
 * Сопоставляет категорию товара с данными комиссии и записывает в data.product.commission
 */
async function matchCategoryWithCommission() {
    console.log("[INFO] Сопоставляем категорию товара с комиссией...");
    const commissionData = await loadCommissionData();
    if (!data?.product?.xsubject) {
        console.warn("[WARN] Нет xsubject в данных товара");
        return;
    }
    const xsubjectId = Number(data.product.xsubject);
    const match = commissionData.report.find(entry => entry.subjectID === xsubjectId);
    if (match) {
        data.product.commission = {
            kgvpMarketplace: match.kgvpMarketplace,
            kgvpSupplier: match.kgvpSupplier,
            kgvpSupplierExpress: match.kgvpSupplierExpress,
            paidStorageKgvp: match.paidStorageKgvp
        };
        console.log("[INFO] Комиссия сопоставлена:", data.product.commission);
    } else {
        console.warn("[WARN] Не найдено совпадение комиссии для xsubjectId:", xsubjectId);
    }
}

/**
 * Формирует HTML с информацией о продавце
 * @param {Object} s данные продавца
 * @returns {string} html-код
 */
function buildSellerHTML(s) {
    let html = '';
    if (s.logo) {
        html += `<img src="${s.logo}" alt="${s.name || ''}" style="max-width:60px;float:right;margin-left:8px;border-radius:3px">`;
    }
    html += `<strong style="font-size:14px">${s.name || 'Продавец #' + s.id}</strong><br>`;
    if (s.rating != null) html += `Рейтинг: <b>${s.rating}</b><br>`;
    if (s.reviews != null) html += `Отзывы: <b>${s.reviews}</b><br>`;
    if (s.sales != null) html += `Продажи: <b>${s.sales}</b><br>`;
    if (s.buyoutRate != null) html += `Выкуп: <b>${s.buyoutRate}%</b><br>`;
    if (s.timeOnWB != null) html += `На WB: <b>${s.timeOnWB} лет</b><br>`;
    if (s.status) html += `Статус: <b>${s.status}</b><br>`;
    if (s.details && typeof s.details === 'object' && Object.keys(s.details).length) {
        html += '<hr style="border:none;border-top:1px solid #444;margin:6px 0">';
        for (const [k, v] of Object.entries(s.details)) {
            html += `${k}: <b>${v}</b><br>`;
        }
    }
    return html;
}

/** Показывает тултип с переданным html в координатах x,y */
function showTooltip(html, x, y) {
    tooltip.innerHTML = html;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.style.display = 'block';
    console.log("[INFO] Показан тултип");
}

/** Скрывает тултип */
function hideTooltip() {
    tooltip.style.display = 'none';
    console.log("[INFO] Скрыт тултип");
}

/**
 * Обновляет вид отображения данных: raw JSON или парсинг
 */
function updateView() {
    calcView.style.display = 'none';
    if (!data) {
        parsedView.style.display = 'block';
        parsedView.textContent = 'Нет данных. Выполните запрос.';
        jsonView.style.display = 'none';
        console.log("[INFO] Нет данных для отображения");
        return;
    }
    if (raw) {
        parsedView.style.display = 'none';
        jsonView.textContent = JSON.stringify(data, null, 2);
        jsonView.style.display = 'block';
        btnToggle.textContent = 'VIEW';
        console.log("[INFO] Отображение в формате RAW JSON");
    } else {
        renderParsed();
        parsedView.style.display = 'block';
        jsonView.style.display = 'none';
        btnToggle.textContent = 'RAW';
        console.log("[INFO] Отображение в формате парсинга");
    }
    window.updateView = updateView;
}

/**
 * Отрисовывает парсинг данных в удобочитаемом формате
 */
function renderParsed() {
    parsedView.innerHTML = '';
    if (data.product) {
        const { product } = data;
        const results = document.createElement('div');
        results.className = 'results';

        // Хлебные крошки
        let breadcrumbText = '';
        if (product.category) breadcrumbText += product.category;
        if (product.subcategory) breadcrumbText += ' > ' + product.subcategory;
        if (product.title) breadcrumbText += ' > ' + product.title;
        else breadcrumbText += ' > ' + `Товар ${product.id}`;

        const header = document.createElement('h3');
        header.textContent = breadcrumbText;
        results.appendChild(header);

        // Изображение товара
        if (product.image) {
            const row = document.createElement('div');
            row.className = 'result-row';

            const label = document.createElement('div');
            label.className = 'label';
            label.textContent = 'Изображение';
            row.appendChild(label);

            const value = document.createElement('div');
            value.className = 'value';
            value.style.display = 'flex';
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.name || 'Изображение товара';
            value.appendChild(img);
            row.appendChild(value);

            results.appendChild(row);
        }

        // Вспомогательная функция для создания строк
        function createRow(labelText, valueText, dataField, tooltipText = '') {
            const row = document.createElement('div');
            row.className = 'result-row';

            const label = document.createElement('div');
            label.className = 'label';
            label.textContent = labelText;
            if (tooltipText) {
                const tooltip = document.createElement('span');
                tooltip.className = 'tooltip';
                tooltip.setAttribute('data-tooltip', tooltipText);
                tooltip.textContent = '?';
                label.appendChild(tooltip);
            }
            row.appendChild(label);

            const valueDiv = document.createElement('div');
            valueDiv.className = 'value';
            valueDiv.style.display = 'flex';
            const span = document.createElement('span');
            if (dataField) span.setAttribute('data-field', dataField);
            span.textContent = valueText;
            valueDiv.appendChild(span);
            row.appendChild(valueDiv);

            return row;
        }

        // Метаданные продукта
        if (product.rating != null) results.appendChild(createRow('Рейтинг', product.rating, 'rating'));
        if (product.reviews != null) results.appendChild(createRow('Отзывы', product.reviews, 'reviews'));
        if (product.questions != null) results.appendChild(createRow('Вопросы', product.questions, 'questions'));

        // Продавец с раскрывающейся информацией
        if (product.seller && product.seller.name) {
            const sellerRow = document.createElement('div');
            sellerRow.className = 'result-row';

            const sellerLabel = document.createElement('div');
            sellerLabel.className = 'label';
            sellerLabel.textContent = 'Продавец';
            const tooltipSpan = document.createElement('span');
            tooltipSpan.className = 'tooltip';
            tooltipSpan.setAttribute('data-tooltip', 'Информация о продавце.');
            tooltipSpan.textContent = '?';
            sellerLabel.appendChild(tooltipSpan);
            sellerRow.appendChild(sellerLabel);

            const sellerValue = document.createElement('div');
            sellerValue.className = 'value';
            sellerValue.style.display = 'flex';

            const sellerLink = document.createElement('a');
            sellerLink.href = '#';
            sellerLink.className = 'seller-toggle';
            sellerLink.textContent = product.seller.name;
            sellerValue.appendChild(sellerLink);

            const sellerInfo = document.createElement('div');
            sellerInfo.className = 'seller-info';
            sellerInfo.style.display = 'none';
            sellerInfo.innerHTML = buildSellerHTML(product.seller);
            sellerValue.appendChild(sellerInfo);

            sellerLink.addEventListener('click', (e) => {
                e.preventDefault();
                sellerInfo.style.display = sellerInfo.style.display === 'none' ? 'block' : 'none';
                console.log(`[INFO] Переключение отображения информации о продавце: ${sellerInfo.style.display}`);
            });

            sellerRow.appendChild(sellerValue);
            results.appendChild(sellerRow);
        }

        results.appendChild(createRow('ID', product.id, 'id'));
        if (product.price != null) {
            results.appendChild(createRow('Цена (₽)', product.price, 'price'));
        }

        // Параметры продукта
        if (product.productParameters) {
            for (const [key, val] of Object.entries(product.productParameters)) {
                let cleanedValue = val;
                if (typeof val === 'string') {
                    const match = val.match(/[\d.,]+/);
                    cleanedValue = match ? match[0] : val;
                }
                results.appendChild(createRow(key, cleanedValue, key));
            }
        }

        parsedView.appendChild(results);
        console.log("[INFO] Данные успешно отрисованы");
    }

    // Ошибки
    if (data.errors?.length) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'results';

        const header = document.createElement('h3');
        header.textContent = 'Ошибки';
        header.style.color = '#ff5555';
        errorContainer.appendChild(header);

        const pre = document.createElement('pre');
        pre.textContent = JSON.stringify(data.errors, null, 2);
        errorContainer.appendChild(pre);

        parsedView.appendChild(errorContainer);
        console.warn("[WARN] Отображены ошибки:", data.errors);
    }
}

/**
 * Запускает SSE-подключение по указанному URL и обрабатывает данные
 * @param {string} url
 */
/**
 * Запускает SSE-подключение по указанному URL и обрабатывает данные
 * @param {string} url
 */
function startSSE(url) {
    console.log(`[INFO] Запуск SSE соединения по адресу: ${url}`);
    currentProgress = 0;
    progressBar.style.width = '0%';
    statusText.textContent = '...';
    loadingBox.style.display = 'block';
    parsedView.style.visibility = 'hidden';
    jsonView.style.visibility = 'hidden';

    const es = new EventSource(url);

    es.onmessage = e => {
        try {
            const { percent, text } = JSON.parse(e.data);
            if (typeof percent === 'number' && percent >= currentProgress) {
                progressBar.style.width = percent + '%';
                currentProgress = percent;
                console.log(`[INFO] Прогресс обновлён: ${percent}%`);
            }
            if (text) {
                statusText.textContent = text;
                console.log(`[INFO] Статус: ${text}`);
            }
        } catch (err) {
            console.error("[ERROR] Ошибка парсинга SSE сообщения:", err);
        }
    };

    es.addEventListener('result', async (e) => {
        try {
            data = JSON.parse(e.data);
            window.data = data;
            console.log("[INFO] Получены финальные данные:", data);
            await matchCategoryWithCommission();
            loadingBox.style.display = 'none';
            parsedView.style.visibility = 'visible';
            jsonView.style.visibility = 'visible';
            window.prevParsedHTML = parsedView.innerHTML;
            updateView();
            es.close();
            console.log("[INFO] SSE соединение закрыто после получения результата");
        } catch (err) {
            statusText.textContent = 'Ошибка обработки данных';
            console.error("[ERROR] Ошибка при обработке данных:", err);
            es.close();
        }
    });

    es.addEventListener('redirect', (e) => {
        try {
            const { location } = JSON.parse(e.data);
            if (location && typeof location === 'string') {
                console.log(`[INFO] Получен редирект: ${location}`);
                window.location.href = location;
            }
        } catch (err) {
            console.error("[ERROR] Ошибка обработки события redirect:", err);
        }
    });

    es.onerror = () => {
        statusText.textContent = 'Ошибка соединения';
        console.error("[ERROR] SSE соединение прервано");
        es.close();
    };
}


// Обработчики кнопок

prodBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const id = prodInp.value.match(/\d+/)?.[0];
    if (!id) {
        alert('Введите корректный ID товара');
        console.warn("[WARN] Некорректный ID товара");
        return;
    }
    data = null;
    raw = false;
    updateView();
    startSSE(`/api/v1/stream/product?id=${id}`);
});

sellBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const id = sellInp.value.match(/\d+/)?.[0];
    if (!id) {
        alert('Введите корректный ID продавца');
        console.warn("[WARN] Некорректный ID продавца");
        return;
    }
    data = null;
    raw = false;
    updateView();
    startSSE(`/api/v1/stream/seller?id=${id}`);
});

btnToggle.addEventListener('click', () => {
    if (!data) {
        console.warn("[WARN] Нет данных для переключения вида");
        return;
    }
    raw = !raw;
    updateView();
    console.log(`[INFO] Переключение вида отображения: ${raw ? 'RAW' : 'PARSED'}`);
});

window.updateView = updateView;
updateView();
