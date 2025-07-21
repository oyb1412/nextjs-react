'use client'

export const dynamic = "force-dynamic";


import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useSearchParams} from "next/navigation";
import Link from "next/link";

export default function TradeListPage() {
    type item ={
        item_id : number,
        status : string, //여기에 selling, sellover, buying, buyover같은 타입을 넣음
        title : string, // 글 제목
        amount : number, // 게임머니 수량
        price : number, //실제 현금가
        order_date : string, //진행중인 거래면 order_date, over 거래면 order_over_date
    }

    const [itemList, setItemList] = useState<item[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const params = useSearchParams();

    //selling, sellover, buying, buyover 중 하나의 값이 들어옴
    const type = params?.get('type');

    useEffect(() => {const fetchTradeList = async() => {
        const token = localStorage.getItem('accessToken');
        if(!token){
            alert("로그인 후 이용해 주세요");
            await router.push('/');
            return;
        }

        setLoading(true);

        try{
            const res = await fetch(`/api/tradeList?type=${type}`,{
                method : 'GET',
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            });

            const result = await res.json();

            if(result.success){
                setItemList(result.itemList);
            }
            else {
                console.error(result.message);
            }
        }catch (e) {
            console.error(e);
        }finally {
            setLoading(false);
        }

        }

        fetchTradeList().then();
    }, [type]);

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
                <h1 className="text-xl font-bold mb-6">
                    거래 목록
                </h1>

                {itemList.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 text-sm">
                        거래 내역이 없습니다.
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {itemList.map((item, index) => (
                            <li key={index} className="border rounded p-4 bg-white shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                        item.status === 'selling' || item.status === 'buying'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-200 text-gray-600'
                    }`}
                >
                    {item.status === 'selling' && '판매중'}
                    {item.status === 'sellover' && '판매종료'}
                    {item.status === 'buying' && '구매중'}
                    {item.status === 'buyover' && '구매종료'}
                </span>
                                    <span className="text-sm text-gray-500">{item.order_date}</span>
                                </div>

                                {(item.status === 'selling' || item.status === 'buying') && (
                                    <Link
                                        href={
                                            item.status === 'selling'
                                                ? `/sellConfirm/${item.item_id}`
                                                : `/buyConfirm/${item.item_id}`
                                        }
                                    >
                                        <h2 className="text-lg font-bold">{item.title}</h2>
                                    </Link>
                                )}

                                <div className="text-sm text-gray-600">
                                    수량: <span className="font-semibold">{item.amount}</span> / 가격: <span className="font-semibold">{item.price.toLocaleString()}원</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </>
    );

}