// 邮箱格式校验工具
export function isValidEmail(email: string): boolean {
  // 简单常用邮箱正则
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

// 密码校验工具
export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 8) {
    return { isValid: false, message: '密码长度至少8位' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: '密码必须包含至少一个大写字母' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: '密码必须包含至少一个小写字母' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: '密码必须包含至少一个数字' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: '密码必须包含至少一个特殊字符' };
  }
  return { isValid: true, message: '密码强度符合要求' };
} 