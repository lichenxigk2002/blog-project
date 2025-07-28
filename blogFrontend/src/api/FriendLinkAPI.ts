import { http } from '@/http/request';
import { FriendLinks } from "@/types/FriendLinks";
import { ApiResponse } from '@/types/common';

export const FriendLinksAPI = {
    getAllFriendLinks: () => http.get<FriendLinks[]>('/friendlinks'),

    getFriendLinks: (id: number) => http.get<FriendLinks>(`/friendlinks/${id}`),

    addFriendLinks: (data: Omit<FriendLinks, 'id' | 'createdAt' | 'updatedAt'>) =>
        http.post<ApiResponse<FriendLinks>>('/friendlinks', data),

    updateFriendLinks: (id: number, data: Partial<FriendLinks>) =>
        http.put<ApiResponse<FriendLinks>>(`/friendlinks/${id}`, data),

    deleteFriendLinks: (id: number) => http.delete<ApiResponse<FriendLinks>>(`/friendlinks/${id}`),
};