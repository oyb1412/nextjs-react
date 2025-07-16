import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from '@/lib/db';

export default async function handler(
    req : NextApiRequest,
    res : NextApiResponse
){
    if(req.method !== 'GET') return res.status(405).end();

    const postId = req.query.postId as string;

    if(!postId)
        return res.status(400).json({error : "글 정보가 올바르지 않습니다"});

    const pool = await getPool();

    const [dup] = await pool.query('SELECT title, content FROM post WHERE id=?', [postId]);

    if(!(dup as any[]).length)
         return res.status(409).json({error : "글 정보가 올바르지 않습니다"});

    const dop = dup as any[];
    return res.json({
        title : dop[0].title,
        content : dop[0].content
    });
}