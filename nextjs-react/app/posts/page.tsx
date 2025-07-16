'use client'

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Link from "next/link";

export default function PostsPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();

    useEffect(() => {
        fetch('/api/posts')
            .then((r) => r.json())
            .then(setPosts)
            .finally(() => setLoading(false))
    }, []);

    return(
        <>
            {/* 게시글 작성 버튼 */}
            <Link
                href="/postWrite"
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                글쓰기
            </Link>
            {loading ? (<p className="p-10">게시글을 불러오는 중입니다...</p>)
                    : posts.length === 0
                    ? (<p className="p-10">게시글이 없습니다</p>)
                    : (
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-gray-100 text-center">
                                <th className="border p-2 w-20">번호</th>
                                <th className="border p-2 w-20">제목</th>
                                <th className="border p-2 w-20">작성일</th>
                            </tr>
                            </thead>

                            <tbody>
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 text-center" onClick={() => router.push(`/post/${post.id}`)}>
                                    <td className="border p-2">{post.id}</td>
                                    <td className="border p-2 text-left">{post.title}</td>
                                    <td className="border p-2">{post.created_date}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                ) }

        </>
    )
}