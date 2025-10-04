// packages/core/src/domain/entities/Product.ts

import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  sku: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  basePrice: z.number().min(0, 'Base price must be a positive number'),
  cost: z.number().min(0, 'Cost must be a positive number'),
  weight: z.number().min(0, 'Weight must be a positive number'),
  weightUnit: z.enum(['g', 'kg', 'lb', 'oz']).default('g'),
  dimensions: z.object({
    length: z.number().min(0, 'Length must be a positive number'),
    width: z.number().min(0, 'Width must be a positive number'),
    height: z.number().min(0, 'Height must be a positive number'),
    unit: z.enum(['mm', 'cm', 'm', 'in', 'ft']).default('cm')
  }).optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export type Product = z.infer<typeof ProductSchema>;
