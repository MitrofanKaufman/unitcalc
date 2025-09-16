#!/usr/bin/env ts-node
/**
 * Скрипт для инициализации базы данных
 * Создает базу данных и пользователя с необходимыми правами
 */

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { table } from 'table';
import chalk from 'chalk';
import dotenv from 'dotenv';
import path from 'path';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

// Загружаем переменные окружения из файла .env
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Конфигурация подключения к серверу MySQL (без указания базы данных)
const adminConfig = {
  type: 'mysql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_ROOT_USERNAME || 'root',
  password: process.env.DB_ROOT_PASSWORD || '',
  database: undefined as string | undefined,
  synchronize: false,
  logging: false,
};

// Конфигурация приложения
const appConfig = {
  dbName: process.env.DB_NAME || 'wb_calculator',
  dbUser: process.env.DB_USERNAME || 'wb_user',
  dbPassword: process.env.DB_PASSWORD || 'wb_password',
  dbHost: process.env.DB_HOST || 'localhost',
};

/**
 * Основная функция инициализации базы данных
 */
async function initializeDatabase() {
  console.log(chalk.blue('🔄 Инициализация базы данных...'));
  
  try {
    // Запрашиваем учетные данные администратора, если они не указаны
    if (!adminConfig.password) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'username',
          message: 'Имя пользователя администратора MySQL:',
          default: adminConfig.username,
        },
        {
          type: 'password',
          name: 'password',
          message: 'Пароль администратора MySQL:',
          mask: '*',
        },
      ]);
      
      adminConfig.username = answers.username;
      adminConfig.password = answers.password;
    }
    
    // Создаем подключение от имени администратора
    const adminSpinner = createSpinner('Подключение к серверу MySQL...').start();
    const adminDataSource = new DataSource(adminConfig);
    
    try {
      await adminDataSource.initialize();
      adminSpinner.success({ text: '✅ Успешное подключение к серверу MySQL' });
      
      // Проверяем версию MySQL
      const [version] = await adminDataSource.query('SELECT VERSION() as version');
      console.log(chalk.blue(`📊 Версия сервера: ${version[0].version}`));
      
      // Проверяем существование базы данных
      const dbSpinner = createSpinner('Проверка базы данных...').start();
      const [databases] = await adminDataSource.query('SHOW DATABASES');
      const dbExists = databases.some((db: any) => Object.values(db)[0] === appConfig.dbName);
      
      if (dbExists) {
        dbSpinner.warn({ text: `База данных '${appConfig.dbName}' уже существует` });
        
        const { confirmRecreate } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmRecreate',
            message: `Пересоздать базу данных '${appConfig.dbName}'? Все данные будут потеряны!`,
            default: false,
          },
        ]);
        
        if (confirmRecreate) {
          await adminDataSource.query(`DROP DATABASE IF EXISTS \`${appConfig.dbName}\``);
          await adminDataSource.query(`CREATE DATABASE \`${appConfig.dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
          console.log(chalk.green(`✅ База данных '${appConfig.dbName}' успешно пересоздана`));
        } else {
          console.log(chalk.yellow('Пропущено пересоздание базы данных'));
        }
      } else {
        await adminDataSource.query(`CREATE DATABASE \`${appConfig.dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        dbSpinner.success({ text: `✅ База данных '${appConfig.dbName}' успешно создана` });
      }
      
      // Создаем пользователя и выдаем права
      const userSpinner = createSpinner('Настройка пользователя базы данных...').start();
      
      try {
        // Проверяем существование пользователя
        const [users] = await adminDataSource.query(
          `SELECT User FROM mysql.user WHERE User = '${appConfig.dbUser}' AND Host = '%'`
        );
        
        if (users.length > 0) {
          // Обновляем пароль существующего пользователя
          await adminDataSource.query(
            `ALTER USER '${appConfig.dbUser}'@'%' IDENTIFIED BY '${appConfig.dbPassword}'`
          );
          userSpinner.success({ text: `✅ Пароль пользователя '${appConfig.dbUser}' обновлен` });
        } else {
          // Создаем нового пользователя
          await adminDataSource.query(
            `CREATE USER '${appConfig.dbUser}'@'%' IDENTIFIED BY '${appConfig.dbPassword}'`
          );
          userSpinner.success({ text: `✅ Пользователь '${appConfig.dbUser}' успешно создан` });
        }
        
        // Выдаем права на базу данных
        await adminDataSource.query(
          `GRANT ALL PRIVILEGES ON \`${appConfig.dbName}\`.* TO '${appConfig.dbUser}'@'%'`
        );
        await adminDataSource.query('FLUSH PRIVILEGES');
        
        console.log(chalk.green(`✅ Пользователю '${appConfig.dbUser}' выданы права на базу данных '${appConfig.dbName}'`));
        
        // Обновляем файл .env
        const envSpinner = createSpinner('Обновление файла .env...').start();
        
        try {
          const envContent = `# Database Configuration
DB_HOST=${appConfig.dbHost}
DB_PORT=${adminConfig.port}
DB_USERNAME=${appConfig.dbUser}
DB_PASSWORD=${appConfig.dbPassword}
DB_NAME=${appConfig.dbName}

# Для разработки
DB_SYNC=false
DB_LOGGING=true
`;
          
          // Добавляем настройки базы данных в конец файла .env
          const fs = await import('fs/promises');
          let currentEnv = '';
          
          try {
            currentEnv = await fs.readFile(envPath, 'utf-8');
          } catch (error) {
            // Файл не существует, создаем новый
            await fs.writeFile(envPath, envContent, 'utf-8');
            envSpinner.success({ text: '✅ Файл .env успешно создан с настройками базы данных' });
            return;
          }
          
          // Обновляем существующие настройки или добавляем новые
          const envLines = currentEnv.split('\n');
          const newEnvLines: string[] = [];
          const dbKeys = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME', 'DB_SYNC', 'DB_LOGGING'];
          
          // Оставляем только те строки, которые не содержат настроек базы данных
          for (const line of envLines) {
            if (!dbKeys.some(key => line.startsWith(`${key}=`))) {
              newEnvLines.push(line);
            }
          }
          
          // Добавляем новые настройки базы данных
          newEnvLines.push('', '# Database Configuration');
          newEnvLines.push(...envContent.split('\n').filter(Boolean));
          
          // Сохраняем обновленный файл
          await fs.writeFile(envPath, newEnvLines.join('\n').trim() + '\n', 'utf-8');
          envSpinner.success({ text: '✅ Файл .env успешно обновлен с настройками базы данных' });
          
          console.log('\n' + chalk.green.bold('✅ Инициализация базы данных завершена успешно!'));
          console.log(chalk.blue('\nДля применения миграций выполните команду:'));
          console.log(chalk.cyan('  npm run db:migrate'));
          
        } catch (error: any) {
          envSpinner.error({ text: `❌ Ошибка при обновлении файла .env: ${error.message}` });
          console.log(chalk.yellow('\nСкопируйте следующие настройки в файл .env вручную:'));
          console.log(chalk.gray('----------------------------------------'));
          console.log(`DB_HOST=${appConfig.dbHost}`);
          console.log(`DB_PORT=${adminConfig.port}`);
          console.log(`DB_USERNAME=${appConfig.dbUser}`);
          console.log(`DB_PASSWORD=${appConfig.dbPassword}`);
          console.log(`DB_NAME=${appConfig.dbName}`);
          console.log('DB_SYNC=false');
          console.log('DB_LOGGING=true');
          console.log(chalk.gray('----------------------------------------\n'));
        }
        
      } catch (error: any) {
        userSpinner.error({ text: `❌ Ошибка при настройке пользователя: ${error.message}` });
        throw error;
      }
      
    } catch (error: any) {
      adminSpinner.error({ text: '❌ Ошибка при подключении к серверу MySQL' });
      
      if (error.code === 'ECONNREFUSED') {
        console.error(chalk.red('\nНе удалось подключиться к серверу MySQL. Убедитесь, что:'));
        console.error(`1. Сервер MySQL запущен на ${adminConfig.host}:${adminConfig.port}`);
        console.error('2. Указаны правильные учетные данные администратора');
        console.error('3. Пользователь имеет права на подключение с указанного хоста');
      } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error(chalk.red('\nОшибка аутентификации. Проверьте имя пользователя и пароль администратора MySQL.'));
      } else {
        console.error(chalk.red(`\nОшибка: ${error.message}`));
      }
      
      throw error;
    } finally {
      // Закрываем соединение
      if (adminDataSource.isInitialized) {
        await adminDataSource.destroy();
      }
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ Инициализация базы данных не удалась'));
    process.exit(1);
  }
}

// Запускаем инициализацию
initializeDatabase().catch(() => process.exit(1));
