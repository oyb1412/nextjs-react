//Link는 a대신 쓰는 nextjs전용 라우터. 페이지 전환이 빠르다.
import Link from 'next/link';

//유저 어텐티케이션
import { authenticate } from "@/lib/auth";

export default async function Home() {
    const user = await authenticate();


    return (
        <main className="flex flex-col items-center justify-center h-screen gap-8">
            {/* 로그인 시(유저 어텐티케이션이 존재할 시) */}
            {user ? (
                <>
                <h1 className="text-4xl font-bold">{user.username}님, 어서오세요</h1>

                    {/* 게시글 목록 버튼 */}
                    <Link
                        href="/posts"
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        게시글
                    </Link>

                    {/* 로그아웃 버튼 */}
                    <Link
                        href="/logout"
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        로그아웃
                    </Link>
                </>
            ) : (
                <>
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
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        로그인
                    </Link>
                </>
            )}
        </main>
    );
}