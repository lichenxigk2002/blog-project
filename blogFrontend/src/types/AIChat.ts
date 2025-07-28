// AIChat.ts
import { ApiResponse, Timestamped, Identifiable } from './common';

// 消息角色类型
export type MessageRole = 'user' | 'assistant';

// 消息类型（前端使用）
export interface Message {
    id: string;
    content: string;
    type: 'user' | 'ai';
    timestamp: Date;
}

// AI聊天会话实体（后端返回）
export interface AiChatSession extends Identifiable, Timestamped {
    userId: number;
    title: string;
}

// AI聊天消息实体（后端返回）
export interface AiChatMessage extends Identifiable {
    sessionId: number;
    role: MessageRole;
    content: string;
    createdAt: string;
}

// 创建会话请求
export interface CreateSessionRequest {
    userId: number;
    title?: string;
}

// 保存消息请求
export interface SaveMessageRequest {
    sessionId: number;
    role: MessageRole;
    content: string;
}

// 批量保存消息请求
export interface SaveMessagesBatchRequest {
    messages: SaveMessageRequest[];
}

// 更新会话标题请求
export interface UpdateSessionTitleRequest {
    title: string;
}

// API响应类型
export type SessionsResponse = ApiResponse<AiChatSession[]>;
export type SessionResponse = ApiResponse<AiChatSession>;
export type MessagesResponse = ApiResponse<AiChatMessage[]>;
export type MessageResponse = ApiResponse<AiChatMessage>;
export type SuccessResponse = ApiResponse<string>;