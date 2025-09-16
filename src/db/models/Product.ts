// path: src/db/models/Product.ts
/**
 * Модель товара
 * Определяет схему и методы для работы с товарами в базе данных
 */

import mongoose, { Document, Schema, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from './User';

// Интерфейс для изображения товара
export interface IProductImage {
  url: string;
  isMain: boolean;
  order?: number;
  altText?: string;
}

// Интерфейс для варианта товара
export interface IProductVariant {
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  barcode?: string;
  quantity: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  options: Record<string, string>;
}

// Интерфейс для отзыва о товаре
export interface IProductReview {
  userId: mongoose.Types.ObjectId | IUser;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  likes: number;
  dislikes: number;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Основной интерфейс товара
export interface IProduct extends Document {
  // Основная информация
  name: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  barcode?: string;
  
  // Цены
  price: number;
  compareAtPrice?: number;
  cost: number;
  taxRate?: number;
  
  // Категории и теги
  categories: mongoose.Types.ObjectId[];
  tags: string[];
  
  // Изображения
  images: IProductImage[];
  
  // Варианты
  hasVariants: boolean;
  variants: IProductVariant[];
  
  // Характеристики
  brand?: string;
  model?: string;
  specifications: Record<string, any>;
  
  // Настройки видимости
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  isDownloadable: boolean;
  requiresShipping: boolean;
  isGiftCard: boolean;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  slug: string;
  
  // Отзывы и рейтинги
  reviews: IProductReview[];
  averageRating: number;
  reviewCount: number;
  
  // Внешние ID (например, из API Wildberries)
  externalId?: string;
  externalSource?: string;
  
  // Метаданные
  meta: Record<string, any>;
  
  // Владелец и даты
  createdBy: mongoose.Types.ObjectId | IUser;
  updatedBy: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
  
  // Методы
  updateRating(): Promise<void>;
  generateSlug(): Promise<string>;
  getMainImage(): string | null;
}

// Схема товара
const ProductSchema = new Schema<IProduct>(
  {
    // Основная информация
    name: {
      type: String,
      required: [true, 'Название товара обязательно'],
      trim: true,
      maxlength: [255, 'Название товара не может превышать 255 символов'],
    },
    description: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [1000, 'Краткое описание не может превышать 1000 символов'],
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      default: () => `SKU-${uuidv4().substring(0, 8).toUpperCase()}`,
    },
    barcode: {
      type: String,
      trim: true,
    },
    
    // Цены
    price: {
      type: Number,
      required: [true, 'Цена обязательна'],
      min: [0, 'Цена не может быть отрицательной'],
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Цена со скидкой не может быть отрицательной'],
      validate: {
        validator: function(this: IProduct, value: number) {
          return value > this.price;
        },
        message: 'Цена со скидкой должна быть больше обычной цены',
      },
    },
    cost: {
      type: Number,
      required: [true, 'Себестоимость обязательна'],
      min: [0, 'Себестоимость не может быть отрицательной'],
    },
    taxRate: {
      type: Number,
      min: [0, 'Налоговая ставка не может быть отрицательной'],
      max: [100, 'Налоговая ставка не может превышать 100%'],
    },
    
    // Категории и теги
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Хотя бы одна категория должна быть указана'],
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    
    // Изображения
    images: [{
      url: {
        type: String,
        required: [true, 'URL изображения обязателен'],
      },
      isMain: {
        type: Boolean,
        default: false,
      },
      order: {
        type: Number,
        default: 0,
      },
      altText: {
        type: String,
        trim: true,
      },
    }],
    
    // Варианты
    hasVariants: {
      type: Boolean,
      default: false,
    },
    variants: [{
      name: {
        type: String,
        required: [true, 'Название варианта обязательно'],
        trim: true,
      },
      sku: {
        type: String,
        required: [true, 'SKU варианта обязательно'],
        trim: true,
      },
      price: {
        type: Number,
        required: [true, 'Цена варианта обязательна'],
        min: [0, 'Цена варианта не может быть отрицательной'],
      },
      compareAtPrice: {
        type: Number,
        min: [0, 'Цена со скидкой не может быть отрицательной'],
      },
      cost: {
        type: Number,
        required: [true, 'Себестоимость варианта обязательна'],
        min: [0, 'Себестоимость варианта не может быть отрицательной'],
      },
      barcode: {
        type: String,
        trim: true,
      },
      quantity: {
        type: Number,
        required: [true, 'Количество обязательно'],
        min: [0, 'Количество не может быть отрицательным'],
        default: 0,
      },
      weight: {
        type: Number,
        min: [0, 'Вес не может быть отрицательным'],
      },
      dimensions: {
        length: {
          type: Number,
          min: [0, 'Длина не может быть отрицательной'],
        },
        width: {
          type: Number,
          min: [0, 'Ширина не может быть отрицательной'],
        },
        height: {
          type: Number,
          min: [0, 'Высота не может быть отрицательной'],
        },
      },
      options: {
        type: Map,
        of: String,
      },
    }],
    
    // Характеристики
    brand: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    specifications: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    
    // Настройки видимости
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDigital: {
      type: Boolean,
      default: false,
    },
    isDownloadable: {
      type: Boolean,
      default: false,
    },
    requiresShipping: {
      type: Boolean,
      default: true,
    },
    isGiftCard: {
      type: Boolean,
      default: false,
    },
    
    // SEO
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [70, 'SEO заголовок не может превышать 70 символов'],
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: [320, 'SEO описание не может превышать 320 символов'],
    },
    seoKeywords: [{
      type: String,
      trim: true,
    }],
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    
    // Отзывы и рейтинги
    reviews: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      title: {
        type: String,
        trim: true,
        maxlength: [100, 'Заголовок отзыва не может превышать 100 символов'],
      },
      comment: {
        type: String,
        trim: true,
        maxlength: [2000, 'Комментарий не может превышать 2000 символов'],
      },
      images: [{
        type: String,
        trim: true,
      }],
      likes: {
        type: Number,
        default: 0,
        min: 0,
      },
      dislikes: {
        type: Number,
        default: 0,
        min: 0,
      },
      isVerifiedPurchase: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Рейтинг не может быть отрицательным'],
      max: [5, 'Максимальный рейтинг - 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Количество отзывов не может быть отрицательным'],
    },
    
    // Внешние ID
    externalId: {
      type: String,
      trim: true,
    },
    externalSource: {
      type: String,
      trim: true,
      enum: {
        values: ['wildberries', 'ozon', 'yandex-market', 'sbermegamarket'],
        message: 'Неподдерживаемый внешний источник',
      },
    },
    
    // Метаданные
    meta: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    
    // Владелец и даты
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Создатель товара обязателен'],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Редактор товара обязателен'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Виртуальное поле для URL товара
ProductSchema.virtual('url').get(function(this: IProduct) {
  return `/products/${this.slug}`;
});

// Индексы для ускорения поиска
ProductSchema.index({ name: 'text', description: 'text', 'variants.name': 'text' });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ barcode: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ 'categories': 1 });
ProductSchema.index({ 'tags': 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ reviewCount: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ updatedAt: -1 });

