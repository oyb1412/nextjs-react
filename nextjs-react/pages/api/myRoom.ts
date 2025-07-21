import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from "@/lib/db";
import {authenticate} from "@/lib/auth";
import {RowDataPacket} from "mysql2";

export default async function handler (
    req : NextApiRequest,
    res : NextApiResponse
){
    if(req.method !== 'POST') return res.json({success : false, message : "요청 타입이 올바르지 않습니다"});

    const user = await authenticate(req);
    if(!user) return res.json({success : false, message : "로그인이 필요합니다"});

    const pool = await getPool();

    const userId = user.id;

    //sellitem 말고 sellorder로 검색해야할듯.
    const [sellingItemRows] = await pool.query('SELECT COUNT(*) as count FROM orders WHERE seller_id=? AND stat=? OR stat=?', [userId, 'REQUEST', 'OK']) as RowDataPacket[][];
    const [sellOverItemRows] = await pool.query('SELECT COUNT(*) as count FROM orders WHERE seller_id=? AND stat=?', [userId, 'DONE']) as RowDataPacket[][];

    const [buyingItemRows] = await pool.query('SELECT COUNT(*) as count FROM orders WHERE buyer_id=? AND stat=? OR stat=?', [userId, 'REQUEST', 'OK']) as RowDataPacket[][];
    const [buyOverItemRows] = await pool.query('SELECT COUNT(*) as count FROM orders WHERE buyer_id=? AND stat=?', [userId, 'DONE']) as RowDataPacket[][];
    const tradingItem = {
        sellingItemCount : sellingItemRows[0].count,
        sellOverItemCount : sellOverItemRows[0].count,
        buyingItemCount : buyingItemRows[0].count,
        buyOverItemCount : buyOverItemRows[0].count
    };

    //내 모든 알람을 읽음 상태로 변경해야함
    await pool.query('UPDATE alarm SET reading =? WHERE user_id=?', [1, userId]);

    let tradeOverItem: any[] = [];

    const [sellOrderRows] = await pool.query ('SELECT item_id, order_date, order_over_date FROM orders WHERE seller_id=?', [userId]) as RowDataPacket[][];

    for(const row of sellOrderRows){
        const [itemRows] = await pool.query('SELECT selected_game, selected_server, amount, price FROM item WHERE id=? AND stat=? AND item_type=?', [row.item_id, 'DONE', 'SELL']) as RowDataPacket[][];

        if(!itemRows || itemRows.length === 0)
            continue;

        tradeOverItem.push({
            selected_game: itemRows[0].selected_game,
            selected_server: itemRows[0].selected_server,
            amount: itemRows[0].amount,
            price: itemRows[0].price,
            order_date: String(row.order_date),
            order_over_date: String(row.order_over_date),
            is_sell: true
        });
    }

    const [buyOrderRows] = await pool.query ('SELECT item_id, order_date, order_over_date FROM orders WHERE buyer_id=?', [userId]) as RowDataPacket[][];

    for(const row of buyOrderRows){
        const [itemRows] = await pool.query('SELECT selected_game, selected_server, amount, price FROM item WHERE id=? AND stat=? AND item_type', [row.item_id, 'DONE', 'BUY']) as RowDataPacket[][];

        if(!itemRows || itemRows.length === 0)
            continue;

        tradeOverItem.push({
            selected_game: itemRows[0].selected_game,
            selected_server: itemRows[0].selected_server,
            amount: itemRows[0].amount,
            price: itemRows[0].price,
            order_date: String(row.order_date),
            order_over_date: String(row.order_over_date),
            is_sell: false
        });
    }

    //내가 등록한 판매 아이템 갯수 카운트
    const [sellRegisterRows] = await pool.query('SELECT COUNT(*) as count FROM item WHERE user_id=? AND item_type=? AND stat=?', [userId, 'SELL', 'IDLE']) as RowDataPacket[][];
    //내가 등록한 구매 아이템 갯수 카운트
    const [buyRegisterRows] = await pool.query('SELECT COUNT(*) as count FROM item WHERE user_id=? AND item_type=? AND stat=?', [userId, 'BUY', 'IDLE']) as RowDataPacket[][];



    return res.json({
        success : true,
        tradingItem : tradingItem,
        tradeOverItem : tradeOverItem,
        sellRegisterCount : sellRegisterRows[0].count,
        buyRegisterCount : buyRegisterRows[0].count
    });
}