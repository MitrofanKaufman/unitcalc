// path: src/api/session.js

import { Model, DataTypes } from 'sequelize';

/**
 * Модель для хранения пользователей, авторизовавшихся через Telegram Login Widget.
 */
export default class TelegramUser extends Model {
    /**
     * Инициализация модели в Sequelize.
     * @param {import('sequelize').Sequelize} sequelize — экземпляр Sequelize.
     */
    static initModel(sequelize) {
        TelegramUser.init({
            // Внутренний ID в нашей БД
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            // Уникальный идентификатор пользователя в Telegram
            telegramId: {
                type: DataTypes.BIGINT,
                allowNull: false,
                unique: true,
                field: 'telegram_id',
            },
            // Имя пользователя из Telegram
            firstName: {
                type: DataTypes.STRING(255),
                allowNull: false,
                field: 'first_name',
            },
            // Фамилия (если есть)
            lastName: {
                type: DataTypes.STRING(255),
                allowNull: true,
                field: 'last_name',
            },
            // @username в Telegram (если есть)
            username: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            // URL аватара
            photoUrl: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'photo_url',
            },
            // Дата и время последней авторизации
            authDate: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'auth_date',
            },
            // Временные метки создания и обновления записи
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                field: 'created_at',
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                field: 'updated_at',
            },
        }, {
            sequelize,
            modelName: 'TelegramUser',
            tableName: 'telegram_users',
            timestamps: true,
            underscored: true,
        });
    }
}
