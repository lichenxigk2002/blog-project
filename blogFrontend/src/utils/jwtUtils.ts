// src/utils/jwtUtils.ts

/**
 * 解析JWT token获取过期时间
 * @param token JWT token字符串
 * @returns 过期时间戳（毫秒）或null
 */
export const parseJwtExpiration = (token: string): number | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return payload.exp * 1000; // 转换为毫秒
  } catch (error) {
    console.error('解析JWT token失败:', error);
    return null;
  }
};

/**
 * 检查token是否过期
 * @param token JWT token字符串
 * @returns 是否过期
 */
export const isTokenExpired = (token: string): boolean => {
  const expiration = parseJwtExpiration(token);
  if (!expiration) return true;
  return Date.now() > expiration;
};

/**
 * 解析JWT token获取payload
 * @param token JWT token字符串
 * @returns payload对象或null
 */
export const parseJwtPayload = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('解析JWT payload失败:', error);
    return null;
  }
};

/**
 * 获取token剩余有效时间（毫秒）
 * @param token JWT token字符串
 * @returns 剩余时间（毫秒），如果已过期或解析失败返回0
 */
export const getTokenRemainingTime = (token: string): number => {
  const expiration = parseJwtExpiration(token);
  if (!expiration) return 0;
  const remaining = expiration - Date.now();
  return remaining > 0 ? remaining : 0;
}; 