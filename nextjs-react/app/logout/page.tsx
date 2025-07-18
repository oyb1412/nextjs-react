'use client'

import {useRouter} from "next/navigation";
import {useEffect } from "react";
import {useGlobalUser} from "@/app/stores/UserContext";


export default function SetLogout(){
    const router = useRouter();
    const [user, setUser] = useGlobalUser();

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

                if(result.success){
                    setUser(null);
                    localStorage.removeItem('accessToken');
                    router.push('/');
                    return;
                }
                else{
                    alert(result.message);
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