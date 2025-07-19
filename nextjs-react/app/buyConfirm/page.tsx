'use client'

import {useEffect, useState} from "react";

export default function buyConfirm(){
    const [loading, setLoading] = useState(true);
    const [tradeDate, setTradeDate] = useState(null);

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-white/80 z-[9999] flex items-center justify-center">
                    <div className="text-2xl font-bold text-gray-700 animate-pulse">
                        로딩 중...
                    </div>
                </div>
            )}

            {tradeDate && (
                <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
                    <h1 className="text-2xl font-bold text-green-600 mb-8">🟢 거래 진행 중</h1>

                    {/* 거래 정보 */}
                    <section className="border rounded-lg p-6 mb-8 bg-white shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">판매 정보</h2>
                        <table className="w-full text-sm table-fixed">
                            <tbody>
                            <tr>
                                <td className="font-medium w-1/4">게임</td>
                                <td>{1} &gt; {1}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">판매자</td>
                                <td>{1}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">거래 제목</td>
                                <td>{1}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">캐릭터명</td>
                                <td>{1}</td>
                            </tr>
                            <tr>
                                <td className="font-medium">거래 수량</td>
                                <td>{1} 메소</td>
                            </tr>
                            <tr>
                                <td className="font-medium">총 가격</td>
                                <td>{1} 원</td>
                            </tr>
                            <tr>
                                <td className="font-medium">등록일</td>
                                <td>{1}</td>
                            </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* 채팅 영역 (나중에 구현) */}
                    <section className="border rounded-lg p-6 mb-8 bg-white shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">거래 채팅</h2>
                        <div className="text-sm text-gray-500 italic">※ 채팅 기능은 추후 구현 예정</div>
                    </section>

                    {/* 인수 완료 버튼 */}
                    <div className="flex justify-center">
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded text-lg"
                        >
                            인수 완료
                        </button>
                    </div>
                </main>
            )}
        </>
    );
}