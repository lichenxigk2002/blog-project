import { http } from '@/http/request';
import { RssArticle } from '@/types/RssArticle';

export interface RssInfo {
  feedUrl: string;
  title: string;
  description: string;
  language: string;
}

export interface RssArticlesParams {
  page?: number;
  size?: number;
}

export interface RssArticlesCountResponse {
  totalCount: number;
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
    }),

  /**
   * 获取RSS文章（支持分页）
   */
  getRssArticles: (params: RssArticlesParams = {}) => {
    const { page = 1, size = 20 } = params;
    return http.get<RssArticle[]>(`/rss/articles?page=${page}&size=${size}`);
  },

  /**
   * 获取RSS文章总数
   */
  getRssArticlesCount: () =>
    http.get<RssArticlesCountResponse>('/rss/articles/count'),
}; 