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

    const [dup] = await pool.query('SELECT title, content FROM post WHERE id=?', [postId]);

    if(!(dup as any[]).length)
         return res.json({success : false, message : "글 정보가 올바르지 않습니다"});

    const dop = dup as any[];
    return res.json({
        success : true,
        message : "글 정보를 불러왔습니다",
        title : dop[0].title,
        content : dop[0].content
    });
}