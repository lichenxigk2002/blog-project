import { HeadersInit } from '../core/types';

export class HeadersBuilder {
    private headers: Headers;

    constructor() {
        this.headers = new Headers();
    }

    // 设置默认头部
    setContentType(method: string, body?: any): this {
        // 修改 Content-Type 设置逻辑
        if (method === 'GET') {
            return this;
        }

        if (body instanceof FormData) {
            // FormData 不需要设置 Content-Type
            return this;
        }

        if (body instanceof URLSearchParams) {
            this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
        } else {
            // 默认使用 application/json
            this.headers.set('Content-Type', 'application/json');
        }
        return this;
    }

    // 设置 Accept 头部
    setAuthHeader(token: string): this {
        if (token) {
            this.headers.set('Authorization', `Bearer ${token}`);
        }
        return this;
    }

    // 设置自定义头部
    setCustomHeaders(headers: HeadersInit): this {
        if (headers instanceof Headers) {
            headers.forEach((value, key) =>
                this.headers.set(key, value));
        } else if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
                this.headers.set(key, String(value));
            });
        }
        return this;
    }

    // 获取最终的 Headers 对象
    getHeaders(): Headers {
        return this.headers;
    }

}