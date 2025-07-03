import { http } from '@/utils/request';
import {Tag} from "@/types/Tags";

export const TagsAPI = {
  // 获取所有标签
  getTags: () => http.get('/tags/list'),

  // 获取带文章数量的标签
  getTagsWithCount: () => http.get('/tags/withCount'),

  // 根据ID获取标签
  getTagById: (id: number) => http.get<Tag>(`/tags/${id}`),

  // 获取标签下的文章
  getArticlesByTagId: (id: number) => http.get(`/tags/${id}/articles`),

  // 创建标签
  createTag: (data: any) => http.post('/tags', data),

  // 更新标签
  updateTag: (id: number, data: any) => http.put(`/tags/${id}`, data),

  // 删除标签
  deleteTag: (id: number) => http.delete(`/tags/${id}`)
}; 