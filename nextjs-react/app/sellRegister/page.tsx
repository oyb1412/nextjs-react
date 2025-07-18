'use client'

import Header from '../components/Header';
import Footer from '../components/Footer';
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function sellRegisterPage(){
    const [selectedGame, setSelectedGame] = useState<string>('메이플스토리');
    const [selectedServer, setSelectedServer] = useState<string>('스카니아');

    const [amount, setAmount] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [charName, setCharName] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const router = useRouter();

    async function handlerSellRegister(){
        const token = localStorage.getItem('accessToken');

        if(!token)
        {
            router.push('/');
            return;
        }

        try{
            const data ={
                selectedGame : selectedGame,
                selectedServer : selectedServer,
                amount : amount,
                price : price,
                charName : charName,
                title : title,
                content : content
            };

            const res = await fetch('/api/sellRegister', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization : `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            alert(result.message);

            if(result.success){
                router.push('/');
                return;
            }
            else{
                console.error(result.message);
            }
        }catch (e){
            console.error(e);
        }finally {

        }
    }

    return (
        <>
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold text-blue-600 mb-8">📦 판매등록</h1>

                <div className="space-y-6">

                    {/* 게임명 선택 */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">게임명</label>
                        <div className="flex items-center border rounded px-3 py-2">
                            <select
                                className="flex-1 outline-none bg-transparent text-sm"
                                value={selectedGame}
                                onChange={(e) => setSelectedGame(e.target.value)}
                            >
                                <option value="메이플스토리">메이플스토리</option>
                            </select>
                        </div>
                    </div>

                    {/* 서버명 선택 */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">서버명</label>
                        <div className="flex items-center border rounded px-3 py-2">
                            <select
                                className="flex-1 outline-none bg-transparent text-sm"
                                value={selectedServer}
                                onChange={(e) => setSelectedServer(e.target.value)}
                            >
                                <option value="스카니아">스카니아</option>
                            </select>
                        </div>
                    </div>

                    {/* 판매수량 */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">판매수량</label>
                        <div className="flex items-center gap-2">
                            <input type="number" className="w-32 border rounded px-2 py-1" placeholder="수량"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}/>
                            <span className="text-sm text-gray-500">게임머니</span>

                        </div>
                    </div>

                    {/* 판매금액 */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">판매금액</label>
                        <input type="number" className="w-full border rounded px-3 py-2" placeholder="금액을 입력해주세요"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}/>
                        <p className="text-xs text-red-500 mt-1">※ 평균 시세보다 낮으면 제한될 수 있습니다.</p>
                    </div>

                    {/* 캐릭터명 */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">캐릭터명</label>
                        <input type="text" className="w-full border rounded px-3 py-2" placeholder="본인의 캐릭터명을 입력해주세요"
                        value={charName}
                        onChange={(e) => setCharName(e.target.value)}/>
                        <p className="text-xs text-red-500 mt-1">※ 미기재시 책임은 거래신청자에게 있습니다.</p>
                    </div>

                    {/* 물품제목 */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">물품제목</label>
                        <input type="text" className="w-full border rounded px-3 py-2" placeholder="예: 게임머니 팝니다."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}/>
                    </div>

                    {/* 상세설명 */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">상세설명</label>
                        <textarea className="w-full border rounded px-3 py-2" rows={4} placeholder="물품 상세 설명을 입력해주세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}/>
                    </div>

                    {/* 등록 & 취소 버튼 */}
                    <div className="pt-4 flex justify-end gap-3">
                        <Link href="/">
                            <button type="button" className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">
                                취소
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            onClick={handlerSellRegister}
                        >
                            등록하기
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );

}