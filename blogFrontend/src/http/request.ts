import { StatusHandler } from '@/http/handlers/statusHandler';
import { HeadersBuilder } from '@/http/builders/headers';
import { UrlBuilder } from '@/http/builders/url';
import RequestConfig from '@/http/core/types';
import { httpError } from '@/http/core/error';
import {
  createCacheInterceptor,
  createLoggingInterceptor,
  createAuthInterceptor,
  createTimeoutInterceptor,
  createRetryInterceptor
} from "@/http/interceptors/commonInterceptors";
import { InterceptorManager } from "@/http/interceptors/interceptorManager";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '/api';


const interceptorManager = new InterceptorManager();

// 注册各种拦截器（按优先级从低到高）
interceptorManager.use(createCacheInterceptor());       // 优先级0：缓存处理
interceptorManager.use(createLoggingInterceptor());    // 优先级1：日志记录
interceptorManager.use(createAuthInterceptor());       // 优先级2：认证处理
interceptorManager.use(createTimeoutInterceptor());    // 优先级3：超时处理
interceptorManager.use(createRetryInterceptor());      // 优先级4：重试机制

const request = async<T>(url: string, config: RequestConfig = {}): Promise<T> => {

  const { params, ...restConfig } = config;

  const urlBuilder = new UrlBuilder(
    url.startsWith('http') ? url : `${BASE_URL}${url}`
  );

  // 只有当params存在且不为空时才添加参数
  if (params && Object.keys(params).length > 0) {
    urlBuilder.addParams(params);
  }

  const finalUrl = urlBuilder.build();

  const headersBuilder = new HeadersBuilder()
    .setContentType(restConfig.method || 'GET', restConfig.body);

  // 移除重复的认证逻辑，统一由认证拦截器处理
  // const token = localStorage.getItem('token');
  // headersBuilder.setAuthHeader(token || '');

  // 处理自定义头
  if (restConfig.headers) {
    headersBuilder.setCustomHeaders(restConfig.headers);
  }

  try {
    const interceptedConfig = await interceptorManager.applyRequestInterceptors({
      ...restConfig,
      headers: headersBuilder.getHeaders(),
    })

    // 检查是否是缓存命中
    if ((interceptedConfig as any)._cacheHit) {
      // 如果是缓存命中，直接返回缓存数据，跳过网络请求
      return (interceptedConfig as any)._cachedData;
    }

    const response = await fetch(finalUrl, interceptedConfig);

    const interceptedResponse = await interceptorManager.applyResponseInterceptors(response);

    return await StatusHandler.handle<T>(interceptedResponse, finalUrl);
  } catch (error: any) {
    // 应用错误拦截器
    const interceptedError = await interceptorManager.applyErrorInterceptors(error);

    // 如果已经是自定义错误，直接抛出
    if (interceptedError instanceof httpError) {
      throw interceptedError;
    }

    // 改进错误分类
    if (error.name === 'AbortError') {
      throw new httpError(
        '请求被取消或超时',
        0,
        finalUrl,
        { originalError: error, type: 'ABORT' }
      );
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new httpError(
        '网络连接错误',
        0,
        finalUrl,
        { originalError: error, type: 'NETWORK' }
      );
    }

    throw new httpError(
      error instanceof Error ? error.message : '请求失败',
      0,
      finalUrl,
      { originalError: error, type: 'UNKNOWN' }
    );
  }
}

export const http = {
  //GET请求，用来获取数据
  get: <T>(url: string, params?: Record<string, any>, config?: RequestConfig) =>
    request<T>(url, { method: 'GET', params, ...config }),
  //POST请求，用来创建数据
  post: <T>(url: string, data?: any, config?: RequestConfig) =>
    request<T>(url, { method: 'POST', ...config, body: data instanceof FormData ? data : JSON.stringify(data) }),
  //PUT请求，用来更新数据
  put: <T>(url: string, data?: any, config?: RequestConfig) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(data), ...config }),
  //DELETE请求，用来删除数据
  delete: <T>(url: string, config?: RequestConfig) =>
    request<T>(url, { method: 'DELETE', ...config }),
  //PATCH请求，用来更新部分数据
  patch: <T>(url: string, data?: any, config?: RequestConfig) =>
    request<T>(url, { method: 'PATCH', body: JSON.stringify(data), ...config }),
  //HEAD请求，用来获取响应头信息
  head: <T>(url: string, config?: RequestConfig) =>
    request<T>(url, { method: 'HEAD', ...config }),
  //OPTIONS请求，用来获取资源支持的HTTP方法
  options: <T>(url: string, config?: RequestConfig) =>
    request<T>(url, { method: 'OPTIONS', ...config })
}
