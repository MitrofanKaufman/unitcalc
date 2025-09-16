// @ts-nocheck
// db/MySQLClient.js — автоматически сконвертировано в TypeScript 2025-07-17.
// Логика сохранена, при необходимости уточнить типы.

// path: src/api/db/MySQLClient.js
import mysql from "mysql2/promise";

class MySQLClient {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "your_user",
            password: process.env.DB_PASSWORD || "your_password",
            database: process.env.DB_NAME || "dimastik86_unit",
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            // добавьте charset, timezone если нужно
        });
    }

    async query(sql, params) {
        const [rows] = await this.pool.query(sql, params);
        return rows;
    }

    async execute(sql, params) {
        const [result] = await this.pool.execute(sql, params);
        return result;
    }
}

export default new MySQLClient();
