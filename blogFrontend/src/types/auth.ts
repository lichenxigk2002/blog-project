import { Identifiable, ApiResponse } from './common';

export interface User extends Identifiable {
  username: string;
  avatar?: string;
  phone?: string;
  phoneVerified?: boolean;
  phoneBindTime?: string;
  loginType?: 'password' | 'sms' | 'google' | 'github' | 'email';

  // Google账号相关
  googleId?: string;
  googleEmail?: string;
  googleName?: string;
  googleAvatar?: string;

  // GitHub账号相关
  githubId?: string;
  githubUsername?: string;
  githubEmail?: string;
  githubAvatar?: string;

  // 邮箱账号相关
  emailAccount?: string;
  emailVerified?: boolean;
  emailBindTime?: string;
}

export interface LoginCredentials {
  username?: string;
  password?: string;
  email?: string;
  code?: string;
}

export interface SmsLoginCredentials {
  phone: string;
  code: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginResponse extends ApiResponse<{
  token: string;
  user: User;
}> { }

export interface SmsCodeResponse extends ApiResponse<{
  success: boolean;
}> { } 