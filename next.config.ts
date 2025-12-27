import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */

    async headers() {
        const allowedOrigins = [
            'http://localhost:3007',
            // Vercel 환경 변수에서 프론트엔드 URL을 가져옵니다.
            // 값이 없거나 undefined일 경우를 대비해 필터링합니다.
            process.env.NEXT_PUBLIC_FRONTEND_URL,
        ].filter(Boolean); // null, undefined, 빈 문자열 제거
        return [
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value:
                            process.env.NEXT_PUBLIC_FRONTEND_URL ||
                            'http://localhost:3007',
                    },
                    {
                        // 💡 Credentials (쿠키, 인증)를 주고받을 때 필수
                        key: 'Access-Control-Allow-Credentials',
                        value: 'true',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
