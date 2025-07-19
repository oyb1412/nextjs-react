'use client';

import Link from 'next/link';
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useGlobalUser} from "@/app/stores/UserContext";
import {GameData} from "@/pages/util/GameData";


export default function Header() {
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [user] = useGlobalUser();
    const gameList = Object.keys(GameData);
    const router = useRouter();

    async function handleSearch(){
        if(!searchKeyword){
            alert("검색어를 입력해 주세요");
        }

        if(!gameList.includes(searchKeyword)){
            alert("지원하지 않는 게임입니다");
        }
        router.push('/search');
    }

    return (
        <header className="w-full bg-white border-b shadow-sm">
            <div className="mx-auto px-4 py-4 max-w-screen-xl flex justify-between items-center">
                {/* 로고 */}
                <div className="text-2xl font-bold text-blue-600">
                    <Link href="/">ItemMania🍉</Link>
                </div>

                {/* 검색창 */}
                <div className="flex-1 px-6">
                    <div className="flex items-center w-full max-w-2xl mx-auto border border-blue-400 rounded-full px-4 py-2 gap-x-2">

                        {/* 거래 타입 선택 */}
                        <select className="text-sm border-none bg-transparent outline-none text-gray-600">
                            <option>팝니다</option>
                            <option>삽니다</option>
                        </select>

                        {/* 게임명 선택 */}
                        <select
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="text-sm border-none bg-transparent outline-none text-gray-600"
                        >
                            <option value="">선택하세요</option>
                            {gameList.map((game) => (
                                <option key={game} value={game}>
                                    {game}
                                </option>
                            ))}
                        </select>

                        {/* 검색어 입력 */}
                        <input
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            type="text"
                            className="flex-1 px-3 bg-transparent outline-none text-sm text-gray-700"
                        />

                        {/* X 버튼 */}
                        <button
                            type="button"
                            onClick={() => setSearchKeyword('')}
                            className="text-gray-400 hover:text-gray-600 text-lg flex-shrink-0"
                        >
                            ×
                        </button>

                        {/* 돋보기 버튼 */}
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="text-blue-500 hover:text-blue-700 text-lg flex-shrink-0"
                        >
                            🔍
                        </button>
                    </div>
                </div>

                {/* 로그인 버튼 */}
                {user ? (
                    <div className="text-sm text-gray-700 whitespace-nowrap">
                        <Link href="/logout" className="hover:underline flex items-center gap-1">
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
