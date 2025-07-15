import jwt from 'jsonwebtoken';
import type {NextApiRequest} from "next";

export interface JWTPayload{
    id : number;
    username : string;
}

//요청에서 쿠키 내 jwt 검증해 payload반환, 없으면 예외
export function authenticate(req : NextApiRequest) : JWTPayload{
    const cookie = req.cookies['access_token'];
    if(!cookie) throw new Error('No access token provided');

    try{
        return jwt.verify(cookie, process.env.JWT_SECRET!) as JWTPayload;
    }
    catch{
        throw new Error('Invalid JWT payload');
    }
}