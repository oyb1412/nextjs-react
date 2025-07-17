import {NextApiRequest, NextApiResponse} from "next";
import {authenticate} from "@/lib/auth";

export default async function GetUser(
    req :NextApiRequest,
    res: NextApiResponse)
{
    try{
        const user = await authenticate(req);

        if(!user)
        {
            localStorage.removeItem('accessToken');
            return res.json({success : false});
        }

        return res.json({success :true, user : user});
    }catch(e){
        localStorage.removeItem('accessToken');
        return res.json({success : false});
    }
}