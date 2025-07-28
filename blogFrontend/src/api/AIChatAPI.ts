import { http } from '@/http/request';
import {
    SessionsResponse,
    SessionResponse,
    MessagesResponse,
    MessageResponse,
    SuccessResponse,
    CreateSessionRequest,
    SaveMessageRequest,
    SaveMessagesBatchRequest,
    UpdateSessionTitleRequest
} from '@/types/AIChat';

export const AIChatAPI = {
    // ==================== 会话相关接口 ====================

    // 获取用户的所有会话列表
    getSessionsByUserId: (userId: number) => http.get<SessionsResponse>(`/ai-chat-sessions/user/${userId}`),
    // 创建新会话
    createSession: (data: CreateSessionRequest) => http.post<SessionResponse>('/ai-chat-sessions', data),
    // 获取单个会话详情
    getSessionById: (sessionId: number) => http.get<SessionResponse>(`/ai-chat-sessions/${sessionId}`),
    // 更新会话标题
    updateSessionTitle: (sessionId: number, data: UpdateSessionTitleRequest) => http.put<SessionResponse>(`/ai-chat-sessions/${sessionId}`, data),
    // 删除会话
    deleteSession: (sessionId: number) => http.delete<SuccessResponse>(`/ai-chat-sessions/${sessionId}`),
    // ==================== 消息相关接口 ====================
    // 获取会话下的所有消息
    getMessagesBySessionId: (sessionId: number) => http.get<MessagesResponse>(`/ai-chat-messages/session/${sessionId}`),
    // 保存单条消息
    saveMessage: (data: SaveMessageRequest) => http.post<MessageResponse>('/ai-chat-messages', data),
    // 批量保存消息
    saveMessagesBatch: (data: SaveMessagesBatchRequest) => http.post<SuccessResponse>('/ai-chat-messages/batch', data),
    // 获取单条消息详情
    getMessageById: (messageId: number) => http.get<MessageResponse>(`/ai-chat-messages/${messageId}`),
    // 删除消息
    deleteMessage: (messageId: number) => http.delete<SuccessResponse>(`/ai-chat-messages/${messageId}`),
    // 清空会话下的所有消息
    clearSessionMessages: (sessionId: number) => http.delete<SuccessResponse>(`/ai-chat-messages/session/${sessionId}`)
};