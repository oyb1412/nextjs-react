'use client';

import Link from 'next/link';
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {GameData} from "@/pages/util/GameData";
import {useGlobalUser} from "@/app/stores/UserContext";


export default function Header() {
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [hasUnreadAlarm, setHasUnreadAlarm] = useState<boolean>(false);
    const gameList = Object.keys(GameData);
    const router = useRouter();
    const [user] =  useGlobalUser();

    async function handleSearch(){
        if(!searchKeyword){
            alert("검색어를 입력해 주세요");
        }

        if(!gameList.includes(searchKeyword)){
            alert("지원하지 않는 게임입니다");
        }
        router.push('/search');
    }

    useEffect(() => {
        const fetchUnreadAlarm = async () => {
            setHasUnreadAlarm(false);
            const token = localStorage.getItem('accessToken');
            if(!token || !user)
                return;


            try{
                const res = await fetch(`/api/unreadAlarm?userId=${user}`,{
                    method: "GET",
                    headers : {
                        'Authorization' : `Bearer ${token}`
                    },
                    cache : "no-store"
                });

                const result = await res.json();

                if(result.success){
                    setHasUnreadAlarm(result.unreadAlarm);
                }
            }catch (e){
                console.error(e);
            }
        }
        fetchUnreadAlarm().then();

        // 1분마다 실행
        const intervalId = setInterval(fetchUnreadAlarm, 6000);

        // 컴포넌트 언마운트 시 인터벌 제거
        return () => clearInterval(intervalId);
    }, [user, hasUnreadAlarm]);

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

                <div className="flex items-center gap-6 text-sm text-gray-700 whitespace-nowrap">
                    {/* 알림 텍스트 */}
                    {user && (
                        <Link href="/myRoom" className="relative font-bold text-base text-black-600">
                            알림
                            {hasUnreadAlarm && (
                                <span className="absolute -top-1 -right-3 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </Link>
                    )}

                    {/* 로그인/로그아웃 버튼 */}
                    {user ? (
                        <Link href="/logout" className="hover:underline flex items-center gap-1">
                            <span>→</span> 로그아웃
                        </Link>
                    ) : (
                        <Link href="/login" className="hover:underline flex items-center gap-1">
                            <span>→</span> 로그인
                        </Link>
                    )}
                </div>

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
