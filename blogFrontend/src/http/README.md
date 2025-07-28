# HTTP 模块使用指南

## 基本使用

```typescript
import { http } from '@/http/request';

// GET 请求
const data = await http.get<User[]>('/users', { page: 1, limit: 10 });

// POST 请求
const newUser = await http.post<User>('/users', { name: 'John', email: 'john@example.com' });

// PUT 请求
const updatedUser = await http.put<User>('/users/1', { name: 'John Updated' });

// DELETE 请求
await http.delete('/users/1');
```

## 高级配置

### 超时设置
```typescript
// 设置10秒超时
const data = await http.get('/api/slow-endpoint', {}, { timeout: 10000 });
```

### 请求取消
```typescript
const controller = new AbortController();

// 5秒后取消请求
setTimeout(() => controller.abort(), 5000);

const data = await http.get('/api/long-request', {}, { 
  signal: controller.signal 
});
```

### 重试配置
```typescript
const data = await http.get('/api/unreliable-endpoint', {}, {
  retry: {
    maxRetries: 5,
    retryDelay: 2000,
    retryableStatusCodes: [500, 502, 503, 504, 429]
  }
});
```

### 缓存配置
```typescript
// 缓存5分钟
const data = await http.get('/api/static-data', {}, {
  cache: {
    ttl: 5 * 60 * 1000 // 5分钟
  }
});
```

## 错误处理

```typescript
try {
  const data = await http.get('/api/users');
} catch (error) {
  if (error instanceof httpError) {
    console.log('HTTP错误:', error.message);
    console.log('状态码:', error.status);
    console.log('请求URL:', error.url);
    console.log('错误类型:', error.meta?.type);
  }
}
```

## 拦截器

### 自定义拦截器
```typescript
import { RequestInterceptor } from '@/http/interceptors/type';

const customInterceptor: RequestInterceptor = {
  beforeRequest: (config) => {
    // 在请求前添加自定义逻辑
    console.log('发送请求:', config);
    return config;
  },
  afterRequest: (response) => {
    // 在响应后添加自定义逻辑
    console.log('收到响应:', response);
    return response;
  },
  onError: (error) => {
    // 错误处理
    console.error('请求错误:', error);
    return error;
  },
  config: {
    enabled: true,
    priority: 5
  }
};

// 注册拦截器
interceptorManager.use(customInterceptor);
```

## 特性

- ✅ 类型安全的 TypeScript 支持
- ✅ 拦截器系统（日志、认证、超时、重试、缓存）
- ✅ 请求取消支持
- ✅ 自动重试机制
- ✅ 智能请求缓存（不破坏拦截器链）
- ✅ 详细的错误分类
- ✅ 链式 API 设计
- ✅ 支持所有 HTTP 方法
- ✅ 自动处理 JSON 和 FormData

## 拦截器优先级

1. **缓存拦截器** (优先级 0) - 最高优先级
   - 在请求前检查缓存
   - 缓存命中时标记配置，跳过网络请求
   - 缓存未命中时正常执行后续拦截器
   - 响应成功后缓存新数据

2. **日志拦截器** (优先级 1) - 记录请求和响应

3. **认证拦截器** (优先级 2) - 处理认证逻辑

4. **超时拦截器** (优先级 3) - 处理请求超时

5. **重试拦截器** (优先级 4) - 处理重试逻辑

拦截器按优先级从高到低执行，优先级数字越小，执行越早。

## 缓存机制说明

缓存拦截器采用智能设计，确保不会破坏拦截器链：

1. **缓存检查阶段**：在 `beforeRequest` 中检查缓存，但不直接返回数据
2. **缓存命中**：标记配置为缓存命中，跳过后续拦截器，直接返回缓存数据
3. **缓存未命中**：正常执行所有拦截器，包括网络请求
4. **缓存存储**：在 `afterRequest` 中缓存新数据

这种设计确保了：
- 缓存命中时不会执行不必要的网络请求
- 缓存未命中时所有拦截器正常工作
- 日志、认证等功能在缓存未命中时正常执行 