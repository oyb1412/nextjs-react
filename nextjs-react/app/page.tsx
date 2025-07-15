//Link는 a대신 쓰는 nextjs전용 라우터. 페이지 전환이 빠르다.
import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center h-screen gap-8">
            <h1 className="text-4xl font-bold">어서오세요</h1>

            {/* 회원가입 버튼 */}
            <Link
                href="/signup"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                회원가입
            </Link>

            {/* 로그인 버튼 */}
            <Link
                href="/login"
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                로그인
            </Link>
        </main>
    );
}