'use client'

import React, {useState} from "react";
import {useRouter} from "next/navigation";

export default function postWritePage(){
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent)
    {
        e.preventDefault();
        setError('');

        const data = {
            title : title,
            content : content
        };

        const res = await fetch('/api/postWrite',{
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(data)
        });

        if(res.ok)
        {
            //글 작성 성공
            router.push('/posts');
        }
        else
        {
            const {error} = await res.json();
            setError(error ?? '글 작성 실패');
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
                <h1 className="text-2xl font-bold">글 작성</h1>

                {/*타이틀 입력*/}
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력하세요" required className="border p-2"/>

                {/*콘텐츠 입력*/}
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="내용을 입력하세요" required rows={8} className="border p-2 w-full mt-4 resize-y"/>

                {/*에러 메시지(있을 때만)*/}
                {error && <p className="text-red-500">{error}</p>}

                {/*제출 버튼*/}
                <button type="submit" className="bg-blue-500 text-white py-2">글 등록</button>
            </form>
        </>
    )
}