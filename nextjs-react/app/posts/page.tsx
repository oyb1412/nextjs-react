'use client'

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Link from "next/link";

export default function PostsPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async  () => {
            const token = localStorage.getItem('accessToken');
            if(!token){
                router.push('/');
                return;
            }
            try {
                const res = await fetch('/api/posts', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const result = await res.json();
                alert(result.message);

                if (result.success) {
                    setPosts(result.posts);
                }
                else{
                    console.error(result.message);
                }
            }
            catch(e){
                console.error(e);
            }
            finally {
                setLoading(false);
            }
        };

        fetchPosts().then();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            {loading ? (
                <div className="text-2xl font-bold text-gray-700 animate-pulse">
                    로딩중입니다...
                </div>
            ) : (
                <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">게시글 목록</h1>
                        <Link href="/postWrite">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                                글쓰기
                            </button>
                        </Link>
                    </div>

                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">번호</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">제목</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">작성일</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{post.id}</td>
                                    <td className="px-6 py-4">
                                        <Link href={`/post/${post.id}`}>
                      <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                        {post.title}
                      </span>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{post.created_date}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6">
                        <Link href="/">
                            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
                                메인으로
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}