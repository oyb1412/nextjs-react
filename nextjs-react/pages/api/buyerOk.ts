import type { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { authenticate } from "@/lib/auth";
import {RowDataPacket} from "mysql2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "POST 요청만 허용됨" });
    }

    const user = await authenticate(req);
    if (!user) {
        return res.json({ success: false, message: "로그인 필요" });
    }

    const { pageId } = req.query;
    const parsePageId = parseInt(pageId as string, 10);

    if (!parsePageId) {
        return res.json({ success: false, message: "유효하지 않은 pageId" });
    }

    const pool = await getPool();

    try {
        const [result] = await pool.query(
            'UPDATE orders SET buyer_ok = 1 WHERE item_id = ? AND buyer_id = ?',
            [parsePageId, user.id]
        );

        // 반영된 row가 없으면, 잘못된 접근이거나 이미 완료된 거래
        if ((result as any).affectedRows === 0) {
            return res.json({ success: false, message: "업데이트 실패: 조건 불일치" });
        }

        // 거래 종료 조건 확인
        const [rows] = await pool.query('SELECT seller_ok FROM orders WHERE item_id = ?', [parsePageId]) as any[];
        if (rows.length > 0 && rows[0].seller_ok === 1) {
            await pool.query('UPDATE orders SET stat = ?, order_over_date = NOW() WHERE item_id = ?', ['DONE', parsePageId]);
            await pool.query('UPDATE item SET stat = ? WHERE id = ?', ['DONE', parsePageId]);

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

            return res.json({ success: true, done: true });
        }

        return res.json({ success: true });
    } catch (err) {
        console.error("DB 에러:", err);
        return res.json({ success: false, message: "서버 에러" });
    }
}
