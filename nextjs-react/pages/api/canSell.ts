import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from '@/lib/db';
import {RowDataPacket} from "mysql2";
import {authenticate} from "@/lib/auth";

export default async function handler(
    req : NextApiRequest,
    res : NextApiResponse
){
    if(req.method !== 'POST') return res.json({success : false, message : "잘못된 요청입니다"});

    const {pageId} = req.query;

    const parsePageId = parseInt(pageId as string, 10);

    const user = await authenticate(req);
    if(!user) return res.json({success : false, message : "로그인 필요"})

    const pool = await getPool();

    const [userRows] = await pool.query('SELECT point FROM user WHERE id=?', [user.id]) as RowDataPacket[][];

    const [buyItemRows] = await pool.query('SELECT * FROM item WHERE id=? AND item_type=?', [parsePageId, 'BUY']) as RowDataPacket[][];

    //내가 작성한 판매글인지 체크
    if(buyItemRows[0].user_id == user.id)
    {
        return res.json({success : false, message : "나에게 판매할 수 없습니다"});
    }

    //알림 추가
    await pool.query('INSERT INTO alarm(user_id, is_sell, target_item_id, reading) VALUES(?,?,?,?)', [buyItemRows[0].user_id, 0, parsePageId, 0] );

    //거래 아이템 상태 is_selling, is_idle 변경
    await pool.query('UPDATE item SET stat=? WHERE id=?', ['REQUEST', parsePageId]);

    //buy 주문 이력 추가
    await pool.query('INSERT INTO orders(seller_id, buyer_id, item_id, item_type) VALUES(?,?,?,?)', [user.id,buyItemRows[0].user_id,  parsePageId,'BUY']);

    return res.json({success : true});
}