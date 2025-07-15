console.log('🌐 ENV DB_URL:', process.env.DB_URL);


import type { NextApiRequest, NextApiResponse } from 'next';
import { getPool } from '@/lib/db';

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const pool = await getPool();
        const [rows] = await pool.query('SELECT 1 AS result');
        res.status(200).json(rows);
    } catch (err) {
        console.error('DB ERROR >>>', err);
        res.status(500).json({ error: String(err) });
    }
}