// Middleware для генерации slug перед сохранением
ProductSchema.pre<IProduct>('save', async function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = await this.generateSlug();
  }
  next();
});

// Middleware для обновления даты изменения при обновлении
ProductSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Метод для генерации slug
ProductSchema.methods.generateSlug = async function(this: IProduct): Promise<string> {
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Удаляем диакритические знаки
      .replace(/[^\w\s-]/g, '') // Удаляем все не-слова
      .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
      .replace(/--+/g, '-') // Удаляем двойные дефисы
      .replace(/^-+/, '') // Удаляем дефисы с начала
      .replace(/-+$/, ''); // Удаляем дефисы с конца
  };
  
  let baseSlug = slugify(this.name);
  let slug = baseSlug;
  let counter = 1;
  
  // Проверяем уникальность slug
  const ProductModel = this.constructor as Model<IProduct>;
  while (await ProductModel.findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${counter++}`;
  }
  
  return slug;
};

// Метод для обновления рейтинга товара
ProductSchema.methods.updateRating = async function(this: IProduct): Promise<void> {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.reviewCount = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.averageRating = parseFloat((totalRating / this.reviews.length).toFixed(1));
  this.reviewCount = this.reviews.length;
};

// Метод для получения основного изображения
ProductSchema.methods.getMainImage = function(this: IProduct): string | null {
  const mainImage = this.images.find((img: IProductImage) => img.isMain);
  if (mainImage) {
    return mainImage.url;
  }
  
  return this.images.length > 0 ? this.images[0].url : null;
};

// Создаем и экспортируем модель
const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
