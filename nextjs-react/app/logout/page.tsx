'use client'

import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function SetLogout(){

    const router = useRouter();

    useEffect(() => {
        fetch('/api/logout', {method : 'POST'})
            .finally(() => {
                router.push('/');
            });
    }, []);

    return <p className="p-10">로그아웃 중입니다...</p>
}