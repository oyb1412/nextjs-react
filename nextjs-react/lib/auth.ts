import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface JWTPayload {
    id: number;
    username: string;
}

export async function authenticate(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch {
        throw new Error("Invalid JWT payload");
    }
}