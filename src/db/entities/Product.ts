import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Index,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';

/**
 * Сущность товара для хранения в базе данных MySQL
 */
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci' })
  @Index('IDX_PRODUCT_NAME')
  name: string;

  @Column({ 
    type: 'text', 
    nullable: true,
    collation: 'utf8mb4_unicode_ci'
  })
  description: string | null;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    unsigned: true,
    default: 0
  })
  price: number;

  @Column({ 
    type: 'int', 
    unsigned: true,
    default: 0 
  })
  stock: number;

  @Column({ 
    type: 'varchar', 
    length: 100, 
    nullable: true,
    collation: 'utf8mb4_unicode_ci'
  })
  @Index('IDX_PRODUCT_SKU', { unique: true })
  sku: string | null;

  @Column({ 
    type: 'varchar', 
    length: 100, 
    nullable: true,
    collation: 'utf8mb4_unicode_ci'
  })
  @Index('IDX_PRODUCT_BARCODE', { unique: true })
  barcode: string | null;

  @Column({ 
    type: 'json', 
    nullable: true,
    comment: 'Дополнительные метаданные товара'
  })
  metadata: Record<string, any> | null;

  @Column({ 
    type: 'tinyint', 
    width: 1, 
    default: 1,
    comment: 'Флаг активности товара (1 - активен, 0 - неактивен)'
  })
  isActive: boolean;

  @CreateDateColumn({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    precision: 0
  })
  createdAt: Date;

  @UpdateDateColumn({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    precision: 0
  })
  updatedAt: Date;

  @Column({ 
    type: 'timestamp', 
    nullable: true,
    precision: 0,
    comment: 'Дата удаления товара (для мягкого удаления)'
  })
  deletedAt: Date | null;

  constructor(partial: Partial<Product> = {}) {
    Object.assign(this, partial);
  }

  @BeforeInsert()
  updateDates() {
    const now = new Date();
    this.createdAt = this.createdAt || now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  updateTimestamps() {
    this.updatedAt = new Date();
  }

  /**
   * Мягкое удаление товара
   */
  softDelete() {
    this.isActive = false;
    this.deletedAt = new Date();
  }

  /**
   * Восстановление товара
   */
  restore() {
    this.isActive = true;
    this.deletedAt = null;
  }
}
