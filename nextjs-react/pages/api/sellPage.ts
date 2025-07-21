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

    const [itemRows] = await pool.query('SELECT * FROM item WHERE id = ? AND item_type = ?' , [parsePageId, 'SELL']) as RowDataPacket[][];
    const item = itemRows[0];

    const sellerId = item.user_id;
    const [sellerRows] = await pool.query('SELECT name FROM user WHERE id = ?', [sellerId]) as RowDataPacket[][];
    const seller = sellerRows[0];

    const result ={
        selected_game : item.selected_game,
        selected_server : item.selected_server,
        amount : item.amount,
        price : item.price,
        seller_id :sellerId,
        char_name : item.char_name,
        seller_name : seller.name,
        title : item.title,
        content : item.content,
        created_date : item.created_date,

    }

    return res.json({
        success : true,
        message : "글 정보를 불러왔습니다",
        sellDescription : result
    });
}