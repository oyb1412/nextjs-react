'use client';                // ← 훅 쓸 거면 꼭

import {useState} from 'react';
import {useRouter} from "next/navigation";
import Header from '../components/Header';
import Footer from '../components/Footer';
import {useGlobalUser} from "@/app/stores/UserContext";
import Link from "next/link";

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useGlobalUser();

    const router = useRouter();

    async function handleLogin() {
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: email,
                                      password: pw}),
            });

            const result = await res.json();

            if (result.success) {
                setUser(result.id);
                localStorage.setItem('accessToken', result.accessToken);
                router.push('/');
                return;
            }
            else
            {
                alert(result.message);
            }
        }catch(e){
            console.error(e);
            alert("서버 오류가 발생했습니다");
        }finally
        {
            setLoading(false);
        }
    }

    async function handleNaverLogin(){

    }

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-white/80 z-[9999] flex items-center justify-center">
                    <div className="text-2xl font-bold text-gray-700 animate-pulse">로딩중입니다...</div>
                </div>
            )}

            <main className="mx-auto px-4 pt-24 pb-12 max-w-screen-xl">
                <div className="flex justify-center">
                    <div className="max-w-md w-full bg-gray-50 rounded-lg p-6 shadow-md">
                        <h1 className="text-2xl font-bold text-center mb-6">아이템매니아 회원 로그인</h1>

                        {/* 이메일 입력 */}
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="아이디"
                            />

                            <input
                                type="password"
                                value={pw}
                                onChange={(e) => setPw(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="비밀번호"
                            />
                        </div>

                        {/* 일반 로그인 */}
                        <button
                            onClick={() => handleLogin()}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold mt-4"
                        >
                            로그인
                        </button>

                        {/* 네이버 로그인 */}
                        <button
                            onClick={() => handleNaverLogin()}
                            className="w-full mt-3 bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600 transition-colors"
                        >
                            네이버 아이디로 로그인
                        </button>

                        {/* 회원가입 */}
                        <Link href="/signup">
                        <button className="w-full mt-3 bg-orange-500 text-white py-2 rounded font-semibold hover:bg-green-600 transition-colors">
                            회원가입
                        </button>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );

}