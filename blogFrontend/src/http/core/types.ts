export default interface RequestConfig extends RequestInit {
    params?: Record<string, any>;
    url?: string;
    timeout?: number; // 超时时间（毫秒）
    signal?: AbortSignal; // 取消信号
    retry?: {
        maxRetries?: number;
        retryDelay?: number;
        retryableStatusCodes?: number[];
    };
}

export type HeadersInit = Headers | Record<string, string> | Array<[string, string]>;

export type Response = globalThis.Response;