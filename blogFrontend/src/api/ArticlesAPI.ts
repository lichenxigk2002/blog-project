import { http } from '@/http/request';
import { Article } from '@/types/Article';
import { ApiResponse } from '@/types/common';


export const ArticlesAPI = {
  //  获取文章列表
  getArticles: () => http.get<ApiResponse<Article[]>>('/articles/list'),
  //  获取文章
  getArticleById: (id: number) => http.get<Article>(`/articles/${id}`),
  //  创建文章
  createArticle: (data: any) => http.post<ApiResponse<Article>>('/articles', data),
  //  更新文章
  updateArticle: (id: number, data: any) => http.put<ApiResponse<Article>>(`/articles/${id}`, data),
  //  删除文章
  deleteArticle: (id: number) => http.delete<ApiResponse<boolean>>(`/articles/${id}`),
  //  点赞文章
  likeArticle: (id: number) => http.post<ApiResponse<{ likeCount: number }>>(`/articles/${id}/like`),
  //  增加浏览量
  incrementViewCount: (id: number) => http.post<ApiResponse<{ viewCount: number }>>(`/articles/${id}/view`),
};