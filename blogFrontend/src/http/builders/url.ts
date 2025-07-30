export class UrlBuilder {
    private baseUrl: string;
    private params: Record<string, any> = {};

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    addParams(params: Record<string, any>): this {
        this.params = { ...this.params, ...params };
        return this;
    }

    build(): string {
        // 检查参数是否为空
        if (!this.params || Object.keys(this.params).length === 0) {
            return this.baseUrl;
        }

        const queryString = Object.entries(this.params)
            .filter(([key, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        // 如果没有有效的查询参数，返回原始URL
        if (!queryString) {
            return this.baseUrl;
        }

        return `${this.baseUrl}${this.baseUrl.includes('?') ? '&' : '?'}${queryString}`;
    }
}