import RequestConfig from '../core/types';

export interface InterceptorConfig {
    // 是否启用拦截器
    enabled?: boolean;
    // 拦截器优先级，数字越大优先级越高
    priority?: number;
}

export interface RequestInterceptor {
    // 请求发送前的处理
    beforeRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
    // 请求发送后的处理
    afterRequest?: (response: Response) => Response | Promise<Response>;
    // 错误处理
    onError?: (error: any) => any;
    // 拦截器配置
    config?: InterceptorConfig;
}