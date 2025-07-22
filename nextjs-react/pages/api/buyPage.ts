import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from '@/lib/db';
import {RowDataPacket} from "mysql2";

export default async function handler(
    req :  NextApiRequest,
    res : NextApiResponse

){
    if(req.method !== 'GET') return res.json({success : false, message : "요청 타입이 올바르지 않습니다"});

    const {pageId} = req.query;

    const parsePageId = parseInt(pageId as string, 10);

    if(!parsePageId || parsePageId < 1) return res.json({success : false, message : "글 정보가 올바르지 않습니다"});

    const pool = await getPool();

    const [itemRows] = await pool.query('SELECT * FROM item WHERE id = ? AND item_type = ?' , [parsePageId, 'BUY']) as RowDataPacket[][];
    const item = itemRows[0];

    const buyerId = item.user_id;
    const [buyerRows] = await pool.query('SELECT name FROM user WHERE id = ?', [buyerId]) as RowDataPacket[][];
    const buyer = buyerRows[0];

    const result ={
        selected_game : item.selected_game,
        selected_server : item.selected_server,
        amount : item.amount,
        price : item.price,
        buyer_id :buyerId,
        char_name : item.char_name,
        buyer_name : buyer.name,
        title : item.title,
        content : item.content,
        created_date : item.created_date,

    }

    return res.json({
        success : true,
        message : "글 정보를 불러왔습니다",
        buyDescription : result
    });
}