// path: src/api/v1/calculator.js
export class StorageCalculator {
    constructor() {
        this.boxRates = null;
        this.palletRates = null;
        this.returnRates = null;
        this.commissionRates = null;
    }

    async loadRates() {
        const [boxRes, palletRes, returnRes, commissionRes] = await Promise.all([
            fetch('/api/v1/json/tariffs_box.json'),
            fetch('/api/v1/json/tariffs_pallet.json'),
            fetch('/api/v1/json/tariffs_return.json'),
            fetch('/api/v1/json/commission_ru.json')
        ]);

        if (![boxRes, palletRes, returnRes, commissionRes].every(res => res.ok)) {
            throw new Error('Ошибка загрузки тарифов');
        }

        [this.boxRates, this.palletRates, this.returnRates, this.commissionRates] = await Promise.all([
            boxRes.json(),
            palletRes.json(),
            returnRes.json(),
            commissionRes.json()
        ]);
    }

    parseValue(value) {
        if (value == null) return 0;
        const str = String(value).trim();
        if (str === '' || str === '-') return 0;
        return Number(str.replace(/\s/g, '').replace(',', '.'));
    }

    _getWarehouseData(type) {
        return type === 'box'
            ? this.boxRates.response.data.warehouseList
            : this.palletRates.response.data.warehouseList;
    }

    _calculateCommission(match, price) {
        const getPct = key => this.parseValue(match?.[key]);
        const result = {
            marketplace: getPct("kgvpMarketplace"),
            supplier: getPct("kgvpSupplier"),
            express: getPct("kgvpSupplierExpress"),
            storage: getPct("paidStorageKgvp")
        };

        return {
            marketplace: { pct: result.marketplace, rub: price * result.marketplace / 100 },
            supplier: { pct: result.supplier, rub: price * result.supplier / 100 },
            express: { pct: result.express, rub: price * result.express / 100 },
            storage: { pct: result.storage, rub: price * result.storage / 100 }
        };
    }

    _renderCommission(commission) {
        const keyToAttr = {
            marketplace: 'mp',
            supplier: 'supplier',
            express: 'express',
            storage: 'storage'
        };

        Object.entries(commission).forEach(([key, { rub, pct }]) => {
            const attr = keyToAttr[key];
            const valueEl = document.querySelector(`[data-field="commission-${attr}"]`);
            const percentEl = document.querySelector(`[data-percent="${attr}"]`);
            const rowEl = valueEl?.parentElement;

            if (valueEl) valueEl.textContent = rub.toFixed(2);
            if (percentEl) percentEl.textContent = `(${pct}%)`;
            if (rowEl) rowEl.style.display = "flex";
        });

        if (!commission || Object.keys(commission).length === 0) {
            console.warn("Комиссия не найдена или не рассчитана.");
        }
    }

    _showResultRows() {
        ['delivery', 'storage', 'return', 'total'].forEach(field => {
            const row = document.querySelector(`[data-field="${field}"]`)?.parentElement;
            if (row) row.style.display = "flex";
        });
    }

    async populateWarehouses() {
        const type = document.getElementById('storageType')?.value;
        if (!type) return;

        if (!this.boxRates || !this.palletRates) await this.loadRates();

        const warehouses = this._getWarehouseData(type);
        const select = document.getElementById('warehouse');
        if (!select) return;

        select.innerHTML = '';
        warehouses.forEach(w => {
            const option = document.createElement('option');
            option.value = w.warehouseName;
            option.textContent = w.warehouseName;
            select.appendChild(option);
        });
        select.selectedIndex = 0;
    }

