import type { Pool } from 'mysql2/promise';

let pool: Pool | null = null;

export async function getPool() {
    if (pool) return pool;

    const mysql = (eval("require")("mysql2/promise") as typeof import("mysql2/promise"));
    /** uri 옵션으로 전달하면 타입 오류 X */
    pool = mysql.createPool({ uri: process.env.DB_URL });
    return pool;
}