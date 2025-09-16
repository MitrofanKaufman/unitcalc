// path: src/api/db/index.js

import { Sequelize } from 'sequelize';
import TelegramUser from '@api/models/TelegramUser';
import Session from '@api/models/Session';
import config from '../../../../cfg/database.js';

// Получаем конфигурацию для текущего окружения
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Создаем экземпляр Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Инициализация моделей
TelegramUser.initModel(sequelize);
Session.initModel(sequelize);

// Настройка связей
Session.associate();

// Проверка подключения к БД
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
})();

export default sequelize;
