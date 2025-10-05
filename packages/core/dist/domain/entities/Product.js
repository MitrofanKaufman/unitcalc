// packages/core/src/domain/entities/Product.ts
import { z } from 'zod';
import { ProductCostSchema } from './ProductCost';
import { Weight, WeightSchema } from '../value-objects/Weight';
import { Money, MoneySchema } from '../value-objects/Money';
/**
 * Схема валидации для Product
 */
export const ProductSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Name is required'),
    sku: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    basePrice: MoneySchema,
    cost: ProductCostSchema,
    weight: WeightSchema,
    dimensions: z.object({
        length: z.number().min(0, 'Length must be a positive number'),
        width: z.number().min(0, 'Width must be a positive number'),
        height: z.number().min(0, 'Height must be a positive number'),
        unit: z.enum(['mm', 'cm', 'm', 'in', 'ft']).default('cm')
    }).optional(),
    images: z.array(z.string().url('Invalid image URL')).optional(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date())
}).transform((data) => ({
    ...data,
    // Ensure weight is an instance of Weight
    weight: data.weight instanceof Weight ? data.weight : new Weight(data.weight.value, data.weight.unit),
    // Ensure basePrice is an instance of Money
    basePrice: data.basePrice instanceof Money ? data.basePrice : new Money(data.basePrice.amount, data.basePrice.currency)
}));
/**
 * Класс для представления товара
 */
export class Product {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.sku = data.sku;
        this.description = data.description;
        this.category = data.category;
        this.basePrice = data.basePrice;
        this.cost = data.cost;
        this.weight = data.weight;
        this.dimensions = data.dimensions;
        this.images = data.images;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.validate();
    }
    /**
     * Валидация данных товара
     */
    validate() {
        if (!this.name || this.name.trim().length === 0) {
            throw new Error('Название товара обязательно для заполнения');
        }
        if (this.basePrice.amount < 0) {
            throw new Error('Цена не может быть отрицательной');
        }
    }
    /**
     * Обновление данных товара
     */
    update(updates) {
        return new Product({
            ...this,
            ...updates,
            id: this.id,
            updatedAt: new Date()
        });
    }
}
