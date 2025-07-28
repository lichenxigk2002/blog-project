import { RequestInterceptor, InterceptorConfig } from './type';
import RequestConfig from '../core/types';

export class InterceptorManager {
    private interceptors: RequestInterceptor[] = [];

    use(interceptor: RequestInterceptor) {
        this.interceptors.push(interceptor);
        return this.interceptors.length - 1; // 返回拦截器ID
    }

    eject(id: number) {
        this.interceptors.splice(id, 1);
    }

    private getEnabledInterceptors(): RequestInterceptor[] {
        return this.interceptors
            .filter(interceptor => interceptor.config?.enabled !== false)
            .sort((a, b) => (b.config?.priority || 0) - (a.config?.priority || 0));
    }

    async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
        const enabledInterceptors = this.getEnabledInterceptors();
        let finalConfig = { ...config };

        for (const interceptor of enabledInterceptors) {
            if (interceptor.beforeRequest) {
                const result = await interceptor.beforeRequest(finalConfig);

                // 检查是否是缓存命中
                if ((result as any)._cacheHit) {
                    // 如果是缓存命中，直接返回配置，后续拦截器仍会执行
                    finalConfig = result;
                    break; // 缓存命中时，跳过后续拦截器
                }

                finalConfig = result;
            }
        }

        return finalConfig;
    }

    async applyResponseInterceptors(response: Response): Promise<Response> {
        const enabledInterceptors = this.getEnabledInterceptors();
        let finalResponse = response;

        for (const interceptor of enabledInterceptors) {
            if (interceptor.afterRequest) {
                const result = await interceptor.afterRequest(finalResponse);

                // 如果拦截器返回了非Response对象（如缓存数据），直接返回
                if (!(result instanceof Response)) {
                    return result;
                }

                finalResponse = result;
            }
        }

        return finalResponse;
    }

    async applyErrorInterceptors(error: any): Promise<any> {
        const enabledInterceptors = this.getEnabledInterceptors();
        let finalError = error;

        for (const interceptor of enabledInterceptors) {
            if (interceptor.onError) {
                finalError = await interceptor.onError(finalError);
            }
        }

        return finalError;
    }
}