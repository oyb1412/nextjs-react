'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-100 border-t mt-12 text-sm text-gray-600">
            {/* 상단 링크 */}
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-4 justify-center border-b">
                <Link href="#">회사소개</Link>
                <Link href="#">이용약관</Link>
                <Link href="#">개인정보 처리방침</Link>
                <Link href="#">청소년 보호정책</Link>
                <Link href="#">이메일 수집거부</Link>
                <Link href="#">채용안내</Link>
                <Link href="#">제휴문의</Link>
                <Link href="#">고객센터</Link>
            </div>

            {/* 회사 정보 */}
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm leading-6">
                    <p>(주)xxxxxx</p>
                    <p>xx도 xx시 xx구 xxx로 56 xxxxx빌딩 대표이사: xxx</p>
                    <p>고객센터: xxxx-xxxx &nbsp;&nbsp; Fax: xxxx-xxx-xxxx &nbsp;&nbsp; Email: example@site.com</p>
                    <p>사업자등록번호: xxx-xx-xxxxx &nbsp;&nbsp; 통신판매업신고번호: 제 xxxx-xxxx-xxxx호</p>
                    <p className="mt-2 text-xs text-gray-500">
                        아이템매니아는 통신판매중개자이며 통신판매의 당사자가 아닙니다. 상품 정보 및 거래에 대한 책임은 지지 않습니다.
                    </p>
                    <p className="mt-2 text-xs text-gray-400">Copyright © 2025 ITEMMANIA. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
