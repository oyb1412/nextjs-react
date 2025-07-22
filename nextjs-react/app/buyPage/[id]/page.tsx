'use client'

import {useGlobalUser} from "@/app/stores/UserContext";
import {useState, useEffect } from "react";
import {useRouter, useParams} from "next/navigation";

export default function buy(){
    type buyPage = {
        selected_game : string,
        selected_server : string,
        amount : number,
        price : number,
        buyer_id : number,
        char_name : string,
        buyer_name : string,
        title : string,
        content : string,
        created_date : string,
    }

    const [buyDescription, setBuyDescription] = useState<buyPage>();

    const [user] = useGlobalUser();
    const router =  useRouter();
    const [loading, setLoading] = useState(false);
    const pageId = useParams()?.id;

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
                const res = await fetch(`/api/buyPage?pageId=${pageId}`,{
                    method: "GET",
                    headers : {
                        'Authorization' : `Bearer ${token}`
                    }
                });

                const result = await res.json();

                if(result.success){
                    setBuyDescription(result.buyDescription);
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

    async function sellHandler()
    {
        if(loading)
            return;

        if(!confirm('정말 판매하시겠습니까?'))
            return;

        if(!buyDescription)
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
            //판매 가능한가?
            const pay = await fetch(`/api/canSell?pageId=${pageId}`,{
                method: "POST",
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            });
            const result = await pay.json();

            if(result.success)
            {
                //판매 페이지로 이동
                router.push(`/sellConfirm/${pageId}`);
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

            {buyDescription && (
                <main className="max-w-4xl mx-auto px-4 py-12">
                    <h1 className="text-2xl font-bold text-blue-600 mb-8">📦 구매 상세</h1>

                    {/* 물품정보 */}
                    <section className="border rounded-lg p-6 mb-8 bg-white shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">물품정보</h2>
                        <table className="w-full text-sm table-fixed">
                            <tbody>
                            <tr>
                                <td className="font-medium w-1/4">카테고리</td>
                                <td>{buyDescription.selected_game} &gt; {buyDescription.selected_server}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">물품제목</td>
                                <td className="text-blue-600 font-semibold">{buyDescription.title}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">거래자명</td>
                                <td>{buyDescription.buyer_id}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">캐릭터명</td>
                                <td>{buyDescription.char_name}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">구매 게임머니</td>
                                <td>{buyDescription.amount.toLocaleString()} 원</td>
                            </tr>
                            <tr>
                                <td className="font-medium">구매금액</td>
                                <td>{buyDescription.price.toLocaleString()}원 / 원</td>
                            </tr>
                            <tr>
                                <td className="font-medium">등록일시</td>
                                <td>{new Date(buyDescription.created_date).toLocaleString()}</td>
                            </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* 상세설명 */}
                    <section className="border rounded-lg p-6 mb-8 bg-white shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">상세설명</h2>
                        <p className="text-sm whitespace-pre-wrap">{buyDescription.content}</p>
                    </section>

                    {/* 판매 버튼 */}
                    <div className="flex justify-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded text-lg"
                                onClick={sellHandler}
                        >
                            판매 신청
                        </button>
                    </div>
                </main>
            )}
        </>
    );
}