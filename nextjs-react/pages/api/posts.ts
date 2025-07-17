//게시글 목록 요청 처리

import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from '@/lib/db';

export default async function handler (
    req : NextApiRequest,
    res : NextApiResponse
){
    if(req.method !== 'GET') return res.json({success : false, message : "요청이 올바르지 않습니다"});

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.json({success : false, message : "토큰이 존재하지 않습니다"});

    const pool = await getPool();

    const format = `%Y-%m-%d %H:%i`;
    const [rows] = await pool.query(`SELECT id, title, DATE_FORMAT(created_date,'${format}') AS created_date FROM post`);

    return res.json({success : true, posts : rows, message : "글 목록을 불러왔습니다"});
}