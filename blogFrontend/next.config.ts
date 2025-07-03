import type { NextConfig } from "next";

export const BASE_URL = '/api';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images-1359353257.cos.ap-beijing.myqcloud.com',
                port: '',
                pathname: '/images/**',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
            };
        }
        return config;
    },
    // experimental: {
    //     esmExternals: 'loose'
    // },
    typescript: {
        // !! 警告 !!
        // 危险，仅在生产环境使用
        ignoreBuildErrors: true,
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/:path*',
                basePath: false
            }
        ]
    }
};

export default nextConfig;