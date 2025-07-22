'use client'
//Link는 a대신 쓰는 nextjs전용 라우터. 페이지 전환이 빠르다.
import Link from 'next/link';
import {useEffect, useState}  from 'react';


export default function Home() {
    type tradeItem = {
        id : number,
        selected_game: string,
        amount: number,
        price: number;
    };
    const [recentSellList, setRecentSellList] = useState<tradeItem[]>([]);
    const [recentBuyList, setRecentBuyList] = useState<tradeItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchRecentlySell = async () => {
            try {
                const res = await fetch('/api/recentlyTrade');

                const result = await res.json();

                if(result.success)
                {
                    setRecentSellList(result.recentSellList);
                    setRecentBuyList(result.recentBuyList);
                }

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        fetchRecentlySell().then();
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

            <main className="mx-auto px-4 pt-24 pb-12 max-w-screen-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 최근 판매글 목록 */}
                    <section className="bg-white border p-4 rounded shadow">
                        <h2 className="text-lg font-bold mb-4">최근 등록된 판매글</h2>
                        <table className="w-full text-sm table-auto">
                            <thead>
                            <tr className="text-left border-b">
                                <th className="py-2">게임</th>
                                <th>판매량</th>
                                <th>가격</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentSellList.map((item) => (
                                <tr key={item.id}>
                                    <td className="py-2">
                                        <Link href={`/sellPage/${item.id}`}>
                                            <div className="w-full h-full text-blue-600 hover:underline">
                                                {item.selected_game}
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="py-2">{item.amount}</td>
                                    <td className="py-2">{item.price}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>

                    {/* 최근 구매글 목록 */}
                    <section className="bg-white border p-4 rounded shadow">
                        <h2 className="text-lg font-bold mb-4">최근 등록된 구매글</h2>
                        <table className="w-full text-sm table-auto">
                            <thead>
                            <tr className="text-left border-b">
                                <th className="py-2">게임</th>
                                <th>구매량</th>
                                <th>가격</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentBuyList.map((item) => (
                                <tr key={item.id}>
                                    <td className="py-2">
                                        <Link href={`/buyPage/${item.id}`}>
                                            <div className="w-full h-full text-blue-600 hover:underline">
                                                {item.selected_game}
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="py-2">{item.amount}</td>
                                    <td className="py-2">{item.price}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            </main>
        </>
    );

}