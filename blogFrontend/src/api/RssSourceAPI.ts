import { http } from '@/http/request';

export interface RssSource {
  id?: number;
  friendLinkId: number;
  rssUrl: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RssFeedDTO {
  sourceId: number;
  friendLinkId: number;
  friendName: string;
  friendUrl: string;
  friendAvatarUrl: string;
  friendDescription: string;
  rssUrl: string;
  createdAt: string;
}

export const RssSourceAPI = {
  /**
   * 获取所有RSS源（包含友链信息）
   */
  getRssSources: () =>
    http.get<RssFeedDTO[]>('/rss/sources'),

  /**
   * 添加RSS源
   */
  addRssSource: (data: RssSource) =>
    http.post<RssSource>('/rss/sources', data),

  /**
   * 更新RSS源
   */
  updateRssSource: (id: number, data: Partial<RssSource>) =>
    http.put<RssSource>(`/rss/sources/${id}`, data),

  /**
   * 删除RSS源
   */
  deleteRssSource: (id: number) =>
    http.delete(`/rss/sources/${id}`),

  /**
   * 测试RSS源
   */
  testRssSource: (rssUrl: string) =>
    http.post('/rss/sources/test', { rssUrl }),
}; 