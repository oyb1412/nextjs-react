import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'POST') return res.status(405).end();

    res.setHeader(
        'Set-Cookie',
        'access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
    );
    res.status(204).end();
}