import { http } from '@/utils/request';
import { BulletinBoardProps, BulletinBoardResponse } from '@/types/BulletinBoard';
import { ApiResponse } from '@/types/common';

export const BulletinBoardAPI = {
  // 获取留言列表（分页）
  getMessages: (current: number = 1, size: number = 10, status?: string) =>
    http.get<BulletinBoardResponse>(`/bulletinboard?current=${current}&size=${size}${status ? `&status=${status}` : ''}`),
  // 获取单个留言详情
  getMessageById: (id: number) => http.get<BulletinBoardProps>(`/bulletinboard/${id}`),
  // 创建留言
  createMessage: (data: BulletinBoardProps) => http.post<BulletinBoardProps>('/bulletinboard', data),
  // 更新留言
  updateMessage: (id: number, data: BulletinBoardProps) => http.put<BulletinBoardProps>(`/bulletinboard/${id}`, data),
  // 删除留言
  deleteMessage: (id: number) => http.delete<boolean>(`/bulletinboard/${id}`),
  // 回复留言
  replyMessage: (id: number, reply: string) => http.post<BulletinBoardProps>(`/bulletinboard/${id}/reply`, { reply }),
  // 更新留言状态
  updateStatus: (id: number, status: 'pending' | 'approved' | 'rejected') => http.put<BulletinBoardProps>(`/bulletinboard/${id}/status`, { status })
}