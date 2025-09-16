// path: src/api/v1/models/session.js

import { Model, DataTypes } from 'sequelize';
import TelegramUser from '@api/models/TelegramUser';

/**
 * Модель для хранения сессионных токенов или JWT, выданных после авторизации через Telegram.
 */
export default class Session extends Model {
    /**
     * Инициализация модели в Sequelize.
     * @param {import('sequelize').Sequelize} sequelize — экземпляр Sequelize.
     */
    static initModel(sequelize) {
        Session.init({
            // Внутренний PK
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            // Внешний ключ на TelegramUser.id
            userId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                field: 'user_id',
                references: {
                    model: TelegramUser,
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            // Токен сессии (например, UUID или JWT ID)
            token: {
                type: DataTypes.STRING(512),
                allowNull: false,
                unique: true,
            },
            // Время, до которого сессия действительна
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'expires_at',
            },
            // Метки времени
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
            modelName: 'Session',
            tableName: 'sessions',
            timestamps: true,
            underscored: true,
        });
    }

    /**
     * Настраивает ассоциации моделей.
     */
    static associate() {
        Session.belongsTo(TelegramUser, { foreignKey: 'user_id', as: 'user' });
    }
}
