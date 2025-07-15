'use client' // 이걸 선언하면, 이 컴포넌트는 useState, useRouter 같은 훅을 자유롭게 사용할 수 있게 됨.

import {useState} from "react"; // 입력값 상태 관리용 훅
import {useRouter} from "next/navigation"; // 페이지 이동 관리용 훅

//회원가입 페이지 컴포넌트
//url : http://localhost:8085/signup
//파일 경로 : app/signup/page.tsx -> next.js가 자동으로 맵핑
export default function SignUpPage() {
    //상태 선언(이메일, 비밀번호, 에러 메시지)
    const [email, setEmail] = useState(''); //이메일 입력값
    const [pw, setPw] = useState(''); //비밀번호 입력값
    const [error, setError] = useState(''); // 서버에서 온 에러 메시지 저장

    const router = useRouter() // 페이지 이동 함수 저장

    async function handleSubmit(e : React.FormEvent) {
        e.preventDefault(); //폼 기본 액션 막기
        setError(''); //에러 메시지 초기화

        //서버에 JSON 전송
        const res = await fetch('/api/signup', {
            method : 'POST',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify({email:email, password:pw})
        });

        if(res.ok){
            //가입 성공 -> 메인 페이지로 이동
            router.push('/');
        }
        else {
            //가입 실패 -> 에러 메시지 표시
            const {error} = await res.json();
            setError(error ?? '가입 실패');
        }
    }

    //JSX : 실제 화면 렌더링
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
            {/*타이틀*/}
            <h1 className="text-2xl font-bold">회원가입</h1>

            {/*이메일 입력*/}
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일" required className="border p-2" />

            {/*비밀번호 입력*/}
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="비밀번호" required className="border p-2" />

            {/*에러 메시지(있을 때만)*/}
            {error && <p className="text-red-500">{error}</p>}

            {/*제출 버튼*/}
            <button type="submit" className="bg-blue-500 text-white py-2">가입하기</button>
        </form>
    )
}