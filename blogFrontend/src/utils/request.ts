
import { StatusHandler } from '@/http/handlers/statusHandler';
import { HeadersBuilder } from '@/http/builders/headers';
import { UrlBuilder } from '@/http/builders/url';
import RequestConfig from '@/http/core/types';
import { httpError } from '@/http/core/error';
import {
  createLoggingInterceptor,
  createAuthInterceptor,
  createRetryInterceptor
} from "@/http/interceptors/commonInterceptors";
import {InterceptorManager} from "@/http/interceptors/interceptorManager";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '/api';


const interceptorManager = new InterceptorManager();

// 注册各种拦截器（按优先级从低到高）
interceptorManager.use(createLoggingInterceptor());    // 优先级1：日志记录
interceptorManager.use(createAuthInterceptor());       // 优先级2：认证处理
interceptorManager.use(createRetryInterceptor());      // 优先级3：重试机制

const request = async<T>(url: string, config: RequestConfig = {}): Promise<T> => {

  const { params, ...restConfig } = config;

  const urlBuilder = new UrlBuilder(
    url.startsWith('http') ? url : `${BASE_URL}${url}`
  );

  const finalUrl = urlBuilder.addParams(params || {}).build();

  const headersBuilder = new HeadersBuilder()
    .setContentType(restConfig.method || 'GET', restConfig.body);

  // 处理认证
  const token = localStorage.getItem('token');
  headersBuilder.setAuthHeader(token || '');

  // 处理自定义头
  if (restConfig.headers) {
    headersBuilder.setCustomHeaders(restConfig.headers);
  }

  try {


    const interceptedConfig = await interceptorManager.applyRequestInterceptors({
      ...restConfig,
      headers: headersBuilder.getHeaders(),
    })

    const response = await fetch(finalUrl, interceptedConfig);

    const interceptedResponse = await interceptorManager.applyResponseInterceptors(response);

    return await StatusHandler.handle<T>(interceptedResponse, finalUrl);
  } catch (error) {
    // 应用错误拦截器
    const interceptedError = await interceptorManager.applyErrorInterceptors(error);

    // 如果已经是自定义错误，直接抛出
    if (interceptedError instanceof httpError) {
      throw interceptedError;
    }

    throw new httpError(
      error instanceof Error ? error.message : '请求失败',
      0,
      finalUrl,
      { originalError: error }
    );
  }
}

export const http = {
  get: <T>(url: string, params?: Record<string, any>) =>
    request<T>(url, { method: 'GET', params }),
  post: <T>(url: string, data?: any, config?: RequestConfig) =>
    request<T>(url, { method: 'POST', ...config, body: data instanceof FormData ? data : JSON.stringify(data) }),
  put: <T>(url: string, data?: any) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(url: string) =>
    request<T>(url, { method: 'DELETE' })
}
