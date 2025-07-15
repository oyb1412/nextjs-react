//회원가입 요청 처리

import type { NextApiRequest, NextApiResponse } from 'next';
import {getPool} from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(
    req : NextApiRequest,
    res : NextApiResponse
){

    //post이외의 요청은 거부
    if(req.method !== 'POST') return res.status(405).end();

    //req로 받은 json 파싱
    //{}를 쓰면, json의 key값을 그대로 반환받을 수 있다.
    const {email, password} = req.body as {email : string; password : string};

    //email이나 password가 없으면
    if(!email || !password)
        return res.status(400).json({ error : "필수 값 누락"});

    //DB연결
    const pool = await getPool();

    //이메일 중복 체크
    //[]를 쓰면, 배열값을 반환받을때 인덱스 순서대로 반환받을 수 있다.
    const [dup] = await pool.query('SELECT username FROM user WHERE username =?', [email]);

    //dup를 배열로 취급해서 안전하게 처리
    if((dup as any[]).length)
        return res.status(409).json({error : "이미 가입된 아이디"});

    //비밀번호 해시 후 INSERT
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO user (username, password) VALUES (?, ?)', [email, hash]);

    //성공 응답
    return res.status(201).json({ok : true});
}