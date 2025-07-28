import { http } from '@/http/request';
import type { Comment, CommentOperationResponse } from '@/types/Comment';

export const CommentsAPI = {
  // 获取文章评论列表
  getCommentsByArticleId: (articleId: number) => http.get<Comment[]>(`/comments/article/${articleId}`),
  // 获取所有评论
  getAllComments: () => http.get<Comment[]>(`/comments/all`),
  // 添加评论
  addComment: (comment: Omit<Comment, 'id' | 'username' | 'createdAt' | 'updatedAt' | 'likes' | 'isLiked' | 'replies'>) =>
      http.post<CommentOperationResponse | string>(`/comments`, comment),
  // 删除评论
  deleteComment: (id: number) => http.delete<CommentOperationResponse | string>(`/comments/${id}`),
  // 点赞评论
  likeComment: (id: number) => http.post<CommentOperationResponse>(`/comments/${id}/like`),
};