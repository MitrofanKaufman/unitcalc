import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateProductsTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            collation: 'utf8mb4_unicode_ci',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            collation: 'utf8mb4_unicode_ci',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            unsigned: true,
            default: 0,
          },
          {
            name: 'stock',
            type: 'int',
            unsigned: true,
            default: 0,
          },
          {
            name: 'sku',
            type: 'varchar',
            length: '100',
            collation: 'utf8mb4_unicode_ci',
            isNullable: true,
          },
          {
            name: 'barcode',
            type: 'varchar',
            length: '100',
            collation: 'utf8mb4_unicode_ci',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'json',
            isNullable: true,
            comment: 'Дополнительные метаданные товара',
          },
          {
            name: 'isActive',
            type: 'tinyint',
            width: 1,
            default: 1,
            comment: 'Флаг активности товара (1 - активен, 0 - неактивен)',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            precision: 0,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            precision: 0,
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            precision: 0,
            isNullable: true,
            comment: 'Дата удаления товара (для мягкого удаления)',
          },
        ],
      }),
      true,
    );

    // Создаем индексы
    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'IDX_PRODUCT_NAME',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'IDX_PRODUCT_SKU',
        columnNames: ['sku'],
        isUnique: true,
        where: 'sku IS NOT NULL',
      }),
    );

    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'IDX_PRODUCT_BARCODE',
        columnNames: ['barcode'],
        isUnique: true,
        where: 'barcode IS NOT NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