    async calculateCost() {
        const $ = id => document.getElementById(id);
        const type = $('storageType')?.value;
        const warehouse = $('warehouse')?.value;
        const quantity = parseInt($('quantity')?.value || '1', 10) || 1;
        const price = parseFloat($('price')?.value) || 0;
        const length = parseFloat($('length')?.value) || 0;
        const width = parseFloat($('width')?.value) || 0;
        const height = parseFloat($('height')?.value) || 0;
        const volume = (length * width * height) / 1000000;

        if (!type || !warehouse) return;
        if (!this.boxRates || !this.palletRates || !this.returnRates || !this.commissionRates) {
            await this.loadRates();
        }

        const warehouses = this._getWarehouseData(type);
        const selected = warehouses.find(w => w.warehouseName === warehouse);
        const returnWh = this.returnRates?.response?.data?.warehouseList?.find(w => w.warehouseName === warehouse);
        if (!selected) return;

        const deliveryRate = this.parseValue(type === 'box'
            ? selected.boxDeliveryBase
            : selected.palletDeliveryValueBase);
        const storageRate = this.parseValue(type === 'box'
            ? selected.boxStorageBase
            : selected.palletStorageBase);

        const deliveryCost = deliveryRate * quantity;
        const storageCost = storageRate * quantity;

        // Расчёт возвратной стоимости
        const category = window.data?.product?.subcategory || null;
        const returnReport = this.returnRates?.response?.data?.report;
        const returnEntry = category && Array.isArray(returnReport)
            ? returnReport.find(e => e.subjectName === category)
            : null;

        let returnCost = 0;
        if (returnEntry) {
            const rate = this.parseValue(returnEntry.kgvpSupplier);
            returnCost = quantity * rate * volume;
        } else if (returnWh) {
            const base = this.parseValue(returnWh.deliveryDumpSupOfficeBase);
            const liter = this.parseValue(returnWh.deliveryDumpSupOfficeLiter);
            returnCost = quantity * (base + liter * volume);
        }

        const total = deliveryCost + storageCost + returnCost;

        document.querySelector('[data-field="delivery"]').textContent = deliveryCost.toFixed(2);
        document.querySelector('[data-field="storage"]').textContent = storageCost.toFixed(2);
        document.querySelector('[data-field="return"]').textContent = returnCost.toFixed(2);
        document.querySelector('[data-field="total"]').textContent = total.toFixed(2);

        this._showResultRows();

        // Комиссии — исправлено
        let commissionData = window.data?.product?.commission || null;
        const commissionReport = this.commissionRates?.report;

        if (!commissionData) {
            const xsubjectRaw = window.data?.product?.xsubject;
            const xsubjectId = Number(xsubjectRaw);
            if (!isNaN(xsubjectId)) {
                commissionData = commissionReport?.find(e => Number(e.subjectID) === xsubjectId);
            }
        }

        if (!commissionData) {
            const category = window.data?.product?.subcategory || window.data?.product?.category;
            if (category && Array.isArray(commissionReport)) {
                commissionData = commissionReport.find(e =>
                    e.subjectName?.toLowerCase().trim() === category.toLowerCase().trim()
                );
            }
        }

        const commission = this._calculateCommission(commissionData, price);
        this._renderCommission(commission);
    }

    async initStorageCalculator(productData) {
        const container = document.getElementById('calcView');
        if (!container) return;

        const res = await fetch('/templates/calculator.html');
        if (!res.ok) {
            console.error('Ошибка загрузки шаблона калькулятора');
            return;
        }
        container.innerHTML = await res.text();

        if (productData) {
            const product = productData.product || productData;

            const weight = parseFloat(product.productParameters?.["Вес товара с упаковкой (г)"]?.replace(/\D/g, '') || '10000') / 1000;
            const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
            set('weight', weight || 10);
            set('quantity', 1);
            set('price', product.price || 100);
            ['length', 'width', 'height'].forEach(dim => {
                const fieldId = dim[0].toUpperCase() + dim.slice(1);
                set(dim, parseFloat(product.productParameters?.[fieldId]) || 0);
            });
        }

        await this.populateWarehouses();

        document.getElementById('storageType')?.addEventListener('change', async () => {
            await this.populateWarehouses();
            this.calculateCost();
        });

        document.getElementById('warehouse')?.addEventListener('change', () => this.calculateCost());

        ['weight', 'length', 'width', 'height', 'quantity', 'price'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => this.calculateCost());
        });

        this.calculateCost();
    }
}

export const storageCalculator = new StorageCalculator();
export const initStorageCalculator = storageCalculator.initStorageCalculator.bind(storageCalculator);

document.getElementById('calcBtn').addEventListener('click', async () => {
    if (!window.data || !window.data.product) {
        console.error("Нет данных о товаре для передачи в калькулятор.");
        return;
    }

    const parsedView = document.getElementById('parsedView');
    const result = document.getElementById('result');
    if (parsedView && result) {
        window.prevParsedHTML = parsedView.innerHTML;
        result.classList.add('flex-layout');
        parsedView.style.display = 'block';
    }

    await initStorageCalculator(window.data);
});
