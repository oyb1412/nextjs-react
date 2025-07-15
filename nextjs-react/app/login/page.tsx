'use client';                // ← 훅 쓸 거면 꼭

import {useState} from 'react';
import {useRouter} from "next/navigation";

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    async function handleSubmit(e : React.FormEvent) {
        e.preventDefault();
        setError('');

        const res = await fetch('/api/login', {
            method : 'POST',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify({email: email, password: pw}),
        });

        if(res.ok)
        {
            router.push('/');
        }
        else{
            const {error} = await res.json();
            setError(error ?? '가입 실패');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
            {/*타이틀*/}
            <h1 className="text-2xl font-bold">로그인</h1>

            {/*이메일 입력*/}
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일" required className="border p-2" />

            {/*비밀번호 입력*/}
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="비밀번호" required className="border p-2" />

            {/*에러 메시지(있을 때만)*/}
            {error && <p className="text-red-500">{error}</p>}

            {/*제출 버튼*/}
            <button type="submit" className="bg-blue-500 text-white py-2">로그인</button>
        </form>
    )
}