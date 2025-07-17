'use client'

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function postWritePage(){
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent)
    {
        e.preventDefault();
        setLoading(true);
        const data = {
            title : title,
            content : content
        };

        const token = localStorage.getItem('accessToken');
        if(!token){
            router.push('/');
            return;
        }

        try {
            const res = await fetch('/api/postWrite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            alert(result.message);

            if (result.success) {
                router.push('/posts');
                return;
            }
            else {
                console.error(result.message);
            }
        }
        catch(e){
            console.error(e);
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white p-8">
            {loading ? (
                <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg p-6 shadow-sm text-center">
                    <p className="text-gray-600 animate-pulse">로딩 중입니다...</p>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-center mb-8">글쓰기</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">제목</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="제목을 입력하세요"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">내용</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={8}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-vertical"
                                placeholder="내용을 입력하세요"
                                required
                            />
                        </div>

                        <div className="space-y-3 pt-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                            >
                                확인
                            </button>
                            <Link href="/posts">
                                <button className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors">
                                    뒤로가기
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );

}