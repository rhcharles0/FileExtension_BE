import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */

    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value:
                            process.env.NEXT_PUBLIC_FRONTEND_URL ||
                            'https://file-extension-fe-1xtr-h25p04ptr-rhkth96-1006s-projects.vercel.app/',
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
