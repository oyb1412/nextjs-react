//글 작성 요청 정리

import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from '@/lib/db';

export default async function handler(
    req : NextApiRequest,
    res : NextApiResponse
)
{
    if(req.method !== 'POST') return res.json({success : false, message : "요청 타입이 올바르지 않습니다"});

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.json({ success: false, message : "토큰이 존재하지 않습니다" });

    const {title, content} = req.body as {title : string, content : string};

    if(!title)
        return res.json({success : false, message : "제목을 적어주세요"});

    if(!content)
        return res.json({success : false, message : "내용을 적어주세요"});

    const pool = await getPool();

    await pool.query('INSERT INTO post(title, content) VALUES(?, ?)', [title, content]);

    return res.json({success : true});
}