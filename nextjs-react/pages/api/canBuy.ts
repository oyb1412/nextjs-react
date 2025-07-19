import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from '@/lib/db';
import {RowDataPacket} from "mysql2";
import {authenticate} from "@/lib/auth";

export default async function handler(
    req : NextApiRequest,
    res : NextApiResponse
){
    if(req.method !== 'GET') return res.json({success : false, message : "잘못된 요청입니다"});

    const {price, pageId} = req.query;

    const parsePrice = parseInt(price as string, 10);
    const parsePageId = parseInt(pageId as string, 10);

    const user = await authenticate(req);
    if(!user) return res.json({success : false, message : "로그인 필요"})

    const pool = await getPool();

    const [userRows] = await pool.query('SELECT point FROM user WHERE id=?', [user.id]) as RowDataPacket[][];

    const [sellItemRows] = await pool.query('SELECT seller_id FROM sellitem WHERE id=?', [parsePageId]) as RowDataPacket[][];

    //내가 작성한 판매글인지 체크
    if(sellItemRows[0].seller_id == user.id)
    {
        return res.json({success : false, message : "내 물품은 구매할 수 없습니다"});
    }

    //금액 체크
    if(userRows[0].point < parsePrice)
    {
        return res.json({success : false, message : "포인트가 부족해 구매할 수 없습니다"});
    }
    return res.json({success : true});
}