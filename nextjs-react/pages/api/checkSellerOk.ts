import type { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "GET 요청만 허용됨" });
    }

    const { pageId } = req.query;
    const parsePageId = parseInt(pageId as string, 10);

    if (!parsePageId) {
        return res.json({ success: false, message: "유효하지 않은 pageId" });
    }

    const pool = await getPool();

    try {
        const [rows] = await pool.query(
            'SELECT seller_ok, buyer_ok FROM orders WHERE item_id = ?',
            [parsePageId]
        ) as any[];

        if (rows.length === 0) {
            return res.json({ success: false, message: "주문 정보 없음" });
        }

        const sellerOk = rows[0].seller_ok === 1;
        const buyerOk = rows[0].buyer_ok === 1;
        let done = false;

        // 둘 다 완료됐으면 거래 종료 처리
        if (sellerOk && buyerOk) {
            await pool.query(
                'UPDATE orders SET stat = ?, order_over_date = NOW() WHERE item_id = ?',
                ['DONE', parsePageId]
            );
            await pool.query(
                'UPDATE item SET stat = ? WHERE item_id = ?',
                ['DONE', parsePageId]
            );
            done = true;
        }

        return res.json({ success: true, sellerOk, done });
    } catch (err) {
        console.error("DB 에러:", err);
        return res.json({ success: false, message: "서버 에러" });
    }
}
