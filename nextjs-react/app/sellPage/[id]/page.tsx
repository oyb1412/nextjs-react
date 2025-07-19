'use client'

import {useGlobalUser} from "@/app/stores/UserContext";
import {useState, useEffect } from "react";
import {useRouter, useParams} from "next/navigation";

export default function sell(){
    type sellPage = {
        selected_game : string,
        selected_server : string,
        amount : number,
        price : number,
        seller_id : number,
        char_name : string,
        seller_name : string,
        title : string,
        content : string,
        created_date : string,
    }

    const [sellDescription, setSellDescription] = useState<sellPage>();

    const [user] = useGlobalUser();
    const router =  useRouter();
    const [loading, setLoading] = useState(false);
    const pageId = useParams()?.id;

    useEffect(() => {
        if(!user)
        {
            alert("로그인 후 이용해주세요");
            router.push("/");
            return;
        }
    }, [user]);

    useEffect(() => {
        const fetchSellPage = async () => {
            const token = localStorage.getItem('accessToken');
            if(!token){
                alert("로그인 후 이용해주세요");
                router.push("/");
                return;
            }

            setLoading(true);

            try{
                const res = await fetch(`/api/sellPage?pageId=${pageId}`,{
                    method: "GET",
                    headers : {
                        'Authorization' : `Bearer ${token}`
                    }
                });

                const result = await res.json();

                if(result.success){
                    setSellDescription(result.sellDescription);
                }
                else
                {
                    console.error(result.message);
                }
            }catch (e){
                console.error(e);
            }finally {
                setLoading(false);
            }
        }
        fetchSellPage().then();
    }, []);

    async function buyHandler()
    {
        if(loading)
            return;

        if(!confirm('정말 구매하시겠습니까?'))
            return;

        if(!sellDescription)
        {
            alert('글 정보를 불러오고 있습니다. 잠시만 기다려 주세요');
            return;
        }

        try{
            const token = localStorage.getItem('accessToken');
            if(!token){
                alert("로그인 후 이용해주세요");
                router.push("/");
                return;
            }

            setLoading(true);
            //유저의 보유 포인트로 구매 가능한가?
            const pay = await fetch(`/api/canBuy?price=${sellDescription.price}&pageId=${pageId}`,{
                    method: "GET",
                    headers : {
                        'Authorization' : `Bearer ${token}`
                    }
                });
            const result = await pay.json();

            if(result.success)
            {
                //구매 페이지로 이동
                router.push(`/buyConfirm/${pageId}`);
            }
            else{
                alert(result.message);
            }
        }catch(e){
            console.error(e);
        }finally {
            setLoading(false);
        }

    }

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-white/80 z-[9999] flex items-center justify-center">
                    <div className="text-2xl font-bold text-gray-700 animate-pulse">
                        로딩 중...
                    </div>
                </div>
            )}

            {sellDescription && (
                <main className="max-w-4xl mx-auto px-4 py-12">
                    <h1 className="text-2xl font-bold text-blue-600 mb-8">📦 판매 상세</h1>

                    {/* 물품정보 */}
                    <section className="border rounded-lg p-6 mb-8 bg-white shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">물품정보</h2>
                        <table className="w-full text-sm table-fixed">
                            <tbody>
                            <tr>
                                <td className="font-medium w-1/4">카테고리</td>
                                <td>{sellDescription.selected_game} &gt; {sellDescription.selected_server}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">물품제목</td>
                                <td className="text-blue-600 font-semibold">{sellDescription.title}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">거래자명</td>
                                <td>{sellDescription.seller_name}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">캐릭터명</td>
                                <td>{sellDescription.char_name}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">판매 게임머니</td>
                                <td>{sellDescription.amount.toLocaleString()} 원</td>
                            </tr>
                            <tr>
                                <td className="font-medium">판매금액</td>
                                <td>{sellDescription.price.toLocaleString()}원 / 원</td>
                            </tr>
                            <tr>
                                <td className="font-medium">등록일시</td>
                                <td>{new Date(sellDescription.created_date).toLocaleString()}</td>
                            </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* 상세설명 */}
                    <section className="border rounded-lg p-6 mb-8 bg-white shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">상세설명</h2>
                        <p className="text-sm whitespace-pre-wrap">{sellDescription.content}</p>
                    </section>

                    {/* 구매 버튼 */}
                    <div className="flex justify-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded text-lg"
                        onClick={buyHandler}
                        >
                            구매 신청
                        </button>
                    </div>
                </main>
            )}
        </>
    );
}