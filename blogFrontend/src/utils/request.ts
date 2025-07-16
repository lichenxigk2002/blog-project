
import { StatusHandler } from '@/http/handlers/statusHandler';
import { HeadersBuilder } from '@/http/builders/headers';
import { UrlBuilder } from '@/http/builders/url';
import RequestConfig from '@/http/core/types';
import { httpError } from '@/http/core/error';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '/api';

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
    const response = await fetch(finalUrl, {
      ...restConfig,
      headers: headersBuilder.getHeaders(),
    });

    return await StatusHandler.handle<T>(response, finalUrl);
  } catch (error) {
    if (error instanceof httpError) {
      throw error;
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
