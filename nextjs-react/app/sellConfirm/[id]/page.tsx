'use client'

import {useEffect, useState} from "react";
import {useRouter, useParams} from "next/navigation";


export default function sellConfirm(){
    type tradeDescription = {
        selected_game : string,
        selected_server : string,
        amount : number,
        price : number,
        seller_id : number,
        buyer_id : number,
        char_name : string,
        seller_name : string,
        buyer_name : string,
        title : string,
        content : string,
        created_date : string,
    }

    const [buyerOk, setBuyerOk ] = useState<boolean>(false);
    const [sellerOk, setSellerOk ] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [tradeDescription, setTradeDescription] = useState<tradeDescription>();
    const router = useRouter();
    const pageId = useParams()?.id;

    //첫 한번 거래 정보 받아오기
    useEffect(() => {
        const fetchTradeDescription = async () =>{
            const token = localStorage.getItem('accessToken');
            if(!token){
                alert("로그인 후 이용해 주세요");
                router.push("/");
                return;
            }


            try{
                setLoading(true);

                const res = await fetch(`/api/sellConfirm?pageId=${pageId}`,{
                    method : 'GET',
                    headers : {
                        'Authorization' : `Bearer ${token}`,
                    }
                });

                const result = await res.json();

                if(result.success){
                    setTradeDescription(result.tradeDescription);
                }
                else{
                    console.error(result.message);
                }
            }catch (e) {
                console.error(e);
            }finally {
                setLoading(false);
            }
        }
        fetchTradeDescription().then();
    }, []);

    //인계확인 전송 함수
    async function okHandler(e : React.FormEvent) {
        e.preventDefault(); //폼 기본 액션 막기

        if(!confirm("정말 인계확인을 하시겠습니까?"))
            return;

        const token = localStorage.getItem('accessToken');
        if(!token){
            alert("로그인 후 이용해 주세요");
            router.push("/");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/sellerOk?pageId=${pageId}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization' : `Bearer ${token}`},
                body: JSON.stringify({ok: true})
            });

            const result = await res.json();

            if(result.success){
                setSellerOk(true);
                //거래 종료시 메인 페이지로 이동
                if(result.done)
                {
                    alert("거래가 완료되었습니다");
                    router.push("/");
                    return;
                }

            }else{
                console.error(result.message);
            }
        }catch (e) {
            console.error(e);
        }finally {
            setLoading(false);
        }
    }

    //30초 간격으로 상대방의 인계사실 확인하기
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if(!token){
            alert("로그인 후 이용해 주세요");
            router.push("/");
            return;
        }

        const checkImmediately = async () => {
            try {
                const res = await fetch(`/api/checkBuyerOk?pageId=${pageId}`,
                    {
                        method : 'GET',
                        headers : {
                            'Authorization' : `Bearer ${token}`,
                        }
                    });
                const result = await res.json();

                if (result.success && result.buyerOk) {
                    setBuyerOk(true);

                    //거래 종료시 메인 페이지로 이동
                    if(result.done)
                    {
                        alert("거래가 완료되었습니다");
                        router.push("/");
                        return;
                    }
                }
            } catch (err) {
                console.error("상대방 인계 확인 실패:", err);
            }
        }
        checkImmediately().then();

        const interval = setInterval(checkImmediately, 30000); // 이후 30초 간격 반복

        return () => clearInterval(interval);
    }, [pageId]);


    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-white/80 z-[9999] flex items-center justify-center">
                    <div className="text-2xl font-bold text-gray-700 animate-pulse">
                        로딩 중...
                    </div>
                </div>
            )}

            {tradeDescription && (
                <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
                    <h1 className="text-2xl font-bold text-blue-600 mb-8">🔵 거래 진행 중</h1>

                    {/* 거래 정보 */}
                    <section className="border rounded-lg p-6 mb-8 bg-white shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">판매 정보</h2>
                        <table className="w-full text-sm table-fixed">
                            <tbody>
                            <tr>
                                <td className="font-medium w-1/4">게임</td>
                                <td>{tradeDescription.selected_game} &gt; {tradeDescription.selected_server}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">판매자</td>
                                <td>{tradeDescription.seller_name}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">구매자</td>
                                <td>{tradeDescription.buyer_name}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">거래 제목</td>
                                <td>{tradeDescription.title}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">캐릭터명</td>
                                <td>{tradeDescription.char_name}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">거래 수량</td>
                                <td>{tradeDescription.amount.toLocaleString()} 메소</td>
                            </tr>
                            <tr>
                                <td className="font-medium">총 가격</td>
                                <td>{tradeDescription.price.toLocaleString()} 원</td>
                            </tr>
                            <tr>
                                <td className="font-medium">등록일</td>
                                <td>{tradeDescription.created_date}</td>
                            </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* 인계 완료 버튼 */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            className={`px-8 py-2 rounded text-lg ${
                                sellerOk
                                    ? 'bg-gray-400 text-white cursor-default'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                            disabled={sellerOk}
                            onClick={okHandler}
                        >
                            {sellerOk ? '인계를 확인했습니다' : '인계 완료'}
                        </button>

                        {buyerOk && (
                            <span className="text-green-600 font-semibold">
                    ✅ 상대방이 인수를 확인했습니다
                     </span>
                        )}
                    </div>
                </main>
            )}
        </>
    );

}