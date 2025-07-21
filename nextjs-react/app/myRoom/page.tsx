'use client';
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation"; // 페이지 이동 관리용 훅
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

    const [sellRegisterCount, setSellRegisterCount ] = useState<number>();
    const [buyRegisterCount, setBuyRegisterCount ] = useState<number>();

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
                    method : 'POST',
                    headers : {
                        'Authorization' : `Bearer ${token}`
                    }
                });

                const result = await res.json();

                if(result.success){
                    setSellRegisterCount(result.sellRegisterCount);
                    setBuyRegisterCount(result.buyRegisterCount);

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
        <>
            {loading && (
                <div className="fixed inset-0 bg-white/80 z-[9999] flex items-center justify-center">
                    <div className="text-2xl font-bold text-gray-700 animate-pulse">
                        로딩 중...
                    </div>
                </div>
            )}
        <main className="max-w-4xl mx-auto px-4 py-10">
            {/* 거래 현황 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* 판매현황 */}
                <div className="border border-blue-300 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <span className="text-blue-600 font-bold text-lg mr-2">🪙 SELL</span>
                        <h2 className="font-semibold text-gray-700">판매 현황</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">

                        <Link href="/tradeList?type=sellRegister" className="block text-center cursor-pointer">
                            <div>
                                <p className="text-gray-600">판매 등록</p>
                                <p className="text-blue-600 font-bold text-xl">
                                    {sellRegisterCount ?? 0}
                                </p>
                            </div>
                        </Link>

                        <Link href="/tradeList?type=selling" className="block text-center cursor-pointer">
                            <div>
                                <p className="text-gray-600">판매중</p>
                                <p className="text-blue-600 font-bold text-xl">
                                    {tradingItem?.sellingItemCount ?? 0}
                                </p>
                            </div>
                        </Link>
                        <Link href="/tradeList?type=sellover" className="block text-center cursor-pointer">
                            <div>
                                <p className="text-gray-600">판매종료</p>
                                <p className="text-blue-600 font-bold text-xl">
                                    {tradingItem?.sellOverItemCount ?? 0}
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* 구매현황 */}
                <div className="border border-green-300 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <span className="text-green-600 font-bold text-lg mr-2">💸 BUY</span>
                        <h2 className="font-semibold text-gray-700">구매 현황</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">

                        <Link href="/tradeList?type=buyRegister" className="block text-center cursor-pointer">
                            <div>
                                <p className="text-gray-600">구매 등록</p>
                                <p className="text-green-600 font-bold text-xl">
                                    {buyRegisterCount ?? 0}
                                </p>
                            </div>
                        </Link>

                        <Link href="/tradeList?type=buying" className="block text-center cursor-pointer">
                            <div>
                                <p className="text-gray-600">구매중</p>
                                <p className="text-green-600 font-bold text-xl">
                                    {tradingItem?.buyingItemCount ?? 0}
                                </p>
                            </div>
                        </Link>

                        <Link href="/tradeList?type=buyover" className="block text-center cursor-pointer">
                            <div>
                                <p className="text-gray-600">구매종료</p>
                                <p className="text-green-600 font-bold text-xl">
                                    {tradingItem?.buyOverItemCount ?? 0}
                                </p>
                            </div>
                        </Link>

                    </div>
                </div>
            </section>

            {/* 최근 거래내역 */}
            <section className="bg-gray-50 border rounded-lg p-6">
                <h2 className="font-semibold text-gray-700 mb-4">최근 거래내역</h2>

                {tradeOverItem.length > 0 ? (
                    tradeOverItem.map((item, index) => (
                        <div key={index} className="border rounded bg-white px-4 py-3 flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3 text-sm">
                                <div className={`w-2 h-2 rounded-full ${item.is_sell ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                                <div className="text-gray-800">
                                    <p className="font-semibold">{item.selected_game} · {item.selected_server}</p>
                                    <p className="text-gray-600 text-xs">[수량 : {item.amount}] {item.is_sell ? '판매' : '구매'} 완료</p>
                                </div>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                                <p className="font-bold text-gray-800">{item.price.toLocaleString()}원</p>
                                <p className="text-xs">{item.order_date}</p>
                                <p className={`${item.is_sell ? 'text-blue-600' : 'text-green-600'} font-semibold text-sm`}>
                                    {item.is_sell ? '판매완료' : '구매완료'}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="mt-6 text-center text-gray-500 text-sm">
                        최근 거래내역이 없습니다.
                    </div>
                )}
            </section>

        </main>
            </>
    );
}
