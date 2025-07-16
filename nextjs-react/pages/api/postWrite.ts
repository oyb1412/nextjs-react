//글 작성 요청 정리

import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from '@/lib/db';

export default async function handler(
    req : NextApiRequest,
    res : NextApiResponse
)
{
    if(req.method !== 'POST') return res.status(405).end();

    const {title, content} = req.body as {title : string, content : string};

    if(!title)
        return res.status(400).json({error : "제목을 적어주세요"});

    if(!content)
        return res.status(400).json({error : "내용을 적어주세요"});

    const pool = await getPool();

    await pool.query('INSERT INTO post(title, content) VALUES(?, ?)', [title, content]);

    return res.status(201).json({ok : true});
}