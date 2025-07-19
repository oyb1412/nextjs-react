'use client' // 이걸 선언하면, 이 컴포넌트는 useState, useRouter 같은 훅을 자유롭게 사용할 수 있게 됨.
import Link from 'next/link';

import {useState} from "react"; // 입력값 상태 관리용 훅
import {useRouter} from "next/navigation"; // 페이지 이동 관리용 훅

//회원가입 페이지 컴포넌트
//url : http://localhost:8085/signup
//파일 경로 : app/signup/page.tsx -> next.js가 자동으로 맵핑
export default function SignUpPage() {
    //상태 선언(이메일, 비밀번호, 에러 메시지)
    const [email, setEmail] = useState(''); //이메일 입력값
    const [pw, setPw] = useState(''); //비밀번호 입력값
    const [name, setName] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter(); // 페이지 이동 함수 저장

    async function handleSubmit(e : React.FormEvent) {
        e.preventDefault(); //폼 기본 액션 막기

        setLoading(true);
        try {
            //서버에 JSON 전송
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: email, password: pw, name : name})
            });

            const result = await res.json();

            if(result.success){
                //가입 성공 -> 메인 페이지로 이동
                router.push('/login');
                return;
            }else{
                alert(result.message);
                console.error(result.message);
            }
        }
        catch(e){
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-white/80 z-[9999] flex items-center justify-center">
                    <div className="text-2xl font-bold text-gray-700 animate-pulse">
                        로딩 중입니다...
                    </div>
                </div>
            )}

            <main className="mx-auto px-4 pt-24 pb-12 max-w-screen-sm">
                <div className="bg-white rounded-lg p-6 shadow-md border">
                    <h1 className="text-2xl font-bold text-center mb-8">회원가입</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">이메일</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="이메일을 입력하세요"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">비밀번호</label>
                            <input
                                type="password"
                                value={pw}
                                onChange={(e) => setPw(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">이름</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="이름을 입력하세요"
                                required
                            />
                        </div>

                        <div className="space-y-3 pt-4">
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                            >
                                확인
                            </button>
                            <Link href="/">
                                <button
                                    type="button"
                                    className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                                >
                                    뒤로가기
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );

}