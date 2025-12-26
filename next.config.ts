import type { NextConfig } from 'next';

// const proxyConfig = import('@/src/lib/proxy'); // 또는 import

const NEXT_PUBLIC_FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
const nextConfig: NextConfig = {
    /* config options here */

    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: 'http://localhost:3007',
                    },
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: `${NEXT_PUBLIC_FRONTEND_URL}`,
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
