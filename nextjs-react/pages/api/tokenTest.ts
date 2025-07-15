import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '@/lib/auth';
import { getPool } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const user = authenticate(req);        // ① 쿠키 검증
        const pool = await getPool();
        const [rows] = await pool.query('SELECT id, username FROM user WHERE id = ?', [user.id]);
        const raw = [rows] as any[];
        return res.status(200).json(raw[0]);
    } catch {
        return res.status(401).json({ error: '로그인 필요' });   // ② 실패 시 401
    }
}