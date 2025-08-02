import { http } from '@/http/request';
import { ApiResponse } from '@/types/common';
import { User, LoginCredentials } from '@/types/auth';

// 基础接口定义
export interface SmsCredentials {
    phone: string;
    code: string;
}

export interface BindPhoneData {
    userId: number;
    phone: string;
    code: string;
}

export interface UserDTO {
    username: string;
    password?: string;
    phone?: string;
    avatar?: string;
    // 可选：第三方账号相关字段
    googleId?: string;
    githubId?: string;
    emailAccount?: string;
}

// API 实现
export const AuthAPI = {
    // 账号密码登录
    login: (credentials: LoginCredentials) => http.post<ApiResponse<{ token: string; user: User }>>('/user/login', credentials),
    // Google 登录：前端跳转到 /auth/google，登录后用token调用 /auth/verify 获取用户信息
    verifyGoogleLogin: (token: string) => http.post<ApiResponse<{ user: User }>>('/auth/verify', { token }),
    // 发送邮箱验证码（登录/注册）
    sendEmailCode: (email: string, type: string) => http.post<ApiResponse<void>>('/auth/email/send', { email, type }),
    // 邮箱登录（后端接口待补充）
    loginWithEmail: (email: string, code: string) => http.post<ApiResponse<{ token: string; user: User }>>('/auth/email/login', { email, code }),
    // 邮箱删除
    deleteEmail: (id: number) => http.delete(`/user/${id}/email`),
    // 邮箱绑定
    bindEmail: (userId: number, email: string, code: string) => http.post(`/auth/email/bind`, { userId, email, code }),
    // 注册
    register: (userData: UserDTO) => http.post<ApiResponse<User>>('/user/register', userData),
    // 短信登录
    loginBySms: (credentials: SmsCredentials) => http.post<ApiResponse<{ token: string; user: User }>>('/sms/login', credentials),
    // 用户管理相关
    getUserList: () => http.get<ApiResponse<User[]>>('/user/list'),
    //
    getUserById: (id: number) => http.get<ApiResponse<User>>(`/user/${id}`),

    updateUser: (id: number, userData: UserDTO) => http.put<ApiResponse<User>>(`/user/${id}`, userData),

    changePassword: (id: number, oldPassword: string, newPassword: string) =>
        http.put<ApiResponse<User>>(`/user/${id}/password`, { oldPassword, newPassword }),

    deleteUser: (id: number) => http.delete<ApiResponse<void>>(`/user/${id}`),
    // 手机号相关
    sendSmsCode: (phone: string, type: string) => http.post<ApiResponse<void>>('/sms/send', { phone, type }),

    bindPhone: (data: BindPhoneData) => http.post<ApiResponse<void>>('/sms/bind', data),

    uploadAvatar: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return http.post<{ code: number; url: string; message?: string }>('/files/upload', formData);
    },

};