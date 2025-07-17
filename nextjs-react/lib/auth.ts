import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {NextApiRequest} from "next";
import redis from '@/lib/redis';

export interface JWTPayload {
    id: number;
    username: string;
}

export async function authenticate(req :NextApiRequest): Promise<JWTPayload | null> {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];

    const isBlacklisted = await redis.get(`blacklist:${token}`);

    if (isBlacklisted) throw new Error('Token is blacklisted');

    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch {
        throw new Error('Invalid JWT payload');
    }

}