import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from '@/lib/db';

export default async function handler(
    req : NextApiRequest,
    res : NextApiResponse
){
    if(req.method !== 'GET') return res.json({success : false, message : "요청 타입이 올바르지 않습니다"});

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.json({ success : false, message : "토큰이 존재하지 않습니다" });

    const postId = req.query.postId as string;

    if(!postId)
        return res.json({success : false, message : "글 정보가 올바르지 않습니다"});

    const pool = await getPool();

    const format = `%Y-%m-%d %H:%i`;
    const [rows] = await pool.query(`SELECT title, content, DATE_FORMAT(created_date, '${format}') AS created_date FROM post WHERE id=?`, [postId]);

    if(!(rows as any[]).length)
         return res.json({success : false, message : "글 정보가 올바르지 않습니다"});

    const row = rows as any[];
    return res.json({
        success : true,
        post : row[0]
    });
}