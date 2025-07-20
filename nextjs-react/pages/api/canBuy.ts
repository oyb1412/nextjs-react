import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from '@/lib/db';
import {RowDataPacket} from "mysql2";
import {authenticate} from "@/lib/auth";

export default async function handler(
    req : NextApiRequest,
    res : NextApiResponse
){
    if(req.method !== 'POST') return res.json({success : false, message : "잘못된 요청입니다"});

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

    //유저 포인트 깎기
    await pool.query('UPDATE user SET point = point - ? WHERE id =?', [parsePrice, user.id]);

    //알림 추가
    await pool.query('INSERT INTO alarm(user_id, is_sell, target_item_id, reading) VALUES(?,?,?,?)', [sellItemRows[0].seller_id, 1, parsePageId, 0] );

    //거래 아이템 상태 is_selling, is_idle 변경
    await pool.query('UPDATE sellitem SET is_idle =?, is_selling=? WHERE id=?', [0, 1, parsePageId]);

    return res.json({success : true});
}