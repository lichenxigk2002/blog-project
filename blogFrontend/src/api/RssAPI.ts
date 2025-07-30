import { http } from '@/http/request';

export interface RssInfo {
  feedUrl: string;
  title: string;
  description: string;
  language: string;
}

export const RssAPI = {
  /**
   * 获取RSS订阅信息
   */
  getRssInfo: () =>
    http.get<RssInfo>('/rss/info'),

  /**
   * 获取RSS Feed内容（XML格式）
   */
  getRssFeed: () =>
    http.get<string>('/rss/feed', {
      headers: {
        'Accept': 'application/xml'
      }
    })
}; 