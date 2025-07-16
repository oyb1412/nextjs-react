'use client';

import {useParams} from "next/navigation";
import {useRouter} from "next/navigation";
import {useState, useEffect} from "react";

export default async function PostPage(){
    const params = useParams();
    const postId = params!.id;

    const router = useRouter();


    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() =>{
        fetch(`/api/post?postId=${postId}`)
            .then((r) => r.json())
            .then((data) =>{
                setTitle(data.title);
                setContent(data.content);
            } )
            .catch((err) =>
            setError(err.error))
            .finally(() => setLoading(false))
    }, []);

    if(loading)
        return <h1 className="text-2xl font-bold">게시글을 불러오는 중입니다...</h1>;

    return(

    );
}
