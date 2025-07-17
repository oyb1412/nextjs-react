'use client'

//Link는 a대신 쓰는 nextjs전용 라우터. 페이지 전환이 빠르다.
import Link from 'next/link';

//유저 어텐티케이션
import {useState, useEffect} from "react";

export default function Home() {
    console.log("Home 컴포넌트 렌더됨!");
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMain = async () => {
            const token = localStorage.getItem('accessToken');
            console.log('토큰:', token);
            if (!token){
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                const res = await fetch('/api/me', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                const result = await res.json();

                if (result.success) {
                    setUser(result.user);
                } else {
                    setUser(null);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchMain().then();
    }, []);


    return loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <h1 className="text-3xl font-bold text-gray-700  animate-pulse">로딩중입니다...</h1>
        </div>
    ) : (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-center mb-8">메인 페이지</h1>
                {user ? (
                    <div className="space-y-4">
                        <h2 className="text-xl text-center text-blue-600 mb-6">어서오세요!</h2>
                        <div className="space-y-3">
                            <Link href="/logout">
                                <button className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors">
                                    로그아웃
                                </button>
                            </Link>
                            <Link href="/posts">
                                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                                    게시글 목록
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Link href="/login">
                            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                                로그인
                            </button>
                        </Link>
                        <Link href="/signup">
                            <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors">
                                회원가입
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}