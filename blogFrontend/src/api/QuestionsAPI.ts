import { http } from '@/http/request';
import { Question, QuestionListResponse } from '@/types/Question';
import { ApiResponse } from '@/types/common';

interface GetQuestionsParams {
  page?: number;
  size?: number;
  search?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface QuestionUpdateData {
  title: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published';
  views?: number;
  likes?: number;
}

export const QuestionsAPI = {
  // 获取面试题列表
  getQuestions: (params: GetQuestionsParams) =>
    http.get<ApiResponse<QuestionListResponse>>('/api/questions', {
      params: {
        current: params.page,
        size: params.size,
        search: params.search,
        difficulty: params.difficulty
      }
    }),

  // 获取面试题详情
  getQuestionById: (id: number) =>
    http.get<ApiResponse<Question>>(`/api/questions/${id}`),

  // 点赞面试题
  likeQuestion: (id: number) =>
    http.post<ApiResponse<Question>>(`/api/questions/${id}/like`),

  // 创建面试题
  createQuestion: (data: QuestionUpdateData) =>
    http.post<ApiResponse<Question>>('/api/questions', data),

  // 更新面试题
  updateQuestion: (id: number, data: QuestionUpdateData) =>
    http.put<ApiResponse<Question>>(`/api/questions/${id}`, data),

  // 删除面试题
  deleteQuestion: (id: number) =>
    http.delete<ApiResponse<void>>(`/api/questions/${id}`),
}; 