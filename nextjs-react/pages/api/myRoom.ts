import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from "@/lib/db";
import {authenticate} from "@/lib/auth";
import {RowDataPacket} from "mysql2";

export default async function handler (
    req : NextApiRequest,
    res : NextApiResponse
){
    if(req.method !== 'GET') return res.json({success : false, message : "요청 타입이 올바르지 않습니다"});

    const user = await authenticate(req);
    if(!user) return res.json({success : false, message : "로그인이 필요합니다"});

    const pool = await getPool();

    const userId = user.id;

    const [sellingItemRows] = await pool.query('SELECT COUNT(*) as count FROM sellitem WHERE seller_id=? AND is_selling=?', [userId, 1]) as RowDataPacket[][];
    const [sellOverItemRows] = await pool.query('SELECT COUNT(*) as count FROM sellitem WHERE seller_id=? AND is_sellover=?', [userId, 1]) as RowDataPacket[][];

    const [buyingItemRows] = await pool.query('SELECT COUNT(*) as count FROM buyitem WHERE buyer_id=? AND is_buying=?', [userId, 1]) as RowDataPacket[][];
    const [buyOverItemRows] = await pool.query('SELECT COUNT(*) as count FROM buyitem WHERE buyer_id=? AND is_buyover=?', [userId, 1]) as RowDataPacket[][];

    const tradingItem = {
        sellingItemCount : sellingItemRows[0].count,
        sellOverItemCount : sellOverItemRows[0].count,
        buyingItemCount : buyingItemRows[0].count,
        buyOverItemCount : buyOverItemRows[0].count
    };
    let tradeOverItem: any[] = [];

    const [sellOrderRows] = await pool.query ('SELECT item_id, order_date, order_over_date FROM sellorder WHERE seller_id=?', [userId]) as RowDataPacket[][];

    for(const row of sellOrderRows){
        const [itemRows] = await pool.query('SELECT selected_game, selected_server, amount, price FROM sellitem WHERE id=?', [row.item_id]) as RowDataPacket[][];
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

    const [buyOrderRows] = await pool.query ('SELECT item_id, order_date, order_over_date FROM buyorder WHERE buyer_id=?', [userId]) as RowDataPacket[][];

    for(const row of buyOrderRows){
        const [itemRows] = await pool.query('SELECT selected_game, selected_server, amount, price FROM buyitem WHERE id=?', [row.item_id]) as RowDataPacket[][];
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

    return res.json({
        success : true,
        tradingItem : tradingItem,
        tradeOverItem : tradeOverItem
    });
}