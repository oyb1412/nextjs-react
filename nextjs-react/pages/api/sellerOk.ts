import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from "@/lib/db";
import {authenticate} from "@/lib/auth";

export default async function handler(
    req :  NextApiRequest,
    res : NextApiResponse,
)
{
    if(req.method !== 'POST') return res.json({success : false, message : "요청이 올바르지 않습니다"});

    const user = await authenticate(req);
    if(!user) return res.json({success : false, message : "로그인 필요"})

    const {pageId} = req.query;
    const parsePageId = parseInt(pageId as string, 10);

    const pool = await getPool();
    const userId = user.id;

    await pool.query('UPDATE orders SET seller_ok=? WHERE item_id=? AND seller_id=?', [1, parsePageId, userId]);

    // 거래 완료 여부 체크
    const [rows] = await pool.query('SELECT buyer_ok FROM orders WHERE item_id = ?', [parsePageId]) as any[];

    if (rows.length > 0 && rows[0].buyer_ok === 1) {
        await pool.query('UPDATE orders SET stat =?, order_over_date =NOW() WHERE item_id = ?', ['DONE', parsePageId]);
        await pool.query('UPDATE item SET stat =? WHERE id = ?', ['DONE',parsePageId]);

        // seller_id, price 안전하게 가져오기
        const [sellerRows] = await pool.query('SELECT seller_id FROM orders WHERE item_id = ?', [parsePageId]) as any[];
        const [itemRows] = await pool.query('SELECT price FROM item WHERE id = ?', [parsePageId]) as any[];

        if (!sellerRows.length || !itemRows.length) {
            return res.json({ success: false, message: "거래 정보 없음" });
        }

        const sellerId = sellerRows[0].seller_id;
        const price = itemRows[0].price;

        // 포인트 지급
        await pool.query('UPDATE user SET point = point + ? WHERE id = ?', [price, sellerId]);

        //거래 종료
        return res.json({success : true, done : true})
    }

    return res.json({success : true, done : false});
}