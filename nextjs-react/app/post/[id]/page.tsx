'use client';

import {useParams} from "next/navigation";
import {useRouter} from "next/navigation";
import {useState, useEffect} from "react";
import Link from "next/link";

export default function PostPage(){
    const params = useParams();
    const postId = params!.id;

    const router = useRouter();


    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() =>{
        const fetchPost = async  () => {
            const token = localStorage.getItem('accessToken');
            if(!token){
                router.push('/');
                return;
            }
            try{
                const res = await fetch(`/api/post?postId=${postId}`,{
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const result = await res.json();
                alert(result.message);

                if(result.success){
                    setTitle(result.title);
                    setContent(result.content);
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
        fetchPost().then();
    }, []);

    return (
        <div className="min-h-screen bg-white p-8">
            {loading ? (
                <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg p-6 shadow-sm text-center">
                    <p className="text-gray-600 animate-pulse">로딩 중입니다...</p>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-center mb-8">글 확인</h1>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">제목</label>
                            <input
                                type="text"
                                value={title}
                                readOnly
                                className="w-full p-3 border border-gray-300 rounded bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">내용</label>
                            <textarea
                                value={content}
                                readOnly
                                rows={8}
                                className="w-full p-3 border border-gray-300 rounded bg-gray-100 resize-none"
                            />
                        </div>

                        <div className="pt-4">
                            <Link href="/posts">
                                <button className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors">
                                    뒤로가기
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
