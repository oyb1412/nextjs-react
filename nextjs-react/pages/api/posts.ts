//게시글 목록 요청 처리

import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from '@/lib/db';

export default async function handler (
    req : NextApiRequest,
    res : NextApiResponse
){
    if(req.method !== 'GET') return res.status(405).end();

    const pool = await getPool();

    const [rows] = await pool.query('SELECT id, title, created_date FROM post');

    return res.status(200).json(rows);
}