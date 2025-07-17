'use client'

import {useRouter} from "next/navigation";
import {useEffect } from "react";

export default function SetLogout(){
    const router = useRouter();

    useEffect(() => {
        const fetchLogout = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
                return;
            }
            try{
                const res = await fetch('/api/logout', {
                    method: 'POST',
                    headers : {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await res.json();
                alert(result.message);

                if(result.success){
                    localStorage.removeItem('accessToken');
                    router.push('/');
                    return;
                }
                else{
                    console.error(result.message);
                }
            }catch(e)
            {
                console.error(e);
            }
        };

        fetchLogout().then();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="text-2xl font-bold text-gray-700 animate-pulse">
                로그아웃 중입니다...
            </div>
        </div>
    );
}