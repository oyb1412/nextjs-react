
//Link는 a대신 쓰는 nextjs전용 라우터. 페이지 전환이 빠르다.
import Link from 'next/link';

//유저 어텐티케이션

import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
    return (
        <>
            <Header />

            <main className="container mx-auto px-4 py-8 space-y-12">

                {/* 파워물품 ZONE */}
                <section>
                    <h2 className="text-xl font-bold mb-4">
                        <span className="text-black">파워물품 </span>
                        <span className="text-blue-500">ZONE</span> 지금 템 + 머니 뭐 필요하세요? ⚡
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[
                            { title: "디아블로2:레저렉션", desc: "래더", price: "1개당 1,000원" },
                            { title: "메이플스토리월드", desc: "메이플랜드", price: "100만당 3,430원" },
                            { title: "패스오브엑자일", desc: "4개월리그", price: "1당 1,000원" },
                            { title: "디아블로2:레저렉션", desc: "스탠다드", price: "1개당 1,000원" },
                            { title: "메이플스토리월드", desc: "메이플랜드", price: "100만당 3,350원" },
                            { title: "패스오브엑자일", desc: "4개월리그", price: "10당 680원" },
                            { title: "디아블로2:레저렉션", desc: "래더", price: "1개당 1,000원" },
                            { title: "서든어택", desc: "기타", price: "1,000당 2,150원" },
                            { title: "디아블로2:레저렉션", desc: "래더", price: "1개당 100원" },
                            { title: "디아블로2:레저렉션", desc: "스탠다드", price: "1개당 100원" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border p-4 rounded shadow text-center">
                                <h3 className="text-sm font-semibold text-blue-500">{item.title}</h3>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                                <p className="mt-1 text-sm font-medium text-gray-800">{item.price}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 매니아 핫게임 & 게임순위 */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* 핫게임 */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">
                            <span className="text-black">매니아 </span>
                            <span className="text-red-600">핫게임</span> 놓치면 후회할 매니아 추천게임 🔥
                        </h2>

                        <div className="grid grid-cols-5 gap-4 text-center text-sm">
                            {[
                                "실버앤블러드", "세븐나이츠리버스", "에그몬월드:저니", "인생존망겜", "츄위:삼국",
                                "야드", "히어로즈크루", "미니언100", "킹오브파이터AFK", "메카브레이크"
                            ].map((game, i) => (
                                <div key={i} className="bg-white border p-3 rounded shadow">
                                    {game}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 게임순위 */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">게임순위</h2>
                        <ol className="space-y-2 text-sm">
                            {[
                                "메이플스토리 👑",
                                "메이플스토리월드",
                                "로스트아크",
                                "리니지 🔻18",
                                "바람의나라클래식",
                                "던전앤파이터",
                                "오딘:발할라라이징 🔻3",
                                "패스오브엑자일 🔻1",
                                "마비노기 🔻1",
                                "서든어택 🔻3"
                            ].map((game, i) => (
                                <li key={i} className="flex justify-between px-4 py-2 bg-gray-100 rounded">
                                    <span className="font-bold">{i + 1}.</span>
                                    <span className="ml-2">{game}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );

}