'use client';

import Link from 'next/link';
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function Header() {
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [user, setUser] = useState<any | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchMain = async () => {
            const token = localStorage.getItem('accessToken');
            console.log('토큰:', token);
            if (!token){
                setUser(null);
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
            }
        };
        fetchMain().then();
    }, []);

    async function handleSearch(){
        if(!searchKeyword)
        {
            alert("검색어를 입력해 주세요");
        }
        router.push('/search');
    }

    return (
        <header className="w-full bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* 로고 */}
                <div className="text-2xl font-bold text-blue-600">
                    <Link href="/">ItemMania🍉</Link>
                </div>

                {/* 검색창 */}
                <div className="flex-1 px-6">
                    <div className="flex items-center w-full max-w-2xl mx-auto border border-blue-400 rounded-full px-4 py-2">
                        <select className="text-sm border-none bg-transparent outline-none text-gray-600">
                            <option>팝니다</option>
                            <option>삽니다</option>
                        </select>
                        <input
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            type="text"
                            placeholder="게임명을 입력해주세요."
                            className="flex-1 px-3 bg-transparent outline-none text-sm"
                        />
                        <button type="button"
                                className="text-gray-400 hover:text-gray-600 px-2"
                                onClick={(e) => setSearchKeyword('')}
                                >×</button>
                        <button type="button"
                                onClick={handleSearch}
                                className="text-blue-500 hover:text-blue-700 px-2">🔍</button>
                    </div>
                </div>

                {/* 로그인 버튼 */}
                {user ? (
                    <div className="text-sm text-gray-700 whitespace-nowrap">
                        <Link href="/login" className="hover:underline flex items-center gap-1">
                            <span>→</span> 로그아웃
                        </Link>
                    </div>
                ) : (
                    <div className="text-sm text-gray-700 whitespace-nowrap">
                        <Link href="/login" className="hover:underline flex items-center gap-1">
                            <span>→</span> 로그인
                        </Link>
                    </div>
                )}

            </div>

            {/* 🔽 하단 메뉴 */}
            <nav className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-2 flex gap-8 text-sm font-semibold text-gray-700">
                    <Link href="/sellRegister" className="hover:text-blue-600">판매등록</Link>
                    <Link href="/buyRegister" className="hover:text-green-600">구매등록</Link>
                    <Link href="/myRoom" className="hover:text-purple-600">마이룸</Link>
                </div>
            </nav>
        </header>
    );
}
