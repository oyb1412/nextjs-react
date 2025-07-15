import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
    res.setHeader(
        'Set-Cookie',
        'access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
    );
    res.status(204).end();
}