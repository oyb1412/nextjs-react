'use client';
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";

export default function MyRoomPage() {
    type tradingItem = {
        sellingItemCount : number,
        sellOverItemCount : number,
        buyingItemCount : number,
        buyOverItemCount : number
    };

    type tradeOverItem = {
        selected_game : string,
        selected_server : string,
        amount : number,
        price : number,
        order_date : string,
        order_over_date : string,
        is_sell : boolean
    }

    const [tradingItem,  setTradingItem] = useState<tradingItem>();
    const [tradeOverItem,setTradeOverItem] = useState<tradeOverItem[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchMyRoom = async () => {
            const token = localStorage.getItem('accessToken');
            if(!token){
                alert("로그인 후 이용해 주세요");
                await router.push("/");
                return;
            }

            setLoading(true);

            try{
                const res = await fetch('/api/myRoom', {
                    method : "GET",
                    headers : {
                        'Authorization' : `Bearer ${token}`
                    }
                });

                const result = await res.json();

                if(result.success){
                    setTradingItem(result.tradingItem);
                    setTradeOverItem(result.tradeOverItem);
                }
                else{
                    console.error(result.message);
                }
            }catch (e){
                console.error(e);
            }finally {
                setLoading(false);
            }
        }
        fetchMyRoom().then();
    }, []);

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            {/* 거래 현황 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* 판매현황 */}
                <div className="border border-blue-300 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <span className="text-blue-600 font-bold text-lg mr-2">🪙 SELL</span>
                        <h2 className="font-semibold text-gray-700">판매 등록</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">

                        <div>
                            <p className="text-gray-600">판매중</p>
                            <p className="text-blue-600 font-bold text-xl">0</p>
                        </div>
                        <div>
                            <p className="text-gray-600">판매종료</p>
                            <p className="text-blue-600 font-bold text-xl">0</p>
                        </div>

                    </div>
                    <div className="mt-4 text-right text-sm text-blue-500 hover:underline cursor-pointer">
                        자세히보기
                    </div>
                </div>

                {/* 구매현황 */}
                <div className="border border-green-300 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <span className="text-green-600 font-bold text-lg mr-2">💸 BUY</span>
                        <h2 className="font-semibold text-gray-700">구매 등록</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">

                        <div>
                            <p className="text-gray-600">구매중</p>
                            <p className="text-green-600 font-bold text-xl">0</p>
                        </div>
                        <div>
                            <p className="text-gray-600">구매종료</p>
                            <p className="text-green-600 font-bold text-xl">0</p>
                        </div>
                    </div>
                    <div className="mt-4 text-right text-sm text-green-500 hover:underline cursor-pointer">
                        자세히보기
                    </div>
                </div>
            </section>

            {/* 최근 거래내역 */}
            <section className="bg-gray-50 border rounded-lg p-6">
                <h2 className="font-semibold text-gray-700 mb-4">최근 거래내역</h2>

                <div className="border rounded bg-white px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-gray-800">
                            <p className="font-semibold">메이플스토리 · 스카니아</p>
                            <p className="text-gray-600 text-xs">[수량 : 227억] 개인 메소 팝니다. 접속중</p>
                        </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                        <p className="font-bold text-gray-800">442,650원</p>
                        <p className="text-xs">06-09</p>
                        <p className="text-blue-600 font-semibold text-sm">판매완료</p>
                    </div>
                </div>

                {/* 최근 거래 없음 메시지 */}
                <div className="mt-6 text-center text-gray-500 text-sm">
                    최근 거래내역이 없습니다.
                </div>
            </section>
        </main>
    );
}
