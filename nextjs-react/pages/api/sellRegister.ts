import type {NextApiRequest, NextApiResponse} from "next";
import {getPool} from '@/lib/db';
import {authenticate} from "@/lib/auth";

export default async function handler(
    req : NextApiRequest,
    res : NextApiResponse
){
    if(req.method !== 'POST') return res.json({success : false, message : "요청 타입이 올바르지 않습니다"});

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.json({ success: false, message : "토큰이 존재하지 않습니다" });

    const {selectedGame,selectedServer, amount,price,charName,title, content} = req.body as {
        selectedGame : string, selectedServer : string, amount : string, price : string,
        charName : string, title : string, content : string
    };

    const parsedAmount = parseInt(amount, 10);
    const parsedPrice = parseInt(price, 10);

    if(!selectedGame)
        return res.json({success : false, message : "게임을 선택해 주세요"});

    if(!selectedServer)
        return res.json({success : false, message : "서버를 선택해 주세요"});

    if(!amount)
        return res.json({success : false, message : "수량을 입력해 주세요"});

    if(!price)
        return res.json({success : false, message : "금액을 입력해 주세요"});

    if(!charName)
        return res.json({success : false, message : "캐릭터 닉네임을 입력해 주세요"});

    if(!title)
        return res.json({success : false, message : "글 제목을 입력해 주세요"});

    if(!content)
        return res.json({success : false, message : "글 내용을 입력해 주세요"});

    const pool = await getPool();

    const user = await authenticate(req);

    if(!user){
        return res.json({success : false, message : "인증되지 않은 사용자입니다"});
    }

    const userId = user.id;

    await pool.query('INSERT INTO sellitem(seller_id, selected_game, amount, price, char_name, title, content, selected_server, is_register) VALUES(?,?,?,?,?,?,?,?,?)', [userId, selectedGame, parsedAmount, parsedPrice ,charName ,title, content, selectedServer, 1]);

    return res.json({success : true, message : "판매 등록했습니다"});
}