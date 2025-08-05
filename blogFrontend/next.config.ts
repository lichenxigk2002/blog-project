import type { NextConfig } from "next";

export const BASE_URL = '/api';

import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images-1359353257.cos.ap-beijing.myqcloud.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    webpack: (config, { isServer, dev }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
            };
        }

        // 优化代码分割
        config.optimization = {
            ...config.optimization,
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    // 将 React 相关库单独打包
                    react: {
                        name: 'react',
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        chunks: 'all',
                        priority: 40,
                    },
                    // 将 Next.js 相关库单独打包
                    next: {
                        name: 'next',
                        test: /[\\/]node_modules[\\/](next)[\\/]/,
                        chunks: 'all',
                        priority: 30,
                    },
                    // 将重型库单独打包
                    heavy: {
                        name: 'heavy',
                        test: /[\\/]node_modules[\\/](framer-motion|gsap|recharts|mermaid)[\\/]/,
                        chunks: 'all',
                        priority: 20,
                    },
                    // 其他第三方库
                    vendor: {
                        name: 'vendor',
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        priority: 10,
                    },
                },
            },
        };

        // 生产环境优化
        if (!dev) {
            // 启用 tree shaking
            config.optimization.usedExports = true;
            config.optimization.sideEffects = false;

            // 压缩配置
            config.optimization.minimize = true;
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
    // 优化输出
    output: 'standalone', // 启用standalone模式
    // 压缩配置
    compress: true,
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

export default withAnalyzer(nextConfig);