'use client';                // ← 훅 쓸 거면 꼭

import {useState} from 'react';
import {useRouter} from "next/navigation";
import Link from 'next/link';

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    async function handleSubmit(e : React.FormEvent) {
        e.preventDefault();

        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: email,
                                      password: pw}),
            });

            const result = await res.json();

            alert(result.message);

            if (result.success) {
                localStorage.setItem('accessToken', result.accessToken);
                router.push('/');
                return;
            }
        }catch(e){
            console.error(e);
            alert("서버 오류가 발생했습니다");
        }finally
        {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            {loading ? (
                <div className="text-2xl font-bold text-gray-700 animate-pulse">로딩중입니다...</div>
            ) : (
                <div className="max-w-md w-full bg-gray-50 rounded-lg p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-center mb-8">로그인</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">이메일</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="이메일을 입력하세요"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">비밀번호</label>
                            <input
                                type="password"
                                value={pw}
                                onChange={(e) => setPw(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                        </div>

                        <div className="space-y-3 pt-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                            >
                                확인
                            </button>
                            <Link href="/">
                                <button
                                    type="button"
                                    className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                                >
                                    뒤로가기
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}