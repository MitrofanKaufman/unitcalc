// path: src/api/v1/product/product.types.ts
/**
 * Типы и интерфейсы для работы с товарами
 */

import { Document } from 'mongoose';
import { Product as ProductModel } from '@db/models/Product';

// Базовый интерфейс товара
export interface IProduct extends Document, Omit<ProductModel, '_id' | 'id'> {
  _id: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Тип для создания/обновления товара
export type TCreateProduct = Omit<ProductModel, 'createdAt' | 'updatedAt' | '_id' | 'id'>;

// Тип для обновления товара
export type TUpdateProduct = Partial<TCreateProduct>;

// Тип для ответа API с товаром
interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type TProductResponse = IApiResponse<IProduct>;
export type TProductsResponse = IApiResponse<IProduct[]>;

// Типы для запросов
export interface IGetProductsQuery {
  page?: string;
  limit?: string;
  sort?: string;
  fields?: string;
  search?: string;
}

export interface ISearchProductsQuery extends IGetProductsQuery {
  query: string;
}

// Типы для пагинации
export interface IPaginationOptions {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
}

// Результат пагинации
export interface IPaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Типы для фильтрации товаров
export interface IProductFilter {
  name?: { $regex: string; $options: string };
  article?: string;
  barcode?: string;
  category?: string;
  brand?: string;
  price?: { $gte?: number; $lte?: number };
  stock?: { $gt: number };
  isActive?: boolean;
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  $text?: { $search: string };
}
