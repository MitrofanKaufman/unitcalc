#!/usr/bin/env node
/**
 * Утилита для работы с базой данных
 * Предоставляет команды для проверки подключения, выполнения SQL-запросов и управления БД
 */

const mysql = require('mysql2/promise');
const { Command } = require('commander');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs').promises;
const inquirer = require('inquirer');
const { table } = require('table');
const chalk = require('chalk');

// Загрузка переменных окружения
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Конфигурация подключения к БД
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: 'Z',
  decimalNumbers: true,
  supportBigNumbers: true,
  bigNumberStrings: false,
  multipleStatements: true,
};

// Создаем пул соединений
let pool;

/**
 * Инициализирует пул соединений с БД
 */
function initPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    
    // Обработка событий пула
    pool.on('acquire', (connection) => {
      console.log(chalk.blue(`[DB] Connection ${connection.threadId} acquired`));
    });
    
    pool.on('release', (connection) => {
      console.log(chalk.blue(`[DB] Connection ${connection.threadId} released`));
    });
    
    pool.on('enqueue', () => {
      console.log(chalk.yellow('[DB] Waiting for available connection slot'));
    });
  }
  return pool;
}

/**
 * Проверяет подключение к БД
 */
async function checkConnection() {
  console.log(chalk.blue('🔍 Проверка подключения к базе данных...'));
  
  try {
    const connection = await initPool().getConnection();
    console.log(chalk.green('✅ Успешное подключение к базе данных'));
    
    // Получаем информацию о версии сервера
    const [rows] = await connection.query('SELECT VERSION() as version');
    console.log(chalk.blue(`📊 Версия сервера MySQL: ${rows[0].version}`));
    
    // Получаем список баз данных
    const [databases] = await connection.query('SHOW DATABASES');
    console.log(chalk.blue('📂 Доступные базы данных:'));
    console.log(databases.map(db => `- ${db.Database}`).join('\n'));
    
    connection.release();
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Ошибка подключения к базе данных:'), error.message);
    return false;
  }
}

/**
 * Выполняет SQL-запрос из файла
 */
async function executeSqlFile(filePath) {
  try {
    const sql = await fs.readFile(path.resolve(process.cwd(), filePath), 'utf8');
    const connection = await initPool().getConnection();
    
    console.log(chalk.blue(`🚀 Выполнение SQL из файла: ${filePath}`));
    const [results] = await connection.query(sql);
    
    console.log(chalk.green('✅ SQL выполнен успешно'));
    console.log(chalk.blue('📊 Результаты:'));
    console.log(JSON.stringify(results, null, 2));
    
    connection.release();
    return results;
  } catch (error) {
    console.error(chalk.red('❌ Ошибка выполнения SQL:'), error.message);
    throw error;
  }
}

/**
 * Выводит информацию о таблицах в БД
 */
async function showTables() {
  try {
    const connection = await initPool().getConnection();
    
    // Получаем список таблиц
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log(chalk.yellow('ℹ️ В базе данных нет таблиц'));
      return;
    }
    
    console.log(chalk.blue('📊 Список таблиц:'));
    
    // Для каждой таблицы получаем информацию о колонках
    for (const tableInfo of tables) {
      const tableName = tableInfo[`Tables_in_${dbConfig.database}`];
      console.log(chalk.cyan(`\n📌 Таблица: ${tableName}`));
      
      // Получаем информацию о колонках
      const [columns] = await connection.query(`DESCRIBE \`${tableName}\``);
      
      // Форматируем вывод в виде таблицы
      const data = [
        ['Поле', 'Тип', 'NULL', 'Ключ', 'По умолчанию', 'Дополнительно']
      ];
      
      columns.forEach(column => {
        data.push([
          column.Field,
          column.Type,
          column.Null,
          column.Key,
          column.Default || 'NULL',
          column.Extra
        ]);
      });
      
      console.log(table(data));
    }
    
    connection.release();
  } catch (error) {
    console.error(chalk.red('❌ Ошибка при получении информации о таблицах:'), error.message);
    throw error;
  }
}

/**
 * Создает резервную копию базы данных
 */
async function backupDatabase() {
  try {
    const backupDir = path.resolve(process.cwd(), 'backups');
    await fs.mkdir(backupDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);
    
    // Для простоты используем mysqldump через child_process
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    const command = `mysqldump -u ${dbConfig.user} -p${dbConfig.password} -h ${dbConfig.host} -P ${dbConfig.port} ${dbConfig.database} > ${backupFile}`;
    
    console.log(chalk.blue(`💾 Создание резервной копии в ${backupFile}...`));
    await execAsync(command);
    
    console.log(chalk.green(`✅ Резервная копия успешно создана: ${backupFile}`));
    return backupFile;
  } catch (error) {
    console.error(chalk.red('❌ Ошибка при создании резервной копии:'), error.message);
    throw error;
  }
}

/**
 * Основная функция
 */
async function main() {
  const program = new Command();
  
  program
    .name('db-utils')
    .description('Утилита для работы с базой данных')
    .version('1.0.0');
  
  // Команда проверки подключения
  program
    .command('check')
    .description('Проверить подключение к базе данных')
    .action(checkConnection);
  
  // Команда выполнения SQL из файла
  program
    .command('exec <file>')
    .description('Выполнить SQL-запрос из файла')
    .action(executeSqlFile);
  
  // Команда показа списка таблиц
  program
    .command('tables')
    .description('Показать список таблиц в базе данных')
    .action(showTables);
  
  // Команда создания резервной копии
  program
    .command('backup')
    .description('Создать резервную копию базы данных')
    .action(backupDatabase);
  
  // Парсим аргументы командной строки
  await program.parseAsync(process.argv);
  
  // Закрываем пул соединений при завершении
  if (pool) {
    await pool.end();
  }
}

// Запускаем утилиту
main().catch(error => {
  console.error(chalk.red('❌ Ошибка:'), error.message);
  process.exit(1);
});
