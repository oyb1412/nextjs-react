import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import {JWTPayload} from "@/lib/auth";
import redis from '@/lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'POST') return res.json({success : false, message : "요청 방식이 올바르지 않습니다"});

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.json({ success : false, message : '토큰이 존재하지 않습니다' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        const exp = (decoded as any).exp;
        const ttl = exp ? exp * 1000 - Date.now() : 1000 * 60 * 60 * 24 * 7;

        await redis.set(`blacklist:${token}`, 'true', 'PX', ttl);
        return res.json({success : true, message : "로그아웃 하였습니다"});
    } catch {
        return res.json({ success : false, message : '토큰 정보가 올바르지 않습니다' });
    }
}