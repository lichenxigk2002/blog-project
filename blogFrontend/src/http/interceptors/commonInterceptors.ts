import { RequestInterceptor } from './type';
import RequestConfig from '../core/types';

// 简单的内存缓存
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// 缓存拦截器 - 修复版本
export const createCacheInterceptor = (defaultTTL: number = 5 * 60 * 1000): RequestInterceptor => ({
    beforeRequest: (config: RequestConfig) => {
        // 只对GET请求进行缓存标记
        if (config.method === 'GET' || !config.method) {
            const cacheKey = `${config.url || ''}_${JSON.stringify(config.params || {})}`;
            const cached = cache.get(cacheKey);

            // 检查缓存是否有效
            if (cached && Date.now() - cached.timestamp < cached.ttl) {
                // 标记为缓存命中，但不直接返回数据
                (config as any)._cacheHit = true;
                (config as any)._cachedData = cached.data;
            } else {
                // 标记为缓存未命中，需要请求新数据
                (config as any)._cacheHit = false;
                (config as any)._cacheKey = cacheKey;
                (config as any)._cacheTTL = defaultTTL;
            }
        }

        return config;
    },
    afterRequest: async (response: Response) => {
        const config = (response as any)._config;

        if (config && (config.method === 'GET' || !config.method)) {
            // 如果是缓存命中，直接返回缓存数据
            if ((config as any)._cacheHit) {
                return Promise.resolve((config as any)._cachedData);
            }

            // 如果是缓存未命中且请求成功，缓存新数据
            const cacheKey = (config as any)._cacheKey;
            const cacheTTL = (config as any)._cacheTTL;

            if (cacheKey && response.ok) {
                try {
                    const data = await response.clone().json();
                    cache.set(cacheKey, {
                        data,
                        timestamp: Date.now(),
                        ttl: cacheTTL
                    });
                } catch {
                    // 如果不是JSON，尝试缓存文本
                    try {
                        const text = await response.clone().text();
                        cache.set(cacheKey, {
                            data: text,
                            timestamp: Date.now(),
                            ttl: cacheTTL
                        });
                    } catch {
                        // 忽略缓存错误
                    }
                }
            }
        }

        return response;
    },
    config: {
        enabled: true,
        priority: 0 // 最高优先级，最先执行
    }
});

// 日志拦截器
export const createLoggingInterceptor = (): RequestInterceptor => ({
    beforeRequest: (config: RequestConfig) => {
        console.log('Request:', config);
        return config;
    },
    // 这个拦截器用于记录响应的日志
    afterRequest: (response: Response) => {
        console.log('Response:', response);
        return response;
    },
    // 这个拦截器用于处理错误
    onError: (error: any) => {
        console.error('Error:', error);
        return error;
    },
    // 拦截器的配置项
    config: {
        enabled: true,
        priority: 1
    }
});

// 认证拦截器
export const createAuthInterceptor = (): RequestInterceptor => ({
    beforeRequest: (config: RequestConfig) => {
        // 只处理需要认证的请求
        if (config.url?.includes('/api/admin/')) {
            const token = localStorage.getItem('admin_token');
            if (token) {
                config.headers = {
                    ...config.headers,
                    'Authorization': `Bearer ${token}`
                };
            } else {
                // 如果没有token，可以选择抛出错误或继续请求
                console.warn('No admin token found for admin API request');
            }
        }
        return config;
    },
    onError: (error: any) => {
        // 处理认证相关的错误
        if (error.status === 401) {
            // 清除无效的token
            localStorage.removeItem('admin_token');
            // 可以在这里添加重定向到登录页面的逻辑
            console.warn('Authentication failed, please login again');
        }
        return error;
    },
    config: {
        enabled: true,
        priority: 2
    }
});

// 超时拦截器
export const createTimeoutInterceptor = (defaultTimeout: number = 10000): RequestInterceptor => ({
    beforeRequest: (config: RequestConfig) => {
        const timeout = config.timeout || defaultTimeout;

        if (timeout > 0) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, timeout);

            // 合并现有的signal
            if (config.signal) {
                config.signal.addEventListener('abort', () => {
                    clearTimeout(timeoutId);
                    controller.abort();
                });
            }

            config.signal = controller.signal;

            // 保存timeoutId以便清理
            (config as any)._timeoutId = timeoutId;
        }

        return config;
    },
    afterRequest: (response: Response) => {
        // 清理timeout
        if ((response as any)._timeoutId) {
            clearTimeout((response as any)._timeoutId);
        }
        return response;
    },
    onError: (error: any) => {
        // 清理timeout
        if (error._timeoutId) {
            clearTimeout(error._timeoutId);
        }
        return error;
    },
    config: {
        enabled: true,
        priority: 3
    }
});

// 重试拦截器 - 改进版本
export const createRetryInterceptor = (defaultMaxRetries: number = 3, defaultRetryDelay: number = 1000): RequestInterceptor => {
    let originalFetch: typeof fetch;

    return {
        beforeRequest: (config: RequestConfig) => {
            // 保存原始fetch函数
            if (!originalFetch) {
                originalFetch = fetch;
            }

            const retryConfig = config.retry || {};
            const maxRetries = retryConfig.maxRetries || defaultMaxRetries;
            const retryDelay = retryConfig.retryDelay || defaultRetryDelay;
            const retryableStatusCodes = retryConfig.retryableStatusCodes || [500, 502, 503, 504, 429];

            // 重写fetch函数以支持重试
            const originalFetchRef = originalFetch;
            const retryableFetch = async (url: string, options?: RequestInit) => {
                let lastError: any;

                for (let attempt = 0; attempt <= maxRetries; attempt++) {
                    try {
                        const response = await originalFetchRef(url, options);

                        // 只对特定状态码进行重试
                        if (retryableStatusCodes.includes(response.status)) {
                            if (attempt < maxRetries) {
                                await new Promise(resolve =>
                                    setTimeout(resolve, retryDelay * Math.pow(2, attempt))
                                );
                                continue;
                            }
                        }

                        return response;
                    } catch (error) {
                        lastError = error;
                        if (attempt < maxRetries) {
                            await new Promise(resolve =>
                                setTimeout(resolve, retryDelay * Math.pow(2, attempt))
                            );
                        }
                    }
                }

                throw lastError;
            };

            // 替换全局fetch
            (globalThis as any).fetch = retryableFetch;

            return config;
        },
        afterRequest: (response: Response) => {
            // 恢复原始fetch函数
            if (originalFetch) {
                (globalThis as any).fetch = originalFetch;
            }
            return response;
        },
        onError: (error: any) => {
            // 恢复原始fetch函数
            if (originalFetch) {
                (globalThis as any).fetch = originalFetch;
            }
            return error;
        },
        config: {
            enabled: true,
            priority: 4
        }
    };
};