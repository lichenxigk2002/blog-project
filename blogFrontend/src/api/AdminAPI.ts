import { http } from '@/utils/request';
import { Admin } from '@/types/Admin';
import { AdminApiResponse } from '@/types/common';

export const AdminAPI = {
    // 管理员登录
    login: (credentials: { username: string; password: string }) =>
        http.post<AdminApiResponse<{ token: string; admin: Admin }>>('/admin/login', credentials),

};