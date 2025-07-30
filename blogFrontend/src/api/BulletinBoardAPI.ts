import { http } from '@/http/request';
import { BulletinBoardProps, BulletinBoardResponse } from '@/types/BulletinBoard';
import { ApiResponse } from '@/types/common';

// 添加简单缓存
let messagesCache: BulletinBoardResponse | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2分钟缓存

export const BulletinBoardAPI = {
  // 获取留言列表（分页）
  getMessages: async (current: number = 1, size: number = 10, status?: string) => {
    // 检查缓存
    const now = Date.now();
    if (messagesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return messagesCache;
    }

    const response = await http.get<BulletinBoardResponse>(`/bulletinboard?current=${current}&size=${size}${status ? `&status=${status}` : ''}`);

    // 更新缓存
    messagesCache = response;
    cacheTimestamp = now;

    return response;
  },
  // 获取单个留言详情
  getMessageById: (id: number) => http.get<BulletinBoardProps>(`/bulletinboard/${id}`),
  // 创建留言
  createMessage: async (data: BulletinBoardProps) => {
    const response = await http.post<BulletinBoardProps>('/bulletinboard', data);
    // 清除缓存
    messagesCache = null;
    return response;
  },
  // 更新留言
  updateMessage: async (id: number, data: BulletinBoardProps) => {
    const response = await http.put<BulletinBoardProps>(`/bulletinboard/${id}`, data);
    // 清除缓存
    messagesCache = null;
    return response;
  },
  // 删除留言
  deleteMessage: async (id: number) => {
    const response = await http.delete<boolean>(`/bulletinboard/${id}`);
    // 清除缓存
    messagesCache = null;
    return response;
  },
  // 回复留言
  replyMessage: async (id: number, reply: string, sendEmail: boolean) => {
    const response = await http.post<BulletinBoardProps>(`/bulletinboard/${id}/reply`, { reply, sendEmail });
    // 清除缓存
    messagesCache = null;
    return response;
  },
  // 更新留言状态
  updateStatus: async (id: number, status: 'pending' | 'approved' | 'rejected') => {
    const response = await http.put<BulletinBoardProps>(`/bulletinboard/${id}/status`, { status });
    // 清除缓存
    messagesCache = null;
    return response;
  }
}