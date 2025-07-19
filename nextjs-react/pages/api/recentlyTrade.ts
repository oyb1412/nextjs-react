import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from '@/lib/db';

export default async function handler(
    req : NextApiRequest,
    res : NextApiResponse
){
    if(req.method !== 'GET') return res.json({success : false, message : "요청이 올바르지 않습니다"});

    const pool = await getPool();

    const [sellRows] = await pool.query('SELECT id, selected_game, amount, price FROM sellitem ORDER BY created_date DESC LIMIT 10');
    const [buyRows] = await pool.query('SELECT id, selected_game, amount, price FROM buyitem ORDER BY created_date DESC LIMIT 10');

    return res.json({success : true, recentSellList : sellRows, recentBuyList : buyRows});
}