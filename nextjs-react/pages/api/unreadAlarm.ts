import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from "@/lib/db";
import {authenticate} from "@/lib/auth";
import {RowDataPacket} from "mysql2";

export default async function handler(
    req : NextApiRequest,
    res : NextApiResponse
){
    if(req.method !== 'GET') return res.json({success : false, message : "요청 타입이 올바르지 않습니다"});

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.json({ success: false, message : "토큰이 존재하지 않습니다" });

    const user = await authenticate(req);

    if(!user) return res.json({success : false});

    const pool = await getPool();

    const [rows] = await pool.query('SELECT is_sell FROM alarm WHERE user_id=? AND reading=?', [user.id, 0]) as RowDataPacket[][];

    if(rows.length > 0)
    {
        return res.json({success : true, unreadAlarm : true})
    }

    return res.json({success : false, unreadAlarm : false});
}