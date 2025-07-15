'use client';
import { useEffect, useState } from 'react';

export default function ProfileBox() {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        fetch('/api/profile', { credentials: 'include' })
            .then(res => res.json())
            .then(setProfile)
            .catch(() => alert('로그인 필요'));
    }, []);

    if (!profile) return null;
    return <div>{profile.username}님 환영!</div>;
}