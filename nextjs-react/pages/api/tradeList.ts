import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from "@/lib/db";
import {authenticate} from "@/lib/auth";
import {RowDataPacket} from "mysql2";

export default async function handler(
    req : NextApiRequest,
    res : NextApiResponse
)
{
    if(req.method !== 'GET') return res.json({success : false, message : "요청이 올바르지 않습니다"});

    const user = await authenticate(req);

    if(!user) return res.json({success : false, message :"로그인 후 이용해 주세요"});

    const userId = user.id;

    const {type} = req.query;

    const pool = await getPool();

    if(!type) return res.json({success : false, message :"요청이 올바르지 않습니다"});

    type item ={
        item_id : number,
        status : string, //여기에 selling, sellover, buying, buyover같은 타입을 넣음
        title : string, // 글 제목
        amount : number, // 게임머니 수량
        price : number, //실제 현금가
        order_date : string, //진행중인 거래면 order_date, over 거래면 order_over_date
    }

    const tradeList : item[] = [];

    switch (type){
        case 'selling':
            //sellorder에서 is_selling == 1 인것만 뽑기
            const [sellingRows] = await pool.query('SELECT item_id, order_date FROM sellorder WHERE seller_id=? AND is_selling=?', [userId, 1]) as RowDataPacket[][];

            //for돌면서 각 아이템 push
            for(const row of sellingRows){
                const [itemRows] = await pool.query('SELECT title, amount, price FROM buyitem WHERE id=?', [row.item_id]) as RowDataPacket[][];

                if(!itemRows || itemRows.length === 0)
                    continue;

                tradeList.push({
                    item_id : row.item_id,
                   status : "selling",
                   title : itemRows[0].title,
                    amount : itemRows[0].amount,
                    price : itemRows[0].price,
                    order_date : String(row.order_date)
                });
            }
            break;

        case 'sellover':
            //sellorder에서 is_sellover == 1 인것만 뽑기
            const [selloverRows] = await pool.query('SELECT item_id, order_date FROM sellorder WHERE seller_id=? AND is_sellover=?', [userId, 1]) as RowDataPacket[][];

            //for돌면서 각 아이템 push
            for(const row of selloverRows){
                const [itemRows] = await pool.query('SELECT title, amount, price FROM buyitem WHERE id=?', [row.item_id]) as RowDataPacket[][];

                if(!itemRows || itemRows.length === 0)
                    continue;

                tradeList.push({
                    item_id : row.item_id,
                    status : "sellover",
                    title : itemRows[0].title,
                    amount : itemRows[0].amount,
                    price : itemRows[0].price,
                    order_date : String(row.order_date)
                });
            }
            break;

        case 'buying':
            //buyorder에서 is_buying == 1 인것만 뽑기
            const [buyingRows] = await pool.query('SELECT item_id, order_date FROM buyorder WHERE buyer_id=? AND is_buying=?', [userId, 1]) as RowDataPacket[][];

            //for돌면서 각 아이템 push
            for(const row of buyingRows){
                const [itemRows] = await pool.query('SELECT title, amount, price FROM sellitem WHERE id=?', [row.item_id]) as RowDataPacket[][];

                if(!itemRows || itemRows.length === 0)
                    continue;

                tradeList.push({
                    item_id : row.item_id,
                    status : "buying",
                    title : itemRows[0].title,
                    amount : itemRows[0].amount,
                    price : itemRows[0].price,
                    order_date : String(row.order_date)
                });
            }
            break;

        case 'buyover':
            //buyorder에서 is_buyover == 1 인것만 뽑기
            const [buyoverRows] = await pool.query('SELECT item_id, order_date FROM buyorder WHERE buyer_id=? AND is_buyover=?', [userId, 1]) as RowDataPacket[][];

            //for돌면서 각 아이템 push
            for(const row of buyoverRows){
                const [itemRows] = await pool.query('SELECT title, amount, price FROM sellitem WHERE id=?', [row.item_id]) as RowDataPacket[][];

                if(!itemRows || itemRows.length === 0)
                    continue;

                tradeList.push({
                    item_id : row.item_id,
                    status : "buyover",
                    title : itemRows[0].title,
                    amount : itemRows[0].amount,
                    price : itemRows[0].price,
                    order_date : String(row.order_date)
                });
            }
            break;

        default:
            return res.json({success : false, message : " 요청이 올바르지 않습니다"});
    }

    return res.json({success : true, itemList : tradeList});
}