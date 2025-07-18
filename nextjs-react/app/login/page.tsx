'use client';                // ← 훅 쓸 거면 꼭

import {useState} from 'react';
import {useRouter} from "next/navigation";
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

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
            <Header />
            <main className="min-h-[80vh] flex items-center justify-center bg-white px-4">
                {loading ? (
                    <div className="text-2xl font-bold text-gray-700 animate-pulse">로딩중입니다...</div>
                ) : (
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
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
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

                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}