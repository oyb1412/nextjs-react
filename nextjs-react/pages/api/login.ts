//로그인 요청 처리

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPool} from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export default async function handler(
    req : NextApiRequest,
    res : NextApiResponse
)
{
    if(req.method !== 'POST') return res.status(405).end();

    const {email, password} = req.body as {email: string, password: string};

    if(!email || !password)
        return res.status(400).json({error : "필수 값 누락"});

    const pool = await getPool();

    const [rows] = await pool.query('SELECT id, username, password FROM user WHERE username =?', [email]);

    if((rows as any[]).length === 0)
        return res.status(401).json({error : "아이디나 비밀번호가 올바르지 않습니다"});

    const raw = rows as any[];

    const ok : boolean = await bcrypt.compare(password, raw[0].password);

    if(!ok)
        return res.status(401).json({error : "아이디나 비밀번호가 올바르지 않습니다"});

    //jwt 생성
    const token = jwt.sign(
        {id : raw[0].id, username:email},
        process.env.JWT_SECRET!,
        {expiresIn : '7d'}
    );

    //httponly 쿠키로 내려주기
    res.setHeader('Set-Cookie',[
        `access-token=${token}; HttpOnly; Path=/; Max-Age = ${7 * 24 * 60 * 60}; SameSite=Lax${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
        }`,
    ]);

    return res.status(201).json({ok : true});
}