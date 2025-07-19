'use client'

import {useRouter} from "next/navigation";
import {useEffect, useState } from "react";
import {useGlobalUser} from "@/app/stores/UserContext";


export default function SetLogout(){
    const router = useRouter();
    const [, setUser] = useGlobalUser();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLogout = async () => {

            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
                return;
            }

            setLoading(true);
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
            }finally {
                setLoading(false);
            }
        };

        fetchLogout().then();
    }, []);

    return (
        <div className="fixed inset-0 bg-white/80 z-[9999] flex items-center justify-center">
            <div className="text-2xl font-bold text-gray-700 animate-pulse">
                로딩 중입니다...
            </div>
        </div>
    );
}